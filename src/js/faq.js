// faq.js - Handles FAQ carousel horizontal scrolling
document.addEventListener('DOMContentLoaded', () => {
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
});
