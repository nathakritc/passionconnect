/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Logo click to scroll to top
    const logo = document.getElementById('logo');
    if(logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Parallax scroll effect
    const layers = document.querySelectorAll('.layer');
    if (!prefersReducedMotion) {
        const updateParallax = () => {
            layers.forEach(layer => {
                const offset = parseFloat(layer.dataset.offset);
                layer.style.transform = `translateY(${window.scrollY * offset}px)`;
            });
        }
        
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateParallax);
        });

        updateParallax();
    }

    // Scroll reveal animations
    const sections = document.querySelectorAll('.section');
    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        sections.forEach(section => {
            section.classList.add('visible');
        });
    }

    // CTA button scroll
    const ctaBtn = document.getElementById('cta-btn');
    if(ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            document.getElementById('role-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});