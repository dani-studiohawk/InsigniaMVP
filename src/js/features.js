// features.js - Handles feature gallery navigation with clockwise diamond pattern

class FeatureGallery {
    constructor(galleryElement) {
        this.gallery = galleryElement;
        this.container = this.gallery.querySelector('.feature-gallery-container');
        this.slides = this.gallery.querySelectorAll('img');
        this.totalSlides = this.slides.length;
        
        // Start with first image (index 0) for clockwise pattern: Top → Right → Left
        this.currentSlide = 0;
        this.clockwiseOrder = [0, 2, 1]; // Top(0) → Right(2) → Left(1) → Top(0)
        this.clockwiseIndex = 0; // Start at first position (index 0)
        
        this.dots = this.gallery.querySelectorAll('.diamond-dot');
        this.prevBtn = this.gallery.querySelector('.feature-gallery-nav.prev');
        this.nextBtn = this.gallery.querySelector('.feature-gallery-nav.next');
        
        this.init();
    }
    
    init() {
        console.log('🔧 FeatureGallery: Simple init - current slide:', this.currentSlide);
        this.setupEventListeners();
        // Don't set any transforms - let it start naturally at slide 0
        this.updateActiveDot();
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
        this.clockwiseIndex = this.clockwiseOrder.indexOf(index);
        this.updateSlide();
    }
    
    nextSlide() {
        // Move clockwise: Top(1) → Right(2) → Left(0) → Top(1)
        this.clockwiseIndex = (this.clockwiseIndex + 1) % this.clockwiseOrder.length;
        this.currentSlide = this.clockwiseOrder[this.clockwiseIndex];
        this.updateSlide();
        console.log('Next slide - clockwise index:', this.clockwiseIndex, 'slide:', this.currentSlide);
    }
    
    prevSlide() {
        // Move counter-clockwise: Top(1) → Left(0) → Right(2) → Top(1)
        this.clockwiseIndex = (this.clockwiseIndex - 1 + this.clockwiseOrder.length) % this.clockwiseOrder.length;
        this.currentSlide = this.clockwiseOrder[this.clockwiseIndex];
        this.updateSlide();
        console.log('Prev slide - clockwise index:', this.clockwiseIndex, 'slide:', this.currentSlide);
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
