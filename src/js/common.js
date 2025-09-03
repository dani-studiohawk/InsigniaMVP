// common.js - Shared functionality for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Update hash
                history.pushState(null, null, this.getAttribute('href'));
                // Focus on heading
                const heading = target.querySelector('h1, h2, h3');
                if (heading) heading.focus();
            }
        });
    });

    // Back to top visibility
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
    }

    // Section view analytics (placeholder)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Track section view
                console.log('Section viewed:', entry.target.id);
                // Replace with analytics code, e.g., gtag('event', 'section_view', { section: entry.target.id });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
});
