// ===== NAVIGATION & SMOOTH SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburger
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu si on clique en dehors
        document.addEventListener('click', (e) => {
            if (hamburger && navMenu && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target) &&
                navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Fermer le menu mobile au clic sur un lien
    if (navLinks.length > 0 && hamburger && navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

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
                // Sur mobile : ajouter la lueur jaune automatique
                if (window.innerWidth <= 768) {
                    entry.target.classList.add('highlighted');
                }
            } else {
                // Retirer seulement la lueur quand on sort du viewport sur mobile
                if (window.innerWidth <= 768) {
                    entry.target.classList.remove('highlighted');
                }
            }
        });
    }, observerOptions);

    // Fonction pour détecter si on est sur mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Observer les cartes de services
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        observer.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Sur mobile : alterner gauche/droite
        if (isMobile()) {
            if (index % 2 === 0) {
                card.classList.add('from-left');
            } else {
                card.classList.add('from-right');
            }
        }
        
        // Sur PC : rendre visible immédiatement
        if (!isMobile()) {
            card.classList.add('visible');
        }
    });

    // Observer les cartes d'agences
    const agenceCards = document.querySelectorAll('.agence-card');
    agenceCards.forEach((card, index) => {
        observer.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
        
        // Sur mobile : alterner gauche/droite
        if (isMobile()) {
            if (index % 2 === 0) {
                card.classList.add('from-left');
            } else {
                card.classList.add('from-right');
            }
        }
        
        // Sur PC : rendre visible immédiatement
        if (!isMobile()) {
            card.classList.add('visible');
        }
    });

    // Réinitialiser les classes au redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const mobile = isMobile();
            serviceCards.forEach((card, index) => {
                card.classList.remove('from-left', 'from-right');
                if (mobile) {
                    if (index % 2 === 0) {
                        card.classList.add('from-left');
                    } else {
                        card.classList.add('from-right');
                    }
                }
            });
            agenceCards.forEach((card, index) => {
                card.classList.remove('from-left', 'from-right');
                if (mobile) {
                    if (index % 2 === 0) {
                        card.classList.add('from-left');
                    } else {
                        card.classList.add('from-right');
                    }
                }
            });
        }, 250);
    });

    // Observer les avantages avec animation alternée (toujours alterné)
    const avantageItems = document.querySelectorAll('.avantage-item');
    avantageItems.forEach((item, index) => {
        // Alterner gauche/droite : pair = gauche, impair = droite (toujours)
        if (index % 2 === 0) {
            item.classList.add('from-left');
        } else {
            item.classList.add('from-right');
        }
        
        observer.observe(item);
        item.style.transitionDelay = `${index * 0.1}s`;
        
        // Sur PC : rendre visible immédiatement
        if (!isMobile()) {
            setTimeout(() => {
                item.classList.add('visible');
            }, 50);
        }
    });

    // ===== CARROUSEL D'AVIS MOBILE =====
    const avisCards = document.querySelectorAll('.avis-card');
    const sliderContainer = document.querySelector('.slider-container');
    let currentAvisIndex = 0;
    let avisInterval = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    function initAvisCarousel() {
        // Détecter si on est sur mobile
        const isMobile = window.innerWidth <= 768;

        // Nettoyer l'interval précédent
        if (avisInterval) {
            clearInterval(avisInterval);
            avisInterval = null;
        }

        // Retirer les anciens event listeners
        const newSliderContainer = document.querySelector('.slider-container');
        if (newSliderContainer && newSliderContainer !== sliderContainer) {
            // Cloner et remplacer pour retirer les listeners
        }

        if (isMobile && avisCards.length > 0 && sliderContainer) {
            // Initialiser le carrousel mobile
            avisCards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next');
                if (index === 0) {
                    card.classList.add('active');
                } else if (index === 1) {
                    card.classList.add('next');
                } else {
                    card.style.display = 'block';
                }
            });

            function showNextAvis() {
                if (isDragging) return; // Ne pas changer pendant le drag
                
                avisCards[currentAvisIndex].classList.remove('active');
                avisCards[currentAvisIndex].classList.add('prev');

                currentAvisIndex = (currentAvisIndex + 1) % avisCards.length;
                updateAvisCards();
            }

            function showPrevAvis() {
                if (isDragging) return;
                
                avisCards[currentAvisIndex].classList.remove('active');
                avisCards[currentAvisIndex].classList.add('next');

                currentAvisIndex = (currentAvisIndex - 1 + avisCards.length) % avisCards.length;
                updateAvisCards();
            }

            function updateAvisCards() {
                // Réinitialiser toutes les classes
                avisCards.forEach((card, index) => {
                    card.classList.remove('active', 'prev', 'next');
                });

                avisCards[currentAvisIndex].classList.add('active');

                const prevIndex = (currentAvisIndex - 1 + avisCards.length) % avisCards.length;
                const nextIndex = (currentAvisIndex + 1) % avisCards.length;

                avisCards[prevIndex].classList.add('prev');
                avisCards[nextIndex].classList.add('next');
            }

            // Gestion du swipe tactile
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                isDragging = true;
                if (avisInterval) clearInterval(avisInterval);
            }, { passive: true });

            sliderContainer.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                touchEndX = e.touches[0].clientX;
            }, { passive: true });

            sliderContainer.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const swipeDistance = touchStartX - touchEndX;
                const minSwipeDistance = 50; // Distance minimale pour déclencher le swipe

                if (Math.abs(swipeDistance) > minSwipeDistance) {
                    if (swipeDistance > 0) {
                        // Swipe vers la gauche = suivant
                        showNextAvis();
                    } else {
                        // Swipe vers la droite = précédent
                        showPrevAvis();
                    }
                }

                isDragging = false;
                startAvisCarousel();
            }, { passive: true });

            // Démarrer le carrousel automatique (3.5 secondes)
            function startAvisCarousel() {
                if (avisInterval) clearInterval(avisInterval);
                avisInterval = setInterval(showNextAvis, 3500);
            }

            // Pause au survol/touch
            sliderContainer.addEventListener('mouseenter', () => {
                if (avisInterval) clearInterval(avisInterval);
            });

            sliderContainer.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    startAvisCarousel();
                }
            });

            // Démarrer le carrousel
            startAvisCarousel();
        } else {
            // Desktop : scroll horizontal normal
            avisCards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next');
                card.style.position = '';
                card.style.opacity = '';
                card.style.transform = '';
                observer.observe(card);
                card.style.transitionDelay = `${index * 0.1}s`;
            });
        }
    }

    // Initialiser au chargement
    initAvisCarousel();

    // Réinitialiser au redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initAvisCarousel, 250);
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

