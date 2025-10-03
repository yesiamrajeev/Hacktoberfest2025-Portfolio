// Animation effect for the submit button
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn) {
        // Add ripple effect
        submitBtn.addEventListener('mousedown', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.transform = 'scale(0)';
                ripple.style.opacity = '1';
                
                // Trigger animation
                setTimeout(() => {
                    ripple.style.transform = 'scale(5)';
                    ripple.style.opacity = '0';
                    ripple.style.transition = 'transform 0.6s, opacity 0.6s';
                }, 1);
            }
        });
        
        // Add hover animation for text and icon
        submitBtn.addEventListener('mouseenter', function() {
            const btnText = this.querySelector('.btn-text');
            const btnIcon = this.querySelector('.btn-icon');
            
            if (btnText && btnIcon) {
                btnText.style.transition = 'transform 0.3s ease';
                btnIcon.style.transition = 'transform 0.3s ease';
                btnText.style.transform = 'translateX(-5px)';
                btnIcon.style.transform = 'translateX(5px) scale(1.2)';
            }
        });
        
        submitBtn.addEventListener('mouseleave', function() {
            const btnText = this.querySelector('.btn-text');
            const btnIcon = this.querySelector('.btn-icon');
            
            if (btnText && btnIcon) {
                btnText.style.transform = 'translateX(0)';
                btnIcon.style.transform = 'translateX(0) scale(1)';
            }
        });
    }
    
    // Add custom scrollbar styling
    document.documentElement.style.scrollbarWidth = 'thin';
    document.documentElement.style.scrollbarColor = 'rgb(245, 122, 77) #1a1a1a';
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        ::-webkit-scrollbar {
            width: 12px;
        }
        
        ::-webkit-scrollbar-track {
            background: #1a1a1a;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, rgb(245, 122, 77), #8742F5);
            border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #ff8c5a, #9c5aff);
        }
    `;
    document.head.appendChild(styleElement);
});
