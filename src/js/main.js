// main.js
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const upponHillSection = document.querySelector('.uppon-hill-section');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;
    let scrollTimeout;
    const SCROLL_THRESHOLD = 100;
    let isScrolling = false;

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

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        isScrolling = true;
        
        clearTimeout(scrollTimeout);

        // Don't process if we're near the top
        if (currentScroll < 50) {
            navbar.classList.remove('nav-hidden');
            if (upponHillSection) {
                upponHillSection.classList.remove('uppon-hill-hidden');
            }
            lastScroll = currentScroll;
            return;
        }

        if (currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
            if (upponHillSection) {
                upponHillSection.classList.add('uppon-hill-hidden');
            }
            // Close mobile menu if open while scrolling
            if (navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
            if (upponHillSection) {
                upponHillSection.classList.remove('uppon-hill-hidden');
            }
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

    // Character Gallery functionality
    const characterPortraits = document.querySelectorAll('.character-portrait');
    const characterName = document.getElementById('character-name');
    const characterInfoContainer = document.querySelector('.character-info');

    // Character data
    const characterData = {
        armin: {
            name: 'Armin',
            description: [
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.',
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.'
            ],
            artwork: 'src/assets/images/armin-walking-colour.png'
        },
        char2: {
            name: 'Unknown',
            description: [
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.',
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.'
            ],
            artwork: 'src/assets/images/ensign-blueorange.png'
        },
        char3: {
            name: 'Unknown',
            description: [
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.',
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.'
            ],
            artwork: 'src/assets/images/ensign-blueteal.png'
        },
        char4: {
            name: 'Unknown',
            description: [
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.',
                'This is some text to signify that something will be written here which I don\'t currently have the text for. Eventually, I\'ll write something here and everyone will be able to read how informative it is.'
            ],
            artwork: 'src/assets/images/armin-walking-colour.png'
        }
    };

    // Function to update character display
    function updateCharacterDisplay(characterKey) {
        const character = characterData[characterKey];
        if (!character) return;

        // Get fresh reference to character artwork element
        const artworkElement = document.getElementById('character-artwork');
        
        // Add fade out effect
        if (artworkElement) {
            artworkElement.classList.add('fade-out');
        }

        setTimeout(() => {
            // Update character name
            if (characterName) {
                characterName.textContent = character.name;
            }

            // Update character descriptions
            if (characterInfoContainer) {
                // Clear existing descriptions
                characterInfoContainer.querySelectorAll('.character-description').forEach(p => p.remove());
                
                // Add new descriptions
                character.description.forEach(text => {
                    const p = document.createElement('p');
                    p.className = 'character-description';
                    p.textContent = text;
                    characterInfoContainer.appendChild(p);
                });
            }

            // Update character artwork
            if (artworkElement) {
                artworkElement.src = character.artwork;
                artworkElement.alt = `${character.name} Artwork`;
                artworkElement.classList.remove('fade-out');
                artworkElement.classList.add('fade-in');
            }

            // Remove fade-in class after animation
            setTimeout(() => {
                if (artworkElement) {
                    artworkElement.classList.remove('fade-in');
                }
            }, 400);
        }, 200);
    }

    // Add click event listeners to character portraits
    characterPortraits.forEach(portrait => {
        portrait.addEventListener('click', () => {
            // Remove active class from all portraits
            characterPortraits.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked portrait
            portrait.classList.add('active');
            
            // Get character key and update display
            const characterKey = portrait.getAttribute('data-character');
            updateCharacterDisplay(characterKey);
        });

        // Add keyboard support
        portrait.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                portrait.click();
            }
        });

        // Make portraits focusable for accessibility
        portrait.setAttribute('tabindex', '0');
        portrait.setAttribute('role', 'button');
        portrait.setAttribute('aria-label', `Select character`);
    });

    // Mobile Character Gallery functionality
    const mobileCharacterGallery = document.getElementById('character-gallery-mobile');
    const characterNextBtn = document.getElementById('character-next');
    const characterPrevBtn = document.getElementById('character-prev');
    const characterDiamondDots = document.querySelectorAll('.character-diamond-dot');
    
    if (mobileCharacterGallery) {
        const slides = mobileCharacterGallery.querySelectorAll('img');
        let currentCharacterSlide = 0;
        const totalCharacterSlides = slides.length;

        function updateCharacterSlide() {
            mobileCharacterGallery.style.transform = `translateX(-${currentCharacterSlide * 100}%)`;
            updateCharacterActiveDot();
            
            // Update character info based on current slide
            const currentSlide = slides[currentCharacterSlide];
            const characterKey = currentSlide.getAttribute('data-character');
            updateCharacterInfoOnly(characterKey);
        }
        
        function updateCharacterActiveDot() {
            characterDiamondDots.forEach((dot, index) => {
                if (index === currentCharacterSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Function to update only character info (for mobile gallery)
        function updateCharacterInfoOnly(characterKey) {
            const character = characterData[characterKey];
            if (!character) return;

            // Update character name
            if (characterName) {
                characterName.textContent = character.name;
            }

            // Update character descriptions
            if (characterInfoContainer) {
                // Clear existing descriptions
                characterInfoContainer.querySelectorAll('.character-description').forEach(p => p.remove());
                
                // Add new descriptions
                character.description.forEach(text => {
                    const p = document.createElement('p');
                    p.className = 'character-description';
                    p.textContent = text;
                    characterInfoContainer.appendChild(p);
                });
            }
        }

        // Next button
        if (characterNextBtn) {
            characterNextBtn.addEventListener('click', () => {
                currentCharacterSlide = (currentCharacterSlide + 1) % totalCharacterSlides;
                updateCharacterSlide();
            });
        }

        // Previous button
        if (characterPrevBtn) {
            characterPrevBtn.addEventListener('click', () => {
                currentCharacterSlide = (currentCharacterSlide - 1 + totalCharacterSlides) % totalCharacterSlides;
                updateCharacterSlide();
            });
        }

        // Diamond dot navigation
        characterDiamondDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentCharacterSlide = index;
                updateCharacterSlide();
            });
        });

        // Initialize mobile gallery
        updateCharacterSlide();
    }
});

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
    const upponHillSection = document.querySelector('.uppon-hill-section');
    const upponHillPlaceholder = document.querySelector('.uppon-hill-placeholder');
    
    if (!fullLogo || !initialsLogo || !upponHillSection) return;
    
    // Comment out animation code and directly show initials
    fullLogo.style.opacity = '0'; // Hide full logo
    fullLogo.style.display = 'none'; // Completely hide full logo
    initialsLogo.style.opacity = '1'; // Show initials
    
    // Show section without animation
    upponHillSection.classList.add('show-section');
    
    // Add shrink section to fit the initials
    upponHillSection.classList.add('shrink-section');
    
    // Shrink the placeholder if it exists
    if (upponHillPlaceholder) {
        upponHillPlaceholder.classList.add('shrink-placeholder');
    }
    
    // No timeout or animation sequence needed
}
}