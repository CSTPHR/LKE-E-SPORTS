// ============================================
// MAIN.JS - SISTEMA DE NAVEGACIÓN DINÁMICA PARA LKE E-SPORTS
// VERSIÓN DEFINITIVA - CONTADORES INTERACTIVOS CON SCROLL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // SECCIÓN 1: MANEJO DEL SPLASH SCREEN
    // ============================================
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
        
        // Inicializar scroll reveal mejorado
        initEnhancedScrollReveal();
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

    // ============================================
    // SECCIÓN 2: ELEMENTOS DEL DOM Y ESTADO GLOBAL
    // ============================================
    const content = document.getElementById('content');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    
    // Estado de la página actual
    let currentPage = 'home';
    
    // Variable para almacenar intervalos
    let activeIntervals = [];
    
    // Variable para el observer de scroll reveal mejorado
    let enhancedScrollObserver = null;
    
    // Variable para el intervalo de contadores (30 segundos)
    let counterLoopInterval = null;
    
    // ============================================
    // SECCIÓN 3: FUNCIÓN PARA ASIGNAR EVENT LISTENERS A NAVIGATION
    // ============================================
    function assignNavLinkListeners() {
        // Seleccionar TODOS los elementos con clase nav-link (incluyendo los del home cargado dinámicamente)
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            // Remover event listeners previos para evitar duplicados
            link.removeEventListener('click', handleNavClick);
            // Agregar nuevo event listener
            link.addEventListener('click', handleNavClick);
        });
        
        console.log('Event listeners asignados a', navLinks.length, 'nav-links');
    }
    
    // Manejador de clic para navegación
    function handleNavClick(e) {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        
        // Cerrar menú móvil si está abierto
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
    
    // Cerrar menú móvil al hacer click fuera
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && 
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
    
    // Limpiar intervalos
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
    
    // Actualizar título de la página
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
    
    // Obtener página desde la URL
    function getPageFromPath() {
        const path = window.location.pathname;
        if (path === '/' || path === '') return 'home';
        const page = path.substring(1);
        const validPages = ['home', 'team', 'tournaments', 'organigrama', 'news', 'contact'];
        return validPages.includes(page) ? page : 'home';
    }
    
    // Actualizar clases de navegación activas
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
        
        // Resetear stats cards - TODAS reciben el mismo tratamiento
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => {
            card.classList.add('opacity-0', 'translate-y-[30px]');
        });
        
        // Resetear títulos de sección
        const sectionTitles = document.querySelectorAll('h2 span.animate-from-left, h2 span.animate-from-right, p.animate-from-bottom');
        sectionTitles.forEach(title => {
            title.classList.add('opacity-0');
            if (title.classList.contains('animate-from-left')) {
                title.classList.add('translate-x-[-50px]');
            }
            if (title.classList.contains('animate-from-right')) {
                title.classList.add('translate-x-[50px]');
            }
            if (title.classList.contains('animate-from-bottom')) {
                title.classList.add('translate-y-[30px]');
            }
        });
        
        // Resetear news cards
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            card.classList.add('opacity-0', 'translate-y-[30px]');
        });
        
        console.log('Elementos del home reseteados');
    }
    
    // ============================================
    // SECCIÓN 7: FUNCIÓN PARA APLICAR EFECTO NEON A STATS CARDS
    // ============================================
    function applyNeonEffectToStatsCards() {
        const allStatsCards = document.querySelectorAll('.stats-card');
        
        allStatsCards.forEach((card, index) => {
            // Aplicar efecto neon con un pequeño delay entre cada tarjeta
            setTimeout(() => {
                card.classList.add('neon-border');
                
                // Quitar el efecto después de 1 segundo
                setTimeout(() => {
                    card.classList.remove('neon-border');
                }, 1000);
            }, index * 150); // Delay de 150ms entre cada tarjeta para efecto cascada
        });
        
        console.log('Efecto neon aplicado a', allStatsCards.length, 'stats cards');
    }
    
    // ============================================
    // SECCIÓN 8: FUNCIÓN PARA UNIFICAR COMPORTAMIENTO HOVER
    // ============================================
    function unifyStatsCardsHover() {
        const statsCards = document.querySelectorAll('.stats-card');
        
        statsCards.forEach(card => {
            // Remover cualquier evento hover previo
            card.removeEventListener('mouseenter', handleStatsCardHover);
            card.removeEventListener('mouseleave', handleStatsCardLeave);
            
            // Añadir nuevos eventos hover unificados
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
        
        // Aplicar efecto al texto
        const numberElement = card.querySelector('.text-cyan-400');
        if (numberElement) {
            numberElement.style.textShadow = '0 0 10px rgba(34, 211, 238, 0.5)';
        }
        
        // Aplicar efecto al sufijo si existe
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
            this.hasAnimated = new WeakMap(); // Para rastrear qué contadores ya se animaron
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
                
                // Inicializar el WeakMap para este contador
                if (parentCard) {
                    this.hasAnimated.set(parentCard, false);
                }
            });
            
            console.log('Contadores inicializados:', this.counters.length);
        }
        
        async animateAll(force = false) {
            this.stop();
            
            // Si no es forzado, verificar qué contadores ya se animaron
            if (!force) {
                // Solo animar contadores que no se hayan animado aún
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
            
            // Resetear todos los contadores a 0
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
                            
                            // Marcar que este contador ya se animó
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
        
        // Función para reiniciar contadores específicos por tarjeta
        resetCounterForCard(card) {
            // Marcar que esta tarjeta necesita animación nuevamente
            this.hasAnimated.set(card, false);
            
            // Encontrar y animar solo los contadores de esta tarjeta
            const countersInCard = this.counters.filter(counter => counter.parentCard === card);
            
            countersInCard.forEach(counter => {
                counter.currentValue = 0;
                counter.element.textContent = '0';
            });
            
            // Animar solo estos contadores
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
                        
                        // Marcar que este contador ya se animó
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
        
        // Reiniciar todos los contadores para que puedan volver a animarse
        resetAllCounters() {
            this.counters.forEach(counter => {
                if (counter.parentCard) {
                    this.hasAnimated.set(counter.parentCard, false);
                }
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
            // Animar inmediatamente
            this.resetAllCounters();
            this.animateAll(true);
            
            // Configurar intervalo de 30 segundos
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
            }
            
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
    // SECCIÓN 10: SCROLL REVEAL MEJORADO CON CONTADORES
    // ============================================
    function initEnhancedScrollReveal() {
        // Desconectar observer anterior
        if (enhancedScrollObserver) {
            enhancedScrollObserver.disconnect();
        }
        
        // Seleccionar TODOS los elementos animables
        const animatedElements = document.querySelectorAll(
            '.stats-card, .news-card, ' +
            '.animate-from-left, .animate-from-right, .animate-from-bottom, ' +
            '.glow-text, h1 span, p, ' +
            'h2 span.animate-from-left, h2 span.animate-from-right'
        );
        
        console.log('Elementos a observar (scroll reveal mejorado):', animatedElements.length);
        
        // Configuración del observer - threshold más bajo para detectar entrada/salida
        const observerOptions = {
            threshold: 0.2, // Se activa cuando el 20% del elemento es visible
            rootMargin: '0px 0px -50px 0px' // Margen negativo para activarse un poco antes
        };
        
        // Callback del observer mejorado
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                
                if (entry.isIntersecting) {
                    // ===== ELEMENTO ENTRA EN EL VIEWPORT =====
                    console.log('Elemento visible:', el.className);
                    
                    // Remover clases que ocultan
                    el.classList.remove('opacity-0', 'translate-y-[-30px]', 'translate-x-[-50px]', 
                                      'translate-x-[50px]', 'translate-y-[30px]');
                    
                    // Añadir clase visible para activar animaciones CSS
                    el.classList.add('visible');
                    
                    // Aplicar animaciones específicas según el tipo
                    if (el.classList.contains('stats-card')) {
                        // Efecto neon para stats cards al hacer scroll
                        el.classList.add('neon-border');
                        setTimeout(() => {
                            el.classList.remove('neon-border');
                        }, 1000);
                        
                        // ===== REINICIAR CONTADOR DE ESTA TARJETA =====
                        if (window.counterManager) {
                            console.log('Reiniciando contador por scroll:', el);
                            window.counterManager.resetCounterForCard(el);
                        }
                    }
                    
                    // Forzar animación con estilo inline para los elementos de texto
                    if (el.classList.contains('animate-from-left') || 
                        el.classList.contains('animate-from-right') || 
                        el.classList.contains('animate-from-bottom')) {
                        
                        el.style.animation = 'none';
                        el.offsetHeight; // Forzar reflow
                        
                        if (el.classList.contains('animate-from-left')) {
                            el.style.animation = 'slideFromLeft 0.8s ease-out forwards';
                        } else if (el.classList.contains('animate-from-right')) {
                            el.style.animation = 'slideFromRight 0.8s ease-out forwards';
                        } else if (el.classList.contains('animate-from-bottom')) {
                            el.style.animation = 'slideFromBottom 0.8s ease-out forwards';
                        }
                    }
                    
                } else {
                    // ===== ELEMENTO SALE DEL VIEWPORT =====
                    // REINICIAR PARA QUE VUELVA A ANIMARSE CUANDO REAPAREZCA
                    if (el.classList.contains('animate-from-left') || 
                        el.classList.contains('animate-from-right') || 
                        el.classList.contains('animate-from-bottom') ||
                        el.classList.contains('stats-card') ||
                        el.classList.contains('news-card')) {
                        
                        // Quitar animaciones y clases
                        el.style.animation = '';
                        el.classList.remove('visible');
                        
                        // Restaurar clases de ocultamiento según el tipo
                        if (el.classList.contains('animate-from-left')) {
                            el.classList.add('opacity-0', 'translate-x-[-50px]');
                        }
                        if (el.classList.contains('animate-from-right')) {
                            el.classList.add('opacity-0', 'translate-x-[50px]');
                        }
                        if (el.classList.contains('animate-from-bottom')) {
                            el.classList.add('opacity-0', 'translate-y-[30px]');
                        }
                        if (el.classList.contains('stats-card') || el.classList.contains('news-card')) {
                            el.classList.add('opacity-0', 'translate-y-[30px]');
                        }
                        
                        console.log('Elemento reiniciado para nueva animación:', el.className);
                    }
                }
            });
        };
        
        // Crear nuevo observer mejorado
        enhancedScrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        
        // Observar cada elemento
        animatedElements.forEach(el => {
            if (el && document.body.contains(el)) {
                enhancedScrollObserver.observe(el);
            }
        });
        
        console.log('Scroll reveal mejorado inicializado con', animatedElements.length, 'elementos');
    }
    
    // ============================================
    // SECCIÓN 11: FUNCIÓN PRINCIPAL DE NAVEGACIÓN
    // ============================================
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
        
        // Desconectar observer mejorado
        if (enhancedScrollObserver) {
            enhancedScrollObserver.disconnect();
            enhancedScrollObserver = null;
        }
        
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
                
                // ===== REASIGNAR EVENT LISTENERS A LOS NUEVOS NAV-LINKS =====
                assignNavLinkListeners();
                
                // ===== TRATAMIENTO ESPECIAL PARA HOME =====
                if (page === 'home') {
                    setTimeout(() => {
                        resetHomeElements();
                        initializePageScripts(page);
                        
                        // Inicializar scroll reveal mejorado
                        initEnhancedScrollReveal();
                        
                        // UNIFICAR COMPORTAMIENTO HOVER DE STATS CARDS
                        unifyStatsCardsHover();
                        
                        // FORZAR EL EFECTO NEON EN TODAS LAS STATS CARDS
                        setTimeout(() => {
                            applyNeonEffectToStatsCards();
                            
                            if (window.counterManager) {
                                // Resetear todos los contadores y animar
                                window.counterManager.resetAllCounters();
                                window.counterManager.animateAll(true);
                            }
                        }, 300);
                        
                    }, 100);
                } else {
                    initializePageScripts(page);
                    // Inicializar scroll reveal mejorado para otras páginas
                    initEnhancedScrollReveal();
                }
                
                // Actualizar clases de navegación activas
                updateActiveNavLinks(page);
                
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
            // Reasignar event listeners incluso en página de error
            assignNavLinkListeners();
            // Inicializar scroll reveal incluso en página de error
            initEnhancedScrollReveal();
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
        
        // Inicializar contadores con el nuevo sistema mejorado
        const counterManager = new CounterManager();
        counterManager.init();
        counterManager.startLoop(30000); // Loop cada 30 segundos
        
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
    
    // ============================================
    // SECCIÓN 13: INICIALIZACIÓN Y EVENTOS GLOBALES
    // ============================================
    
    // Asignar event listeners a los nav-links iniciales
    assignNavLinkListeners();
    
    // Manejar botones atrás/adelante
    window.addEventListener('popstate', (event) => {
        const page = getPageFromPath();
        navigateTo(page);
    });
    
    // Cargar página inicial
    const initialPage = getPageFromPath();
    navigateTo(initialPage);
});

