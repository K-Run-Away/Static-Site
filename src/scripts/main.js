// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to current navigation item
const currentPath = window.location.pathname;
document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});

// Testimonial scroll functionality
document.addEventListener('DOMContentLoaded', () => {
    const testimonialGrid = document.querySelector('.testimonial-grid');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');

    if (testimonialGrid && scrollLeftBtn && scrollRightBtn) {
        const scrollAmount = 400; // Width of one testimonial card

        scrollLeftBtn.addEventListener('click', () => {
            testimonialGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        scrollRightBtn.addEventListener('click', () => {
            testimonialGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
}); 