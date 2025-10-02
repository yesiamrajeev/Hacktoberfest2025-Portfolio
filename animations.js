/**
 * 🚀 Optimized Animations for Hacktoberfest Portfolio
 * - Reduced layout thrashing
 * - Debounced expensive events
 * - Cached DOM lookups
 * - Cleaner class toggling
 */

// ✅ Intersection Observer for Scroll Animations
const animationObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const { target, boundingClientRect } = entry;
      const position = boundingClientRect.top / window.innerHeight;

      target.classList.add("animate");

      // Apply speed-based animation classes
      target.classList.add(
        position < 0.3 ? "animate-fast" :
        position < 0.7 ? "animate-medium" :
        "animate-slow"
      );

      // Random stagger effect
      if (target.classList.contains("stagger-animation")) {
        target.style.animationDelay = `${(Math.random() * 0.5).toFixed(2)}s`;
      }
    }
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px"
  }
);

function enhancedAnimateOnScroll() {
  const elements = document.querySelectorAll(
    ".animate-on-scroll, .project, .card, .achievement-card, .info-card, .social-link, .a1, .a2, .a3, .a4"
  );

  elements.forEach((el) => {
    if (el.classList.contains("card") || el.classList.contains("social-link")) {
      el.classList.add("stagger-animation");
    }
    animationObserver.observe(el);
  });
}

// ✅ Optimized Parallax Effect
function setupParallaxEffects() {
  const parallaxElements = document.querySelectorAll(".parallax");
  if (!parallaxElements.length) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach((el) => {
          const speed = parseFloat(el.dataset.speed) || 0.5;
          el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ✅ Smooth Scroll with easing
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      const start = window.scrollY;
      const end = targetEl.getBoundingClientRect().top + start;
      const distance = end - start;
      const duration = 1000;
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeInOutQuad = (t) =>
          t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        window.scrollTo(0, start + distance * easeInOutQuad(progress));
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  });
}

// ✅ Scroll Indicator
function addScrollIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "scroll-indicator";
  document.body.appendChild(indicator);

  window.addEventListener("scroll", () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    indicator.style.width = `${(scrollTop / scrollHeight) * 100}%`;
  });
}

// ✅ Scroll-to-Top Button
function enhanceScrollToTopButton() {
  const scrollBtn = document.getElementById("scrollToTop");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("show", window.pageYOffset > 300);
  });

  scrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const scrollStep = () => {
      const current = window.scrollY;
      if (current > 0) {
        window.scrollTo(0, current - current / 10);
        requestAnimationFrame(scrollStep);
      }
    };
    requestAnimationFrame(scrollStep);
  });
}

// ✅ Init all when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  enhancedAnimateOnScroll();
  setupParallaxEffects();
  setupSmoothScroll();
  addScrollIndicator();
  enhanceScrollToTopButton();
  document.body.classList.add("page-loaded");
});

// ✅ Debounced resize
window.addEventListener(
  "resize",
  (() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(enhancedAnimateOnScroll, 250);
    };
  })()
);
