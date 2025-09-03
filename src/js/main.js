// main.js
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const upponHillSection = document.querySelector('.uppon-hill-section');
    // Note: Uppon Hill logo is now part of the navbar, so we don't hide/show it with scroll
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;
    let scrollTimeout;
    const SCROLL_THRESHOLD = 100;
    let isScrolling = false;

    // Function to initialize logo sparks effect
    function initializeLogoSparks() {
        const logoContainer = document.querySelector('.logo-container');

        if (!logoContainer) return;

        // Create sparks container
        const sparksContainer = document.createElement('div');
        sparksContainer.className = 'sparks-container';

        // Create 8 spark elements
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            sparksContainer.appendChild(spark);
        }

        // Add sparks container to logo container
        logoContainer.appendChild(sparksContainer);

        // Optional: Add event listeners for additional control
        logoContainer.addEventListener('mouseenter', () => {
            sparksContainer.style.opacity = '1';
        });

        logoContainer.addEventListener('mouseleave', () => {
            sparksContainer.style.opacity = '0';
        });
    }

    // Function to initialize Uppon Hill logo animation
    function initializeUpponHillAnimation() {
        const fullLogo = document.querySelector('.uppon-hill-full-logo');
        const initialsLogo = document.querySelector('.uppon-hill-initials-logo');
        const upponHillLogo = document.querySelector('.uppon-hill-logo.navbar-logo');

        if (!initialsLogo || !upponHillLogo) return;

        // Set initial states - logo is now always visible in navbar
        initialsLogo.style.opacity = '1';

        // Simple hover effect for navbar logo
        if (upponHillLogo) {
            upponHillLogo.addEventListener('mouseenter', () => {
                upponHillLogo.style.transform = 'scale(1.05)';
            });

            upponHillLogo.addEventListener('mouseleave', () => {
                upponHillLogo.style.transform = 'scale(1)';
            });
        }
    }

    // Initialize sparks effect for logo
    initializeLogoSparks();

    // Initialize Uppon Hill logo animation
    initializeUpponHillAnimation();

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

    // Scroll behavior
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

    // Full-screen Image Modal functionality
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="modal-close" title="Close">&times;</span>
        <button class="modal-nav modal-prev" title="Previous Image">&lt;</button>
        <button class="modal-nav modal-next" title="Next Image">&gt;</button>
        <img src="" alt="Full-screen image">
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');

    let currentModalGallery = null;
    let currentModalIndex = 0;

    // Function to open modal
    function openModal(imageSrc, imageAlt, galleryImages, imageIndex) {
        modalImg.src = imageSrc;
        modalImg.alt = imageAlt || 'Full-screen image';
        currentModalGallery = galleryImages;
        currentModalIndex = imageIndex;

        // Show/hide navigation arrows based on gallery size
        if (galleryImages && galleryImages.length > 1) {
            modalPrev.style.display = 'flex';
            modalNext.style.display = 'flex';
        } else {
            modalPrev.style.display = 'none';
            modalNext.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to navigate to next image
    function showNextImage() {
        if (currentModalGallery && currentModalGallery.length > 1) {
            currentModalIndex = (currentModalIndex + 1) % currentModalGallery.length;
            const nextImg = currentModalGallery[currentModalIndex];
            modalImg.src = nextImg.src;
            modalImg.alt = nextImg.alt;
        }
    }

    // Function to navigate to previous image
    function showPrevImage() {
        if (currentModalGallery && currentModalGallery.length > 1) {
            currentModalIndex = (currentModalIndex - 1 + currentModalGallery.length) % currentModalGallery.length;
            const prevImg = currentModalGallery[currentModalIndex];
            modalImg.src = prevImg.src;
            modalImg.alt = prevImg.alt;
        }
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        modalImg.src = ''; // Clear image source for better performance
        currentModalGallery = null;
        currentModalIndex = 0;
    }

    // Handle gallery grid images
    const galleryGridImages = document.querySelectorAll('.gallery-grid > img');
    galleryGridImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal(img.src, img.alt, Array.from(galleryGridImages), index);
        });
    });

    // Handle mobile gallery images
    const mobileGalleryImages = document.querySelectorAll('.mobile-gallery img');
    mobileGalleryImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal(img.src, img.alt, Array.from(mobileGalleryImages), index);
        });
    });

    // Handle feature gallery images (each feature gallery is separate)
    document.querySelectorAll('.feature-gallery').forEach(gallery => {
        const featureImages = gallery.querySelectorAll('img');
        featureImages.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(img.src, img.alt, Array.from(featureImages), index);
            });
        });
    });

    // Modal event listeners
    modalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // FAQ Section Horizontal Scroll with Mouse Wheel
    const faqScrollWrapper = document.querySelector('.faq-carousel-scroll-wrapper');

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

    // Character Carousel (namespaced, safe)
    (function initCharacterCarousel() {
        const section = document.querySelector('#characters');
        if (!section) return;

        const track = section.querySelector('.character-carousel-track');
        const prevBtn = section.querySelector('.character-carousel-nav.prev');
        const nextBtn = section.querySelector('.character-carousel-nav.next');
        if (!track || !prevBtn || !nextBtn) return;

        const slides = Array.from(track.children);
        let index = 0;

        function render() {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        prevBtn.addEventListener('click', () => {
            index = (index - 1 + slides.length) % slides.length;
            render();
        });

        nextBtn.addEventListener('click', () => {
            index = (index + 1) % slides.length;
            render();
        });

        // Keyboard support limited to the section, and not while modal is open
        section.setAttribute('tabindex', '-1'); // so it can receive key events
        section.addEventListener('keydown', (e) => {
            const modalOpen = document.querySelector('.image-modal')?.classList.contains('active');
            if (modalOpen) return;
            if (e.key === 'ArrowLeft') { 
                e.preventDefault(); 
                prevBtn.click(); 
            }
            if (e.key === 'ArrowRight') { 
                e.preventDefault(); 
                nextBtn.click(); 
            }
        });

        // Basic touch swipe
        let startX = 0;
        track.addEventListener('touchstart', (e) => { 
            startX = e.touches[0].clientX; 
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) {
                dx < 0 ? nextBtn.click() : prevBtn.click();
            }
        }, { passive: true });

        render();
    })();

});