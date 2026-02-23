/**
 * MEGALEDS - Vanilla JS + GSAP Main Script
 * Estilo Editorial / Premium Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
    // Registra plugins do GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Preferência do usuário por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Page Transition & Preloader
    const preloader = document.querySelector('.page-transition');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            if(preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
            initHeroAnimation();
        }, 800);
    });

    // 2. Header & Mobile Menu
    const header = document.getElementById('header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateHeader = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); 

    const toggleMenu = () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    if(mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;
            
            e.preventDefault();
            if (mainNav && mainNav.classList.contains('active')) toggleMenu();

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? "auto" : "smooth"
                });
            }
        });
    });

    // 3. Animações GSAP Base (Hero)
    function initHeroAnimation() {
        if (prefersReducedMotion) return;
        
        const tl = gsap.timeline();
        
        tl.from(".hero-text-content .gs-reveal", {
            y: 30, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out"
        })
        .from(".hero-img-main", {
            scale: 0.95, opacity: 0, duration: 1.5, ease: "power2.out"
        }, "-=0.8")
        .from(".hero-img-secondary", {
            y: 40, x: -20, opacity: 0, duration: 1.2, ease: "power3.out"
        }, "-=1")
        .from(".authority-bar", {
            y: 30, opacity: 0, duration: 1, ease: "power2.out"
        }, "-=0.6");
    }

    if (!prefersReducedMotion) {
        // Revelar blocos genéricos
        gsap.utils.toArray('.gs-reveal-up').forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
                y: 40, opacity: 0, duration: 1.2, ease: "power2.out"
            });
        });

        // Parallax nas imagens do Manifesto Redesenhado
        gsap.utils.toArray('.img-parallax').forEach(img => {
            gsap.to(img, {
                yPercent: 15, ease: "none",
                scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1 }
            });
        });

        gsap.utils.toArray('.img-parallax-fast').forEach(img => {
            gsap.to(img, {
                yPercent: 25, ease: "none",
                scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1.5 }
            });
        });
    }

    // 4. Lógica de Count-Up (Números Animados - ScrollTrigger)
    const counters = document.querySelectorAll('.count-up');
    if (prefersReducedMotion) {
        counters.forEach(el => { el.innerText = el.getAttribute('data-target'); });
    } else if (counters.length > 0) {
        ScrollTrigger.create({
            trigger: ".authority-bar",
            start: "top 95%",
            once: true,
            onEnter: () => {
                counters.forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'));
                    el.innerText = "0"; 
                    gsap.to({ val: 0 }, {
                        val: target,
                        duration: 2.5,
                        ease: "power3.out",
                        onUpdate: function() {
                            el.innerText = Math.floor(this.targets()[0].val);
                        }
                    });
                });
                
                gsap.fromTo('.auth-scale', 
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.5)", delay: 0.3 }
                );
            }
        });
    }

    // 5. Acordeão de Galeria Interativa
    const galleryItems = document.querySelectorAll('.ig-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            galleryItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });

        item.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                galleryItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // 6. Slider de Depoimentos
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const btnSlidePrev = document.querySelector('.slider-btn.prev');
    const btnSlideNext = document.querySelector('.slider-btn.next');
    
    if(track && slides.length > 0) {
        let currentSlide = 0;
        const updateSlider = () => { track.style.transform = `translateX(-${currentSlide * 100}%)`; };
        btnSlideNext.addEventListener('click', () => { currentSlide = (currentSlide + 1) % slides.length; updateSlider(); });
        btnSlidePrev.addEventListener('click', () => { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlider(); });
    }

    // 7. Validação de Formulário
    const inputWhatsapp = document.getElementById('whatsapp');
    const leadForm = document.getElementById('lead-form');

    if(inputWhatsapp) {
        inputWhatsapp.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    if(leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = leadForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = "Processando...";
            btn.style.opacity = "0.7";
            
            setTimeout(() => {
                btn.innerText = "Mensagem Enviada";
                btn.style.backgroundColor = "var(--c-beige)";
                btn.style.color = "var(--c-dark)";
                btn.style.opacity = "1";
                leadForm.reset();
                setTimeout(() => { btn.innerText = originalText; btn.style.backgroundColor = ""; btn.style.color = ""; }, 4000);
            }, 1500);
        });
    }

    // 8. POP-UP INTELIGENTE PREMIUM (Sempre 6s Após Cada Load)
    const popup = document.getElementById('premium-popup');
    const btnCloseIcon = document.getElementById('popup-close-icon');
    const btnCloseText = document.getElementById('popup-close-text');
    const btnCta = document.getElementById('popup-cta');
    const backdrop = document.getElementById('popup-backdrop');

    const openPopup = () => {
        if (!popup) return;
        popup.classList.add('active');
        popup.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
        if (!popup) return;
        popup.classList.remove('active');
        popup.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (popup) {
        // Exibe exatamente 6 segundos após o DOM carregar (a cada reload da página)
        setTimeout(() => {
            openPopup();
        }, 6000);

        if(btnCloseIcon) btnCloseIcon.addEventListener('click', closePopup);
        if(btnCloseText) btnCloseText.addEventListener('click', closePopup);
        if(backdrop) backdrop.addEventListener('click', closePopup);
        
        if(btnCta) btnCta.addEventListener('click', () => { closePopup(); });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                closePopup();
            }
        });
    }

    // Dynamic Year Update
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
});