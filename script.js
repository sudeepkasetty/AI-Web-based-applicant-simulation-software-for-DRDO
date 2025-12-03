// Professional JavaScript with Advanced Effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Matrix Background
    initMatrixBackground();
    
    // Initialize 3D Particles
    init3DParticles();
    
    // Initialize Typing Animation
    initTypingAnimation();
    
    // Initialize Interactive Navigation
    initNavigation();
    
    // Initialize Animated Counters
    initAnimatedCounters();
    
    // Initialize 3D Logo
    init3DLogo();
    
    // Initialize Interactive Cards
    initInteractiveCards();
    
    // Initialize Charts
    initCharts();
    
    // Initialize Scroll Animations
    initScrollAnimations();
    
    // Initialize Button Effects
    initButtonEffects();
    
    // Initialize Mobile Menu
    initMobileMenu();
    
    // Initialize Login Functionality
    initLoginButton();
    
    // Initialize User Database
    initUserDatabase();
    
    // Initialize other button handlers
    initOtherButtons();
    
    // Load user data if exists
    loadUserFromStorage();
});

// ==================== CORE ANIMATIONS ====================

// Matrix Background Effect
function initMatrixBackground() {
    const matrixBg = document.getElementById('matrixBg');
    const chars = "01";
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    const rows = Math.floor(window.innerHeight / fontSize);
    
    let matrixHTML = '';
    for (let i = 0; i < rows; i++) {
        let row = '';
        for (let j = 0; j < columns; j++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const opacity = Math.random() * 0.3 + 0.1;
            const delay = Math.random() * 5;
            row += `<span style="opacity:${opacity};animation-delay:${delay}s">${char}</span>`;
        }
        matrixHTML += `<div class="matrix-row">${row}</div>`;
    }
    
    matrixBg.innerHTML = matrixHTML;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .matrix-row {
            display: flex;
            justify-content: center;
        }
        .matrix-row span {
            font-family: 'Courier New', monospace;
            font-size: ${fontSize}px;
            color: rgba(0, 168, 255, 0.3);
            animation: matrixFade 3s ease-in-out infinite;
        }
        @keyframes matrixFade {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);
    
    // Update on resize
    window.addEventListener('resize', initMatrixBackground);
}

