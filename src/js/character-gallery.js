// character-gallery.js - Handles character gallery functionality
document.addEventListener('DOMContentLoaded', () => {
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
