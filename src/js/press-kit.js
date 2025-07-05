// Press Kit Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.press-kit-nav-links a');
    const sections = document.querySelectorAll('.press-kit-section');
    
    let currentActiveSection = 'fact-sheet';
    
    // Function to update active link
    function updateActiveLink(sectionId) {
        if (currentActiveSection === sectionId) return; // Avoid unnecessary updates
        
        currentActiveSection = sectionId;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Track scroll direction and position for hysteresis
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';
    
    // Function to check which section should be active with hysteresis
    function checkSectionActivity() {
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;
        
        // Get the navigation area to use as our reference point
        const navContainer = document.querySelector('.press-kit-nav-links');
        if (!navContainer) return;
        
        const navRect = navContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Use different trigger points based on scroll direction for hysteresis
        let triggerPoint;
        if (scrollDirection === 'down') {
            // When scrolling down, trigger when header reaches the middle of nav
            triggerPoint = navRect.top + navRect.height / 2;
        } else {
            // When scrolling up, trigger later (when header is higher up)
            triggerPoint = navRect.top - 50; // 50px buffer above nav
        }
        
        let activeSection = null;
        let bestMatch = null;
        let bestDistance = Infinity;
        
        // Find the section whose header is closest to but above the trigger point
        sections.forEach(section => {
            const sectionHeader = section.querySelector('h2, h3, .section-title');
            if (!sectionHeader) return;
            
            const headerRect = sectionHeader.getBoundingClientRect();
            const headerTop = headerRect.top;
            const sectionId = section.getAttribute('id');
            
            // Check if this header is above the trigger point
            if (headerTop <= triggerPoint) {
                const distance = triggerPoint - headerTop;
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestMatch = sectionId;
                }
            }
        });
        
        // If we found a match, use it
        if (bestMatch) {
            activeSection = bestMatch;
        } else {
            // Default to first section if no headers have crossed yet
            activeSection = sections[0] ? sections[0].getAttribute('id') : 'fact-sheet';
        }
        
        updateActiveLink(activeSection);
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Get the navbar height dynamically
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                // Scroll to position the section nicely below the navbar
                const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, offsetTop), // Ensure we don't scroll to negative position
                    behavior: 'smooth'
                });
                
                // Immediately update the active link to provide instant feedback
                updateActiveLink(targetId);
            }
        });
    });
    
    // Listen for scroll events to check section activity
    window.addEventListener('scroll', throttle(checkSectionActivity, 50));
    
    // Initialize fact-sheet as active by default
    updateActiveLink('fact-sheet');
});
