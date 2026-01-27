gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

function initNavbarAnimations() {
    const navbarBg = document.querySelector(".navbar-background");
    const navbarItems = document.querySelector(".navbar-items");
    const navbarLinks = document.querySelectorAll(".navbar-links");

    const isDesktop = window.innerWidth >= 720;

    if (!isDesktop) {
        gsap.set([navbarBg, navbarItems], {
            width: "100%",
            height: "100vh",
        });
        return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const initialWidth = navbarBg.offsetWidth;
    const initialHeight = navbarBg.offsetHeight;
    const initialLinksWidths = [...navbarLinks].map((l) => l.offsetWidth);

    /* ================= LOGO CROSSFADE ================= */
    gsap.timeline({
        scrollTrigger: {
            trigger: ".navbar-backdrop",
            start: "top top",
            end: "+=120%",
            scrub: true,
        },
    })
        .to(
            ".logo-hero .logo-text",
            {
                scale: 0.6,
                opacity: 0,
                duration: 0.4,
                ease: "power3.inOut",
            },
            0
        )
        .to(
            ".logo-navbar .logo-text",
            {
                scale: 1.5,
                opacity: 1,
                y: 10,
                duration: 0.4,
                ease: "power3.inOut",
            },
            1
        );

    /* ================= NAVBAR GLASS ================= */

    ScrollTrigger.create({
        trigger: ".navbar-backdrop",
        start: "top top",
        end: `+=${vh}`,
        scrub: true,

        onUpdate(self) {
            const p = self.progress;

            gsap.set([navbarBg, navbarItems], {
                width: gsap.utils.interpolate(initialWidth, vw, p),
                height: gsap.utils.interpolate(initialHeight, vh, p),
            });

            gsap.set(navbarBg, {
                backdropFilter: `blur(${gsap.utils.interpolate(12, 24, p)}px) saturate(140%)`,
                opacity: gsap.utils.interpolate(0.9, 1, p),
            });

            navbarLinks.forEach((link, i) => {
                gsap.set(link, {
                    width: gsap.utils.interpolate(initialLinksWidths[i], link.scrollWidth, p),
                });
            });

            navbarBg.classList.toggle("navbar-glass-active", p > 0.35);
        },
    });
}

document.addEventListener("DOMContentLoaded", initNavbarAnimations);