// 3D Particles System
function init3DParticles() {
    const particles3d = document.getElementById('particles3d');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-3d';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const depth = Math.random() * 1000;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 168, 255, 0.2);
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            transform: translateZ(${depth}px);
            animation: particleFloat ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            box-shadow: 0 0 ${size * 2}px rgba(0, 168, 255, 0.3);
        `;
        
        particles3d.appendChild(particle);
    }
    
    // Add particle animation to styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% { 
                transform: translateZ(var(--depth)) translate(0, 0);
                opacity: 0.1;
            }
            25% { 
                transform: translateZ(calc(var(--depth) + 100px)) translate(50px, -30px);
                opacity: 0.3;
            }
            50% { 
                transform: translateZ(var(--depth)) translate(-30px, 20px);
                opacity: 0.1;
            }
            75% { 
                transform: translateZ(calc(var(--depth) - 100px)) translate(20px, 50px);
                opacity: 0.3;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.querySelectorAll('.particle-3d').forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX * speed * 100) - 50;
            const y = (mouseY * speed * 100) - 50;
            
            particle.style.transform = `translateZ(${Math.random() * 1000}px) translate(${x}px, ${y}px)`;
        });
    });
}

// Typing Animation
function initTypingAnimation() {
    const textReveal = document.getElementById('textReveal');
    const texts = [
        "Selection Simulation",
        "Defense Research Platform",
        "Intelligent Assessment",
        "Professional Training"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            textReveal.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textReveal.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    
    // Update active nav on scroll
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Smooth scrolling
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const menuToggle = document.getElementById('menuToggle');
                const navMenu = document.querySelector('.nav-menu');
                if (menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated Counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                const suffix = counter.querySelector('span')?.textContent || '';
                animateCounter(counter, target, suffix);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            const value = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
            element.textContent = value.toLocaleString() + suffix;
        }
    }, 16);
}

// 3D Logo Interaction
function init3DLogo() {
    const logo3d = document.getElementById('logo3d');
    
    logo3d.addEventListener('mouseenter', () => {
        logo3d.style.animation = 'logo3dRotate 2s ease-in-out';
    });
    
    logo3d.addEventListener('mouseleave', () => {
        logo3d.style.animation = 'logo3dRotate 8s ease-in-out infinite';
    });
}

// Interactive Cards
function initInteractiveCards() {
    const cards = document.querySelectorAll('.module-card');
    
    cards.forEach(card => {
        // Mouse move effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 10;
            const rotateX = ((centerY - y) / centerY) * -10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Progress ring animation
        const progressRing = card.querySelector('.progress-ring circle:last-child');
        if (progressRing) {
            const progress = parseInt(card.querySelector('.progress-ring').getAttribute('data-progress'));
            const circumference = 2 * Math.PI * 25;
            const offset = circumference - (progress / 100) * circumference;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            progressRing.style.strokeDashoffset = offset;
                            progressRing.style.transition = 'stroke-dashoffset 2s ease-out';
                        }, 500);
                        observer.unobserve(progressRing);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(progressRing);
        }
        
        // Bar animation
        const bars = card.querySelectorAll('.fill');
        bars.forEach(bar => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            bar.style.animation = 'fillBar 2s ease-out forwards';
                        }, 300);
                        observer.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });
    });
}

// Charts
function initCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Performance Score',
                data: [65, 72, 78, 82, 85, 88],
                borderColor: '#00a8ff',
                backgroundColor: 'rgba(0, 168, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00a8ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y: {
                    min: 50,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
    
    // Analytics Chart
    const analyticsCtx = document.getElementById('analyticsChart').getContext('2d');
    new Chart(analyticsCtx, {
        type: 'radar',
        data: {
            labels: ['Technical', 'Aptitude', 'Communication', 'Analysis', 'Problem Solving', 'Domain Knowledge'],
            datasets: [{
                label: 'Current Score',
                data: [85, 78, 82, 76, 88, 80],
                backgroundColor: 'rgba(0, 168, 255, 0.2)',
                borderColor: '#00a8ff',
                borderWidth: 2,
                pointBackgroundColor: '#00a8ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Target Score',
                data: [90, 85, 88, 85, 92, 90],
                backgroundColor: 'rgba(138, 43, 226, 0.1)',
                borderColor: '#8a2be2',
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: '#8a2be2',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        backdropColor: 'transparent'
                    }
                }
            }
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.module-card, .feature-card, .metric-card').forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        document.querySelector('.animated-grid').style.transform = `translateY(${rate}px)`;
        document.querySelectorAll('.orb').forEach((orb, index) => {
            const speed = (index + 1) * 0.3;
            orb.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Button Effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-gradient');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation to styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// 3D Dashboard Interaction
function init3DDashboard() {
    const dashboard3d = document.getElementById('dashboard3d');
    
    if (dashboard3d) {
        dashboard3d.addEventListener('mousemove', (e) => {
            const rect = dashboard3d.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 15;
            const rotateX = ((centerY - y) / centerY) * 10;
            
            dashboard3d.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
            dashboard3d.style.animation = 'none';
        });
        
        dashboard3d.addEventListener('mouseleave', () => {
            dashboard3d.style.transform = 'perspective(2000px) rotateX(5deg) rotateY(-10deg) translateZ(0)';
            dashboard3d.style.animation = 'dashboardFloat 6s ease-in-out infinite';
        });
    }
}

// Initialize 3D dashboard
setTimeout(init3DDashboard, 100);

// ==================== DATABASE & LOGIN FUNCTIONALITY ====================

// IndexedDB Database for Client-side Storage
class UserDatabase {
    constructor() {
        this.dbName = 'DRDOUsersDB';
        this.version = 1;
        this.db = null;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('IndexedDB initialized successfully');
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object store (like a table)
            if (!db.objectStoreNames.contains('users')) {
                const objectStore = db.createObjectStore('users', { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                
                // Create indexes for querying
                objectStore.createIndex('email', 'email', { unique: true });
                objectStore.createIndex('createdAt', 'createdAt', { unique: false });
                
                console.log('Users object store created');
            }
        };
    }

    addUser(userData) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database not initialized');
                return;
            }

            const transaction = this.db.transaction(['users'], 'readwrite');
            const objectStore = transaction.objectStore('users');
            
            // Add timestamp
            const userWithTimestamp = {
                ...userData,
                createdAt: new Date().toISOString()
            };

            const request = objectStore.add(userWithTimestamp);

            request.onsuccess = (event) => {
                console.log('User added with ID:', event.target.result);
                resolve({
                    success: true,
                    userId: event.target.result,
                    user: userWithTimestamp
                });
            };

            request.onerror = (event) => {
                console.error('Error adding user:', event.target.error);
                reject('Failed to store user');
            };
        });
    }

    getLatestUser() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database not initialized');
                return;
            }

            const transaction = this.db.transaction(['users'], 'readonly');
            const objectStore = transaction.objectStore('users');
            const request = objectStore.openCursor(null, 'prev'); // Get last record

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    resolve(cursor.value);
                } else {
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database not initialized');
                return;
            }

            const transaction = this.db.transaction(['users'], 'readonly');
            const objectStore = transaction.objectStore('users');
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    getUserCount() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database not initialized');
                return;
            }

            const transaction = this.db.transaction(['users'], 'readonly');
            const objectStore = transaction.objectStore('users');
            const request = objectStore.count();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
}

// Global user database instance
let userDB = null;

// Current logged in user
let currentUser = null;

// Initialize user database
function initUserDatabase() {
    userDB = new UserDatabase();
}

// Load user from localStorage on page load
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('drdoCurrentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUserDisplay(currentUser);
        } catch (e) {
            console.error('Error parsing saved user:', e);
            localStorage.removeItem('drdoCurrentUser');
        }
    }
}

// Save user to localStorage
function saveUserToStorage(user) {
    localStorage.setItem('drdoCurrentUser', JSON.stringify(user));
}

// Remove user from localStorage (logout)
function removeUserFromStorage() {
    localStorage.removeItem('drdoCurrentUser');
    currentUser = null;
    updateUserDisplay(null);
}

// Update user display in navigation
function updateUserDisplay(user) {
    const userDisplay = document.getElementById('userDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const displayUsername = document.getElementById('displayUsername');
    
    if (user) {
        // Show user display, hide login button
        userDisplay.style.display = 'flex';
        loginBtn.style.display = 'none';
        
        // Update username
        displayUsername.textContent = user.fullName || user.username || 'User';
        
        // Add click event to user display (for logout or profile)
        userDisplay.onclick = () => {
            if (confirm('Do you want to logout?')) {
                removeUserFromStorage();
                showNotification('Logged out successfully');
            }
        };
    } else {
        // Show login button, hide user display
        userDisplay.style.display = 'none';
        loginBtn.style.display = 'flex';
    }
}

// Modal Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear form and messages
        const form = document.getElementById('loginForm');
        if (form) form.reset();
        
        const messageDiv = document.getElementById('loginMessage');
        if (messageDiv) messageDiv.innerHTML = '';
    }
}

// Video Modal Functions
function openVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Function to store user on server
async function storeUserOnServer(userData) {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Server request failed:', error);
        return {
            success: false,
            message: 'Server connection failed'
        };
    }
}

// Enhanced Login Handler with fallback to IndexedDB if server fails
async function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value || email.split('@')[0];
    const phone = document.getElementById('phone').value || 'Not provided';
    
    // Simple validation
    if (!email || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Logging in...</span>';
    submitBtn.disabled = true;
    
    // Prepare user data for both server and client
    const userData = {
        email: email,
        password: password,
        fullName: fullName,
        phone: phone,
        username: email.split('@')[0]
    };
    
    try {
        // Try to store on server first
        const serverResponse = await storeUserOnServer(userData);
        
        if (serverResponse.success) {
            // Server storage successful
            const userToSave = {
                ...userData,
                id: serverResponse.userId || Date.now()
            };
            
            // Store locally as backup
            try {
                await userDB.addUser(userToSave);
            } catch (localError) {
                console.log('Local backup failed:', localError);
            }
            
            // Save as current user
            currentUser = userToSave;
            saveUserToStorage(userToSave);
            
            showMessage('Login successful! Welcome ' + fullName, 'success');
            showNotification(`Welcome ${fullName}! You are now logged in.`);
            
            // Update UI
            updateUserDisplay(userToSave);
            
            // Reset form
            document.getElementById('loginForm').reset();
            
            // Close modal after delay
            setTimeout(() => {
                closeLoginModal();
            }, 1500);
            
        } else {
            // Server failed, use local storage as fallback
            throw new Error(serverResponse.message || 'Server storage failed');
        }
        
    } catch (error) {
        console.log('Server storage failed, trying local storage:', error);
        
        try {
            // Fallback to IndexedDB
            const localResult = await userDB.addUser(userData);
            
            // Save as current user
            currentUser = {
                ...userData,
                id: localResult.userId
            };
            saveUserToStorage(currentUser);
            
            showMessage('Login successful (offline mode)! Welcome ' + fullName, 'success');
            showNotification('Welcome ' + fullName + '! (Server unavailable - offline mode)');
            
            // Update UI
            updateUserDisplay(currentUser);
            
            // Reset form
            document.getElementById('loginForm').reset();
            
            setTimeout(() => {
                closeLoginModal();
            }, 1500);
            
        } catch (localError) {
            console.error('Both server and local storage failed:', localError);
            showMessage('Failed to login. Please try again.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Function to show messages in modal
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('loginMessage');
    const colors = {
        success: '#00ff88',
        error: '#ff4444',
        info: '#00a8ff'
    };
    
    messageDiv.innerHTML = `
        <div style="padding: 0.8rem; border-radius: var(--radius); 
                    background: rgba(255,255,255,0.1); border-left: 4px solid ${colors[type]}; margin-top: 1rem;">
            <span style="color: ${colors[type]}">${message}</span>
        </div>
    `;
    
    // Auto-clear message after 5 seconds
    setTimeout(() => {
        if (messageDiv.innerHTML.includes(message)) {
            messageDiv.innerHTML = '';
        }
    }, 5000);
}

// Function to show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 8, 20, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 168, 255, 0.5);
        border-left: 4px solid ${type === 'error' ? '#ff4444' : '#00ff88'};
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        color: white;
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        box-shadow: var(--shadow-lg);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}" 
               style="color: ${type === 'error' ? '#ff4444' : '#00ff88'};"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize login button functionality
function initLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }
    
    // Close modal when clicking outside or on X
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal.id === 'loginModal') closeLoginModal();
                if (modal.id === 'videoModal') closeVideoModal();
            }
        });
        
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal.id === 'loginModal') closeLoginModal();
                if (modal.id === 'videoModal') closeVideoModal();
            });
        }
    });
    
    // Add Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLoginModal();
            closeVideoModal();
        }
    });
}

// Initialize other button handlers
function initOtherButtons() {
    // Live Demo button - opens YouTube video
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', openVideoModal);
    }
    
    // Schedule Demo button - opens login modal
    const scheduleDemoBtn = document.getElementById('scheduleDemo');
    if (scheduleDemoBtn) {
        scheduleDemoBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please login first to schedule a demo');
                openLoginModal();
            } else {
                showNotification('Demo scheduled! Our team will contact you shortly.', 'success');
            }
        });
    }
    
    // Start Free Trial button
    const startTrialBtn = document.getElementById('startFreeTrial');
    if (startTrialBtn) {
        startTrialBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please login to start your free trial');
                openLoginModal();
            } else {
                showNotification('Free trial started! You have 14 days of full access.', 'success');
            }
        });
    }
    
    // Start Simulation button
    const startSimBtn = document.getElementById('startSimulation');
    if (startSimBtn) {
        startSimBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please login to start simulation');
                openLoginModal();
            } else {
                showNotification('Starting simulation... Redirecting to Round 1');
                // In a real app, you would redirect to the simulation page
                // window.location.href = 'DRDO-ROUND1-MAIN.html';
            }
        });
    }
    
    // Watch Video button
    const watchVideoBtn = document.getElementById('watchVideo');
    if (watchVideoBtn) {
        watchVideoBtn.addEventListener('click', openVideoModal);
    }
}

// Add this code to your existing script.js file

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const modalClose = document.querySelector('.modal-close');
    const userDisplay = document.getElementById('userDisplay');
    const displayUsername = document.getElementById('displayUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const userMenu = document.getElementById('userMenu');

    // Ensure initial UI state: login button visible, profile hidden
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (userDisplay) userDisplay.classList.remove('active');

    // Check if user is already logged in
    checkUserSession();

    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
        });
    }

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!fullName || !email || !password) {
                showLoginMessage('Please fill in all required fields', 'error');
                return;
            }

            // Send login request to server
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    password: password,
                    phone: phone,
                    username: fullName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('isLoggedIn', 'true');

                    showLoginMessage('Login successful!', 'success');
                    
                    // Reset form
                    loginForm.reset();

                    // Close modal after short delay
                    setTimeout(function() {
                        loginModal.style.display = 'none';
                        updateProfileDisplay(data.user);
                    }, 1000);
                } else {
                    showLoginMessage(data.message || 'Login failed', 'error');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                showLoginMessage('Network error. Please try again.', 'error');
            });
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');

            // Hide user display and show login button
            if (userDisplay) userDisplay.classList.remove('active');
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (displayUsername) displayUsername.textContent = 'Guest';
            if (userMenu) userMenu.style.display = 'none';

            console.log('User logged out');
        });
    }

    // Toggle user menu on click (mobile friendly)
    if (userDisplay) {
        userDisplay.addEventListener('click', function(e) {
            if (e.target.closest('.user-menu')) return;
            
            const isOpen = userMenu.style.display === 'block';
            userMenu.style.display = isOpen ? 'none' : 'block';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!userDisplay || !userDisplay.contains(e.target)) {
            if (userMenu) userMenu.style.display = 'none';
        }
    });

    // Function to show login messages
    function showLoginMessage(message, type) {
        const messageDiv = document.getElementById('loginMessage');
        if (messageDiv) {
            messageDiv.style.display = 'block';
            messageDiv.className = 'login-' + type;
            messageDiv.textContent = message;

            if (type === 'success') {
                messageDiv.style.color = '#4CAF50';
            } else {
                messageDiv.style.color = '#f44336';
            }

            setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 4000);
        }
    }

    // Function to update profile display after login
    function updateProfileDisplay(user) {
        // Hide login button
        if (loginBtn) loginBtn.style.display = 'none';

        // Show user display by adding active class
        if (userDisplay) userDisplay.classList.add('active');

        // Update username with actual name or email
        const displayName = (user && (user.full_name || user.username || (user.email && user.email.split('@')[0]))) || 'User';
        if (displayUsername) displayUsername.textContent = displayName;
    }

    // Function to check if user has an active session
    function checkUserSession() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const user = localStorage.getItem('user');

        if (isLoggedIn === 'true' && user) {
            try {
                const userData = JSON.parse(user);
                updateProfileDisplay(userData);
            } catch (e) {
                console.error('Error parsing user data:', e);
                // Ensure default state if parsing fails
                if (userDisplay) userDisplay.classList.remove('active');
                if (loginBtn) loginBtn.style.display = 'inline-flex';
            }
        } else {
            // Not logged in — enforce hidden profile and visible login
            if (userDisplay) userDisplay.classList.remove('active');
            if (loginBtn) loginBtn.style.display = 'inline-flex';
        }
    }
});

// Export database function (for debugging)
window.exportUserData = async function() {
    try {
        const users = await userDB.getAllUsers();
        const dataStr = JSON.stringify(users, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'drdo-users-backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`Exported ${users.length} user(s) to JSON file`);
    } catch (error) {
        console.error('Export failed:', error);
        showNotification('Failed to export data', 'error');
    }
};

// View database function (for debugging)
window.viewUserData = async function() {
    try {
        const users = await userDB.getAllUsers();
        const usersDiv = document.createElement('div');
        usersDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 8, 20, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(0, 168, 255, 0.5);
            padding: 2rem;
            border-radius: var(--radius-lg);
            z-index: 10001;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            color: white;
        `;
        
        usersDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="color: var(--accent);">Stored Users (${users.length})</h3>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: var(--accent); font-size: 1.5rem; cursor: pointer;">
                    &times;
                </button>
            </div>
            <pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius); 
                       max-height: 400px; overflow-y: auto; font-size: 0.9rem;">
