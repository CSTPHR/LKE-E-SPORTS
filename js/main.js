// ============================================
// MAIN.JS - SISTEMA DE NAVEGACIÓN DINÁMICA PARA LKE E-SPORTS
// VERSIÓN DEFINITIVA - CON HASH ROUTING Y EFECTOS COMPLETOS
// INCLUYE ORGANIGRAMA CON EFECTOS DE TÍTULO ARMONIZADOS Y SCROLL REVEAL
// NUEVO: EFECTO DE TÍTULO ESTILO TORNEOS PARA EL HERO (DOMINA EL COMPETITIVO)
// NUEVO: EVENTO PERSONALIZADO PARA ACTIVAR GLITCH EN COMPETITIVO CUANDO SE REINICIAN LOS CONTADORES
// NUEVO: EFECTO FLASH AL HACER SCROLL EN TARJETAS DE NOTICIAS (REPETIBLE Y CON MEJOR VISIBILIDAD)
// MODIFICADO: CORRECCIÓN DE DOBLE REINICIO DE CONTADORES
// MODIFICADO: ORGANIGRAMA CON EFECTOS UNIFICADOS (STAFF-CARD-ENHANCED)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // SECCIÓN 1: MANEJO DEL SPLASH SCREEN
    // ============================================
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    
    // Variable para controlar si las animaciones ya se ejecutaron
    let animationsExecuted = false;
    
    // Detectar si es dispositivo táctil para optimizar animaciones
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // ============================================
    // FUNCIÓN PARA ACTIVAR GLITCH EN LA PALABRA COMPETITIVO
    // ============================================
    function triggerCompetitivoGlitch() {
        // Buscar el elemento por ID o por clase si no tiene ID
        let competitivoWord = document.getElementById('competitivo-word');
        
        // Si no encuentra por ID, buscar por la clase y el texto
        if (!competitivoWord) {
            const possibleElements = document.querySelectorAll('.hero-title-line2');
            for (let el of possibleElements) {
                if (el.textContent.trim() === 'COMPETITIVO') {
                    competitivoWord = el;
                    break;
                }
            }
        }
        
        if (competitivoWord) {
            // Remover cualquier animación previa
            competitivoWord.style.animation = 'none';
            // Forzar reflow
            void competitivoWord.offsetWidth;
            // Aplicar la animación glitch
            competitivoWord.style.animation = 'heroGlitch 0.3s ease-in-out';
            // Limpiar después de que termine
            setTimeout(() => {
                if (competitivoWord) {
                    competitivoWord.style.animation = '';
                }
            }, 300);
            console.log('Glitch activado en COMPETITIVO');
        } else {
            console.log('Elemento COMPETITIVO no encontrado para glitch');
        }
    }
    
    // ============================================
    // FUNCIÓN PARA ACTIVAR FLASH EN TARJETAS DE NOTICIAS AL HACER SCROLL
    // MODIFICADA: Flash cuando la tarjeta está completamente visible y repetible
    // ============================================
    function initNewsCardsFlashOnScroll() {
        const newsCards = document.querySelectorAll('.news-card-enhanced');
        
        if (newsCards.length === 0) {
            console.log('No se encontraron tarjetas de noticias para el efecto flash');
            return;
        }
        
        // Configurar observer para detectar cuando las tarjetas entran al viewport
        const observerOptions = {
            threshold: 0.85,
            rootMargin: '0px 0px 0px 0px'
        };
        
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const flashElement = card.querySelector('.camera-flash');
                    if (flashElement) {
                        flashElement.classList.remove('camera-flash');
                        void flashElement.offsetWidth;
                        flashElement.classList.add('camera-flash');
                        setTimeout(() => {
                            if (flashElement) {
                                flashElement.classList.remove('camera-flash');
                            }
                        }, 500);
                    }
                    console.log('Flash activado en tarjeta de noticias al hacer scroll');
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        newsCards.forEach(card => {
            observer.observe(card);
        });
        
        console.log('Flash on scroll inicializado en', newsCards.length, 'tarjetas de noticias');
        
        window.newsCardsFlashObserver = observer;
    }
    
    function cleanupNewsCardsFlashObserver() {
        if (window.newsCardsFlashObserver) {
            window.newsCardsFlashObserver.disconnect();
            window.newsCardsFlashObserver = null;
            console.log('Observer de flash en noticias limpiado');
        }
    }
    
    // ============================================
    // FUNCIÓN PARA ACTIVAR FLASH EN TARJETAS DE ORGANIGRAMA
    // ============================================
    function initOrganigramaCardsFlashOnScroll() {
        const staffCards = document.querySelectorAll('.staff-card-enhanced');
        
        if (staffCards.length === 0) return;
        
        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px 0px -30px 0px'
        };
        
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-flash-played')) {
                    const card = entry.target;
                    const flashElement = card.querySelector('.camera-flash');
                    if (flashElement) {
                        flashElement.classList.remove('camera-flash');
                        void flashElement.offsetWidth;
                        flashElement.classList.add('camera-flash');
                        setTimeout(() => {
                            if (flashElement) {
                                flashElement.classList.remove('camera-flash');
                            }
                        }, 500);
                    }
                    card.setAttribute('data-flash-played', 'true');
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        staffCards.forEach(card => {
            observer.observe(card);
        });
        
        window.organigramaFlashObserver = observer;
        console.log('Flash on scroll inicializado en', staffCards.length, 'tarjetas de organigrama');
    }
    
    // ============================================
    // FUNCIÓN PARA EFECTO DE PARTÍCULAS EN TARJETAS DE ORGANIGRAMA
    // ============================================
    function initOrganigramaParticleEffect() {
        const staffCards = document.querySelectorAll('.staff-card-enhanced');
        
        staffCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });
        
        console.log('Efecto de partículas inicializado en', staffCards.length, 'tarjetas de organigrama');
    }
    
    // ============================================
    // FUNCIÓN PARA EJECUTAR TODAS LAS ANIMACIONES DESPUÉS DEL SPLASH
    // ============================================
    function executeAnimations() {
        if (animationsExecuted) return;
        animationsExecuted = true;
        
        mainContent.classList.add('visible');
        void document.body.offsetHeight;
        
        setTimeout(() => {
            // Animación para las palabras del título "DOMINA EL COMPETITIVO"
            const titleLeft = document.querySelector('.title-word-left-hero');
            const titleRight = document.querySelector('.title-word-right-hero');
            const subtitle = document.querySelector('.subtitle-hero');
            const titleLine = document.querySelector('.title-line-hero');
            
            if (titleLeft) {
                titleLeft.classList.add('revealed');
                titleLeft.style.opacity = '1';
                titleLeft.style.transform = 'translateX(0)';
            }
            
            setTimeout(() => {
                if (titleRight) {
                    titleRight.classList.add('revealed');
                    titleRight.style.opacity = '1';
                    titleRight.style.transform = 'translateX(0)';
                }
            }, 150);
            
            setTimeout(() => {
                if (subtitle) {
                    subtitle.classList.add('revealed');
                    subtitle.style.opacity = '1';
                    subtitle.style.transform = 'translateY(0)';
                }
            }, 400);
            
            setTimeout(() => {
                if (titleLine) {
                    titleLine.classList.add('revealed');
                    titleLine.style.transform = 'scaleX(1)';
                }
            }, 600);
            
            // Animar los botones
            const buttons = document.querySelectorAll('.flex.flex-col.sm\\:flex-row a');
            setTimeout(() => {
                buttons.forEach((btn, index) => {
                    setTimeout(() => {
                        btn.classList.remove('opacity-0', 'translate-y-[30px]');
                        btn.classList.add('visible', 'animate-enter-bottom');
                        btn.style.opacity = '1';
                        btn.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }, 800);
            
            // Animar las tarjetas de estadísticas
            const statsCards = document.querySelectorAll('.stats-card');
            statsCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('opacity-0', 'translate-y-[30px]');
                    card.classList.add('visible', 'animate-stats-card');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.classList.add('neon-border');
                    setTimeout(() => {
                        card.classList.remove('neon-border');
                    }, 1000);
                }, 800 + (index * 100));
            });
            
            document.body.classList.add('animate-ready');
            
            setTimeout(() => {
                if (window.counterManager) {
                    window.counterManager.init();
                }
            }, 1200);
            
            initEnhancedScrollReveal();
            initTitleEffects();
            initNewsTitleScrollReveal();
            initHeroTitleScrollReveal();
            initNewsCardsFlashOnScroll();
            initParticleEffectOnNewsCards();
            unifyStatsCardsHover();
            
        }, 100);
    }
    
    function hideSplashScreen() {
        mainContent.classList.add('visible');
        splashScreen.classList.add('hidden');
        
        setTimeout(() => {
            executeAnimations();
        }, 50);
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 800);
    }
    
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

    // ============================================
    // SECCIÓN 2: ELEMENTOS DEL DOM Y ESTADO GLOBAL
    // ============================================
    const content = document.getElementById('content');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    
    let currentPage = 'home';
    let activeIntervals = [];
    let enhancedScrollObserver = null;
    let counterLoopInterval = null;
    let newsTitleObserver = null;
    let heroTitleObserver = null;
    
    window.tournamentsTitleObserver = null;
    window.tournamentsHeaderTitleObserver = null;
    window.organigramaTitleObserver = null;
    window.sectionTitleObservers = [];
    window.organigramaCardObserver = null;
    window.organigramaFlashObserver = null;
    
    // ============================================
    // SECCIÓN 3: FUNCIÓN PARA ASIGNAR EVENT LISTENERS A NAVIGATION
    // ============================================
    function assignNavLinkListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.removeEventListener('click', handleNavClick);
            link.addEventListener('click', handleNavClick);
        });
        console.log('Event listeners asignados a', navLinks.length, 'nav-links');
    }
    
    function handleNavClick(e) {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('mobile-menu-enter');
            if (menuBtn) {
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
        
        navigateTo(page);
    }
    
    // ============================================
    // SECCIÓN 4: MANEJO DEL MENÚ MÓVIL
    // ============================================
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
    
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && 
            !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('mobile-menu-enter');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu) {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-menu-enter');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
    
    // ============================================
    // SECCIÓN 5: FUNCIONES UTILITARIAS
    // ============================================
    function clearAllIntervals() {
        activeIntervals.forEach(interval => {
            clearInterval(interval);
        });
        activeIntervals = [];
        if (counterLoopInterval) {
            clearInterval(counterLoopInterval);
            counterLoopInterval = null;
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
    
    function getPageFromHash() {
        const hash = window.location.hash.substring(1);
        const validPages = ['home', 'team', 'tournaments', 'organigrama', 'news', 'contact'];
        return validPages.includes(hash) ? hash : 'home';
    }
    
    function updateActiveNavLinks(page) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('text-cyan-400');
                link.classList.remove('text-gray-300');
            } else {
                link.classList.remove('text-cyan-400');
                link.classList.add('text-gray-300');
            }
        });
    }
    
    // ============================================
    // SECCIÓN 6: FUNCIÓN PARA RESETEAR ELEMENTOS DEL HOME
    // ============================================
    function resetHomeElements() {
        const titleLeft = document.querySelector('.title-word-left-hero');
        const titleRight = document.querySelector('.title-word-right-hero');
        const subtitle = document.querySelector('.subtitle-hero');
        const titleLine = document.querySelector('.title-line-hero');
        
        if (titleLeft) {
            titleLeft.classList.remove('revealed');
            titleLeft.style.opacity = '0';
            titleLeft.style.transform = 'translateX(-30px)';
        }
        if (titleRight) {
            titleRight.classList.remove('revealed');
            titleRight.style.opacity = '0';
            titleRight.style.transform = 'translateX(30px)';
        }
        if (subtitle) {
            subtitle.classList.remove('revealed');
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
        if (titleLine) {
            titleLine.classList.remove('revealed');
            titleLine.style.transform = 'scaleX(0)';
        }
        
        const buttons = document.querySelectorAll('.flex.flex-col.sm\\:flex-row a');
        buttons.forEach(btn => {
            btn.classList.remove('visible', 'animate-enter-bottom');
            btn.classList.add('opacity-0', 'translate-y-[30px]');
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(30px)';
        });
        
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.classList.remove('visible', 'animate-stats-card');
            card.classList.add('opacity-0', 'translate-y-[30px]');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = '';
        });
        
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.textContent = '0';
        });
        
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            card.classList.add('opacity-0', 'translate-y-[30px]');
        });
        
        resetNewsTitleElements();
        console.log('Elementos del home reseteados');
    }
    
    // ============================================
    // SECCIÓN 6.5: FUNCIONES PARA EL TÍTULO DE NOTICIAS
    // ============================================
    function resetNewsTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-news');
        const titleRight = document.querySelector('.title-word-right-news');
        const subtitle = document.querySelector('.subtitle-news');
        const titleLine = document.querySelector('.title-line-news');
        
        if (titleLeft) {
            titleLeft.classList.remove('revealed');
            titleLeft.style.opacity = '0';
            titleLeft.style.transform = 'translateX(-30px)';
        }
        if (titleRight) {
            titleRight.classList.remove('revealed');
            titleRight.style.opacity = '0';
            titleRight.style.transform = 'translateX(30px)';
        }
        if (subtitle) {
            subtitle.classList.remove('revealed');
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
        if (titleLine) {
            titleLine.classList.remove('revealed');
            titleLine.style.transform = 'scaleX(0)';
        }
    }
    
    function revealNewsTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-news');
        const titleRight = document.querySelector('.title-word-right-news');
        const subtitle = document.querySelector('.subtitle-news');
        const titleLine = document.querySelector('.title-line-news');
        
        if (titleLeft && !titleLeft.classList.contains('revealed')) {
            titleLeft.classList.add('revealed');
        }
        if (titleRight && !titleRight.classList.contains('revealed')) {
            titleRight.classList.add('revealed');
        }
        if (subtitle && !subtitle.classList.contains('revealed')) {
            subtitle.classList.add('revealed');
        }
        if (titleLine && !titleLine.classList.contains('revealed')) {
            titleLine.classList.add('revealed');
        }
    }
    
    function initNewsTitleScrollReveal() {
        if (newsTitleObserver) {
            newsTitleObserver.disconnect();
        }
        
        const newsSection = document.getElementById('news-section');
        if (!newsSection) {
            setTimeout(initNewsTitleScrollReveal, 500);
            return;
        }
        
        resetNewsTitleElements();
        
        const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealNewsTitleElements();
                } else {
                    resetNewsTitleElements();
                }
            });
        };
        
        newsTitleObserver = new IntersectionObserver(observerCallback, observerOptions);
        newsTitleObserver.observe(newsSection);
        
        setTimeout(() => {
            if (newsSection && isElementInViewport(newsSection, 100)) {
                revealNewsTitleElements();
            }
        }, 300);
        
        console.log('Scroll reveal para título de noticias inicializado');
    }
    
    // ============================================
    // SECCIÓN 6.6: FUNCIÓN PARA EL TÍTULO DEL HERO
    // ============================================
    function resetHeroTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-hero');
        const titleRight = document.querySelector('.title-word-right-hero');
        const subtitle = document.querySelector('.subtitle-hero');
        const titleLine = document.querySelector('.title-line-hero');
        
        if (titleLeft) {
            titleLeft.classList.remove('revealed');
            titleLeft.style.opacity = '0';
            titleLeft.style.transform = 'translateX(-30px)';
        }
        if (titleRight) {
            titleRight.classList.remove('revealed');
            titleRight.style.opacity = '0';
            titleRight.style.transform = 'translateX(30px)';
        }
        if (subtitle) {
            subtitle.classList.remove('revealed');
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
        if (titleLine) {
            titleLine.classList.remove('revealed');
            titleLine.style.transform = 'scaleX(0)';
        }
    }
    
    function revealHeroTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-hero');
        const titleRight = document.querySelector('.title-word-right-hero');
        const subtitle = document.querySelector('.subtitle-hero');
        const titleLine = document.querySelector('.title-line-hero');
        
        if (titleLeft && !titleLeft.classList.contains('revealed')) {
            titleLeft.classList.add('revealed');
        }
        if (titleRight && !titleRight.classList.contains('revealed')) {
            titleRight.classList.add('revealed');
        }
        if (subtitle && !subtitle.classList.contains('revealed')) {
            subtitle.classList.add('revealed');
        }
        if (titleLine && !titleLine.classList.contains('revealed')) {
            titleLine.classList.add('revealed');
        }
    }
    
    function initHeroTitleScrollReveal() {
        if (heroTitleObserver) {
            heroTitleObserver.disconnect();
        }
        
        const heroSection = document.getElementById('home-hero-section');
        if (!heroSection) {
            setTimeout(initHeroTitleScrollReveal, 500);
            return;
        }
        
        resetHeroTitleElements();
        
        const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealHeroTitleElements();
                } else {
                    resetHeroTitleElements();
                }
            });
        };
        
        heroTitleObserver = new IntersectionObserver(observerCallback, observerOptions);
        heroTitleObserver.observe(heroSection);
        
        setTimeout(() => {
            if (heroSection && isElementInViewport(heroSection, 100)) {
                revealHeroTitleElements();
            }
        }, 300);
        
        console.log('Scroll reveal para título del hero inicializado');
    }
    
    // ============================================
    // SECCIÓN 6.7: EFECTOS MEJORADOS PARA NOTICIAS
    // ============================================
    function initParticleEffectOnNewsCards() {
        const newsCards = document.querySelectorAll('.news-card-enhanced');
        newsCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });
        console.log('Efecto de partículas inicializado en', newsCards.length, 'tarjetas');
    }
    
    function initDataBlastEffect() {
        const newsLinks = document.querySelectorAll('.news-card-enhanced .nav-link');
        newsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const arrowIcon = link.querySelector('.news-arrow-icon');
                if (arrowIcon) {
                    arrowIcon.style.animation = 'none';
                    void arrowIcon.offsetWidth;
                    arrowIcon.style.animation = 'dataBlast 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    setTimeout(() => {
                        if (arrowIcon) {
                            arrowIcon.style.animation = '';
                        }
                    }, 400);
                }
            });
        });
        console.log('Efecto Data Blast inicializado en', newsLinks.length, 'enlaces');
    }
    
    // ============================================
    // SECCIÓN 6.8: EFECTOS MEJORADOS PARA TORNEOS
    // ============================================
    function initTournamentCameraFlash() {
        const tournamentCards = document.querySelectorAll('.tournament-card-enhanced');
        tournamentCards.forEach((card, index) => {
            const flashElement = card.querySelector('.camera-flash');
            if (flashElement) {
                flashElement.classList.remove('camera-flash');
                void flashElement.offsetWidth;
                setTimeout(() => {
                    flashElement.classList.add('camera-flash');
                    setTimeout(() => {
                        flashElement.classList.remove('camera-flash');
                    }, 500);
                }, index * 200);
            }
        });
        console.log('Efecto cámara flash inicializado en', tournamentCards.length, 'tarjetas de torneos');
    }
    
    function initTournamentParticleEffect() {
        const tournamentCards = document.querySelectorAll('.tournament-card-enhanced');
        tournamentCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });
        console.log('Efecto de partículas inicializado en', tournamentCards.length, 'tarjetas de torneos');
    }
    
    function initTournamentDataBlast() {
        const tournamentLinks = document.querySelectorAll('.tournament-card-enhanced .nav-link');
        tournamentLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const arrowIcon = link.querySelector('.tournament-arrow-icon');
                if (arrowIcon) {
                    arrowIcon.style.animation = 'none';
                    void arrowIcon.offsetWidth;
                    arrowIcon.style.animation = 'tournamentDataBlast 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    setTimeout(() => {
                        if (arrowIcon) {
                            arrowIcon.style.animation = '';
                        }
                    }, 400);
                }
            });
        });
        console.log('Efecto Data Blast inicializado en', tournamentLinks.length, 'enlaces de torneos');
    }
    
    function initTournamentEffects() {
        initTournamentCameraFlash();
        initTournamentParticleEffect();
        initTournamentDataBlast();
    }
    
    // ============================================
    // SECCIÓN 6.9: FUNCIONES PARA EL TÍTULO DE TORNEOS ANTERIORES
    // ============================================
    function resetTournamentsTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-tournaments');
        const titleRight = document.querySelector('.title-word-right-tournaments');
        const subtitle = document.querySelector('.subtitle-tournaments');
        const titleLine = document.querySelector('.title-line-tournaments');
        
        if (titleLeft) {
            titleLeft.classList.remove('revealed');
            titleLeft.style.opacity = '0';
            titleLeft.style.transform = 'translateX(-30px)';
        }
        if (titleRight) {
            titleRight.classList.remove('revealed');
            titleRight.style.opacity = '0';
            titleRight.style.transform = 'translateX(30px)';
        }
        if (subtitle) {
            subtitle.classList.remove('revealed');
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
        if (titleLine) {
            titleLine.classList.remove('revealed');
            titleLine.style.transform = 'scaleX(0)';
        }
    }
    
    function revealTournamentsTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-tournaments');
        const titleRight = document.querySelector('.title-word-right-tournaments');
        const subtitle = document.querySelector('.subtitle-tournaments');
        const titleLine = document.querySelector('.title-line-tournaments');
        
        if (titleLeft && !titleLeft.classList.contains('revealed')) {
            titleLeft.classList.add('revealed');
        }
        if (titleRight && !titleRight.classList.contains('revealed')) {
            titleRight.classList.add('revealed');
        }
        if (subtitle && !subtitle.classList.contains('revealed')) {
            subtitle.classList.add('revealed');
        }
        if (titleLine && !titleLine.classList.contains('revealed')) {
            titleLine.classList.add('revealed');
        }
    }
    
    function initTournamentsTitleScrollReveal() {
        if (window.tournamentsTitleObserver) {
            window.tournamentsTitleObserver.disconnect();
        }
        
        const tournamentsPastSection = document.getElementById('tournaments-past-section');
        if (!tournamentsPastSection) {
            setTimeout(initTournamentsTitleScrollReveal, 500);
            return;
        }
        
        resetTournamentsTitleElements();
        
        const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealTournamentsTitleElements();
                } else {
                    resetTournamentsTitleElements();
                }
            });
        };
        
        window.tournamentsTitleObserver = new IntersectionObserver(observerCallback, observerOptions);
        window.tournamentsTitleObserver.observe(tournamentsPastSection);
        
        setTimeout(() => {
            if (tournamentsPastSection && isElementInViewport(tournamentsPastSection, 100)) {
                revealTournamentsTitleElements();
            }
        }, 300);
        
        console.log('Scroll reveal para título de torneos anteriores inicializado');
    }
    
    // ============================================
    // SECCIÓN 6.10: FUNCIONES PARA EL TÍTULO HEADER DE TORNEOS
    // ============================================
    function resetTournamentsHeaderTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-tournaments-header');
        const titleRight = document.querySelector('.title-word-right-tournaments-header');
        const subtitle = document.querySelector('.subtitle-tournaments-header');
        const titleLine = document.querySelector('.title-line-tournaments-header');
        
        if (titleLeft) {
            titleLeft.classList.remove('revealed');
            titleLeft.style.opacity = '0';
            titleLeft.style.transform = 'translateX(-30px)';
        }
        if (titleRight) {
            titleRight.classList.remove('revealed');
            titleRight.style.opacity = '0';
            titleRight.style.transform = 'translateX(30px)';
        }
        if (subtitle) {
            subtitle.classList.remove('revealed');
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
        if (titleLine) {
            titleLine.classList.remove('revealed');
            titleLine.style.transform = 'scaleX(0)';
        }
    }
    
    function revealTournamentsHeaderTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-tournaments-header');
        const titleRight = document.querySelector('.title-word-right-tournaments-header');
        const subtitle = document.querySelector('.subtitle-tournaments-header');
        const titleLine = document.querySelector('.title-line-tournaments-header');
        
        if (titleLeft && !titleLeft.classList.contains('revealed')) {
            titleLeft.classList.add('revealed');
        }
        if (titleRight && !titleRight.classList.contains('revealed')) {
            titleRight.classList.add('revealed');
        }
        if (subtitle && !subtitle.classList.contains('revealed')) {
            subtitle.classList.add('revealed');
        }
        if (titleLine && !titleLine.classList.contains('revealed')) {
            titleLine.classList.add('revealed');
        }
    }
    
    function initTournamentsHeaderTitleScrollReveal() {
        if (window.tournamentsHeaderTitleObserver) {
            window.tournamentsHeaderTitleObserver.disconnect();
        }
        
        const tournamentsHeaderSection = document.getElementById('tournaments-header-section');
        if (!tournamentsHeaderSection) {
            setTimeout(initTournamentsHeaderTitleScrollReveal, 500);
            return;
        }
        
        resetTournamentsHeaderTitleElements();
        
        const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealTournamentsHeaderTitleElements();
                } else {
                    resetTournamentsHeaderTitleElements();
                }
            });
        };
        
        window.tournamentsHeaderTitleObserver = new IntersectionObserver(observerCallback, observerOptions);
        window.tournamentsHeaderTitleObserver.observe(tournamentsHeaderSection);
        
        setTimeout(() => {
            if (tournamentsHeaderSection && isElementInViewport(tournamentsHeaderSection, 100)) {
                revealTournamentsHeaderTitleElements();
            }
        }, 300);
        
        console.log('Scroll reveal para título header de torneos inicializado');
    }
    
    // ============================================
    // SECCIÓN 6.11: FUNCIONES PARA EL TÍTULO DE ORGANIGRAMA
    // ============================================
    function resetOrganigramaTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-organigrama');
        const titleRight = document.querySelector('.title-word-right-organigrama');
        const subtitle = document.querySelector('.subtitle-organigrama');
        const titleLine = document.querySelector('.title-line-organigrama');
        
        if (titleLeft) {
            titleLeft.classList.remove('revealed');
            titleLeft.style.opacity = '0';
            titleLeft.style.transform = 'translateX(-30px)';
        }
        if (titleRight) {
            titleRight.classList.remove('revealed');
            titleRight.style.opacity = '0';
            titleRight.style.transform = 'translateX(30px)';
        }
        if (subtitle) {
            subtitle.classList.remove('revealed');
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(20px)';
        }
        if (titleLine) {
            titleLine.classList.remove('revealed');
            titleLine.style.transform = 'scaleX(0)';
        }
    }
    
    function revealOrganigramaTitleElements() {
        const titleLeft = document.querySelector('.title-word-left-organigrama');
        const titleRight = document.querySelector('.title-word-right-organigrama');
        const subtitle = document.querySelector('.subtitle-organigrama');
        const titleLine = document.querySelector('.title-line-organigrama');
        
        if (titleLeft && !titleLeft.classList.contains('revealed')) {
            titleLeft.classList.add('revealed');
        }
        if (titleRight && !titleRight.classList.contains('revealed')) {
            titleRight.classList.add('revealed');
        }
        if (subtitle && !subtitle.classList.contains('revealed')) {
            subtitle.classList.add('revealed');
        }
        if (titleLine && !titleLine.classList.contains('revealed')) {
            titleLine.classList.add('revealed');
        }
    }
    
    function initOrganigramaTitleScrollReveal() {
        if (window.organigramaTitleObserver) {
            window.organigramaTitleObserver.disconnect();
        }
        
        const organigramaHeaderSection = document.getElementById('organigrama-header-section');
        if (!organigramaHeaderSection) {
            setTimeout(initOrganigramaTitleScrollReveal, 500);
            return;
        }
        
        resetOrganigramaTitleElements();
        
        const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealOrganigramaTitleElements();
                } else {
                    resetOrganigramaTitleElements();
                }
            });
        };
        
        window.organigramaTitleObserver = new IntersectionObserver(observerCallback, observerOptions);
        window.organigramaTitleObserver.observe(organigramaHeaderSection);
        
        setTimeout(() => {
            if (organigramaHeaderSection && isElementInViewport(organigramaHeaderSection, 100)) {
                revealOrganigramaTitleElements();
            }
        }, 300);
        
        console.log('Scroll reveal para título de organigrama inicializado');
    }
    
    // ============================================
    // SECCIÓN 6.12: FUNCIONES PARA LOS TÍTULOS DE SECCIÓN DEL ORGANIGRAMA
    // ============================================
    function initOrganigramaSectionTitlesScrollReveal() {
        if (window.sectionTitleObservers) {
            window.sectionTitleObservers.forEach(observer => observer.disconnect());
            window.sectionTitleObservers = [];
        }
        
        const sections = [
            { id: 'ceo-section', leftClass: '.section-title-left-ceo', rightClass: '.section-title-right-ceo', lineClass: '.section-title-line-ceo' },
            { id: 'asistentes-section', leftClass: '.section-title-left-asistentes', rightClass: '.section-title-right-asistentes', lineClass: '.section-title-line-asistentes' },
            { id: 'directoras-section', leftClass: '.section-title-left-directoras', rightClass: '.section-title-right-directoras', lineClass: '.section-title-line-directoras' },
            { id: 'coaches-section', leftClass: '.section-title-left-coaches', rightClass: '.section-title-right-coaches', lineClass: '.section-title-line-coaches' },
            { id: 'managers-section', leftClass: '.section-title-left-managers', rightClass: '.section-title-right-managers', lineClass: '.section-title-line-managers' },
            { id: 'audiovisual-section', leftClass: '.section-title-left-audiovisual', rightClass: '.section-title-right-audiovisual', lineClass: '.section-title-line-audiovisual' },
            { id: 'creadores-section', leftClass: '.section-title-left-creadores', rightClass: '.section-title-right-creadores', lineClass: '.section-title-line-creadores' }
        ];
        
        sections.forEach(section => {
            const sectionElement = document.getElementById(section.id);
            if (!sectionElement) return;
            
            const leftElement = document.querySelector(section.leftClass);
            const rightElement = document.querySelector(section.rightClass);
            const lineElement = document.querySelector(section.lineClass);
            
            if (!leftElement && !rightElement && !lineElement) return;
            
            if (leftElement) {
                leftElement.classList.remove('revealed');
                leftElement.style.opacity = '0';
                leftElement.style.transform = 'translateX(-30px)';
            }
            if (rightElement) {
                rightElement.classList.remove('revealed');
                rightElement.style.opacity = '0';
                rightElement.style.transform = 'translateX(30px)';
            }
            if (lineElement) {
                lineElement.classList.remove('revealed');
                lineElement.style.transform = 'scaleX(0)';
            }
            
            const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
            const observerCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (leftElement && !leftElement.classList.contains('revealed')) {
                            leftElement.classList.add('revealed');
                        }
                        if (rightElement && !rightElement.classList.contains('revealed')) {
                            rightElement.classList.add('revealed');
                        }
                        if (lineElement && !lineElement.classList.contains('revealed')) {
                            lineElement.classList.add('revealed');
                        }
                    } else {
                        if (leftElement) {
                            leftElement.classList.remove('revealed');
                            leftElement.style.opacity = '0';
                            leftElement.style.transform = 'translateX(-30px)';
                        }
                        if (rightElement) {
                            rightElement.classList.remove('revealed');
                            rightElement.style.opacity = '0';
                            rightElement.style.transform = 'translateX(30px)';
                        }
                        if (lineElement) {
                            lineElement.classList.remove('revealed');
                            lineElement.style.transform = 'scaleX(0)';
                        }
                    }
                });
            };
            
            const observer = new IntersectionObserver(observerCallback, observerOptions);
            observer.observe(sectionElement);
            window.sectionTitleObservers.push(observer);
        });
        
        console.log('Scroll reveal para títulos de sección de organigrama inicializado');
    }
    
    // ============================================
    // SECCIÓN 7: FUNCIÓN PARA APLICAR EFECTO NEON A STATS CARDS
    // ============================================
    function applyNeonEffectToStatsCards() {
        const allStatsCards = document.querySelectorAll('.stats-card');
        allStatsCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('neon-border');
                setTimeout(() => {
                    card.classList.remove('neon-border');
                }, 1000);
            }, index * 150);
        });
        console.log('Efecto neon aplicado a', allStatsCards.length, 'stats cards');
    }
    
    // ============================================
    // SECCIÓN 8: FUNCIÓN PARA UNIFICAR COMPORTAMIENTO HOVER
    // ============================================
    function unifyStatsCardsHover() {
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.removeEventListener('mouseenter', handleStatsCardHover);
            card.removeEventListener('mouseleave', handleStatsCardLeave);
            card.addEventListener('mouseenter', handleStatsCardHover);
            card.addEventListener('mouseleave', handleStatsCardLeave);
        });
        console.log('Hover unificado aplicado a', statsCards.length, 'stats cards');
    }
    
    function handleStatsCardHover(e) {
        const card = e.currentTarget;
        card.style.transition = 'all 0.3s ease-in-out';
        card.style.transform = 'scale(1.05)';
        card.style.borderColor = '#22d3ee';
        card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        card.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.3)';
        
        const numberElement = card.querySelector('.text-cyan-400');
        if (numberElement) {
            numberElement.style.textShadow = '0 0 10px rgba(34, 211, 238, 0.5)';
        }
        
        const suffixElement = card.querySelector('.counter-suffix');
        if (suffixElement) {
            suffixElement.style.color = '#22d3ee';
            suffixElement.style.textShadow = '0 0 10px rgba(34, 211, 238, 0.5)';
        }
    }
    
    function handleStatsCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.backgroundColor = '';
        card.style.boxShadow = '';
        
        const numberElement = card.querySelector('.text-cyan-400');
        if (numberElement) {
            numberElement.style.textShadow = '';
        }
        
        const suffixElement = card.querySelector('.counter-suffix');
        if (suffixElement) {
            suffixElement.style.color = '';
            suffixElement.style.textShadow = '';
        }
    }
    
    // ============================================
    // SECCIÓN 9: SISTEMA DE CONTADORES MEJORADO
    // ============================================
    class CounterManager {
        constructor() {
            this.counters = [];
            this.animationDuration = 2000;
            this.isRunning = false;
            this.animationId = null;
            this.countdownInterval = null;
            this.hasAnimated = new WeakMap();
        }
        
        init() {
            this.counters = [];
            const counterElements = document.querySelectorAll('.counter');
            
            counterElements.forEach(counterEl => {
                const target = parseInt(counterEl.dataset.target) || 0;
                const parentCard = counterEl.closest('.stats-card');
                
                this.counters.push({
                    element: counterEl,
                    target: target,
                    currentValue: 0,
                    parentCard: parentCard
                });
                
                if (parentCard) {
                    this.hasAnimated.set(parentCard, false);
                }
            });
            
            console.log('Contadores inicializados:', this.counters.length);
            return this.counters.length > 0;
        }
        
        triggerGlitchEffect() {
            if (typeof window.triggerCompetitivoGlitch === 'function') {
                window.triggerCompetitivoGlitch();
            } else {
                let competitivoWord = document.getElementById('competitivo-word');
                if (!competitivoWord) {
                    const possibleElements = document.querySelectorAll('.hero-title-line2');
                    for (let el of possibleElements) {
                        if (el.textContent.trim() === 'COMPETITIVO') {
                            competitivoWord = el;
                            break;
                        }
                    }
                }
                if (competitivoWord) {
                    competitivoWord.style.animation = 'none';
                    void competitivoWord.offsetWidth;
                    competitivoWord.style.animation = 'heroGlitch 0.3s ease-in-out';
                    setTimeout(() => {
                        if (competitivoWord) {
                            competitivoWord.style.animation = '';
                        }
                    }, 300);
                    console.log('Glitch activado directamente desde CounterManager');
                }
            }
        }
        
        async animateAll(force = false) {
            this.stop();
            
            if (this.counters.length === 0) {
                const hasCounters = this.init();
                if (!hasCounters) {
                    console.log('No hay contadores para animar');
                    return;
                }
            }
            
            if (!force) {
                const countersToAnimate = this.counters.filter(counter => {
                    if (counter.parentCard) {
                        return !this.hasAnimated.get(counter.parentCard);
                    }
                    return true;
                });
                
                if (countersToAnimate.length === 0) {
                    console.log('Todos los contadores ya fueron animados en este ciclo');
                    return;
                }
            }
            
            this.triggerGlitchEffect();
            
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
                            if (counter.parentCard) {
                                this.hasAnimated.set(counter.parentCard, true);
                            }
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
        
        resetCounterForCard(card) {
            this.hasAnimated.set(card, false);
            const countersInCard = this.counters.filter(counter => counter.parentCard === card);
            
            countersInCard.forEach(counter => {
                counter.currentValue = 0;
                counter.element.textContent = '0';
            });
            
            if (countersInCard.length > 0) {
                this.animateCounters(countersInCard);
            }
        }
        
        animateCounters(countersToAnimate) {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.animationDuration, 1);
                
                let allFinished = true;
                
                countersToAnimate.forEach(counter => {
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
                        if (counter.parentCard) {
                            this.hasAnimated.set(counter.parentCard, true);
                        }
                    }
                });
                
                if (!allFinished) {
                    this.animationId = requestAnimationFrame(animate);
                }
            };
            
            this.animationId = requestAnimationFrame(animate);
        }
        
        resetAllCounters() {
            this.counters.forEach(counter => {
                if (counter.parentCard) {
                    this.hasAnimated.set(counter.parentCard, false);
                }
                counter.currentValue = 0;
                counter.element.textContent = '0';
            });
            console.log('Todos los contadores reseteados para nueva animación');
        }
        
        stop() {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }
        
        startLoop(intervalTime = 30000) {
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            
            this.resetAllCounters();
            this.animateAll(true);
            
            this.countdownInterval = setInterval(() => {
                console.log('Ciclo de 30 segundos: reiniciando contadores');
                this.resetAllCounters();
                this.animateAll(true);
            }, intervalTime);
            
            console.log('Loop de contadores iniciado cada', intervalTime / 1000, 'segundos');
        }
        
        destroy() {
            this.stop();
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
        }
    }
    
    // ============================================
    // SECCIÓN 10: SCROLL REVEAL MEJORADO
    // ============================================
    function initEnhancedScrollReveal() {
        if (enhancedScrollObserver) {
            enhancedScrollObserver.disconnect();
        }
        
        const animatedElements = document.querySelectorAll(
            '.stats-card, .news-card, .tournament-card-enhanced, .staff-card-enhanced, ' +
            '.animate-from-left, .animate-from-right, .animate-from-bottom, ' +
            '.glow-text, h1 span, p'
        );
        
        console.log('Elementos a observar:', animatedElements.length);
        
        const observerOptions = {
            threshold: isTouchDevice ? 0.15 : 0.2,
            rootMargin: '0px 0px -30px 0px'
        };
        
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                
                if (entry.isIntersecting) {
                    if (!el.classList.contains('animate-from-left') && 
                        !el.classList.contains('animate-from-right') && 
                        !el.classList.contains('animate-from-bottom')) {
                        el.classList.remove('opacity-0', 'translate-y-[-30px]', 'translate-x-[-50px]', 
                                          'translate-x-[50px]', 'translate-y-[30px]');
                        el.classList.add('visible');
                    }
                    
                    if (el.classList.contains('stats-card')) {
                        el.classList.add('neon-border');
                        setTimeout(() => {
                            el.classList.remove('neon-border');
                        }, 1000);
                        
                        if (window.counterManager) {
                            window.counterManager.resetCounterForCard(el);
                        }
                    }
                    
                    if (el.classList.contains('staff-card-enhanced') && !el.classList.contains('revealed')) {
                        setTimeout(() => {
                            el.classList.add('revealed');
                            const flashElement = el.querySelector('.camera-flash');
                            if (flashElement) {
                                flashElement.classList.add('camera-flash');
                                setTimeout(() => {
                                    flashElement.classList.remove('camera-flash');
                                }, 500);
                            }
                        }, 100);
                    }
                    
                    if (el.classList.contains('news-card-enhanced') && !el.classList.contains('revealed')) {
                        const flashElement = el.querySelector('.camera-flash');
                        if (flashElement) {
                            setTimeout(() => {
                                flashElement.classList.add('camera-flash');
                                setTimeout(() => {
                                    flashElement.classList.remove('camera-flash');
                                }, 500);
                            }, 200);
                        }
                    }
                    
                    if (el.classList.contains('tournament-card-enhanced') && !el.classList.contains('revealed')) {
                        const flashElement = el.querySelector('.camera-flash');
                        if (flashElement) {
                            setTimeout(() => {
                                flashElement.classList.add('camera-flash');
                                setTimeout(() => {
                                    flashElement.classList.remove('camera-flash');
                                }, 500);
                            }, 200);
                        }
                    }
                    
                    if (el.classList.contains('animate-from-left') || 
                        el.classList.contains('animate-from-right') || 
                        el.classList.contains('animate-from-bottom')) {
                        
                        if (!el.classList.contains('visible')) {
                            el.style.animation = 'none';
                            el.offsetHeight;
                            
                            if (el.classList.contains('animate-from-left')) {
                                el.style.animation = 'slideFromLeft 0.6s ease-out forwards';
                            } else if (el.classList.contains('animate-from-right')) {
                                el.style.animation = 'slideFromRight 0.6s ease-out forwards';
                            } else if (el.classList.contains('animate-from-bottom')) {
                                el.style.animation = 'slideFromBottom 0.6s ease-out forwards';
                            }
                            
                            el.classList.add('visible');
                        }
                    }
                    
                } else {
                    if (!el.classList.contains('animate-from-left') && 
                        !el.classList.contains('animate-from-right') && 
                        !el.classList.contains('animate-from-bottom')) {
                        if (el.classList.contains('stats-card') ||
                            el.classList.contains('news-card') ||
                            el.classList.contains('tournament-card-enhanced') ||
                            el.classList.contains('staff-card-enhanced')) {
                            
                            el.style.animation = '';
                            el.classList.remove('visible');
                            el.classList.add('opacity-0', 'translate-y-[30px]');
                        }
                    }
                }
            });
        };
        
        enhancedScrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        
        setTimeout(() => {
            animatedElements.forEach(el => {
                if (el && document.body.contains(el)) {
                    enhancedScrollObserver.observe(el);
                }
            });
        }, 100);
        
        console.log('Scroll reveal mejorado inicializado con', animatedElements.length, 'elementos');
    }
    
    // ============================================
    // SECCIÓN 10.5: EFECTOS INTERACTIVOS DEL TÍTULO
    // ============================================
    function initTitleEffects() {
        const titleLeft = document.querySelector('.title-word-left');
        const titleRight = document.querySelector('.title-word-right');
        const subtitle = document.querySelector('.subtitle-text');
        const titleLine = document.querySelector('.title-line');
        
        setTimeout(() => {
            if (titleLeft) {
                titleLeft.classList.add('opacity-100', 'translate-x-0');
                titleLeft.classList.remove('opacity-0', 'translate-x-[-30px]');
            }
            if (titleRight) {
                titleRight.classList.add('opacity-100', 'translate-x-0');
                titleRight.classList.remove('opacity-0', 'translate-x-[30px]');
            }
        }, 200);
        
        setTimeout(() => {
            if (subtitle) {
                subtitle.classList.add('opacity-100', 'translate-y-0');
                subtitle.classList.remove('opacity-0', 'translate-y-[20px]');
            }
        }, 600);
        
        setTimeout(() => {
            if (titleLine) {
                titleLine.classList.add('animated');
            }
        }, 900);
        
        function revealCardsOnScroll() {
            const revealCards = document.querySelectorAll('.scroll-reveal-card');
            
            revealCards.forEach((el, index) => {
                if (isElementInViewport(el, 120) && !el.classList.contains('revealed')) {
                    setTimeout(() => {
                        el.classList.add('revealed');
                        const flashElement = el.querySelector('.camera-flash');
                        if (flashElement) {
                            flashElement.classList.add('camera-flash');
                            setTimeout(() => {
                                flashElement.classList.remove('camera-flash');
                            }, 500);
                        }
                    }, index * 150);
                }
            });
        }
        
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(revealCardsOnScroll, 100);
        });
        
        setTimeout(revealCardsOnScroll, 500);
        window.addEventListener('load', function() {
            setTimeout(revealCardsOnScroll, 300);
        });
    }
    
    // ============================================
    // SECCIÓN 11: FUNCIÓN PRINCIPAL DE NAVEGACIÓN
    // ============================================
    async function navigateTo(page) {
        console.log('Navegando a:', page);
        
        clearAllIntervals();
        
        if (window.counterManager) {
            window.counterManager.destroy();
            window.counterManager = null;
        }
        
        if (window.currentPageCleanup) {
            window.currentPageCleanup();
            window.currentPageCleanup = null;
        }
        
        if (enhancedScrollObserver) {
            enhancedScrollObserver.disconnect();
            enhancedScrollObserver = null;
        }
        
        if (newsTitleObserver) {
            newsTitleObserver.disconnect();
            newsTitleObserver = null;
        }
        
        if (heroTitleObserver) {
            heroTitleObserver.disconnect();
            heroTitleObserver = null;
        }
        
        if (window.tournamentsTitleObserver) {
            window.tournamentsTitleObserver.disconnect();
            window.tournamentsTitleObserver = null;
        }
        
        if (window.tournamentsHeaderTitleObserver) {
            window.tournamentsHeaderTitleObserver.disconnect();
            window.tournamentsHeaderTitleObserver = null;
        }
        
        if (window.organigramaTitleObserver) {
            window.organigramaTitleObserver.disconnect();
            window.organigramaTitleObserver = null;
        }
        
        if (window.sectionTitleObservers) {
            window.sectionTitleObservers.forEach(observer => observer.disconnect());
            window.sectionTitleObservers = [];
        }
        
        if (window.organigramaCardObserver) {
            window.organigramaCardObserver.disconnect();
            window.organigramaCardObserver = null;
        }
        
        if (window.organigramaFlashObserver) {
            window.organigramaFlashObserver.disconnect();
            window.organigramaFlashObserver = null;
        }
        
        cleanupNewsCardsFlashObserver();
        
        content.style.opacity = '0';
        
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Página no encontrada');
            const html = await response.text();
            
            setTimeout(() => {
                content.innerHTML = html;
                content.style.opacity = '1';
                currentPage = page;
                
                assignNavLinkListeners();
                
                if (page === 'home') {
                    setTimeout(() => {
                        resetHomeElements();
                        initializePageScripts(page);
                        initEnhancedScrollReveal();
                        initTitleEffects();
                        initNewsTitleScrollReveal();
                        initHeroTitleScrollReveal();
                        unifyStatsCardsHover();
                        initParticleEffectOnNewsCards();
                        initDataBlastEffect();
                        initNewsCardsFlashOnScroll();
                        
                        setTimeout(() => {
                            const titleLeft = document.querySelector('.title-word-left-hero');
                            const titleRight = document.querySelector('.title-word-right-hero');
                            const subtitle = document.querySelector('.subtitle-hero');
                            const titleLine = document.querySelector('.title-line-hero');
                            
                            if (titleLeft) {
                                titleLeft.classList.add('revealed');
                                titleLeft.style.opacity = '1';
                                titleLeft.style.transform = 'translateX(0)';
                            }
                            
                            if (titleRight) {
                                setTimeout(() => {
                                    titleRight.classList.add('revealed');
                                    titleRight.style.opacity = '1';
                                    titleRight.style.transform = 'translateX(0)';
                                }, 150);
                            }
                            
                            if (subtitle) {
                                setTimeout(() => {
                                    subtitle.classList.add('revealed');
                                    subtitle.style.opacity = '1';
                                    subtitle.style.transform = 'translateY(0)';
                                }, 400);
                            }
                            
                            if (titleLine) {
                                setTimeout(() => {
                                    titleLine.classList.add('revealed');
                                    titleLine.style.transform = 'scaleX(1)';
                                }, 600);
                            }
                            
                            const buttons = document.querySelectorAll('.flex.flex-col.sm\\:flex-row a');
                            setTimeout(() => {
                                buttons.forEach((btn, index) => {
                                    setTimeout(() => {
                                        btn.classList.remove('opacity-0', 'translate-y-[30px]');
                                        btn.classList.add('visible');
                                        btn.style.opacity = '1';
                                        btn.style.transform = 'translateY(0)';
                                    }, index * 150);
                                });
                            }, 800);
                            
                            const statsCards = document.querySelectorAll('.stats-card');
                            statsCards.forEach((card, index) => {
                                setTimeout(() => {
                                    card.classList.remove('opacity-0', 'translate-y-[30px]');
                                    card.classList.add('visible');
                                    card.style.opacity = '1';
                                    card.style.transform = 'translateY(0)';
                                    card.classList.add('neon-border');
                                    setTimeout(() => {
                                        card.classList.remove('neon-border');
                                    }, 1000);
                                }, 800 + (index * 100));
                            });
                            
                            applyNeonEffectToStatsCards();
                            
                            if (!window.counterManager) {
                                window.counterManager = new CounterManager();
                            }
                            window.counterManager.init();
                            window.counterManager.resetAllCounters();
                            
                            if (!window.counterManager.countdownInterval) {
                                const loopInterval = isTouchDevice ? 45000 : 30000;
                                window.counterManager.startLoop(loopInterval);
                            }
                            
                            setTimeout(() => {
                                if (window.counterManager) {
                                    window.counterManager.animateAll(true);
                                }
                            }, 150);
                            
                        }, 100);
                    }, 100);
                } else if (page === 'organigrama') {
                    setTimeout(() => {
                        initializePageScripts(page);
                        initEnhancedScrollReveal();
                        initOrganigramaTitleScrollReveal();
                        initOrganigramaSectionTitlesScrollReveal();
                        initOrganigramaParticleEffect();
                        initOrganigramaCardsFlashOnScroll();
                    }, 100);
                } else {
                    initializePageScripts(page);
                    initEnhancedScrollReveal();
                }
                
                updateActiveNavLinks(page);
                window.location.hash = page;
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
            assignNavLinkListeners();
            initEnhancedScrollReveal();
            window.location.hash = 'home';
        }
    }
    
    // ============================================
    // SECCIÓN 12: INICIALIZADORES DE PÁGINAS
    // ============================================
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
        
        if (!window.counterManager) {
            window.counterManager = new CounterManager();
        }
        window.counterManager.init();
        
        const loopInterval = isTouchDevice ? 45000 : 30000;
        if (!window.counterManager.countdownInterval) {
            window.counterManager.startLoop(loopInterval);
        }
        
        setTimeout(() => {
            if (window.counterManager) {
                window.counterManager.animateAll(true);
            }
        }, 150);
        
        return () => {
            if (window.counterManager) {
                window.counterManager.stop();
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
        
        setTimeout(() => {
            startCountdown();
        }, 100);
        
        setTimeout(() => {
            initTournamentsHeaderTitleScrollReveal();
        }, 200);
        
        setTimeout(() => {
            initTournamentsTitleScrollReveal();
        }, 250);
        
        setTimeout(() => {
            initTournamentEffects();
            
            const tournamentRevealCards = document.querySelectorAll('.scroll-reveal-card');
            tournamentRevealCards.forEach((card, index) => {
                if (isElementInViewport(card, 120) && !card.classList.contains('revealed')) {
                    setTimeout(() => {
                        card.classList.add('revealed');
                        
                        const flashElement = card.querySelector('.camera-flash');
                        if (flashElement) {
                            flashElement.classList.add('camera-flash');
                            setTimeout(() => {
                                flashElement.classList.remove('camera-flash');
                            }, 500);
                        }
                    }, index * 150);
                }
            });
        }, 300);
    }
    
    function startCountdown() {
        const countdownElement = document.querySelector('.countdown');
        
        if (!countdownElement) {
            console.log('Elemento .countdown no encontrado');
            return;
        }
        
        const targetDate = new Date('2026-03-23T22:00:00-04:00');
        
        if (isNaN(targetDate.getTime())) {
            console.error('Fecha objetivo inválida');
            countdownElement.innerHTML = '<span class="text-red-400 font-bold">FECHA NO DISPONIBLE</span>';
            return;
        }
        
        if (window.countdownIntervalId) {
            clearInterval(window.countdownIntervalId);
            window.countdownIntervalId = null;
        }
        
        function updateCountdown() {
            if (!countdownElement || !countdownElement.parentNode) {
                if (window.countdownIntervalId) {
                    clearInterval(window.countdownIntervalId);
                    window.countdownIntervalId = null;
                }
                return;
            }
            
            const now = new Date();
            const difference = targetDate - now;
            
            if (difference <= 0) {
                countdownElement.innerHTML = '<span class="text-green-400 font-bold text-2xl md:text-3xl">¡TORNEO INICIADO!</span>';
                if (window.countdownIntervalId) {
                    clearInterval(window.countdownIntervalId);
                    window.countdownIntervalId = null;
                }
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
            
            if (countdownElement.parentNode) {
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
        }
        
        updateCountdown();
        
        window.countdownIntervalId = setInterval(updateCountdown, 1000);
        activeIntervals.push(window.countdownIntervalId);
        
        console.log('Countdown iniciado correctamente');
    }
    
    // ==================== ORGANIGRAMA (ACTUALIZADO) ====================
    function initOrganigramaPage() {
        console.log('Organigrama page initialized');
        
        initOrganigramaTitleScrollReveal();
        initOrganigramaSectionTitlesScrollReveal();
        
        const staffCards = document.querySelectorAll('.staff-card-enhanced');
        
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -30px 0px'
        };
        
        const revealCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('revealed')) {
                    const card = entry.target;
                    const index = Array.from(staffCards).indexOf(card);
                    
                    setTimeout(() => {
                        card.classList.add('revealed');
                        const flashElement = card.querySelector('.camera-flash');
                        if (flashElement) {
                            flashElement.classList.add('camera-flash');
                            setTimeout(() => {
                                flashElement.classList.remove('camera-flash');
                            }, 500);
                        }
                    }, index * 100);
                }
            });
        };
        
        if (window.organigramaCardObserver) {
            window.organigramaCardObserver.disconnect();
        }
        
        window.organigramaCardObserver = new IntersectionObserver(revealCallback, observerOptions);
        
        staffCards.forEach((card, index) => {
            card.classList.add('scroll-reveal-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            window.organigramaCardObserver.observe(card);
            
            if (isElementInViewport(card, 120)) {
                setTimeout(() => {
                    card.classList.add('revealed');
                    const flashElement = card.querySelector('.camera-flash');
                    if (flashElement) {
                        flashElement.classList.add('camera-flash');
                        setTimeout(() => {
                            flashElement.classList.remove('camera-flash');
                        }, 500);
                    }
                }, index * 100);
            }
            
            // Eventos hover
            card.addEventListener('mouseenter', () => {
                card.classList.add('shadow-2xl', 'shadow-cyan-500/20');
                card.style.transform = 'translateY(-5px) scale(1.02)';
                
                const icon = card.querySelector('.rounded-full');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.transition = 'all 0.3s ease';
                }
                
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1.1)';
                    image.style.transition = 'all 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('shadow-2xl', 'shadow-cyan-500/20');
                card.style.transform = 'translateY(0) scale(1)';
                
                const icon = card.querySelector('.rounded-full');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
                
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
        });
        
        // Efectos para role badges
        const roleBadges = document.querySelectorAll('.role-badge');
        roleBadges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.05)';
                badge.style.transition = 'all 0.2s ease';
            });
            
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
            });
        });
        
        console.log('Organigrama page initialized with', staffCards.length, 'staff cards');
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
                
                const flashElement = card.querySelector('.camera-flash');
                if (flashElement) {
                    setTimeout(() => {
                        flashElement.classList.add('camera-flash');
                        setTimeout(() => {
                            flashElement.classList.remove('camera-flash');
                        }, 500);
                    }, 200);
                }
            }, 100 * index);
        });
        
        initParticleEffectOnNewsCards();
        initDataBlastEffect();
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
    
    // ============================================
    // SECCIÓN 13: FUNCIÓN AUXILIAR
    // ============================================
    function isElementInViewport(el, offset = 100) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight - offset;
    }
    
    // ============================================
    // SECCIÓN 14: EXPONER FUNCIÓN GLOBAL
    // ============================================
    window.triggerCompetitivoGlitch = triggerCompetitivoGlitch;
    
    // ============================================
    // SECCIÓN 15: INICIALIZACIÓN
    // ============================================
    assignNavLinkListeners();
    
    window.addEventListener('hashchange', () => {
        const page = getPageFromHash();
        navigateTo(page);
    });
    
    const initialPage = getPageFromHash();
    navigateTo(initialPage);
});

