// features.js - Handles feature gallery navigation with simple linear pattern

class FeatureGallery {
    constructor(galleryElement) {
        this.gallery = galleryElement;
        this.container = this.gallery.querySelector('.feature-gallery-container');
        this.slides = this.gallery.querySelectorAll('img');
        this.totalSlides = this.slides.length;
        
        // Simple linear navigation starting at middle slide (index 1)
        this.currentSlide = 1;
        
        this.dots = this.gallery.querySelectorAll('.diamond-dot');
        this.prevBtn = this.gallery.querySelector('.feature-gallery-nav.prev');
        this.nextBtn = this.gallery.querySelector('.feature-gallery-nav.next');
        
        this.init();
    }
    
    init() {
        console.log('🔧 FeatureGallery: Simple init - current slide:', this.currentSlide);
        this.setupEventListeners();
        this.updateSlide(); // Set initial position to middle slide
        console.log('✅ FeatureGallery: Initialization complete');
    }
    
    setupEventListeners() {
        // Diamond dot clicks
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Arrow buttons
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }
    
    nextSlide() {
        // Simple linear next: 0 → 1 → 2 → 0
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
        console.log('Next slide:', this.currentSlide);
    }
    
    prevSlide() {
        // Simple linear previous: 0 → 2 → 1 → 0
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
        console.log('Prev slide:', this.currentSlide);
    }
    
    updateSlide() {
        // Update gallery position
        if (this.container) {
            this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        this.updateActiveDot();
    }
    
    updateActiveDot() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Initialize feature galleries when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Features.js: DOM loaded, initializing feature galleries...');
    const featureGalleries = document.querySelectorAll('.feature-gallery');
    console.log('🔧 Features.js: Found', featureGalleries.length, 'feature galleries');
    
    featureGalleries.forEach((gallery, index) => {
        console.log(`🔧 Features.js: Initializing feature gallery ${index + 1}`, gallery);
        try {
            new FeatureGallery(gallery);
            console.log(`✅ Features.js: Successfully initialized gallery ${index + 1}`);
        } catch (error) {
            console.error(`❌ Features.js: Error initializing gallery ${index + 1}:`, error);
        }
    });
    
    console.log(`🔧 Features.js: Finished initializing ${featureGalleries.length} feature galleries`);
});
