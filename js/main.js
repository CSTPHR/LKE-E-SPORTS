// main.js - Sistema de navegación dinámica para LKE E-SPORTS

document.addEventListener('DOMContentLoaded', () => {
    // ===== MANEJO DEL SPLASH SCREEN =====
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    
    // Función para ocultar el splash screen con efecto profesional
    function hideSplashScreen() {
        // Asegurar que el contenido principal sea visible
        mainContent.classList.add('visible');
        
        // Ocultar splash con transición suave
        splashScreen.classList.add('hidden');
        
        // Remover del DOM después de la animación
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 800);
    }
    
    // Mostrar splash por al menos 2 segundos (para apreciar la animación)
    // pero máximo hasta que cargue todo
    const minSplashTime = 2000; // 2 segundos mínimo
    const startTime = Date.now();
    
    // Esperar a que todo el contenido esté cargado
    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsedTime);
        
        setTimeout(hideSplashScreen, remainingTime);
    });
    
    // Fallback: si todo carga muy rápido, asegurar mínimo tiempo
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
    
    // Toggle menú móvil con animación
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
            
            // Cerrar menú móvil si está abierto
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-menu-enter');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            
            // Cambiar página
            navigateTo(page);
        });
    });
    
    // Función para limpiar intervalos activos
    function clearAllIntervals() {
        activeIntervals.forEach(interval => {
            clearInterval(interval);
        });
        activeIntervals = [];
    }
    
    // Función de navegación - SIN HASH (#)
    async function navigateTo(page) {
        // Limpiar intervalos anteriores
        clearAllIntervals();
        
        // Actualizar clase activa en los enlaces
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
        
        // Cargar el contenido de la página
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Página no encontrada');
            const html = await response.text();
            
            setTimeout(() => {
                content.innerHTML = html;
                content.style.opacity = '1';
                currentPage = page;
                
                // Inicializar scripts específicos de la página
                initializePageScripts(page);
                
                // Actualizar URL sin # y sin recargar la página
                if (page === 'home') {
                    history.pushState({ page }, '', '/');
                } else {
                    history.pushState({ page }, '', `/${page}`);
                }
                
                // Actualizar el título de la página
                updatePageTitle(page);
                
                // Scroll suave hacia arriba
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
    
    // Función para actualizar el título de la página
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
    
    // Función para obtener la página actual desde la URL
    function getPageFromPath() {
        const path = window.location.pathname;
        
        if (path === '/' || path === '') {
            return 'home';
        }
        
        const page = path.substring(1);
        const validPages = ['home', 'team', 'tournaments', 'organigrama', 'news', 'contact'];
        
        return validPages.includes(page) ? page : 'home';
    }
    
    // Función para inicializar scripts específicos de cada página
    function initializePageScripts(page) {
        switch(page) {
            case 'home':
                initHomePage();
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
    
    // Scripts específicos de cada página
    function initHomePage() {
        console.log('Home page initialized');
        
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top <= window.innerHeight - 100;
                
                if (isVisible) {
                    el.classList.add('opacity-100', 'translate-y-0');
                    el.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll();
    }
    
    // ==================== PÁGINA DE EQUIPOS MEJORADA ====================
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
            
            countdownElement.style.transform = 'scale(1.02)';
            setTimeout(() => {
                countdownElement.style.transform = 'scale(1)';
            }, 200);
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
    
    // Manejar botones atrás/adelante del navegador
    window.addEventListener('popstate', (event) => {
        const page = getPageFromPath();
        navigateTo(page);
    });
    
    // Cargar página inicial basada en el path de la URL
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
    
    // Manejar resize de ventana
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

// Limpiar intervalos cuando se cambia de página
window.addEventListener('beforeunload', () => {
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }
});