// gallery.js - Handles all gallery functionalities including modals

class Gallery {
    constructor(galleryElement, options = {}) {
        this.gallery = galleryElement;
        this.container = galleryElement.querySelector('.mobile-gallery-container');
        this.slides = galleryElement.querySelectorAll('img');
        this.totalSlides = this.slides.length;
        // Start with middle image (index 1) for clockwise pattern
        this.currentSlide = this.totalSlides === 3 ? 1 : Math.floor(this.totalSlides / 2);
        this.hasDiamondNav = options.hasDiamondNav !== false; // Default true
        this.autoCreate = options.autoCreate !== false; // Default true
        
        // Define clockwise order for 3-slide arrow formation: top(1) → right(2) → left(0) → top(1)
        this.clockwiseOrder = this.totalSlides === 3 ? [1, 2, 0] : null;
        this.clockwiseIndex = 0; // Start at first position in clockwise order
        
        if (!this.container || this.totalSlides === 0) {
            console.warn('Gallery initialization failed: missing container or slides');
            return;
        }
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupArrowButtons();
        // Don't call updateSlide() here since CSS already positions correctly
        // Just make sure the active dot is set correctly
        this.updateActiveDot();
        console.log('Gallery initialized with slide:', this.currentSlide, 'clockwise index:', this.clockwiseIndex);
    }
    