${JSON.stringify(users, null, 2)}
            </pre>
            <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                <button onclick="exportUserData()" class="btn btn-gradient" style="padding: 0.5rem 1rem;">
                    <i class="fas fa-download"></i> Export JSON
                </button>
                <button onclick="clearAllUsers()" class="btn btn-outline" style="padding: 0.5rem 1rem;">
                    <i class="fas fa-trash"></i> Clear All
                </button>
            </div>
        `;
        
        document.body.appendChild(usersDiv);
    } catch (error) {
        console.error('View failed:', error);
        showNotification('Failed to view data', 'error');
    }
};

// Clear all users (for debugging)
window.clearAllUsers = async function() {
    if (confirm('Are you sure you want to delete all user data?')) {
        try {
            const transaction = userDB.db.transaction(['users'], 'readwrite');
            const objectStore = transaction.objectStore('users');
            const request = objectStore.clear();
            
            request.onsuccess = () => {
                showNotification('All user data cleared');
                removeUserFromStorage();
            };
            
            request.onerror = (error) => {
                console.error('Clear failed:', error);
                showNotification('Failed to clear data', 'error');
            };
        } catch (error) {
            console.error('Clear failed:', error);
            showNotification('Failed to clear data', 'error');
        }
    }
};

// Console greeting
console.log('%c🚀 DRDO AI Selection Platform Loaded', 'color: #00a8ff; font-size: 18px; font-weight: bold;');
console.log('%cAdvanced AI simulation platform for defense research selection', 'color: #8a2be2; font-size: 14px;');