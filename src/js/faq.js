// faq.js - Handles FAQ carousel horizontal scrolling and accordion
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

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains('show');
            
            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('show');
            });
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
            });
            
            // Toggle current answer
            if (!isOpen) {
                answer.classList.add('show');
                question.classList.add('active');
            }
        });
    });
});