    setupNavigation() {
        if (!this.hasDiamondNav) return;
        
        const existingNav = this.gallery.querySelector('.diamond-nav');
        
        if (existingNav) {
            this.dots = existingNav.querySelectorAll('.diamond-dot');
        } else if (this.autoCreate) {
            this.createDiamondNavigation();
        }
        
        // Add click events to dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
        }
    }
    
    createDiamondNavigation() {
        // Remove any existing diamond navigation first
        const existingNav = this.gallery.querySelector('.diamond-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        const diamondNav = document.createElement('div');
        diamondNav.className = 'diamond-nav';
        
        // Calculate middle index for initial active state
        const middleIndex = Math.floor(this.totalSlides / 2);
        
        console.log('Total slides:', this.totalSlides, 'Middle index:', middleIndex);
        
        // Create arrow formation based on number of slides
        if (this.totalSlides === 3) {
            // Top row - 1 diamond (first image, index 0)
            const topRow = document.createElement('div');
            topRow.className = 'diamond-indicator top-row';
            const topDot = document.createElement('div');
            topDot.className = 'diamond-dot';
            if (0 === this.currentSlide) topDot.classList.add('active');  // Use currentSlide instead
            topDot.setAttribute('data-index', 0);
            topRow.appendChild(topDot);
            
            // Bottom row - 2 diamonds (second and third images, indices 1 and 2)
            const bottomRow = document.createElement('div');
            bottomRow.className = 'diamond-indicator bottom-row';
            
            for (let i = 1; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'diamond-dot';
                if (i === this.currentSlide) dot.classList.add('active');  // Use currentSlide instead
                dot.setAttribute('data-index', i);
                bottomRow.appendChild(dot);
            }
            
            diamondNav.appendChild(topRow);
            diamondNav.appendChild(bottomRow);
            
            console.log('Created arrow formation:', {
                topRow: topRow.children.length,
                bottomRow: bottomRow.children.length,
                totalSlides: this.totalSlides,
                currentSlide: this.currentSlide
            });
        } else {
            // Fallback to original horizontal layout for other numbers
            const diamondIndicator = document.createElement('div');
            diamondIndicator.className = 'diamond-indicator horizontal';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'diamond-dot';
                if (i === this.currentSlide) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                diamondIndicator.appendChild(dot);
            }
            
            diamondNav.appendChild(diamondIndicator);
            console.log('Created horizontal layout:', this.totalSlides, 'diamonds');
        }
        
        this.gallery.appendChild(diamondNav);
        this.dots = diamondNav.querySelectorAll('.diamond-dot');
        
        console.log('Final diamond nav structure:', diamondNav.innerHTML);
    }
    
    setupArrowButtons() {
        const nextBtn = this.gallery.querySelector('.next, .mobile-gallery-nav.next');
        const prevBtn = this.gallery.querySelector('.prev, .mobile-gallery-nav.prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        
        // Update clockwise index if using clockwise navigation
        if (this.clockwiseOrder && this.totalSlides === 3) {
            this.clockwiseIndex = this.clockwiseOrder.indexOf(index);
        }
        
        this.updateSlide();
    }
    
    nextSlide() {
        if (this.clockwiseOrder && this.totalSlides === 3) {
            // Use clockwise navigation for 3-slide arrow formation
            this.clockwiseIndex = (this.clockwiseIndex + 1) % this.clockwiseOrder.length;
            this.currentSlide = this.clockwiseOrder[this.clockwiseIndex];
            console.log('Next slide - clockwise index:', this.clockwiseIndex, 'slide:', this.currentSlide);
        } else {
            // Standard linear navigation for other cases
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        }
        this.updateSlide();
    }
    
    prevSlide() {
        if (this.clockwiseOrder && this.totalSlides === 3) {
            // Use counter-clockwise navigation for 3-slide arrow formation
            this.clockwiseIndex = (this.clockwiseIndex - 1 + this.clockwiseOrder.length) % this.clockwiseOrder.length;
            this.currentSlide = this.clockwiseOrder[this.clockwiseIndex];
        } else {
            // Standard linear navigation for other cases
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        }
        this.updateSlide();
    }
    
    updateSlide() {
        if (this.container) {
            this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        this.updateActiveDot();
    }
    
    updateActiveDot() {
        if (!this.dots) return;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Feature galleries are now handled by features.js
    // document.querySelectorAll('.feature-gallery').forEach(gallery => {
    //     new Gallery(gallery, { hasDiamondNav: true });
    // });
    
    // Initialize mobile galleries without diamond navigation
    document.querySelectorAll('.mobile-gallery').forEach(gallery => {
        new Gallery(gallery, { hasDiamondNav: false });
    });

    // Full-screen Image Modal functionality
    class ImageModal {
        constructor() {
            this.currentGallery = null;
            this.currentIndex = 0;
            this.createModal();
            this.bindEvents();
            this.attachToGalleryImages();
        }
        
        createModal() {
            this.modal = document.createElement('div');
            this.modal.className = 'image-modal';
            this.modal.innerHTML = `
                <span class="modal-close" title="Close">&times;</span>
                <button class="modal-nav modal-prev" title="Previous Image">&lt;</button>
                <button class="modal-nav modal-next" title="Next Image">&gt;</button>
                <img src="" alt="Full-screen image">
            `;
            document.body.appendChild(this.modal);
            
            this.modalImg = this.modal.querySelector('img');
            this.modalClose = this.modal.querySelector('.modal-close');
            this.modalPrev = this.modal.querySelector('.modal-prev');
            this.modalNext = this.modal.querySelector('.modal-next');
        }
        
        bindEvents() {
            // Close modal events
            this.modalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
            
            // Navigation events
            this.modalPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPrevious();
            });
            
            this.modalNext.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showNext();
            });
            
            // Close when clicking outside
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!this.modal.classList.contains('active')) return;
                
                switch(e.key) {
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowLeft':
                        this.showPrevious();
                        break;
                    case 'ArrowRight':
                        this.showNext();
                        break;
                }
            });
            
            // Prevent modal content from closing modal
            [this.modalImg, this.modalPrev, this.modalNext].forEach(element => {
                element.addEventListener('click', (e) => e.stopPropagation());
            });
        }
        
        attachToGalleryImages() {
            // Handle all gallery types
            const gallerySelectors = [
                '.gallery-grid > img',
                '.mobile-gallery img', 
                '.feature-gallery img'
            ];
            
            gallerySelectors.forEach(selector => {
                const galleries = this.getGalleriesForSelector(selector);
                
                galleries.forEach(galleryImages => {
                    galleryImages.forEach((img, index) => {
                        img.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.open(img.src, img.alt, galleryImages, index);
                        });
                    });
                });
            });
        }
        
        getGalleriesForSelector(selector) {
            if (selector === '.gallery-grid > img') {
                return [Array.from(document.querySelectorAll(selector))];
            } else if (selector === '.mobile-gallery img') {
                return Array.from(document.querySelectorAll('.mobile-gallery')).map(
                    gallery => Array.from(gallery.querySelectorAll('img'))
                );
            } else if (selector === '.feature-gallery img') {
                return Array.from(document.querySelectorAll('.feature-gallery')).map(
                    gallery => Array.from(gallery.querySelectorAll('img'))
                );
            }
            return [];
        }
        
        open(imageSrc, imageAlt, galleryImages, imageIndex) {
            this.modalImg.src = imageSrc;
            this.modalImg.alt = imageAlt || 'Full-screen image';
            this.currentGallery = galleryImages;
            this.currentIndex = imageIndex;
            
            // Show/hide navigation based on gallery size
            const hasMultipleImages = galleryImages && galleryImages.length > 1;
            this.modalPrev.style.display = hasMultipleImages ? 'flex' : 'none';
            this.modalNext.style.display = hasMultipleImages ? 'flex' : 'none';
            
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        showNext() {
            if (!this.currentGallery || this.currentGallery.length <= 1) return;
            
            this.currentIndex = (this.currentIndex + 1) % this.currentGallery.length;
            this.updateImage();
        }
        
        showPrevious() {
            if (!this.currentGallery || this.currentGallery.length <= 1) return;
            
            this.currentIndex = (this.currentIndex - 1 + this.currentGallery.length) % this.currentGallery.length;
            this.updateImage();
        }
        
        updateImage() {
            if (!this.currentGallery || !this.currentGallery[this.currentIndex]) return;
            
            const currentImg = this.currentGallery[this.currentIndex];
            this.modalImg.src = currentImg.src;
            this.modalImg.alt = currentImg.alt;
        }
        
        close() {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            this.modalImg.src = '';
            this.currentGallery = null;
            this.currentIndex = 0;
        }
    }
    
    // Initialize modal
    new ImageModal();
});
