// gallery.js - Handles all gallery functionalities including modals
document.addEventListener('DOMContentLoaded', () => {
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

    // Add click event to all gallery images (grid, mobile gallery, and feature galleries)

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

    // Close modal when clicking close button
    modalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    // Navigate to previous image
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    // Navigate to next image
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
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

    // Prevent modal image from closing when clicked
    modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Prevent modal navigation buttons from closing modal when clicked
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});
