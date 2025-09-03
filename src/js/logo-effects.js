// logo-effects.js - Handles logo sparks and animation effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sparks effect for logo
    initializeLogoSparks();
    
    // Initialize Uppon Hill logo animation
    initializeUpponHillAnimation();
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
