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
        // Aquí puedes agregar animaciones específicas para el home
    }
    
    function initTeamPage() {
        console.log('Team page initialized');
        // Animaciones para hover en cards de jugadores
        const playerCards = document.querySelectorAll('.player-card');
        playerCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('neon-border');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('neon-border');
            });
        });
    }
    
    function initTournamentsPage() {
        console.log('Tournaments page initialized');
        // Contador regresivo para torneos
        const countdowns = document.querySelectorAll('.countdown');
        countdowns.forEach(countdown => {
            // Lógica de countdown aquí
        });
    }
    
    function initNewsPage() {
        console.log('News page initialized');
        // Efecto de carga para noticias
    }
    
    function initContactPage() {
        console.log('Contact page initialized');
        // Validación de formulario
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
    
    // Efecto parallax en scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});