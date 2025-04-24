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

        function updateSlide() {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
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
});