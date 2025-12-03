import os
import sys
import json
import sqlite3
import logging
import argparse
import signal
import mimetypes
import traceback
import pdb
import math
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse, unquote

# Create SQLite database
DB_FILE = 'users.db'

def init_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT,
            full_name TEXT,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Parse command line args (debug)
parser = argparse.ArgumentParser(description='Simple static HTTP + API server')
parser.add_argument('--debug', action='store_true', help='Enable debug mode with detailed logging and post-mortem on exception')
args = parser.parse_args()
DEBUG = args.debug

# Configure logging (console + file)
log_level = logging.DEBUG if DEBUG else logging.INFO
logging.basicConfig(
    level=log_level,
    format='%(asctime)s %(levelname)s %(name)s: %(message)s',
    handlers=[
        logging.StreamHandler(), 
        logging.FileHandler('server.log', mode='a', encoding='utf-8')
    ]
)
logger = logging.getLogger('drdo-server')

def find_similar_file(root_dir, rel_path):
    """
    Find a file with a tolerant match for rel_path under root_dir.
    """
    target_basename = os.path.basename(rel_path)
    target_stem, target_ext = os.path.splitext(target_basename)
    def normalize(name):
        return ''.join(ch for ch in name.lower() if ch.isalnum())
    target_norm = normalize(target_basename)
    target_stem_norm = normalize(target_stem)

    def gen_stem_variants(stem):
        variants = {stem}
        if stem.lower().endswith('demo'):
            variants.add(stem[:-4])
        if stem.lower().endswith('-demo'):
            variants.add(stem[:-5])
        if stem.lower().endswith('_demo'):
            variants.add(stem[:-5])
        if 'demo' in stem.lower():
            variants.add(stem.replace('demo', ''))
            variants.add(stem.replace('-demo', ''))
            variants.add(stem.replace('_demo', ''))
        return {v for v in variants if v}

    stem_variants = gen_stem_variants(target_stem)
    stem_variants_norm = {normalize(v) for v in stem_variants}

    best_score = -math.inf
    best_path = None

    for dirpath, _, filenames in os.walk(root_dir):
        for fn in filenames:
            fn_stem, fn_ext = os.path.splitext(fn)
            fn_norm = normalize(fn)
            fn_stem_norm = normalize(fn_stem)

            score = 0
            if fn == target_basename:
                score += 200
            if fn_norm == target_norm:
                score += 180
            if fn_stem_norm == target_stem_norm:
                score += 160
            if fn_stem_norm in stem_variants_norm and fn_stem_norm != target_stem_norm:
                score += 140
            if fn_ext.lower() == target_ext.lower() and target_ext != '':
                score += 20
            if target_norm in fn_norm:
                score += 40
            if fn_norm in target_norm:
                score += 30
            if fn_norm.startswith(target_norm) or fn_norm.endswith(target_norm):
                score += 25
            if fn_norm.replace('demo', '') == target_norm.replace('demo', ''):
                score += 35

            if score > 0:
                depth = dirpath.count(os.sep) - root_dir.count(os.sep)
                score -= depth * 2

                if score > best_score:
                    best_score = score
                    best_path = os.path.join(dirpath, fn)

    if best_path:
        logger.debug("find_similar_file: matched '%s' -> '%s'", rel_path, os.path.relpath(best_path, root_dir))
        return best_path
    return None

class RequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        logger.info("%s - - %s" % (self.client_address[0], format % args))

    def _safe_preview(self, data, max_len=300):
        try:
            s = data.decode('utf-8', errors='replace') if isinstance(data, (bytes, bytearray)) else str(data)
            s = s.replace('\n', '\\n').replace('\r', '\\r')
            return s[:max_len] + ('...' if len(s) > max_len else '')
        except Exception:
            return '<unprintable>'

    def _maybe_post_mortem(self):
        if DEBUG and sys.stdin and sys.stdin.isatty():
            traceback.print_exc()
            pdb.post_mortem(sys.exc_info()[2])

    def handle(self):
        try:
            super().handle()
        except Exception as e:
            logger.exception("Unhandled exception: %s", e, exc_info=True)
            try:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'success': False, 'message': 'Internal Server Error'}
                if DEBUG:
                    response['traceback'] = traceback.format_exc()
                self.wfile.write(json.dumps(response).encode())
            except Exception:
                pass
            self._maybe_post_mortem()

    def do_OPTIONS(self):
        try:
            logger.debug("OPTIONS %s", self.path)
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
        except Exception as e:
            logger.exception("Error in do_OPTIONS: %s", e, exc_info=True)

    def do_GET(self):
        try:
            logger.info("GET %s from %s", self.path, self.client_address[0])
            parsed_path = urlparse(self.path)
            path = unquote(parsed_path.path)

            # AI simulation pages
            ai_keys = ['/ai', '/ai-simulation', '/simulate', '/ai-simulate']
            if any(path.lower().startswith(k) for k in ai_keys):
                self.handle_ai_simulation(path)
                return

            # Handle API endpoints
            if path == '/api/users':
                self.handle_api_users()
                return

            # Handle static files and root
            self.handle_static_file(path)
        except Exception as e:
            logger.exception("Error in do_GET: %s path=%s", e, getattr(self, 'path', None), exc_info=True)
            try:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': 'Internal Server Error'}).encode())
            except Exception:
                pass
            self._maybe_post_mortem()

    def handle_static_file(self, path):
        """Serve static files from the current directory."""
        try:
            root = os.getcwd()
            if path == '/':
                path = '/index.html'  # Change this to your actual index file name
            
            target_abs = os.path.normpath(os.path.join(root, path.lstrip('/')))
            
            if not target_abs.startswith(root):
                self.send_response(403)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': 'Forbidden'}).encode())
                return
            
            if os.path.isfile(target_abs):
                content_type, _ = mimetypes.guess_type(target_abs)
                if content_type is None:
                    content_type = 'application/octet-stream'
                
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                with open(target_abs, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                similar = find_similar_file(root, path.lstrip('/'))
                if similar:
                    logger.info("Serving similar file for '%s' -> '%s'", path, os.path.relpath(similar, root))
                    content_type, _ = mimetypes.guess_type(similar)
                    if content_type is None:
                        content_type = 'application/octet-stream'
                    
                    self.send_response(200)
                    self.send_header('Content-Type', content_type)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    with open(similar, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'message': 'File not found', 'requested': path, 'current_dir': root}).encode())
        except Exception as e:
            logger.exception("Error serving static file %s: %s", path, e)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'message': 'Internal Server Error'}).encode())

    def do_POST(self):
        """Handle POST requests for /api/users and /api/login."""
        try:
            parsed_path = urlparse(self.path)
            path = unquote(parsed_path.path)

            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else b''
            logger.debug("POST %s Body: %s", path, self._safe_preview(body))

            try:
                payload = json.loads(body.decode('utf-8')) if body else {}
            except json.JSONDecodeError as e:
                logger.error("Invalid JSON: %s", e)
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': 'Invalid JSON'}).encode())
                return

            if path == '/api/users':
                try:
                    user, created = self._create_or_get_user(payload)
                    self.send_response(201 if created else 200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    msg = 'User created' if created else 'User already exists'
                    self.wfile.write(json.dumps({'success': True, 'message': msg, 'user': user}).encode())
                except ValueError as ve:
                    logger.debug("Validation error: %s", ve)
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'message': str(ve)}).encode())
                except Exception as e:
                    logger.exception("Error creating user: %s", e)
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'message': 'Internal Server Error'}).encode())
                return

            if path == '/api/login':
                try:
                    user, created = self._create_or_get_user(payload)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True, 'message': 'Login successful', 'user': user}).encode())
                except ValueError as ve:
                    logger.debug("Login validation error: %s", ve)
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'message': str(ve)}).encode())
                except Exception as e:
                    logger.exception("Login error: %s", e)
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'message': 'Internal Server Error'}).encode())
                return

            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'message': 'Not found'}).encode())
        except Exception as e:
            logger.exception("Unhandled error in do_POST: %s", e, exc_info=True)
            try:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': 'Internal Server Error'}).encode())
            except Exception:
                pass
            self._maybe_post_mortem()

    def handle_ai_simulation(self, path):
        """Handle AI simulation requests."""
        try:
            if path.lower().startswith('/api/ai') or path.lower().endswith('/simulate'):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': 'AI simulation API placeholder'}).encode())
                return

            root = os.getcwd()
            candidates = [
                'ai-simulation.html', 'ai_simulation.html', 'AI Simulation.html',
                'ai.html', 'simulate.html', 'ai-simulate.html', 'interview-ai.html'
            ]
            requested = path.lstrip('/')
            candidates.insert(0, requested)

            for cand in candidates:
                target_abs = os.path.normpath(os.path.join(root, cand))
                if os.path.exists(target_abs):
                    logger.info("Serving AI simulation: %s", cand)
                    with open(target_abs, 'rb') as f:
                        self.send_response(200)
                        self.send_header('Content-Type', 'text/html')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(f.read())
                    return

            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'message': 'AI simulation page not found'}).encode())
        except Exception as e:
            logger.exception("Error in handle_ai_simulation: %s", e)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'message': 'Internal Server Error'}).encode())

    def handle_api_users(self):
        """Handle GET /api/users"""
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
            users = cursor.fetchall()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                'success': True,
                'users': [
                    {
                        'id': user[0],
                        'username': user[1],
                        'email': user[2],
                        'full_name': user[4],
                        'phone': user[5],
                        'created_at': user[6]
                    } for user in users
                ]
            }
            self.wfile.write(json.dumps(response).encode())
        except Exception as e:
            logger.exception("Error in handle_api_users: %s", e)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'message': str(e)}).encode())

    def _create_or_get_user(self, payload):
        """Create a user if not found by email. Returns (user_dict, created_bool)."""
        email = (payload.get('email') or '').strip().lower()
        username = payload.get('username') or payload.get('full_name') or payload.get('name') or ''
        password = payload.get('password') or ''
        full_name = payload.get('full_name') or username or ''
        phone = payload.get('phone') or ''
        
        if not email:
            raise ValueError("Missing required field: email")

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute('SELECT id, username, email, full_name, phone, created_at FROM users WHERE email = ?', (email,))
            row = cursor.fetchone()
            if row:
                user = {
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'full_name': row[3],
                    'phone': row[4],
                    'created_at': row[5]
                }
                return user, False

            cursor.execute(
                'INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
                (username, email, password, full_name, phone)
            )
            conn.commit()
            user_id = cursor.lastrowid
            cursor.execute('SELECT id, username, email, full_name, phone, created_at FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            user = {
                'id': row[0],
                'username': row[1],
                'email': row[2],
                'full_name': row[3],
                'phone': row[4],
                'created_at': row[5]
            }
            return user, True
        finally:
            conn.close()

if __name__ == '__main__':
    init_database()
    
    host, port = 'localhost', 8000

    try:
        server = HTTPServer((host, port), RequestHandler)
    except OSError as e:
        logger.exception("Failed to bind %s:%s — %s", host, port, e)
        sys.exit(1)

    def _shutdown_and_exit(signum=None, frame=None):
        logger.info("Shutting down server...")
        try:
            server.shutdown()
            server.server_close()
        except Exception:
            pass

    signal.signal(signal.SIGINT, _shutdown_and_exit)
    try:
        signal.signal(signal.SIGTERM, _shutdown_and_exit)
    except Exception:
        pass

    try:
        logger.info("Server running on http://%s:%s", host, port)
        logger.info("Serving files from: %s", os.getcwd())
        server.serve_forever()
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt, shutting down...")
        _shutdown_and_exit()
    except Exception as e:
        logger.exception("Server error: %s", e)
        if DEBUG:
            traceback.print_exc()
    finally:
        try:
            server.shutdown()
            server.server_close()
        except Exception:
            pass
        logger.info("Server stopped")