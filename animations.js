/**
 * Enhanced Animations for Hacktoberfest Portfolio
 * This file contains improved animations and scroll effects
 */

// Animation Observer for Scroll-Based Animations
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Add different animation styles based on element type or position
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        
        // Add custom animations based on position in viewport
        const position = entry.boundingClientRect.top / window.innerHeight;
        
        if (position < 0.3) {
          entry.target.classList.add("animate-fast");
        } else if (position < 0.7) {
          entry.target.classList.add("animate-medium");
        } else {
          entry.target.classList.add("animate-slow");
        }
        
        // Add random animation delays for staggered effect
        if (entry.target.classList.contains("stagger-animation")) {
          const delay = Math.random() * 0.5;
          entry.target.style.animationDelay = `${delay}s`;
        }
      } else {
        // Optional: Remove animations when scrolled out of view
        // Uncomment to enable
        // entry.target.classList.remove("animate", "animate-fast", "animate-medium", "animate-slow");
      }
    });
  },
  { 
    threshold: 0.2, // Trigger when 20% of element is visible
    rootMargin: "0px 0px -100px 0px" // Adjust the trigger area
  }
);

// Enhanced version of existing animation functions
function enhancedAnimateOnScroll() {
  const elements = document.querySelectorAll(
    '.animate-on-scroll, .project, .card, .achievement-card, .info-card, .social-link, .a1, .a2, .a3, .a4'
  );
  
  elements.forEach((element) => {
    // Add stagger animation to certain elements
    if (element.classList.contains('card') || element.classList.contains('social-link')) {
      element.classList.add('stagger-animation');
    }
    
    animationObserver.observe(element);
  });
}

// Parallax Effects
function setupParallaxEffects() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const offset = scrolled * speed;
      element.style.transform = `translateY(${offset}px)`;
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
          
          // Easing function for smoother animation
          window.scrollTo(0, startPosition + distance * easeInOutQuad(Math.min(progress / duration, 1)));
          
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
        
        window.requestAnimationFrame(step);
      }
    });
  });
}

// Add scroll indicator
function addScrollIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  document.body.appendChild(indicator);
  
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
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
    scrollBtn.classList.remove('show');
  });
}

// Initialize all animation enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  enhancedAnimateOnScroll();
  setupParallaxEffects();
  setupSmoothScroll();
  addScrollIndicator();
  enhanceScrollToTopButton();
  
  // Add page transition effect
  document.body.classList.add('page-loaded');
});

// Add resize handler to adjust animations on window resize
window.addEventListener('resize', () => {
  // Debounced resize handler
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    enhancedAnimateOnScroll();
  }, 250);
});
