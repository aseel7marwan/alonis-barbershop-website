/* ═══════════════════════════════════════════════════════════
   ALONI'S BARBER SHOP — NUCLEAR LUXURY ENGINE
   Custom Scroll Reveals · Cinematic Interactions · Zero Dependencies
═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ─── PAGE LOADER ───
  const loader = document.getElementById("pageLoader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
      document.body.style.overflow = "";
      // Trigger hero reveals after loader
      setTimeout(triggerHeroReveals, 200);
    }, 2000);
  });

  // Prevent scroll during loading
  document.body.style.overflow = "hidden";

  // ─── DOM REFS ───
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const overlayMenu = document.getElementById("overlayMenu");
  const heroBg = document.querySelector(".hero-bg");
  const heroContent = document.querySelector(".hero-content");
  const fabCta = document.getElementById("fabCta");
  const statNums = document.querySelectorAll(".stat-num");

  // ─── NAVBAR SCROLL EFFECT ───
  let ticking = false;

  function onScroll() {
    const scrollY = window.pageYOffset;

    // Navbar glassmorphism
    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 80);
    }

    // Parallax hero (desktop only)
    if (heroBg && window.innerWidth > 768) {
      heroBg.style.transform = `scale(${1.1 - scrollY * 0.0001}) translateY(${scrollY * 0.25}px)`;
    }

    // Fade hero content
    if (heroContent) {
      const opacity = Math.max(0, 1 - scrollY / 600);
      heroContent.style.opacity = opacity;
      heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
    }

    // FAB CTA
    if (fabCta) {
      if (scrollY > 500) {
        fabCta.style.opacity = "1";
        fabCta.style.pointerEvents = "all";
      } else {
        fabCta.style.opacity = "0";
        fabCta.style.pointerEvents = "none";
      }
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );

  // ─── OVERLAY MENU ───
  function openMenu() {
    overlayMenu.classList.add("active");
    navToggle.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    overlayMenu.classList.remove("active");
    navToggle.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      overlayMenu.classList.contains("active") ? closeMenu() : openMenu();
    });
  }

  // Close on link click
  document.querySelectorAll(".overlay-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ─── SMOOTH SCROLL (all anchor links) ───
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  // ─── SCROLL REVEAL (replaces AOS completely) ───
  const revealElements = document.querySelectorAll(".reveal-up, .reveal-text");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ─── HERO LETTER REVEAL ───
  function triggerHeroReveals() {
    const heroReveals = document.querySelectorAll(
      ".hero-content .letter-reveal, .hero-content .reveal-text",
    );
    heroReveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, i * 200);
    });
  }

  // ─── STATS COUNTER ANIMATION ───
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNums.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 1500;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  if (statNums.length > 0) {
    const statsSection = statNums[0].closest(".about-stats");
    if (statsSection) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounters();
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 },
      );
      statsObserver.observe(statsSection);
    }
  }

  // ─── FAQ ACCORDION ───
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("active");

      // Close all
      document.querySelectorAll(".faq-item.active").forEach((i) => {
        i.classList.remove("active");
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });

  // ─── ACTIVE NAV LINK ON SCROLL ───
  const sections = document.querySelectorAll(".section[id]");
  const navLinksAll = document.querySelectorAll(".nav-links a");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinksAll.forEach((link) => {
            link.style.color =
              link.getAttribute("href") === `#${id}` ? "var(--gold)" : "";
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // ─── CONSOLE BRANDING ───
  console.log(
    "%c✂ ALONI'S BARBER SHOP — Nuclear Luxury Engine v2.0",
    "color: #c9a44c; font-size: 14px; font-weight: bold; font-family: serif;",
  );
})();