// ============================================
// SECCIÓN 16: SPLASH SCREEN
// ============================================
function initSplashProgress() {
    const progressFill = document.getElementById('progressFill');
    const markers = {
        init: document.getElementById('markerInit'),
        load: document.getElementById('markerLoad'),
        ready: document.getElementById('markerReady')
    };
    const loadingStatus = document.getElementById('loadingStatus');
    
    if (progressFill) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    const width = progressFill.style.width;
                    
                    if (width) {
                        const percent = parseInt(width);
                        
                        if (percent < 30) {
                            if (markers.init) markers.init.classList.add('active');
                            if (markers.load) markers.load.classList.remove('active');
                            if (markers.ready) markers.ready.classList.remove('active');
                            if (loadingStatus) loadingStatus.textContent = 'INICIALIZANDO';
                        } else if (percent < 80) {
                            if (markers.init) markers.init.classList.remove('active');
                            if (markers.load) markers.load.classList.add('active');
                            if (markers.ready) markers.ready.classList.remove('active');
                            if (loadingStatus) loadingStatus.textContent = 'CARGANDO';
                        } else {
                            if (markers.init) markers.init.classList.remove('active');
                            if (markers.load) markers.load.classList.remove('active');
                            if (markers.ready) markers.ready.classList.add('active');
                            if (loadingStatus) loadingStatus.textContent = 'LISTO';
                        }
                    }
                }
            });
        });
        
        observer.observe(progressFill, { attributes: true });
    }
}

document.addEventListener('DOMContentLoaded', initSplashProgress);

// ============================================
// LIMPIEZA AL SALIR DE LA PÁGINA
// ============================================
window.addEventListener('beforeunload', () => {
    if (window.counterManager) {
        window.counterManager.destroy();
    }
    if (window.countdownIntervalId) {
        clearInterval(window.countdownIntervalId);
        window.countdownIntervalId = null;
    }
    if (window.organigramaCardObserver) {
        window.organigramaCardObserver.disconnect();
        window.organigramaCardObserver = null;
    }
    if (window.organigramaFlashObserver) {
        window.organigramaFlashObserver.disconnect();
        window.organigramaFlashObserver = null;
    }
    if (window.sectionTitleObservers) {
        window.sectionTitleObservers.forEach(observer => observer.disconnect());
        window.sectionTitleObservers = [];
    }
    if (heroTitleObserver) {
        heroTitleObserver.disconnect();
        heroTitleObserver = null;
    }
    cleanupNewsCardsFlashObserver();
});