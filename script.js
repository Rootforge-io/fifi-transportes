document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const menuToggleHandler = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const body = document.body;
        const closeMenu = document.querySelector('.close-menu');

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('open');
            body.classList.toggle('no-scroll');
            closeMenu.classList.toggle('active');
        });
        closeMenu.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('open');
            body.classList.remove('no-scroll');
            closeMenu.classList.remove('active');
        });
    }
    menuToggleHandler();

    // Fade-in animation for all sections (except header and footer)
    const sectionContainers = [
        '.hero-content.container',
        '.sobre-nos-content.container',
        '.clientes-content',
        '.servicos-card',
        '.setores-card',
        '.avaliacao-content.container',
    ];

    sectionContainers.forEach(selector => {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        end: 'top 50%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    });

    // Pin servicos header to top when scrolling through the container
    const servicosContainer = document.querySelector('.servicos-content.container');
    const servicosHeader = document.querySelector('.servicos-content.container .servicos-header');

    let servicosPinTrigger = null;

    const setupServicosPin = () => {
        // Kill existing trigger if it exists
        if (servicosPinTrigger) {
            servicosPinTrigger.kill();
            servicosPinTrigger = null;
        }

        if (servicosContainer && servicosHeader) {
            if (window.innerWidth >= 960) {
                const containerHeight = servicosContainer.offsetHeight;
                const headerHeight = servicosHeader.getElementsByTagName('h2')[0].offsetHeight + servicosHeader.querySelector('.servicos-subtitle').offsetHeight;
                const endScrollDistance = containerHeight - headerHeight - 96;

                servicosPinTrigger = ScrollTrigger.create({
                    trigger: servicosContainer,
                    start: 'top top',
                    end: `+=${endScrollDistance}`,
                    pin: servicosHeader,
                    pinSpacing: false,
                    anticipatePin: 1
                });
            }
        }
    };

    // Pin setores header to top when scrolling through the container
    const setoresContainer = document.querySelector('.setores-content.container');
    const setoresHeader = document.querySelector('.setores-content.container .setores-header');

    let setoresPinTrigger = null;

    const setupSetoresPin = () => {
        // Kill existing trigger if it exists
        if (setoresPinTrigger) {
            setoresPinTrigger.kill();
            setoresPinTrigger = null;
        }

        if (setoresContainer && setoresHeader) {
            if (window.innerWidth >= 960) {
                const containerHeight = setoresContainer.offsetHeight;
                const headerHeight = setoresHeader.getElementsByTagName('h2')[0].offsetHeight + setoresHeader.querySelector('.setores-subtitle').offsetHeight;
                const endScrollDistance = containerHeight - headerHeight - 96;

                setoresPinTrigger = ScrollTrigger.create({
                    trigger: setoresContainer,
                    start: 'top top',
                    end: `+=${endScrollDistance}`,
                    pin: setoresHeader,
                    pinSpacing: false,
                    anticipatePin: 1
                });
            }
        }
    };

    // Counter animation for sobre-nos numbers
    const animateCounters = () => {
        const sobreNosGrid = document.querySelector('.sobre-nos-grid');
        if (!sobreNosGrid) return;

        const numberElements = sobreNosGrid.querySelectorAll('h3');

        numberElements.forEach((element) => {
            const originalText = element.textContent.trim();
            let targetValue, format;

            // Parse different number formats and set initial value
            if (originalText.includes('%')) {
                // 98,6%
                targetValue = parseFloat(originalText.replace(',', '.').replace('%', ''));
                format = (val) => val.toFixed(1).replace('.', ',') + '%';
                element.textContent = '0,0%'; // Set initial value
            } else if (originalText.includes('mil')) {
                // +25mil
                targetValue = parseInt(originalText.replace('+', '').replace('mil', '')) * 1000;
                format = (val) => {
                    const thousands = Math.floor(val / 1000);
                    return '+' + thousands + 'mil';
                };
                element.textContent = '+0mil'; // Set initial value
            } else if (originalText.startsWith('+') && !isNaN(parseInt(originalText.replace('+', '')))) {
                // +500
                targetValue = parseInt(originalText.replace('+', ''));
                format = (val) => '+' + Math.round(val);
                element.textContent = '+0'; // Set initial value
            } else if (originalText === '24/7') {
                // 24/7 - just fade in, not a counter
                gsap.fromTo(element,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: sobreNosGrid,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
                return;
            } else {
                return; // Skip if format not recognized
            }

            // Create counter animation
            const counter = { value: 0 };

            gsap.to(counter, {
                value: targetValue,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sobreNosGrid,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function () {
                    element.textContent = format(counter.value);
                }
            });
        });
    };

    animateCounters();

    // Initial setup
    setupServicosPin();
    setupSetoresPin();

    // Handle resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
            setupServicosPin();
            setupSetoresPin();
        }, 250);
    });

});