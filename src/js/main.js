// main.js
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;
    let scrollTimeout;
    const SCROLL_THRESHOLD = 100;
    let isScrolling = false;

    // Mobile menu toggle functionality
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking nav links
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        isScrolling = true;
        
        clearTimeout(scrollTimeout);

        // Don't process if we're near the top
        if (currentScroll < 50) {
            navbar.classList.remove('nav-hidden');
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
            // Close mobile menu if open while scrolling
            if (navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
        }

        lastScroll = currentScroll;

        // Reset scroll state after scrolling stops
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    });

    // Initialize feature card galleries (with diamond navigation)
    document.querySelectorAll('.feature-gallery').forEach(gallery => {
        const container = gallery.querySelector('.feature-gallery-container');
        const slides = gallery.querySelectorAll('img');
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        const existingNav = gallery.querySelector('.diamond-nav');
        let dots;
        
        if (existingNav) {
            // Use existing navigation
            dots = existingNav.querySelectorAll('.diamond-dot');
            
            // Add click events to existing dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    updateSlide();
                });
            });
        } else {
            // Create diamond navigation dots if they don't exist
            const diamondNav = document.createElement('div');
            diamondNav.className = 'diamond-nav';
            
            const diamondIndicator = document.createElement('div');
            diamondIndicator.className = 'diamond-indicator';
            
            // Create diamond dots based on number of slides
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = i === 1 ? 'diamond-dot center' : 'diamond-dot';
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                
                // Add click event to each dot
                dot.addEventListener('click', () => {
                    currentSlide = i;
                    updateSlide();
                });
                
                diamondIndicator.appendChild(dot);
            }
            
            diamondNav.appendChild(diamondIndicator);
            gallery.appendChild(diamondNav);
            
            // Get all diamond dots from newly created navigation
            dots = diamondNav.querySelectorAll('.diamond-dot');
        }
        
        // Set initial active dot
        updateActiveDot();

        function updateSlide() {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateActiveDot();
        }
        
        function updateActiveDot() {
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Check if navigation buttons exist before adding event listeners
        const nextBtn = gallery.querySelector('.next');
        const prevBtn = gallery.querySelector('.prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlide();
            });
        }
    });

    // Initialize mobile gallery (no diamond navigation, just arrow buttons)
    document.querySelectorAll('.mobile-gallery').forEach(gallery => {
        const container = gallery.querySelector('.mobile-gallery-container');
        const slides = gallery.querySelectorAll('img');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateSlide() {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Check if navigation buttons exist before adding event listeners
        const nextBtn = gallery.querySelector('.next');
        const prevBtn = gallery.querySelector('.prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlide();
            });
        }
    });

    // FAQ Section Horizontal Scroll with Mouse Wheel
    const faqScrollWrapper = document.querySelector('.faq-scroll-wrapper');
    
    if (faqScrollWrapper) {
        faqScrollWrapper.addEventListener('wheel', (event) => {
            // Prevent default vertical scrolling
            event.preventDefault();
            
            // Convert vertical scroll to horizontal scroll
            const scrollAmount = event.deltaY * 3;
            
            // Use smooth scrolling method for better performance
            faqScrollWrapper.scrollBy({
                left: scrollAmount,
                behavior: 'auto'
            });
        }, { passive: false });
    }
});