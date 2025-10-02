/**
 * Enhanced Animations for Hacktoberfest Portfolio
 * This file contains improved animations and scroll effects
 * Now with more animation types, mouse interactions, and enhanced parallax
 */

// Animation Observer for Scroll-Based Animations
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");

        // Add custom animation type based on data-animation or random choice
        let animationType = entry.target.dataset.animation;
        if (!animationType) {
          const types = ["fade-in", "slide-up", "slide-down", "slide-left", "slide-right", "zoom-in", "rotate-in", "flip-in", "bounce-in"];
          animationType = types[Math.floor(Math.random() * types.length)];
        }
        entry.target.classList.add(animationType);

        // Add custom animations based on position in viewport
        const position = entry.boundingClientRect.top / window.innerHeight;
        if (position < 0.2) {
          entry.target.classList.add("animate-fast");
        } else if (position < 0.5) {
          entry.target.classList.add("animate-medium");
        } else {
          entry.target.classList.add("animate-slow");
        }

        // Add random animation delays for staggered effect
        if (entry.target.classList.contains("stagger-animation")) {
          const delay = Math.random() * 0.5 + 0.2;
          entry.target.style.animationDelay = `${delay}s`;
        }
      } else {
        // Optional: Remove animations when scrolled out of view
        // entry.target.classList.remove("animate", "animate-fast", "animate-medium", "animate-slow", "fade-in", "slide-up", "slide-down", "slide-left", "slide-right", "zoom-in", "rotate-in", "flip-in", "bounce-in");
      }
    });
  },
  { 
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: "0px 0px -80px 0px" // Adjust the trigger area
  }
);

// Enhanced version of existing animation functions
function enhancedAnimateOnScroll() {
  const elements = document.querySelectorAll(
    '.animate-on-scroll, .project, .card, .achievement-card, .info-card, .social-link, .a1, .a2, .a3, .a4'
  );
  
  elements.forEach((element, idx) => {
    // Add stagger animation to certain elements
    if (element.classList.contains('card') || element.classList.contains('social-link')) {
      element.classList.add('stagger-animation');
    }
    // Assign a specific animation type via data attribute if not present
    if (!element.dataset.animation) {
      const types = ["fade-in", "slide-up", "slide-down", "slide-left", "slide-right", "zoom-in", "rotate-in", "flip-in", "bounce-in"];
      element.dataset.animation = types[idx % types.length];
    }
    animationObserver.observe(element);
  });
}

// Parallax Effects (Y, X, rotate)
function setupParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const xSpeed = parseFloat(element.dataset.xspeed) || 0;
      const rotate = parseFloat(element.dataset.rotate) || 0;
      const yOffset = scrolled * speed;
      const xOffset = scrolled * xSpeed;
      const rotation = scrolled * rotate;
      element.style.transform = `translateY(${yOffset}px) translateX(${xOffset}px) rotate(${rotation}deg)`;
    });
  });

  // Mouse-based parallax
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    parallaxElements.forEach(element => {
      element.style.transform += ` translateY(${y}px) translateX(${x}px)`;
    });
  });
}

// Smooth scrolling with enhanced easing
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Improved smooth scrolling with easing
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          window.scrollTo(0, startPosition + distance * easeInOutQuad(Math.min(progress / duration, 1)));
          if (progress < duration) window.requestAnimationFrame(step);
        }

        window.requestAnimationFrame(step);
      }
    });
  });
}

// Add scroll indicator
function addScrollIndicator() {
  let indicator = document.querySelector('.scroll-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
  }
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    indicator.style.width = scrolled + "%";
  });
}

// Improved scroll-to-top button functionality
function enhanceScrollToTopButton() {
  const scrollBtn = document.getElementById('scrollToTop');
  if (!scrollBtn) return;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('show');
      scrollBtn.classList.remove('hide');
    } else {
      scrollBtn.classList.add('hide');
      setTimeout(() => {
        if (window.pageYOffset <= 300) {
          scrollBtn.classList.remove('show');
          scrollBtn.classList.remove('hide');
        }
      }, 300);
    }
  });
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Animated scroll to top with easing
    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 10);
      }
    };
    window.requestAnimationFrame(scrollToTop);
  });
}

// Mouse-based card hover animation
function setupCardHoverAnimation() {
  document.querySelectorAll('.card, .achievement-card, .info-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover-animate');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover-animate');
    });
  });
}

// Animate elements on window resize and tab visibility
function setupResizeAndVisibilityAnimations() {
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
      enhancedAnimateOnScroll();
      document.body.classList.add('resize-animate');
      setTimeout(() => document.body.classList.remove('resize-animate'), 800);
    }, 250);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      document.body.classList.add('tab-visible-animate');
      setTimeout(() => document.body.classList.remove('tab-visible-animate'), 600);
    }
  });
}

// Initialize all animation enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  enhancedAnimateOnScroll();
  setupParallaxEffects();
  setupSmoothScroll();
  addScrollIndicator();
  enhanceScrollToTopButton();
  setupCardHoverAnimation();
  setupResizeAndVisibilityAnimations();
  document.body.classList.add('page-loaded');
});
