// main.js
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let scrollTimeout;
    const SCROLL_THRESHOLD = 100;
    let isScrolling = false;

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

    document.querySelectorAll('.gallery').forEach(gallery => {
        const container = gallery.querySelector('.gallery-container');
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

        gallery.querySelector('.next').addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide();
        });

        gallery.querySelector('.prev').addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlide();
        });
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