// ============================================
// SECCIÓN 14: SPLASH SCREEN - ACTUALIZACIÓN DE MARCADORES
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
        // Observar cambios en el ancho de la barra de progreso
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    const width = progressFill.style.width;
                    
                    // Actualizar marcadores según el progreso
                    if (width) {
                        const percent = parseInt(width);
                        
                        if (percent < 30) {
                            markers.init.classList.add('active');
                            markers.load.classList.remove('active');
                            markers.ready.classList.remove('active');
                            if (loadingStatus) loadingStatus.textContent = 'INICIALIZANDO SISTEMA';
                        } else if (percent < 80) {
                            markers.init.classList.remove('active');
                            markers.load.classList.add('active');
                            markers.ready.classList.remove('active');
                            if (loadingStatus) loadingStatus.textContent = 'CARGANDO RECURSOS';
                        } else {
                            markers.init.classList.remove('active');
                            markers.load.classList.remove('active');
                            markers.ready.classList.add('active');
                            if (loadingStatus) loadingStatus.textContent = 'PREPARANDO ARENA';
                        }
                    }
                }
            });
        });
        
        observer.observe(progressFill, { attributes: true });
    }
}

// Llamar a la función después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', initSplashProgress);

// ============================================
// LIMPIEZA AL SALIR DE LA PÁGINA
// ============================================
window.addEventListener('beforeunload', () => {
    if (window.counterManager) {
        window.counterManager.destroy();
    }
});