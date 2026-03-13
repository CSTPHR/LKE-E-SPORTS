// main.js - Sistema de navegación dinámica para LKE E-SPORTS

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const content = document.getElementById('content');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Estado de la página actual
    let currentPage = 'home';
    
    // Toggle menú móvil
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // Cerrar menú móvil si está abierto
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            
            // Cambiar página
            navigateTo(page);
        });
    });
    
    // Función de navegación
    async function navigateTo(page) {
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
                
                // Actualizar URL sin recargar
                history.pushState({ page }, '', `#${page}`);
            }, 300);
            
        } catch (error) {
            console.error('Error cargando la página:', error);
            content.innerHTML = `
                <div class="container mx-auto px-4 py-20 text-center">
                    <h2 class="text-3xl font-bold text-red-500 mb-4">Error 404</h2>
                    <p class="text-gray-400 mb-8">La página que buscas no existe</p>
                    <a href="#" data-page="home" class="nav-link bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        Volver al inicio
                    </a>
                </div>
            `;
            content.style.opacity = '1';
        }
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
    }
    
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
    }
    
    function initTournamentsPage() {
        console.log('Tournaments page initialized');
        
        // Iniciar contador regresivo para el torneo principal
        startCountdown();
    }
    
    /**
     * Función para iniciar el contador regresivo del torneo Xylon League
     * Fecha objetivo: 23 de marzo 2026 - 22:00 (10:00 PM) hora Venezuela (UTC-4)
     */
    function startCountdown() {
        // Buscar el elemento del contador
        const countdownElement = document.querySelector('.countdown');
        
        // Si no existe el contador en la página actual, salir
        if (!countdownElement) return;
        
        // Establecer la fecha objetivo: 23 de marzo 2026, 22:00 hora Venezuela
        // Venezuela usa UTC-4 sin horario de verano
        const targetDate = new Date('2026-03-23T22:00:00-04:00');
        
        // Función para actualizar el contador
        function updateCountdown() {
            // Obtener la fecha y hora actual en tiempo real
            const now = new Date();
            
            // Calcular la diferencia en milisegundos
            const difference = targetDate - now;
            
            // Si la fecha ya pasó, mostrar mensaje
            if (difference <= 0) {
                countdownElement.textContent = '¡TORNEO INICIADO!';
                countdownElement.classList.add('text-green-400');
                clearInterval(intervalId);
                return;
            }
            
            // Calcular días, horas, minutos y segundos
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            // Formatear el texto del contador con 2 dígitos para cada valor
            const formattedDays = String(days).padStart(2, '0');
            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            
            // Actualizar el elemento del DOM
            countdownElement.textContent = `${formattedDays}d ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
            
            // Efecto visual de actualización (opcional)
            countdownElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                countdownElement.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Actualizar inmediatamente
        updateCountdown();
        
        // Actualizar cada segundo
        const intervalId = setInterval(updateCountdown, 1000);
        
        // Guardar el interval ID para limpiarlo si es necesario
        window.countdownInterval = intervalId;
    }
    
    function initOrganigramaPage() {
        console.log('Organigrama page initialized');
        
        // Efectos hover mejorados para las tarjetas
        const staffCards = document.querySelectorAll('.staff-card');
        staffCards.forEach(card => {
            // Efecto de entrada
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                card.classList.add('shadow-2xl', 'shadow-cyan-500/20');
                card.style.transform = 'scale(1.05) translateY(-5px)';
                
                // Efecto de brillo en el icono
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
        
        // Animación para los badges de roles
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
        
        // Animación para los números de nivel (solo en desktop)
        const levelIndicators = document.querySelectorAll('.absolute.w-12.h-12');
        levelIndicators.forEach(indicator => {
            indicator.addEventListener('mouseenter', () => {
                indicator.style.transform = 'scale(1.2)';
                indicator.style.transition = 'all 0.3s ease';
            });
            
            indicator.addEventListener('mouseleave', () => {
                indicator.style.transform = 'scale(1)';
            });
        });
        
        // Efecto de conexión visual entre niveles
        const sections = document.querySelectorAll('.organigrama-section');
        sections.forEach((section, index) => {
            section.addEventListener('mouseenter', () => {
                // Resaltar la línea de tiempo al pasar sobre una sección
                const timeline = document.querySelector('.absolute.left-1/2.w-1.h-full');
                if (timeline) {
                    timeline.style.background = 'linear-gradient(to bottom, #06b6d4, #a855f7)';
                    timeline.style.transition = 'all 0.3s ease';
                }
            });
        });
    }
    
    function initNewsPage() {
        console.log('News page initialized');
    }
    
    function initContactPage() {
        console.log('Contact page initialized');
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Mensaje enviado correctamente');
            });
        }
    }
    
    // Manejar botones atrás/adelante del navegador
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            navigateTo(event.state.page);
        } else {
            navigateTo('home');
        }
    });
    
    // Cargar página inicial basada en hash o home por defecto
    const initialPage = window.location.hash.replace('#', '') || 'home';
    navigateTo(initialPage);
});

// Limpiar intervalos cuando se cambia de página (opcional, pero recomendado)
window.addEventListener('beforeunload', () => {
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }
});