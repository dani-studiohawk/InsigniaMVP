// character-gallery.js - Handles character gallery functionality
document.addEventListener('DOMContentLoaded', () => {
    // GIF Carousel functionality
    const gifCarousel = document.querySelector('.gif-carousel-container');
    const gifSlides = document.querySelectorAll('.gif-slide');
    const gifPrevBtn = document.querySelector('.gif-nav.prev');
    const gifNextBtn = document.querySelector('.gif-nav.next');
    const gifDots = document.querySelectorAll('.gif-diamond-dot');
    
    let currentGifSlide = 0;
    const totalGifSlides = gifSlides.length;
    
    function updateGifSlide() {
        // Update z-index for all slides
        gifSlides.forEach((slide, index) => {
            if (index === currentGifSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update dots
        gifDots.forEach((dot, index) => {
            if (index === currentGifSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update text descriptions
        const textSections = document.querySelectorAll('.gallery-text');
        if (textSections.length > 0) {
            textSections.forEach((text, index) => {
                if (index === currentGifSlide) {
                    text.classList.add('active');
                } else {
                    text.classList.remove('active');
                }
            });
        }
    }
    
    function nextGifSlide() {
        currentGifSlide = (currentGifSlide + 1) % totalGifSlides;
        updateGifSlide();
    }
    
    function prevGifSlide() {
        currentGifSlide = (currentGifSlide - 1 + totalGifSlides) % totalGifSlides;
        updateGifSlide();
    }
    
    // Event listeners for navigation buttons
    if (gifNextBtn) {
        gifNextBtn.addEventListener('click', nextGifSlide);
    }
    
    if (gifPrevBtn) {
        gifPrevBtn.addEventListener('click', prevGifSlide);
    }
    
    // Event listeners for dots
    gifDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentGifSlide = index;
            updateGifSlide();
        });
    });
    
    // Auto-play functionality (optional)
    let gifAutoPlay = setInterval(nextGifSlide, 4000);
    
    // Pause auto-play on hover
    const gifCarouselContainer = document.querySelector('.gif-carousel');
    if (gifCarouselContainer) {
        gifCarouselContainer.addEventListener('mouseenter', () => {
            clearInterval(gifAutoPlay);
        });
        
        gifCarouselContainer.addEventListener('mouseleave', () => {
            gifAutoPlay = setInterval(nextGifSlide, 4000);
        });
    }
    
    // Initialize first slide
    updateGifSlide();
});
