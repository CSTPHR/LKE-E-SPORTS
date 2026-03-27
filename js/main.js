// ============================================
// MAIN.JS - SISTEMA DE NAVEGACIÓN DINÁMICA PARA LKE E-SPORTS
// VERSIÓN DEFINITIVA - CON MEJORAS DE ACCESIBILIDAD, ERRORES Y OPTIMIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // SECCIÓN 1: MANEJO DEL SPLASH SCREEN
    // ============================================
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    
    let animationsExecuted = false;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    let particleAnimationId = null;
    
    // ============================================
    // SECCIÓN 1.1: SISTEMA DE TOAST NOTIFICATIONS
    // ============================================
    
    function showToast(message, type = 'error', duration = 5000) {
        // Eliminar toast existente si hay uno
        const existingToast = document.querySelector('.lke-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = `lke-toast fixed top-20 right-4 z-[10000] p-4 rounded-lg shadow-2xl backdrop-blur-lg transition-all duration-300 transform translate-x-full`;
        
        // Configurar estilos según tipo
        const colors = {
            error: 'bg-red-500/90 border-red-300',
            success: 'bg-green-500/90 border-green-300',
            warning: 'bg-yellow-500/90 border-yellow-300',
            info: 'bg-cyan-500/90 border-cyan-300'
        };
        
        const icons = {
            error: 'fa-exclamation-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        toast.classList.add(colors[type] || colors.error);
        toast.style.borderLeft = '4px solid white';
        
        toast.innerHTML = `
            <div class="flex items-center gap-3 min-w-[280px] max-w-[350px]">
                <i class="fas ${icons[type] || icons.error} text-white text-xl"></i>
                <div class="flex-1">
                    <p class="text-white text-sm font-semibold">${type === 'error' ? 'Error' : type === 'success' ? 'Éxito' : type === 'warning' ? 'Advertencia' : 'Información'}</p>
                    <p class="text-white text-xs opacity-90">${message}</p>
                </div>
                <button class="toast-close text-white hover:text-gray-200 transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Botón cerrar
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto-cerrar
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }
    
    // ============================================
    // FUNCIÓN PARA ACTIVAR GLITCH EN LA PALABRA COMPETITIVO
    // ============================================
    function triggerCompetitivoGlitch() {
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
        }
    }
    
    // ============================================
    // FUNCIÓN PARA ACTIVAR FLASH EN TARJETAS (UNIFICADA)
    // ============================================
    function triggerCardFlash(card) {
        const flashElement = card.querySelector('.camera-flash');
        if (flashElement && !card.hasAttribute('data-flash-played')) {
            flashElement.classList.remove('camera-flash');
            void flashElement.offsetWidth;
            flashElement.classList.add('camera-flash');
            setTimeout(() => {
                if (flashElement) {
                    flashElement.classList.remove('camera-flash');
                }
            }, 500);
            card.setAttribute('data-flash-played', 'true');
        }
    }
    
    // ============================================
    // FUNCIÓN PARA EFECTO DE PARTÍCULAS EN TARJETAS
    // ============================================
    function initParticleEffect(cardSelector) {
        const cards = document.querySelectorAll(cardSelector);
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });
    }
    
    // ============================================
    // FUNCIÓN PARA EFECTO DE LUZ DINÁMICA EN TARJETAS DE CREADORES
    // ============================================
    function initCreatorDynamicLight() {
        const creatorCards = document.querySelectorAll('.creator-aura-card');
        
        creatorCards.forEach(card => {
            const glowElement = card.querySelector('.creator-glow');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                if (glowElement) {
                    glowElement.style.setProperty('--mouse-x', `${x}%`);
                    glowElement.style.setProperty('--mouse-y', `${y}%`);
                }
                
                // Efecto de parallax en la imagen
                const img = card.querySelector('img');
                if (img) {
                    const moveX = (e.clientX - rect.left - rect.width / 2) / 30;
                    const moveY = (e.clientY - rect.top - rect.height / 2) / 30;
                    img.style.transform = `scale(1.1) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1) translate(0, 0)';
                }
                if (glowElement) {
                    glowElement.style.setProperty('--mouse-x', '50%');
                    glowElement.style.setProperty('--mouse-y', '50%');
                }
            });
            
            // Efecto de clic con onda
            card.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.className = 'creator-ripple';
                ripple.style.position = 'absolute';
                ripple.style.left = `${e.clientX - card.getBoundingClientRect().left}px`;
                ripple.style.top = `${e.clientY - card.getBoundingClientRect().top}px`;
                ripple.style.width = '0px';
                ripple.style.height = '0px';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(34, 211, 238, 0.5)';
                ripple.style.transform = 'translate(-50%, -50%)';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'rippleEffect 0.6s ease-out forwards';
                ripple.style.zIndex = '100';
                
                const cardInner = card.querySelector('.relative');
                if (cardInner) {
                    cardInner.style.position = 'relative';
                    cardInner.style.overflow = 'hidden';
                    cardInner.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                }
            });
        });
    }
    
    // ============================================
    // FUNCIÓN PARA HAPTIC FEEDBACK EN MÓVILES
    // ============================================
    function initCreatorHapticFeedback() {
        const creatorCards = document.querySelectorAll('.creator-aura-card');
        
        creatorCards.forEach(card => {
            card.addEventListener('click', () => {
                // Efecto visual de vibración sutil
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
                
                // Si es dispositivo móvil, se puede agregar vibración
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(50);
                }
            });
        });
    }
    
    // ============================================
    // EFECTO DE PARTÍCULAS OPTIMIZADO CON INTERSECTION OBSERVER
    // ============================================
    
    function initParticleBackground() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        // Detener animación anterior si existe
        if (particleAnimationId) {
            cancelAnimationFrame(particleAnimationId);
            particleAnimationId = null;
        }
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000, mouseY = -1000;
        let animationActive = true;
        let isVisible = true;
        let particleCount = 50;
        
        const section = document.getElementById('creadores-home-section');
        
        // ===== INTERSECTION OBSERVER PARA PAUSAR ANIMACIÓN =====
        if (section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                    
                    if (isVisible && animationActive) {
                        if (!particleAnimationId) {
                            drawParticles();
                        }
                    } else {
                        if (particleAnimationId) {
                            cancelAnimationFrame(particleAnimationId);
                            particleAnimationId = null;
                        }
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(section);
            
            if (!window.particleObservers) window.particleObservers = [];
            window.particleObservers.push(observer);
        }
        
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            
            if (window.innerWidth < 768) {
                particleCount = 20;
            } else if (window.innerWidth < 1024) {
                particleCount = 30;
            } else {
                particleCount = 40;
            }
            
            initParticles();
        }
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.15,
                    speedY: (Math.random() - 0.5) * 0.15,
                    alpha: Math.random() * 0.3 + 0.1,
                    color: `rgba(6, 182, 212, ${Math.random() * 0.3 + 0.1})`
                });
            }
        }
        
        function drawParticles() {
            if (!animationActive || !isVisible || !ctx) {
                if (particleAnimationId) {
                    cancelAnimationFrame(particleAnimationId);
                    particleAnimationId = null;
                }
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                if (mouseX > 0 && mouseY > 0 && isVisible) {
                    const dx = mouseX - particle.x;
                    const dy = mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        const angle = Math.atan2(dy, dx);
                        const force = (100 - distance) / 100 * 0.2;
                        particle.x -= Math.cos(angle) * force;
                        particle.y -= Math.sin(angle) * force;
                    }
                }
            });
            
            if (isVisible) {
                particleAnimationId = requestAnimationFrame(drawParticles);
            } else {
                particleAnimationId = null;
            }
        }
        
        if (section) {
            const handleMouseMove = (e) => {
                if (!isVisible) return;
                const rect = section.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
            };
            
            const handleMouseLeave = () => {
                mouseX = -1000;
                mouseY = -1000;
            };
            
            section.addEventListener('mousemove', handleMouseMove);
            section.addEventListener('mouseleave', handleMouseLeave);
            
            if (!window.particleEvents) window.particleEvents = [];
            window.particleEvents.push({ element: section, type: 'mousemove', handler: handleMouseMove });
            window.particleEvents.push({ element: section, type: 'mouseleave', handler: handleMouseLeave });
        }
        
        window.addEventListener('resize', () => {
            resizeCanvas();
        });
        
        resizeCanvas();
        animationActive = true;
        
        if (section && isElementInViewport(section, 0)) {
            drawParticles();
        }
    }
    
    function stopParticleBackground() {
        if (particleAnimationId) {
            cancelAnimationFrame(particleAnimationId);
            particleAnimationId = null;
        }
    }
    
    function cleanupParticleResources() {
        if (window.particleObservers) {
            window.particleObservers.forEach(observer => observer.disconnect());
            window.particleObservers = [];
        }
        
        if (window.particleEvents) {
            window.particleEvents.forEach(event => {
                event.element.removeEventListener(event.type, event.handler);
            });
            window.particleEvents = [];
        }
        
        stopParticleBackground();
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
            
            document.body.classList.add('animate-ready');
            
            setTimeout(() => {
                if (window.counterManager) {
                    window.counterManager.init();
                }
            }, 1200);
            
            initEnhancedScrollReveal();
            initTitleEffects();
            initAllTitleScrollReveal();
            initParticleEffectOnNewsCards();
            unifyStatsCardsHover();
            
            setTimeout(() => {
                initParticleBackground();
            }, 500);
            
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
    let titleObservers = [];
    
    // ============================================
    // SECCIÓN 3: FUNCIÓN PARA ASIGNAR EVENT LISTENERS A NAVIGATION
    // ============================================
    function assignNavLinkListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.removeEventListener('click', handleNavClick);
            link.addEventListener('click', handleNavClick);
        });
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
    
    function isElementInViewport(el, offset = 100) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight - offset;
    }
    
    // ============================================
    // SECCIÓN 6: FUNCIONES PARA TÍTULOS DE SECCIÓN (UNIFICADAS)
    // ============================================
    function initTitleScrollReveal(titleConfigs) {
        titleConfigs.forEach(config => {
            const sectionElement = document.getElementById(config.sectionId);
            if (!sectionElement) return;
            
            const leftElement = document.querySelector(config.leftClass);
            const rightElement = document.querySelector(config.rightClass);
            const subtitleElement = config.subtitleClass ? document.querySelector(config.subtitleClass) : null;
            const lineElement = document.querySelector(config.lineClass);
            
            if (!leftElement && !rightElement && !subtitleElement && !lineElement) return;
            
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
            if (subtitleElement) {
                subtitleElement.classList.remove('revealed');
                subtitleElement.style.opacity = '0';
                subtitleElement.style.transform = 'translateY(20px)';
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
                        if (subtitleElement && !subtitleElement.classList.contains('revealed')) {
                            subtitleElement.classList.add('revealed');
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
                        if (subtitleElement) {
                            subtitleElement.classList.remove('revealed');
                            subtitleElement.style.opacity = '0';
                            subtitleElement.style.transform = 'translateY(20px)';
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
            titleObservers.push(observer);
        });
    }
    
    function initAllTitleScrollReveal() {
        titleObservers.forEach(observer => observer.disconnect());
        titleObservers = [];
        
        const titleConfigs = [
            { sectionId: 'home-hero-section', leftClass: '.title-word-left-hero', rightClass: '.title-word-right-hero', subtitleClass: '.subtitle-hero', lineClass: '.title-line-hero' },
            { sectionId: 'creadores-home-section', leftClass: '.title-word-left-creadores-home', rightClass: '.title-word-right-creadores-home', subtitleClass: '.subtitle-creadores-home', lineClass: '.title-line-creadores-home' },
            { sectionId: 'news-section', leftClass: '.title-word-left-news', rightClass: '.title-word-right-news', subtitleClass: '.subtitle-news', lineClass: '.title-line-news' },
            { sectionId: 'team-header-section', leftClass: '.title-word-left-team', rightClass: '.title-word-right-team', subtitleClass: '.subtitle-team', lineClass: '.title-line-team' },
            { sectionId: 'main-team', leftClass: '.section-title-left-main-team', rightClass: '.section-title-right-main-team', subtitleClass: null, lineClass: '.section-title-line-main-team' },
            { sectionId: 'legacy', leftClass: '.section-title-left-legacy', rightClass: '.section-title-right-legacy', subtitleClass: null, lineClass: '.section-title-line-legacy' },
            { sectionId: 'nova', leftClass: '.section-title-left-nova', rightClass: '.section-title-right-nova', subtitleClass: null, lineClass: '.section-title-line-nova' },
            { sectionId: 'secret', leftClass: '.section-title-left-secret', rightClass: '.section-title-right-secret', subtitleClass: null, lineClass: '.section-title-line-secret' },
            { sectionId: 'tournaments-header-section', leftClass: '.title-word-left-tournaments-header', rightClass: '.title-word-right-tournaments-header', subtitleClass: '.subtitle-tournaments-header', lineClass: '.title-line-tournaments-header' },
            { sectionId: 'tournaments-past-section', leftClass: '.title-word-left-tournaments', rightClass: '.title-word-right-tournaments', subtitleClass: '.subtitle-tournaments', lineClass: '.title-line-tournaments' },
            { sectionId: 'organigrama-header-section', leftClass: '.title-word-left-organigrama', rightClass: '.title-word-right-organigrama', subtitleClass: '.subtitle-organigrama', lineClass: '.title-line-organigrama' },
            { sectionId: 'ceo-section', leftClass: '.section-title-left-ceo', rightClass: '.section-title-right-ceo', subtitleClass: null, lineClass: '.section-title-line-ceo' },
            { sectionId: 'asistentes-section', leftClass: '.section-title-left-asistentes', rightClass: '.section-title-right-asistentes', subtitleClass: null, lineClass: '.section-title-line-asistentes' },
            { sectionId: 'directoras-section', leftClass: '.section-title-left-directoras', rightClass: '.section-title-right-directoras', subtitleClass: null, lineClass: '.section-title-line-directoras' },
            { sectionId: 'coaches-section', leftClass: '.section-title-left-coaches', rightClass: '.section-title-right-coaches', subtitleClass: null, lineClass: '.section-title-line-coaches' },
            { sectionId: 'managers-section', leftClass: '.section-title-left-managers', rightClass: '.section-title-right-managers', subtitleClass: null, lineClass: '.section-title-line-managers' },
            { sectionId: 'audiovisual-section', leftClass: '.section-title-left-audiovisual', rightClass: '.section-title-right-audiovisual', subtitleClass: null, lineClass: '.section-title-line-audiovisual' },
            { sectionId: 'creadores-section', leftClass: '.section-title-left-creadores', rightClass: '.section-title-right-creadores', subtitleClass: null, lineClass: '.section-title-line-creadores' },
            { sectionId: 'news-header-section', leftClass: '.title-word-left-news-header', rightClass: '.title-word-right-news-header', subtitleClass: '.subtitle-news-header', lineClass: '.title-line-news-header' },
            { sectionId: 'contact-header-section', leftClass: '.title-word-left-contact', rightClass: '.title-word-right-contact', subtitleClass: '.subtitle-contact', lineClass: '.title-line-contact' }
        ];
        
        initTitleScrollReveal(titleConfigs);
    }
    
    // ============================================
    // SECCIÓN 7: EFECTOS MEJORADOS PARA NOTICIAS Y TARJETAS
    // ============================================
    function initParticleEffectOnNewsCards() {
        const cards = document.querySelectorAll('.news-card-enhanced, .player-card-enhanced, .contact-card, .tournament-card-enhanced, .staff-card-enhanced, .creator-card-mini, .creator-aura-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });
    }
    
    function initDataBlastEffect() {
        const newsLinks = document.querySelectorAll('.news-card-enhanced a, .tournament-card-enhanced a');
        newsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const arrowIcon = link.querySelector('.news-arrow-icon, .tournament-arrow-icon');
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
    }
    
    // ============================================
    // SECCIÓN 8: FUNCIÓN PARA UNIFICAR COMPORTAMIENTO HOVER STATS CARDS
    // ============================================
    function unifyStatsCardsHover() {
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.removeEventListener('mouseenter', handleStatsCardHover);
            card.removeEventListener('mouseleave', handleStatsCardLeave);
            card.addEventListener('mouseenter', handleStatsCardHover);
            card.addEventListener('mouseleave', handleStatsCardLeave);
        });
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
        }
        
        triggerGlitchEffect() {
            triggerCompetitivoGlitch();
        }
        
        async animateAll(force = false) {
            this.stop();
            
            if (this.counters.length === 0) {
                this.init();
                if (this.counters.length === 0) return;
            }
            
            if (!force) {
                const countersToAnimate = this.counters.filter(counter => {
                    if (counter.parentCard) {
                        return !this.hasAnimated.get(counter.parentCard);
                    }
                    return true;
                });
                
                if (countersToAnimate.length === 0) return;
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
                        resolve();
                    }
                };
                
                this.animationId = requestAnimationFrame(animate);
            });
        }
        
        animateCardCounters(card) {
            if (this.hasAnimated.get(card)) return;
            
            const countersToAnimate = this.counters.filter(counter => counter.parentCard === card);
            
            if (countersToAnimate.length > 0) {
                this.animateSpecificCounters(countersToAnimate);
                this.hasAnimated.set(card, true);
            }
        }
        
        animateSpecificCounters(countersToAnimate) {
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
                    }
                });
                
                if (!allFinished) {
                    this.animationId = requestAnimationFrame(animate);
                }
            };
            
            this.animationId = requestAnimationFrame(animate);
        }
        
        stop() {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }
        
        destroy() {
            this.stop();
        }
    }
    
    // ============================================
    // SECCIÓN 10: SCROLL REVEAL MEJORADO (UNIFICADO)
    // ============================================
    function initEnhancedScrollReveal() {
        if (enhancedScrollObserver) {
            enhancedScrollObserver.disconnect();
        }
        
        const animatedElements = document.querySelectorAll(
            '.stats-card, .news-card, .tournament-card-enhanced, .staff-card-enhanced, ' +
            '.player-card-enhanced, .news-card-enhanced, .contact-card, ' +
            '.animate-from-left, .animate-from-right, .animate-from-bottom, ' +
            '.glow-text, h1 span, p, .creator-card-mini, .creator-aura-card'
        );
        
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
                            window.counterManager.animateCardCounters(el);
                        }
                    }
                    
                    if (el.classList.contains('player-card-enhanced') && !el.hasAttribute('data-flash-played')) {
                        setTimeout(() => {
                            triggerCardFlash(el);
                            el.classList.add('revealed');
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 100);
                    }
                    
                    if (el.classList.contains('staff-card-enhanced') && !el.hasAttribute('data-flash-played')) {
                        setTimeout(() => {
                            triggerCardFlash(el);
                            el.classList.add('revealed');
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 100);
                    }
                    
                    if (el.classList.contains('creator-aura-card') && !el.hasAttribute('data-flash-played')) {
                        setTimeout(() => {
                            triggerCardFlash(el);
                            el.classList.add('revealed');
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0) rotateX(0)';
                        }, 100);
                    }
                    
                    if (el.classList.contains('news-card-enhanced') && !el.hasAttribute('data-flash-played')) {
                        setTimeout(() => {
                            triggerCardFlash(el);
                            el.classList.add('revealed');
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 200);
                    }
                    
                    if (el.classList.contains('contact-card') && !el.hasAttribute('data-flash-played')) {
                        setTimeout(() => {
                            triggerCardFlash(el);
                            el.classList.add('revealed');
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 200);
                    }
                    
                    if (el.classList.contains('tournament-card-enhanced') && !el.hasAttribute('data-flash-played')) {
                        setTimeout(() => {
                            triggerCardFlash(el);
                            el.classList.add('revealed');
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 200);
                    }
                    
                    if (el.classList.contains('animate-from-left') || 
                        el.classList.contains('animate-from-right') || 
                        el.classList.contains('animate-from-bottom')) {
                        
                        if (!el.classList.contains('visible')) {
                            el.style.animation = 'none';
                            void el.offsetHeight;
                            
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
                            el.classList.contains('staff-card-enhanced') ||
                            el.classList.contains('player-card-enhanced') ||
                            el.classList.contains('news-card-enhanced') ||
                            el.classList.contains('contact-card') ||
                            el.classList.contains('creator-card-mini') ||
                            el.classList.contains('creator-aura-card')) {
                            
                            el.style.animation = '';
                            el.classList.remove('visible', 'revealed');
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
    }
    
    // ============================================
    // SECCIÓN 11: EFECTOS INTERACTIVOS DEL TÍTULO
    // ============================================
    function initTitleEffects() {
        function revealCardsOnScroll() {
            const revealCards = document.querySelectorAll('.scroll-reveal-card, .player-card-enhanced, .staff-card-enhanced, .news-card-enhanced, .contact-card, .tournament-card-enhanced, .creator-card-mini, .creator-aura-card');
            
            revealCards.forEach((el, index) => {
                if (isElementInViewport(el, 120) && !el.classList.contains('revealed') && !el.hasAttribute('data-flash-played')) {
                    setTimeout(() => {
                        triggerCardFlash(el);
                        el.classList.add('revealed');
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
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
    // SECCIÓN 12: FUNCIÓN PARA RESETEAR ELEMENTOS DEL HOME
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
        
        const creatorsTitleLeft = document.querySelector('.title-word-left-creadores-home');
        const creatorsTitleRight = document.querySelector('.title-word-right-creadores-home');
        const creatorsSubtitle = document.querySelector('.subtitle-creadores-home');
        const creatorsTitleLine = document.querySelector('.title-line-creadores-home');
        
        if (creatorsTitleLeft) {
            creatorsTitleLeft.classList.remove('revealed');
            creatorsTitleLeft.style.opacity = '0';
            creatorsTitleLeft.style.transform = 'translateX(-30px)';
        }
        if (creatorsTitleRight) {
            creatorsTitleRight.classList.remove('revealed');
            creatorsTitleRight.style.opacity = '0';
            creatorsTitleRight.style.transform = 'translateX(30px)';
        }
        if (creatorsSubtitle) {
            creatorsSubtitle.classList.remove('revealed');
            creatorsSubtitle.style.opacity = '0';
            creatorsSubtitle.style.transform = 'translateY(20px)';
        }
        if (creatorsTitleLine) {
            creatorsTitleLine.classList.remove('revealed');
            creatorsTitleLine.style.transform = 'scaleX(0)';
        }
        
        const buttons = document.querySelectorAll('.flex.flex-col.sm\\:flex-row a');
        buttons.forEach(btn => {
            btn.classList.remove('visible');
            btn.classList.add('opacity-0', 'translate-y-[30px]');
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(30px)';
        });
        
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.classList.remove('visible');
            card.classList.add('opacity-0', 'translate-y-[30px]');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });
        
        const creatorCards = document.querySelectorAll('.creator-aura-card');
        creatorCards.forEach(card => {
            card.classList.remove('visible', 'revealed');
            card.classList.add('opacity-0', 'translate-y-[30px]');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });
        
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.textContent = '0';
        });
        
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            card.classList.add('opacity-0', 'translate-y-[30px]');
        });
        
        const newsTitleLeft = document.querySelector('.title-word-left-news');
        const newsTitleRight = document.querySelector('.title-word-right-news');
        const newsSubtitle = document.querySelector('.subtitle-news');
        const newsTitleLine = document.querySelector('.title-line-news');
        
        if (newsTitleLeft) {
            newsTitleLeft.classList.remove('revealed');
            newsTitleLeft.style.opacity = '0';
            newsTitleLeft.style.transform = 'translateX(-30px)';
        }
        if (newsTitleRight) {
            newsTitleRight.classList.remove('revealed');
            newsTitleRight.style.opacity = '0';
            newsTitleRight.style.transform = 'translateX(30px)';
        }
        if (newsSubtitle) {
            newsSubtitle.classList.remove('revealed');
            newsSubtitle.style.opacity = '0';
            newsSubtitle.style.transform = 'translateY(20px)';
        }
        if (newsTitleLine) {
            newsTitleLine.classList.remove('revealed');
            newsTitleLine.style.transform = 'scaleX(0)';
        }
        
        stopParticleBackground();
    }
    
    // ============================================
    // SECCIÓN 13: INICIALIZADORES DE PÁGINAS
    // ============================================
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
    
    // ==================== HOME ====================
    function initHomePage() {
        if (!window.counterManager) {
            window.counterManager = new CounterManager();
        }
        window.counterManager.init();
        
        setTimeout(() => {
            if (window.counterManager) {
                window.counterManager.animateAll(true);
            }
        }, 150);
        
        initScrollTopButton();
        
        setTimeout(() => {
            if (document.getElementById('particle-canvas')) {
                initParticleBackground();
            }
        }, 500);
        
        const creatorCards = document.querySelectorAll('.creator-aura-card');
        creatorCards.forEach((card, index) => {
            card.classList.add('scroll-reveal-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) rotateX(-10deg)';
            card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            
            if (isElementInViewport(card, 120)) {
                setTimeout(() => {
                    triggerCardFlash(card);
                    card.classList.add('revealed');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) rotateX(0)';
                }, index * 100);
            }
        });
        
        initCreatorDynamicLight();
        initCreatorHapticFeedback();
        
        creatorCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const imgContainer = card.querySelector('.avatar-container');
                if (imgContainer) {
                    imgContainer.style.transform = 'scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const imgContainer = card.querySelector('.avatar-container');
                if (imgContainer) {
                    imgContainer.style.transform = 'scale(1)';
                }
                
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1) translate(0, 0)';
                }
            });
        });
    }
    
    // ==================== FUNCIÓN DEL BOTÓN SCROLL TOP ====================
    function initScrollTopButton() {
        let scrollTopBtn = document.getElementById('scrollTopBtn');
        
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.id = 'scrollTopBtn';
            scrollTopBtn.className = 'fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 invisible z-50';
            scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up text-base sm:text-xl"></i>';
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
    
    // ==================== TEAM ====================
    function initTeamPage() {
        initParticleEffectOnNewsCards();
        
        const playerCards = document.querySelectorAll('.player-card-enhanced');
        
        playerCards.forEach((card, index) => {
            card.classList.add('scroll-reveal-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            if (isElementInViewport(card, 120)) {
                setTimeout(() => {
                    triggerCardFlash(card);
                    card.classList.add('revealed');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
            
            card.addEventListener('mouseenter', () => {
                const image = card.querySelector('.rounded-full');
                if (image) {
                    image.style.transform = 'scale(1.1)';
                    image.style.transition = 'all 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const image = card.querySelector('.rounded-full');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
        });
        
        initScrollTopButton();
        initTeamQuickLinks();
        handleTeamHash();
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
        setTimeout(() => {
            startCountdown();
        }, 100);
        
        setTimeout(() => {
            initTournamentEffects();
        }, 300);
    }
    
    function startCountdown() {
        const countdownElement = document.querySelector('.countdown');
        if (!countdownElement) return;
        
        const targetDate = new Date('2026-03-23T22:00:00-04:00');
        
        if (isNaN(targetDate.getTime())) {
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
    }
    
    function initTournamentEffects() {
        const tournamentCards = document.querySelectorAll('.tournament-card-enhanced');
        tournamentCards.forEach((card, index) => {
            setTimeout(() => {
                triggerCardFlash(card);
                card.classList.add('revealed');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        initParticleEffectOnNewsCards();
        initDataBlastEffect();
    }
    
    // ==================== ORGANIGRAMA ====================
    function initOrganigramaPage() {
        const staffCards = document.querySelectorAll('.staff-card-enhanced');
        
        staffCards.forEach((card, index) => {
            card.classList.add('scroll-reveal-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            if (isElementInViewport(card, 120)) {
                setTimeout(() => {
                    triggerCardFlash(card);
                    card.classList.add('revealed');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
            
            card.addEventListener('mouseenter', () => {
                card.classList.add('shadow-2xl', 'shadow-cyan-500/20');
                card.style.transform = 'translateY(-5px) scale(1.02)';
                
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1.1)';
                    image.style.transition = 'all 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('shadow-2xl', 'shadow-cyan-500/20');
                card.style.transform = 'translateY(0) scale(1)';
                
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
        });
        
        initParticleEffectOnNewsCards();
    }
    
    // ==================== NOTICIAS ====================
    function initNewsPage() {
        const newsCards = document.querySelectorAll('.news-card-enhanced');
        
        newsCards.forEach((card, index) => {
            card.classList.add('scroll-reveal-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                triggerCardFlash(card);
                card.classList.add('revealed');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
        
        initParticleEffectOnNewsCards();
        initDataBlastEffect();
        
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => {
                    b.classList.remove('bg-cyan-500', 'text-white');
                    b.classList.add('bg-white/5', 'text-gray-300');
                });
                this.classList.remove('bg-white/5', 'text-gray-300');
                this.classList.add('bg-cyan-500', 'text-white');
            });
        });
    }
    
    // ==================== CONTACTO ====================
    function initContactPage() {
        const contactCards = document.querySelectorAll('.contact-card');
        
        contactCards.forEach((card, index) => {
            card.classList.add('scroll-reveal-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                triggerCardFlash(card);
                card.classList.add('revealed');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
        
        initParticleEffectOnNewsCards();
        
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Enviando...';
                btn.disabled = true;
                
                setTimeout(() => {
                    showToast('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success', 4000);
                    form.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 1500);
            });
        }
        
        const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
            });
            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
            });
        });
    }
    
    // ============================================
    // SECCIÓN 14: FUNCIÓN PARA VERIFICAR SI EXISTE PÁGINA
    // ============================================
    async function checkPageExists(pageName) {
        try {
            const response = await fetch(`pages/${pageName}.html`, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    // ============================================
    // SECCIÓN 15: FUNCIÓN PRINCIPAL DE NAVEGACIÓN MEJORADA
    // ============================================
    async function navigateTo(page) {
        // Limpiar recursos anteriores
        clearAllIntervals();
        
        if (window.counterManager) {
            window.counterManager.destroy();
            window.counterManager = null;
        }
        
        if (enhancedScrollObserver) {
            enhancedScrollObserver.disconnect();
            enhancedScrollObserver = null;
        }
        
        if (window.countdownIntervalId) {
            clearInterval(window.countdownIntervalId);
            window.countdownIntervalId = null;
        }
        
        cleanupParticleResources();
        stopParticleBackground();
        
        // Mostrar loader en el contenido
        content.style.opacity = '0';
        content.innerHTML = `
            <div class="container mx-auto px-4 py-20 text-center">
                <div class="animate-pulse">
                    <i class="fas fa-spinner fa-spin text-5xl text-cyan-400 mb-4"></i>
                    <p class="text-gray-300 text-lg">Cargando ${page === 'home' ? 'inicio' : page}...</p>
                </div>
            </div>
        `;
        content.style.opacity = '1';
        
        try {
            const pageExists = await checkPageExists(page);
            
            if (!pageExists) {
                throw new Error(`La página "${page}" no existe`);
            }
            
            const response = await fetch(`pages/${page}.html`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const html = await response.text();
            
            if (!html || html.trim().length === 0) {
                throw new Error('El contenido de la página está vacío');
            }
            
            setTimeout(() => {
                content.innerHTML = html;
                content.style.opacity = '1';
                currentPage = page;
                
                assignNavLinkListeners();
                
                if (page === 'home') {
                    initializeHomePageAfterLoad();
                } else {
                    initializePageScripts(page);
                }
                
                initEnhancedScrollReveal();
                initAllTitleScrollReveal();
                initParticleEffectOnNewsCards();
                
                updateActiveNavLinks(page);
                window.location.hash = page;
                updatePageTitle(page);
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log(`✅ Página "${page}" cargada correctamente`);
                }
                
            }, 150);
            
        } catch (error) {
            console.error('Error cargando la página:', error);
            
            let errorMessage = 'No se pudo cargar la página solicitada.';
            
            if (error.message.includes('no existe')) {
                errorMessage = 'La página que buscas no está disponible.';
            } else if (error.message.includes('HTTP')) {
                errorMessage = 'Hubo un problema de conexión. Por favor, intenta nuevamente.';
            } else if (error.message.includes('vacío')) {
                errorMessage = 'El contenido de la página no está disponible temporalmente.';
            }
            
            showToast(errorMessage, 'error', 6000);
            
            content.innerHTML = `
                <div class="container mx-auto px-4 py-16 md:py-24 text-center">
                    <div class="max-w-2xl mx-auto">
                        <div class="text-8xl md:text-9xl font-black text-cyan-500/30 mb-4">404</div>
                        <i class="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-6"></i>
                        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">¡Página no encontrada!</h2>
                        <p class="text-gray-300 text-base md:text-lg mb-8">
                            Lo sentimos, la página que estás buscando no existe o ha sido movida.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#" data-page="home" class="nav-link bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2">
                                <i class="fas fa-home"></i>
                                Volver al inicio
                            </a>
                            <button onclick="window.location.reload()" class="border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2">
                                <i class="fas fa-sync-alt"></i>
                                Recargar página
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            content.style.opacity = '1';
            assignNavLinkListeners();
            
            if (page !== 'home') {
                window.location.hash = 'home';
            }
        }
    }
    
    // ============================================
    // FUNCIÓN AUXILIAR PARA INICIALIZAR HOME DESPUÉS DE CARGA
    // ============================================
    function initializeHomePageAfterLoad() {
        setTimeout(() => {
            resetHomeElements();
            initializePageScripts('home');
            
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
            
            if (!window.counterManager) {
                window.counterManager = new CounterManager();
            }
            window.counterManager.init();
            
            setTimeout(() => {
                if (window.counterManager) {
                    window.counterManager.animateAll(true);
                }
            }, 150);
            
            initCreatorDynamicLight();
            initCreatorHapticFeedback();
            
            setTimeout(() => {
                if (document.getElementById('particle-canvas')) {
                    initParticleBackground();
                }
            }, 500);
            
        }, 100);
    }
    
    // ============================================
    // SECCIÓN 16: EXPONER FUNCIÓN GLOBAL
    // ============================================
    window.triggerCompetitivoGlitch = triggerCompetitivoGlitch;
    
    // ============================================
    // SECCIÓN 17: INICIALIZACIÓN
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
// SECCIÓN 18: SPLASH SCREEN PROGRESS
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
    if (particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
    }
});