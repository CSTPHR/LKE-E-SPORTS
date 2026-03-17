// main.js - Sistema de navegación dinámica para LKE E-SPORTS
// VERSIÓN CORREGIDA: Hero reanimado y navegación funcionando

document.addEventListener('DOMContentLoaded', () => {
    // ===== MANEJO DEL SPLASH SCREEN =====
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    
    // Variable para controlar si las animaciones ya se ejecutaron
    let animationsExecuted = false;
    
    // Función para ejecutar todas las animaciones después del splash
    function executeAnimations() {
        if (animationsExecuted) return;
        animationsExecuted = true;
        
        // Activar clase que dispara las animaciones CSS
        document.body.classList.add('animate-ready');
        
        // Forzar reflow
        void document.body.offsetHeight;
        
        // Inicializar contadores
        if (window.counterManager) {
            window.counterManager.animateAll();
        }
        
        // Inicializar scroll reveal
        initScrollReveal();
    }
    
    // Función para ocultar el splash screen
    function hideSplashScreen() {
        mainContent.classList.add('visible');
        splashScreen.classList.add('hidden');
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            executeAnimations();
        }, 800);
    }
    
    // Configuración del splash
    const minSplashTime = 2500;
    const startTime = Date.now();
    
    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsedTime);
        
        setTimeout(hideSplashScreen, remainingTime);
    });
    
    setTimeout(() => {
        if (!splashScreen.classList.contains('hidden')) {
            hideSplashScreen();
        }
    }, minSplashTime + 500);

    // Elementos del DOM
    const content = document.getElementById('content');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Estado de la página actual
    let currentPage = 'home';
    
    // Variable para almacenar intervalos
    let activeIntervals = [];
    
    // Variable para el observer de scroll reveal
    let scrollObserver = null;
    
    // Toggle menú móvil
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('mobile-menu-enter');
            } else {
                mobileMenu.classList.remove('mobile-menu-enter');
            }
            
            const icon = menuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-menu-enter');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            
            navigateTo(page);
        });
    });
    
    // Limpiar intervalos
    function clearAllIntervals() {
        activeIntervals.forEach(interval => {
            clearInterval(interval);
        });
        activeIntervals = [];
    }
    
    // ===== FUNCIÓN PARA RESETEAR ELEMENTOS DEL HOME =====
    function resetHomeElements() {
        // Resetear hero elements
        const heroElements = document.querySelectorAll(
            '.animate-from-top, .animate-from-left, .animate-from-right, .animate-from-bottom'
        );
        
        heroElements.forEach(el => {
            if (el.classList.contains('animate-from-top')) {
                el.classList.add('opacity-0', 'translate-y-[-30px]');
            }
            if (el.classList.contains('animate-from-left')) {
                el.classList.add('opacity-0', 'translate-x-[-50px]');
            }
            if (el.classList.contains('animate-from-right')) {
                el.classList.add('opacity-0', 'translate-x-[50px]');
            }
            if (el.classList.contains('animate-from-bottom')) {
                el.classList.add('opacity-0', 'translate-y-[30px]');
            }
        });
        
        // Resetear stats cards
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.classList.add('opacity-0', 'translate-y-[30px]');
        });
        
        // Resetear títulos de sección
        const sectionTitles = document.querySelectorAll('.section-title, .section-subtitle');
        sectionTitles.forEach(title => {
            title.classList.add('opacity-0', 'translate-y-[30px]');
        });
        
        // Resetear news cards
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            card.classList.add('opacity-0', 'translate-y-[30px]');
        });
        
        console.log('Elementos del home reseteados');
    }
    
    // ===== SCROLL REVEAL MEJORADO =====
    function initScrollReveal() {
        // Desconectar observer anterior
        if (scrollObserver) {
            scrollObserver.disconnect();
        }
        
        // Seleccionar TODOS los elementos que queremos reanimar
        const revealElements = document.querySelectorAll(
            '.stats-card, .news-card, .section-title, .section-subtitle, ' +
            '.animate-from-top, .animate-from-left, .animate-from-right, .animate-from-bottom, ' +
            '.glow-text, h1 span, p'
        );
        
        console.log('Elementos a observar:', revealElements.length);
        
        // Configuración del observer
        const observerOptions = {
            threshold: 0.1, // 10% del elemento visible
            rootMargin: '0px'
        };
        
        // Callback del observer
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Remover clases que ocultan
                    el.classList.remove('opacity-0', 'translate-y-[-30px]', 'translate-x-[-50px]', 
                                      'translate-x-[50px]', 'translate-y-[30px]');
                    
                    // Si es el hero o texto principal, forzar animación
                    if (el.classList.contains('animate-from-top') || 
                        el.classList.contains('animate-from-left') || 
                        el.classList.contains('animate-from-right') || 
                        el.classList.contains('animate-from-bottom')) {
                        
                        el.style.animation = 'none';
                        el.offsetHeight; // Forzar reflow
                        
                        if (el.classList.contains('animate-from-top')) {
                            el.style.animation = 'slideFromTop 0.8s ease-out forwards';
                        } else if (el.classList.contains('animate-from-left')) {
                            el.style.animation = 'slideFromLeft 0.8s ease-out forwards';
                        } else if (el.classList.contains('animate-from-right')) {
                            el.style.animation = 'slideFromRight 0.8s ease-out forwards';
                        } else if (el.classList.contains('animate-from-bottom')) {
                            el.style.animation = 'slideFromBottom 0.8s ease-out forwards';
                        }
                    }
                    
                    // Efecto especial para stats cards
                    if (el.classList.contains('stats-card')) {
                        el.classList.add('neon-border');
                        setTimeout(() => {
                            el.classList.remove('neon-border');
                        }, 1000);
                        
                        // Reiniciar contadores si estamos en home
                        if (window.counterManager) {
                            window.counterManager.animateAll();
                        }
                    }
                    
                    console.log('Elemento visible:', el.className);
                    
                } else {
                    // Cuando el elemento NO es visible, preparamos para reanimar
                    const el = entry.target;
                    
                    // No ocultar elementos que ya no existen
                    if (!document.body.contains(el)) return;
                    
                    // Aplicar clases de ocultamiento según el tipo
                    if (el.classList.contains('stats-card') || 
                        el.classList.contains('news-card') || 
                        el.classList.contains('section-title') || 
                        el.classList.contains('section-subtitle')) {
                        
                        el.classList.add('opacity-0', 'translate-y-[30px]');
                    }
                    
                    if (el.classList.contains('animate-from-top')) {
                        el.classList.add('opacity-0', 'translate-y-[-30px]');
                        el.style.animation = 'none';
                    }
                    
                    if (el.classList.contains('animate-from-left')) {
                        el.classList.add('opacity-0', 'translate-x-[-50px]');
                        el.style.animation = 'none';
                    }
                    
                    if (el.classList.contains('animate-from-right')) {
                        el.classList.add('opacity-0', 'translate-x-[50px]');
                        el.style.animation = 'none';
                    }
                    
                    if (el.classList.contains('animate-from-bottom')) {
                        el.classList.add('opacity-0', 'translate-y-[30px]');
                        el.style.animation = 'none';
                    }
                }
            });
        };
        
        // Crear nuevo observer
        scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        
        // Observar cada elemento
        revealElements.forEach(el => {
            if (el && document.body.contains(el)) {
                scrollObserver.observe(el);
            }
        });
        
        console.log('Scroll reveal inicializado con', revealElements.length, 'elementos');
    }
    
    // ===== NAVEGACIÓN CORREGIDA =====
    async function navigateTo(page) {
        console.log('Navegando a:', page);
        
        // Limpiar recursos anteriores
        clearAllIntervals();
        
        if (window.counterManager) {
            window.counterManager.destroy();
            window.counterManager = null;
        }
        
        if (window.currentPageCleanup) {
            window.currentPageCleanup();
            window.currentPageCleanup = null;
        }
        
        // Desconectar observer
        if (scrollObserver) {
            scrollObserver.disconnect();
            scrollObserver = null;
        }
        
        // Actualizar clases de navegación
        navLinks.forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('text-cyan-400');
                link.classList.remove('text-gray-300');
            } else {
                link.classList.remove('text-cyan-400');
                link.classList.add('text-gray-300');
            }
        });
        
        // Efecto de transición
        content.style.opacity = '0';
        
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Página no encontrada');
            const html = await response.text();
            
            setTimeout(() => {
                // Insertar nuevo contenido
                content.innerHTML = html;
                content.style.opacity = '1';
                currentPage = page;
                
                // IMPORTANTE: Resetear elementos si es home
                if (page === 'home') {
                    // Pequeño delay para asegurar que el DOM se actualizó
                    setTimeout(() => {
                        resetHomeElements();
                        // Inicializar scripts y observer
                        initializePageScripts(page);
                        initScrollReveal();
                        
                        // Animar contadores
                        if (window.counterManager) {
                            window.counterManager.animateAll();
                        }
                    }, 100);
                } else {
                    initializePageScripts(page);
                }
                
                // Actualizar URL
                if (page === 'home') {
                    history.pushState({ page }, '', '/');
                } else {
                    history.pushState({ page }, '', `/${page}`);
                }
                
                updatePageTitle(page);
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
            }, 300);
            
        } catch (error) {
            console.error('Error cargando la página:', error);
            content.innerHTML = `
                <div class="container mx-auto px-4 py-20 text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-red-500 mb-4">Error 404</h2>
                    <p class="text-gray-400 mb-8 text-lg">La página que buscas no existe</p>
                    <a href="#" data-page="home" class="nav-link bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
                        Volver al inicio
                    </a>
                </div>
            `;
            content.style.opacity = '1';
        }
    }
    
    function updatePageTitle(page) {
        const titles = {
            'home': 'LKE E-SPORTS | Inicio',
            'team': 'LKE E-SPORTS | Equipos Competitivos',
            'tournaments': 'LKE E-SPORTS | Torneos',
            'organigrama': 'LKE E-SPORTS | Organigrama',
            'news': 'LKE E-SPORTS | Noticias',
            'contact': 'LKE E-SPORTS | Contacto'
        };
        document.title = titles[page] || 'LKE E-SPORTS';
    }
    
    function getPageFromPath() {
        const path = window.location.pathname;
        if (path === '/' || path === '') return 'home';
        const page = path.substring(1);
        const validPages = ['home', 'team', 'tournaments', 'organigrama', 'news', 'contact'];
        return validPages.includes(page) ? page : 'home';
    }
    
    function initializePageScripts(page) {
        switch(page) {
            case 'home':
                window.currentPageCleanup = initHomePage();
                break;
            case 'team':
                initTeamPage();
                break;
            case 'tournaments':
                initTournamentsPage();
                break;
            case 'organigrama':
                initOrganigramaPage();
                break;
            case 'news':
                initNewsPage();
                break;
            case 'contact':
                initContactPage();
                break;
        }
    }
    
    // ==================== HOME ====================
    function initHomePage() {
        console.log('Home page initialized');
        
        // Sistema de contadores sincronizados
        class CounterManager {
            constructor() {
                this.counters = [];
                this.animationDuration = 2000;
                this.isRunning = false;
                this.animationId = null;
                this.countdownInterval = null;
            }
            
            init() {
                this.counters = []; // Limpiar contadores anteriores
                const counterElements = document.querySelectorAll('.counter');
                
                counterElements.forEach(counterEl => {
                    const target = parseInt(counterEl.dataset.target) || 0;
                    
                    this.counters.push({
                        element: counterEl,
                        target: target,
                        currentValue: 0,
                        startTime: null
                    });
                });
                
                console.log('Contadores inicializados:', this.counters.length);
            }
            
            async animateAll() {
                this.stop();
                
                this.counters.forEach(counter => {
                    counter.currentValue = 0;
                    counter.element.textContent = '0';
                });
                
                this.isRunning = true;
                const startTime = performance.now();
                
                return new Promise((resolve) => {
                    const animate = (currentTime) => {
                        if (!this.isRunning) return;
                        
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / this.animationDuration, 1);
                        
                        let allFinished = true;
                        
                        this.counters.forEach(counter => {
                            const value = Math.floor(progress * counter.target);
                            
                            if (value !== counter.currentValue) {
                                counter.currentValue = value;
                                counter.element.textContent = value;
                                
                                counter.element.classList.add('counter-update');
                                setTimeout(() => {
                                    counter.element.classList.remove('counter-update');
                                }, 300);
                            }
                            
                            if (progress < 1) {
                                allFinished = false;
                            } else {
                                counter.element.textContent = counter.target;
                            }
                        });
                        
                        if (!allFinished) {
                            this.animationId = requestAnimationFrame(animate);
                        } else {
                            console.log('Contadores finalizados');
                            resolve();
                        }
                    };
                    
                    this.animationId = requestAnimationFrame(animate);
                });
            }
            
            stop() {
                this.isRunning = false;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            }
            
            startLoop(intervalTime = 30000) {
                this.animateAll();
                
                if (this.countdownInterval) {
                    clearInterval(this.countdownInterval);
                }
                
                this.countdownInterval = setInterval(() => {
                    this.animateAll();
                }, intervalTime);
            }
            
            destroy() {
                this.stop();
                if (this.countdownInterval) {
                    clearInterval(this.countdownInterval);
                    this.countdownInterval = null;
                }
            }
        }
        
        // Inicializar contadores
        const counterManager = new CounterManager();
        counterManager.init();
        counterManager.startLoop(30000);
        
        window.counterManager = counterManager;
        
        return () => {
            if (window.counterManager) {
                window.counterManager.destroy();
            }
        };
    }
    
    // ==================== TEAM ====================
    function initTeamPage() {
        console.log('Team page initialized');
        
        const playerCards = document.querySelectorAll('.player-card');
        playerCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('neon-border', 'scale-105');
                card.style.transition = 'all 0.3s ease';
                card.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('neon-border', 'scale-105');
                card.style.zIndex = '1';
            });
        });
        
        initScrollTopButton();
        initTeamQuickLinks();
        animateTeamCards();
        handleTeamHash();
    }
    
    function initScrollTopButton() {
        let scrollTopBtn = document.getElementById('scrollTopBtn');
        
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.id = 'scrollTopBtn';
            scrollTopBtn.className = 'fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 invisible z-50';
            scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up text-xl"></i>';
            document.body.appendChild(scrollTopBtn);
        }
        
        const toggleScrollTop = () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('show');
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.classList.remove('show');
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        };
        
        window.addEventListener('scroll', toggleScrollTop);
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        toggleScrollTop();
    }
    
    function initTeamQuickLinks() {
        const quickLinks = document.querySelectorAll('.team-quick-link');
        
        quickLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const navbarHeight = 80;
                        const targetPosition = targetElement.offsetTop - navbarHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        history.pushState(null, '', targetId);
                    }
                }
            });
        });
    }
    
    function animateTeamCards() {
        const cards = document.querySelectorAll('.player-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }
    
    function handleTeamHash() {
        const hash = window.location.hash;
        
        if (hash && hash !== '#') {
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                
                if (targetElement) {
                    const navbarHeight = 80;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }
    
    // ==================== TORNEOS ====================
    function initTournamentsPage() {
        console.log('Tournaments page initialized');
        startCountdown();
    }
    
    function startCountdown() {
        const countdownElement = document.querySelector('.countdown');
        
        if (!countdownElement) return;
        
        const targetDate = new Date('2026-03-23T22:00:00-04:00');
        
        function updateCountdown() {
            const now = new Date();
            const difference = targetDate - now;
            
            if (difference <= 0) {
                countdownElement.innerHTML = '<span class="text-green-400 font-bold">¡TORNEO INICIADO!</span>';
                countdownElement.classList.add('text-green-400');
                clearInterval(intervalId);
                return;
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            const formattedDays = String(days).padStart(2, '0');
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            
            countdownElement.innerHTML = `
                <div class="flex flex-wrap justify-center gap-2 md:gap-4 text-xl md:text-4xl font-bold">
                    <div class="bg-black/50 px-3 py-2 md:px-6 md:py-4 rounded-lg neon-border">
                        <span class="text-cyan-400">${formattedDays}</span>
                        <span class="text-xs md:text-sm block text-gray-400">Días</span>
                    </div>
                    <div class="bg-black/50 px-3 py-2 md:px-6 md:py-4 rounded-lg neon-border">
                        <span class="text-cyan-400">${formattedHours}</span>
                        <span class="text-xs md:text-sm block text-gray-400">Horas</span>
                    </div>
                    <div class="bg-black/50 px-3 py-2 md:px-6 md:py-4 rounded-lg neon-border">
                        <span class="text-cyan-400">${formattedMinutes}</span>
                        <span class="text-xs md:text-sm block text-gray-400">Min</span>
                    </div>
                    <div class="bg-black/50 px-3 py-2 md:px-6 md:py-4 rounded-lg neon-border">
                        <span class="text-cyan-400">${formattedSeconds}</span>
                        <span class="text-xs md:text-sm block text-gray-400">Seg</span>
                    </div>
                </div>
            `;
        }
        
        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);
        activeIntervals.push(intervalId);
    }
    
    // ==================== ORGANIGRAMA ====================
    function initOrganigramaPage() {
        console.log('Organigrama page initialized');
        
        const staffCards = document.querySelectorAll('.staff-card');
        staffCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
            
            card.addEventListener('mouseenter', () => {
                card.classList.add('shadow-2xl', 'shadow-cyan-500/20');
                card.style.transform = 'scale(1.05) translateY(-5px)';
                
                const icon = card.querySelector('.rounded-full');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.transition = 'all 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('shadow-2xl', 'shadow-cyan-500/20');
                card.style.transform = 'scale(1) translateY(0)';
                
                const icon = card.querySelector('.rounded-full');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                }
            });
        });
        
        const roleBadges = document.querySelectorAll('.role-badge');
        roleBadges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.1)';
                badge.style.backgroundColor = 'rgba(6, 182, 212, 0.3)';
                badge.style.transition = 'all 0.2s ease';
            });
            
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
                badge.style.backgroundColor = 'transparent';
            });
        });
    }
    
    // ==================== NOTICIAS ====================
    function initNewsPage() {
        console.log('News page initialized');
        
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // ==================== CONTACTO ====================
    function initContactPage() {
        console.log('Contact page initialized');
        
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Enviando...';
                btn.disabled = true;
                
                setTimeout(() => {
                    alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
                    form.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 1500);
            });
        }
        
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.length > 0) {
                    input.classList.add('border-green-500');
                    input.classList.remove('border-red-500');
                } else {
                    input.classList.remove('border-green-500');
                    input.classList.add('border-red-500');
                }
            });
        });
    }
    
    // Manejar botones atrás/adelante
    window.addEventListener('popstate', (event) => {
        const page = getPageFromPath();
        navigateTo(page);
    });
    
    // Cargar página inicial
    const initialPage = getPageFromPath();
    navigateTo(initialPage);
    
    // Cerrar menú móvil al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('mobile-menu-enter');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
    
    // Manejar resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-menu-enter');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
});

// Limpiar al salir
window.addEventListener('beforeunload', () => {
    if (window.counterManager) {
        window.counterManager.destroy();
    }
});