document.addEventListener('DOMContentLoaded', () => {
    let focusedElementBeforeModal;
    const focusableElementsSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';


    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;


    menuToggle.addEventListener('click', () => {
        const isExpanded = navbar.classList.toggle('active');

        const icon = menuToggle.querySelector('i');

        icon.classList.toggle('fa-bars', !isExpanded);
        icon.classList.toggle('fa-times', isExpanded);


        menuToggle.setAttribute('aria-expanded', isExpanded);


        body.classList.toggle('no-scroll', isExpanded);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                navbar.classList.remove('active');
                body.classList.remove('no-scroll');

                menuToggle.setAttribute('aria-expanded', 'false');

                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });


    const colorMap = {
        'blue': { hex: '#007bff', rgb: '0, 123, 255' },
        'pink': { hex: '#e83e8c', rgb: '232, 62, 140' },
        'orange': { hex: '#fd7e14', rgb: '253, 126, 20' },
        'red': { hex: '#dc3545', rgb: '220, 53, 69' },
        'purple': { hex: '#6f42c1', rgb: '111, 66, 193' },
    };

    /**
     * 
     * @param {string} colorKey 
     */
    const setPrimaryColor = (colorKey) => {
        const colors = colorMap[colorKey];

        if (colors) {

            document.documentElement.style.setProperty('--primary-color', colors.hex);
            document.documentElement.style.setProperty('--highlight-color', colors.hex);
            document.documentElement.style.setProperty('--primary-color-rgb', colors.rgb);
        }
    };


    const themeButtons = document.querySelectorAll('.theme-button');
    const colorButtons = document.querySelectorAll('.color-button');


    const applySavedSettings = () => {
        const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
        const savedColor = localStorage.getItem('portfolioColor') || 'blue';


        body.setAttribute('data-theme', savedTheme);
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme-toggle') === savedTheme);
        });


        body.setAttribute('data-color', savedColor);
        setPrimaryColor(savedColor);

        colorButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-color') === savedColor);
        });
    };


    applySavedSettings();


    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newTheme = button.getAttribute('data-theme-toggle');


            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolioTheme', newTheme);


            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });


    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newColor = button.getAttribute('data-color');


            body.setAttribute('data-color', newColor);
            localStorage.setItem('portfolioColor', newColor);


            setPrimaryColor(newColor);


            colorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });



    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close], .close-btn, .modal-backdrop');
    const videoPlayerContainer = document.getElementById('videoPlayer');

    /**
     * Ouvre la modale et charge la vidéo spécifiée.
     * @param {HTMLElement} modalElement
     * @param {string} videoPath 
     * @param {HTMLElement} triggerButton 
     */
    const openModal = (modalElement, videoPath, triggerButton) => {
        focusedElementBeforeModal = triggerButton;

        videoPlayerContainer.innerHTML = `
            <video class="modal-video" controls autoplay>
                <source src="${videoPath}" type="video/mp4">
                Votre navigateur ne supporte pas la balise vidéo.
            </video>
        `;


        modalElement.classList.add('active');
        document.body.style.overflow = 'hidden';


        const firstFocusableElement = modalElement.querySelector('.close-btn');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }


        document.addEventListener('keydown', handleFocusTrap);
    };

    /**
     * Ferme la modale et stoppe/vide la vidéo.
     * @param {HTMLElement} modalElement L'élément de la modale.
     */
    const closeModal = (modalElement) => {

        videoPlayerContainer.innerHTML = '';


        modalElement.classList.remove('active');
        document.body.style.overflow = '';


        document.removeEventListener('keydown', handleFocusTrap);

        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
            focusedElementBeforeModal = null;
        }
    };

    const handleFocusTrap = (e) => {
        const activeModal = document.querySelector('.modal.active');
        if (!activeModal || e.key !== 'Tab') return;

        const focusableElements = activeModal.querySelectorAll(focusableElementsSelector);
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    };



    modalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');

            const videoPath = button.getAttribute('data-video-path');
            const modal = document.getElementById(modalId);

            if (modal && videoPath) {

                openModal(modal, videoPath, button);
            }
        });
    });


    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {

            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal);
            });
        }
    });




    const elementsToAnimate = document.querySelectorAll('.animate-slide-up');


    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                entry.target.classList.add('visible');

                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);


    elementsToAnimate.forEach(el => {
        sectionObserver.observe(el);
    });

});