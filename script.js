// ===== NAVIGATION & SMOOTH SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburger
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu si on clique en dehors
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Fermer le menu mobile au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link dans la navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = document.querySelectorAll('.nav-link');

    function highlightNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Appel initial pour mettre en évidence la section active au chargement

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== ANIMATIONS AU SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer les cartes de services
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        observer.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Observer les cartes d'agences
    const agenceCards = document.querySelectorAll('.agence-card');
    agenceCards.forEach((card, index) => {
        observer.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Observer les avantages
    const avantageItems = document.querySelectorAll('.avantage-item');
    avantageItems.forEach((item, index) => {
        observer.observe(item);
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // ===== CARROUSEL D'AVIS HORIZONTAL =====
    // Le carrousel utilise maintenant scroll-snap natif CSS, pas besoin de JavaScript
    // Animation au scroll pour les cartes d'avis
    const avisCards = document.querySelectorAll('.avis-card');
    avisCards.forEach((card, index) => {
        observer.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ===== MODULE ÉTOILES INTERACTIF =====
    const stars = document.querySelectorAll(".star");
    const sendButton = document.getElementById("send-rating");
    let selectedRating = 0;
    let hoveredRating = 0;

    // Liens de redirection
    const lienFormulaireMauvaiseNote = "https://docs.google.com/forms/d/e/1FAIpQLSc7MLSAuvdlXIsboLUaIHPkt4OJ6r7wlDVoUcYp6HTWdlrb8A/viewform?usp=header";
    const lienGoogleReview = "https://www.google.fr/maps/search/serrurier+paris+gravocl%C3%A9s/@48.8542406,2.3851334,18z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D";

    if (stars.length > 0 && sendButton) {
        function updateStars(value) {
            stars.forEach(star => {
                const v = parseInt(star.dataset.value);
                star.classList.toggle("active", v <= value);
            });
            sendButton.disabled = value === 0;
        }

        stars.forEach(star => {
            star.addEventListener("click", () => {
                const value = parseInt(star.dataset.value);
                selectedRating = value;
                hoveredRating = value;
                updateStars(value);
            });

            star.addEventListener("mouseenter", () => {
                const value = parseInt(star.dataset.value);
                hoveredRating = value;
                if (!selectedRating) {
                    updateStars(value);
                } else {
                    // Si une note est déjà sélectionnée, on montre quand même le survol
                    updateStars(value);
                }
            });
        });

        // Réinitialiser au survol si aucune note n'est sélectionnée
        const starsContainer = document.querySelector(".stars");
        if (starsContainer) {
            starsContainer.addEventListener("mouseleave", () => {
                hoveredRating = 0;
                if (selectedRating === 0) {
                    stars.forEach(star => star.classList.remove("active"));
                    sendButton.disabled = true;
                } else {
                    updateStars(selectedRating);
                }
            });
        }

        sendButton.addEventListener("click", () => {
            if (!selectedRating) return;

            const target = selectedRating <= 3 ? lienFormulaireMauvaiseNote : lienGoogleReview;
            window.open(target, "_blank");
        });
    }

    // ===== FORMULAIRE DE CONTACT =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Simulation d'envoi (à remplacer par un vrai endpoint)
            console.log('Données du formulaire:', formData);
            
            // Affichage d'un message de confirmation
            alert('Merci pour votre message ! Nous vous contacterons dans les plus brefs délais.\n\nEn cas d\'urgence, appelez-nous au 01 43 73 35 96');
            
            // Réinitialisation du formulaire
            contactForm.reset();
            
            // Alternative : redirection vers email
            // window.location.href = `mailto:gravocles@free.fr?subject=Contact depuis le site&body=Nom: ${formData.name}%0ATéléphone: ${formData.phone}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
        });
    }

    // ===== PARALLAX SUBTIL POUR LE HERO =====
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroBackground = hero.querySelector('.hero-background');
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const heroHeight = hero.offsetHeight;
                if (scrolled < heroHeight) {
                    heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            });
        }
    }

    // ===== PERFORMANCE : Lazy loading des images (si ajoutées plus tard) =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Navigation au clavier gérée dans la section carrousel ci-dessus

// ===== OPTIMISATION : Debounce pour le scroll =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Note: highlightNav est déjà appelée dans le DOMContentLoaded
// Le debounce n'est pas nécessaire ici car highlightNav est déjà optimisée

