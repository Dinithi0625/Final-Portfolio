document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const header = document.querySelector(".header");
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navbar");
    const navLinks = [...document.querySelectorAll(".navbar a")];
    const sections = [...document.querySelectorAll("main section, body > section[id], section[id]")];

    // Add a theme switch without requiring extra HTML markup.
    if (header && !document.querySelector(".theme-toggle")) {
        const themeButton = document.createElement("button");
        themeButton.type = "button";
        themeButton.className = "theme-toggle";
        themeButton.setAttribute("aria-label", "Switch to light theme");
        themeButton.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
        header.appendChild(themeButton);

        const savedTheme = localStorage.getItem("portfolio-theme");
        if (savedTheme === "light") root.setAttribute("data-theme", "light");

        const updateThemeIcon = () => {
            const isLight = root.getAttribute("data-theme") === "light";
            themeButton.innerHTML = isLight
                ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
            themeButton.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
        };
        updateThemeIcon();

        themeButton.addEventListener("click", () => {
            const isLight = root.getAttribute("data-theme") === "light";
            root.classList.add("theme-transition");
            if (isLight) {
                root.removeAttribute("data-theme");
                localStorage.setItem("portfolio-theme", "dark");
            } else {
                root.setAttribute("data-theme", "light");
                localStorage.setItem("portfolio-theme", "light");
            }
            updateThemeIcon();
            window.setTimeout(() => root.classList.remove("theme-transition"), 450);
        });
    }

    // Mobile navigation.
    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });

        navLinks.forEach(link => link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        }));
    }

    // Update the active navigation item while scrolling.
    const observedSections = sections.filter(section => section.id && navLinks.some(link => link.hash === `#${section.id}`));
    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    const active = link.hash === `#${entry.target.id}`;
                    link.classList.toggle("active", active);
                    if (active) link.setAttribute("aria-current", "page");
                    else link.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
        observedSections.forEach(section => sectionObserver.observe(section));
    }

    // Small entrance animation for content blocks.
    const revealTargets = document.querySelectorAll(
        ".about-content, .skill-card, .project-card, .assignment-module-card, .gallery-item, .contact-info-card, .contact-form"
    );
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealTargets.forEach(element => element.classList.add("reveal-on-scroll"));
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealTargets.forEach(element => revealObserver.observe(element));
    }

    // Contact form: open the visitor's email application with the message.
    // A static website cannot send email by itself without a server/service.
    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();
            if (!contactForm.reportValidity()) return;

            const firstName = document.querySelector("#firstName").value.trim();
            const lastName = document.querySelector("#lastName").value.trim();
            const mobile = document.querySelector("#mobileNo").value.trim();
            const email = document.querySelector("#email").value.trim();
            const message = document.querySelector("#message").value.trim();

            const subject = encodeURIComponent(`Portfolio contact from ${firstName} ${lastName}`);
            const body = encodeURIComponent(
                `Name: ${firstName} ${lastName}\nMobile: ${mobile}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            const successMessage = document.querySelector("#formSuccessMsg");
            if (successMessage) {
                successMessage.style.display = "block";
                successMessage.innerHTML = '<i class="fa-solid fa-circle-info"></i> Your email app will open with this message ready to send.';
            }
            window.location.href = `mailto:dinithinimasha@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    const yearElement = document.querySelector("#currentYear");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});
