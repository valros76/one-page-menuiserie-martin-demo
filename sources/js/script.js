'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.querySelector('.form-status');
    
    // Initialisation des animations au défilement
    initScrollAnimations();
    
    // Menu responsive
    initMobileMenu();
    
    // Filtrage du portfolio
    initPortfolioFilter();
    
    // Validation et envoi du formulaire
    initContactForm();
    
    /**
     * Initialise les animations au défilement
     */
    function initScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.section-header, .about-content, .service-card, .portfolio-item, .testimonial, .contact-card');
        
        // Ajouter la classe hidden à tous les éléments à animer
        elementsToAnimate.forEach(element => {
            element.classList.add('hidden');
        });
        
        // Observer pour déclencher les animations au défilement
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
    
    /**
     * Initialise le menu mobile
     */
    function initMobileMenu() {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Fermer le menu après clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    /**
     * Initialise le filtrage du portfolio
     */
    function initPortfolioFilter() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Mettre à jour l'état actif des boutons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                
                const filter = button.getAttribute('data-filter');
                
                // Filtrer les éléments du portfolio
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || filter === category) {
                        item.style.display = 'block';
                        // Animation pour les éléments qui apparaissent
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    /**
     * Initialise la validation et l'envoi du formulaire de contact
     */
    function initContactForm() {
        if (!contactForm) return;
        
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        // Validation des champs lors de la saisie
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', validateField);
        });
        
        // Soumission du formulaire
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Valider tous les champs avant envoi
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });
            
            if (!isValid) return;
            
            // Simuler l'envoi du formulaire (à remplacer par un vrai envoi)
            try {
                await simulateFormSubmission();
                showFormStatus('success', 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.');
                contactForm.reset();
            } catch (error) {
                showFormStatus('error', 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
            }
        });
        
        /**
         * Valide un champ du formulaire
         * @param {Event} e - L'événement de saisie
         * @returns {boolean} - True si le champ est valide
         */
        function validateField(e) {
            const input = e.target;
            const errorElement = input.nextElementSibling;
            let isValid = true;
            let errorMessage = '';
            
            // Réinitialiser l'état d'erreur
            input.classList.remove('error');
            
            // Validation en fonction du type de champ
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                errorMessage = 'Ce champ est requis';
            } else if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    errorMessage = 'Veuillez entrer une adresse email valide';
                }
            } else if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[0-9+\s()-]{8,15}$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    errorMessage = 'Veuillez entrer un numéro de téléphone valide';
                }
            }
            
            // Afficher le message d'erreur si nécessaire
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.textContent = errorMessage;
            }
            
            if (!isValid) {
                input.classList.add('error');
            }
            
            return isValid;
        }
        
        /**
         * Simule l'envoi du formulaire (à remplacer par un vrai envoi)
         * @returns {Promise} - Promise résolue après un délai
         */
        function simulateFormSubmission() {
            return new Promise((resolve) => {
                // Simuler un délai d'envoi
                setTimeout(() => {
                    resolve();
                }, 1500);
            });
        }
        
        /**
         * Affiche un message de statut du formulaire
         * @param {string} type - Type de message ('success' ou 'error')
         * @param {string} message - Message à afficher
         */
        function showFormStatus(type, message) {
            formStatus.textContent = message;
            formStatus.className = 'form-status ' + type;
            
            // Rendre le message accessible aux lecteurs d'écran
            formStatus.setAttribute('role', 'alert');
            
            // Faire défiler jusqu'au message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Masquer le message après un délai
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
                formStatus.removeAttribute('role');
            }, 5000);
        }
    }
});

/**
 * Fonction pour envoyer un email via le formulaire de contact
 * Cette fonction serait normalement remplacée par un appel à un service backend
 * @param {Object} formData - Les données du formulaire
 * @returns {Promise} - Promise résolue après l'envoi
 */
function sendEmail(formData) {
    // Dans une implémentation réelle, cette fonction enverrait les données à un backend
    // Exemple avec fetch:
    /*
    return fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du message');
        }
        return response.json();
    });
    */
    
    // Pour l'instant, on simule juste un envoi réussi
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Email envoyé avec les données:', formData);
            alert("Ce site est une démonstration. Ce formulaire est fictif.");
            resolve({ success: true });
        }, 1000);
    });
}