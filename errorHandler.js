/**
 * Enhanced Form Validation and Error Handling
 * This file improves form validation, provides better error messaging
 * and handles errors gracefully across the portfolio
 */

class FormValidator {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.options = {
      showErrors: true,
      validateOnInput: true,
      errorClass: 'error-message',
      errorFieldClass: 'has-error',
      ...options
    };
    
    if (!this.form) {
      console.error(`Form with ID "${formId}" not found.`);
      return;
    }
    
    this.setupValidation();
  }
  
  setupValidation() {
    // Add submit event listener
    this.form.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
      }
    });
    
    // Add input validation if enabled
    if (this.options.validateOnInput) {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        // Reset error state when user starts typing
        input.addEventListener('input', () => {
          this.clearError(input);
        });
      });
    }
  }
  
  validateForm() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  validateField(field) {
    const value = field.value.trim();
    const name = field.getAttribute('name') || field.id;
    
    // Clear previous errors
    this.clearError(field);
    
    // Check for required fields
    if (field.hasAttribute('required') && value === '') {
      this.showError(field, `${this.formatFieldName(name)} is required`);
      return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        this.showError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // URL validation
    if (field.type === 'url' && value !== '') {
      try {
        new URL(value);
      } catch (e) {
        this.showError(field, 'Please enter a valid URL');
        return false;
      }
    }
    
    // Min/max length validation
    if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
      const minLength = field.getAttribute('minlength');
      this.showError(field, `${this.formatFieldName(name)} must be at least ${minLength} characters`);
      return false;
    }
    
    if (field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
      const maxLength = field.getAttribute('maxlength');
      this.showError(field, `${this.formatFieldName(name)} must not exceed ${maxLength} characters`);
      return false;
    }
    
    // Custom validation based on data-validate attribute
    if (field.hasAttribute('data-validate')) {
      const validateType = field.getAttribute('data-validate');
      
      switch (validateType) {
        case 'phone':
          const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
          if (!phonePattern.test(value)) {
            this.showError(field, 'Please enter a valid phone number');
            return false;
          }
          break;
        
        // Add more custom validation types as needed
      }
    }
    
    return true;
  }
  
  showError(field, message) {
    if (!this.options.showErrors) return;
    
    field.classList.add(this.options.errorFieldClass);
    
    // Create error message element if it doesn't exist
    let errorElement = field.parentNode.querySelector(`.${this.options.errorClass}`);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = this.options.errorClass;
      
      // Insert error after input or at end of parent
      if (field.nextSibling) {
        field.parentNode.insertBefore(errorElement, field.nextSibling);
      } else {
        field.parentNode.appendChild(errorElement);
      }
    }
    
    // Show error with fade-in animation
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.style.opacity = '0';
    errorElement.style.animation = 'fadeIn 0.3s forwards';
  }
  
  clearError(field) {
    field.classList.remove(this.options.errorFieldClass);
    
    const errorElement = field.parentNode.querySelector(`.${this.options.errorClass}`);
    if (errorElement) {
      // Fade out error message
      errorElement.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 300);
    }
  }
  
  formatFieldName(name) {
    // Convert camelCase or snake_case to readable format
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());
  }
}

// Enhanced notification system for success/error messages
class NotificationSystem {
  constructor(options = {}) {
    this.options = {
      position: 'top-right', // top-right, top-left, bottom-right, bottom-left
      duration: 5000,
      maxNotifications: 5,
      container: null,
      ...options
    };
    
    this.notifications = [];
    this.createContainer();
  }
  
  createContainer() {
    // Create notification container if it doesn't exist
    if (!this.options.container) {
      this.container = document.createElement('div');
      this.container.className = `notification-container ${this.options.position}`;
      document.body.appendChild(this.container);
    } else {
      this.container = this.options.container;
    }
  }
  
  show(message, type = 'info', duration = this.options.duration) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    
    switch (type) {
      case 'success':
        icon.innerHTML = '<i class="fa fa-check-circle"></i>';
        break;
      case 'error':
        icon.innerHTML = '<i class="fa fa-exclamation-circle"></i>';
        break;
      case 'warning':
        icon.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
        break;
      default:
        icon.innerHTML = '<i class="fa fa-info-circle"></i>';
    }
    
    notification.appendChild(icon);
    
    // Add message
    const content = document.createElement('div');
    content.className = 'notification-content';
    content.innerHTML = message;
    notification.appendChild(content);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      this.hide(notification);
    });
    notification.appendChild(closeBtn);
    
    // Limit number of notifications
    if (this.notifications.length >= this.options.maxNotifications) {
      this.hide(this.notifications[0]);
    }
    
    // Add to container with animation
    this.container.appendChild(notification);
    this.notifications.push(notification);
    
    // Trigger animation after a small delay to ensure it works
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        if (this.container.contains(notification)) {
          this.hide(notification);
        }
      }, duration);
    }
    
    // Add progress bar if duration is set
    if (duration > 0) {
      const progress = document.createElement('div');
      progress.className = 'notification-progress';
      notification.appendChild(progress);
      
      // Animate progress bar
      progress.style.transition = `width ${duration}ms linear`;
      
      // Trigger animation after a small delay
      setTimeout(() => {
        progress.style.width = '0%';
      }, 10);
    }
    
    return notification;
  }
  
  hide(notification) {
    notification.classList.remove('show');
    notification.classList.add('hiding');
    
    // Remove notification after animation completes
    setTimeout(() => {
      if (this.container.contains(notification)) {
        this.container.removeChild(notification);
        this.notifications = this.notifications.filter(n => n !== notification);
      }
    }, 300);
  }
  
  success(message, duration) {
    return this.show(message, 'success', duration);
  }
  
  error(message, duration) {
    return this.show(message, 'error', duration);
  }
  
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }
  
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
  
  clearAll() {
    while (this.notifications.length) {
      this.hide(this.notifications[0]);
    }
  }
}

// Global error handling for fetch/ajax requests
function setupAjaxErrorHandling() {
  // Create a global notification system for errors
  window.notificationSystem = new NotificationSystem();
  
  // Add global fetch error handler
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch.apply(this, args);
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
        
        // Show notification for non-200 responses
        window.notificationSystem.error(errorMessage);
      }
      
      return response;
    } catch (error) {
      // Show network errors
      window.notificationSystem.error(`Network error: ${error.message}`);
      throw error;
    }
  };
}

// Initialize all error handling enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize form validation for contact form
  if (document.getElementById('contactForm')) {
    const contactFormValidator = new FormValidator('contactForm', {
      errorClass: 'form-error-message',
      errorFieldClass: 'input-error'
    });
  }
  
  // Set up global error handling
  setupAjaxErrorHandling();
  
  // Add global error handler
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Show user-friendly error message for critical errors
    if (window.notificationSystem) {
      window.notificationSystem.error('Something went wrong. Please try again or refresh the page.');
    }
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error message
    if (window.notificationSystem) {
      window.notificationSystem.error('An operation failed. Please try again later.');
    }
  });
});
