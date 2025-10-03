// Enhanced Portfolio Features JavaScript

class PortfolioEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.initDarkMode();
    this.initScrollToTop();
    this.initParticles();
    this.initAnimations();
    this.initAccessibility();
    this.initLazyLoading();
  }

  // Dark Mode Toggle
  initDarkMode() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.title = 'Toggle Dark Mode';
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '☀️';
    }

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
      
      // Announce theme change for screen readers
      this.announceToScreenReader(`Switched to ${newTheme} mode`);
    });

    document.body.appendChild(themeToggle);
  }

  // Enhanced Scroll to Top
  initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    const showScrollButton = () => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    };

    // Throttle scroll events for better performance
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(showScrollButton, 10);
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Animated Background Particles
  initParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'bg-particles';
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
  }

  // Intersection Observer for Animations
  initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .achievement-card, .project1, .project2, .project3, .project4');
    animateElements.forEach(el => observer.observe(el));
  }

  // Accessibility Enhancements
  initAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.background = '#000';
    skipLink.style.color = '#fff';
    skipLink.style.padding = '8px';
    skipLink.style.zIndex = '1000';
    skipLink.style.textDecoration = 'none';
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
      skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
      skipLink.classList.add('sr-only');
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add proper ARIA labels to interactive elements
    this.addAriaLabels();
  }

  addAriaLabels() {
    // Add ARIA labels to social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
      const text = link.querySelector('.social-text')?.textContent || 
                   link.getAttribute('title') || 
                   'Social media link';
      link.setAttribute('aria-label', text);
    });

    // Add ARIA labels to project links
    const projectLinks = document.querySelectorAll('.project1 a, .project2 a, .project3 a, .project4 a');
    projectLinks.forEach((link, index) => {
      const projectText = link.parentElement.querySelector('p')?.textContent || `Project ${index + 1}`;
      link.setAttribute('aria-label', `View ${projectText} project`);
    });
  }

  // Lazy Loading for Images
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Screen Reader Announcements
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Performance Monitor
  initPerformanceMonitor() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Portfolio loaded in ${loadTime}ms`);
        
        // Report to analytics if needed
        if (loadTime > 3000) {
          console.warn('Portfolio is loading slowly. Consider optimizing images and resources.');
        }
      });
    }
  }
}

// Enhanced Tic-Tac-Toe Game Improvements
class EnhancedTicTacToe {
  constructor() {
    this.gameStats = {
      wins: parseInt(localStorage.getItem('ttt-wins') || '0'),
      losses: parseInt(localStorage.getItem('ttt-losses') || '0'),
      draws: parseInt(localStorage.getItem('ttt-draws') || '0')
    };
    this.initGameEnhancements();
  }

  initGameEnhancements() {
    this.addGameStats();
    this.addSoundEffects();
    this.addGameHistory();
  }

  addGameStats() {
    const gameArea = document.querySelector('.tictac-content');
    if (!gameArea) return;

    const statsContainer = document.createElement('div');
    statsContainer.className = 'game-stats';
    statsContainer.innerHTML = `
      <h3>Your Game Statistics</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">${this.gameStats.wins}</span>
          <span class="stat-label">Wins</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${this.gameStats.losses}</span>
          <span class="stat-label">Losses</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${this.gameStats.draws}</span>
          <span class="stat-label">Draws</span>
        </div>
      </div>
    `;

    gameArea.insertBefore(statsContainer, gameArea.querySelector('button'));
  }

  updateStats(result) {
    this.gameStats[result]++;
    localStorage.setItem(`ttt-${result}`, this.gameStats[result].toString());
    this.addGameStats(); // Refresh display
  }

  addSoundEffects() {
    // Add simple sound effects using Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  playSound(type) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    switch (type) {
      case 'move':
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        break;
      case 'win':
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        break;
      case 'lose':
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        break;
    }

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  addGameHistory() {
    // Track game moves for replay functionality
    this.gameHistory = [];
  }
}

// Initialize enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioEnhancements();
  new EnhancedTicTacToe();
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js')
    navigator.serviceWorker.register(new URL('/sw.js', import.meta.url))
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioEnhancements, EnhancedTicTacToe };
}