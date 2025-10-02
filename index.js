const board = document.getElementById("board");
const cells = [];
let currentPlayer = "";
let playerSymbol = "X";
let computerSymbol = "O";
let gameActive = false;
let playerName = ""; 

// Enhanced Custom Alert Modal Functions with improved animations and error handling
function showCustomAlert(message, isWin = false) {
  try {
    const modal = document.getElementById('custom-alert');
    const messageEl = document.getElementById('alert-message');
    const icon = document.getElementById('alert-icon');
    
    if (!modal || !messageEl || !icon) {
      console.error("Custom alert elements not found in the DOM");
      return;
    }
    
    messageEl.textContent = message;
    
    // Enhanced icon animation based on result
    if (message.includes('Win') || message === 'You Win!') {
      icon.innerHTML = '🏆';
      icon.style.animation = 'bounce 0.6s ease, pulse 1.5s ease infinite';
    } else if (message.includes('draw')) {
      icon.innerHTML = '🤝';
      icon.style.animation = 'shake 0.5s ease, floatAnimation 2s ease-in-out infinite';
    } else {
      icon.innerHTML = '😔';
      icon.style.animation = 'fadeIn 0.5s ease, rotateIn 0.8s ease';
    }
    
    // Add shimmer effect to the message
    messageEl.style.backgroundImage = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)';
    messageEl.style.backgroundSize = '200% 100%';
    messageEl.style.animation = 'shimmer 2s infinite';
    
    // Show modal with enhanced animation
    modal.classList.add('show');
    modal.style.animation = 'modalPop 0.5s forwards, pulse 2s infinite';
    
    // Reset animations after a delay
    setTimeout(() => {
      icon.style.animation = isWin ? 'pulse 2s infinite' : '';
    }, 1000);
    
  } catch (error) {
    console.error("Error showing custom alert:", error);
    // Fallback to standard alert if custom alert fails
    alert(message);
  }
}

function closeCustomAlert() {
  try {
    const modal = document.getElementById('custom-alert');
    if (!modal) {
      console.error("Custom alert element not found");
      return;
    }
    
    // Add closing animation
    modal.style.animation = 'fadeOutDown 0.5s forwards';
    
    // Remove show class after animation completes
    setTimeout(() => {
      modal.classList.remove('show');
      modal.style.animation = '';
    }, 500);
    
  } catch (error) {
    console.error("Error closing custom alert:", error);
  }
}

function startGame() {
  gameActive = true;

  if (Math.random() < 0.5) {
    currentPlayer = "Your";
  } else {
    currentPlayer = "Raj's";
    setTimeout(computerMove, 500);
  }

  document.getElementById("turn-info").textContent = `${currentPlayer} turn (you are "${playerSymbol}")`;

  cells.forEach((cell) => (cell.textContent = ""));
}

for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cells.push(cell);
  board.appendChild(cell);

  cell.addEventListener("click", () => {
    if (cell.textContent === "" && currentPlayer === "Your" && gameActive) {
      cell.textContent = playerSymbol;
      if (checkWinner(playerSymbol)) {
        showCustomAlert("You Win!");
        setTimeout(resetBoard, 2000);
      } else if (cells.every((cell) => cell.textContent !== "")) {
        showCustomAlert("It's a draw!");
        setTimeout(resetBoard, 2000);
      } else {
        currentPlayer = "Raj's";
        document.getElementById("turn-info").textContent = `${currentPlayer} turn`;
        setTimeout(computerMove, 500);
      }
    }
  });
}

function checkWinner(player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some((combination) =>
    combination.every((index) => cells[index].textContent === player)
  );
}

function computerMove() {
  if (!gameActive) return;

  const emptyCells = cells.filter((cell) => cell.textContent === "");
  if (emptyCells.length > 0) {
    const bestMove = findBestMove();
    cells[bestMove].textContent = computerSymbol;

    if (checkWinner(computerSymbol)) {
      showCustomAlert("Raj Won!");
      setTimeout(resetBoard, 2000);
    } else if (cells.every((cell) => cell.textContent !== "")) {
      showCustomAlert("It's a draw!");
      setTimeout(resetBoard, 2000);
    }
  }
  currentPlayer = "Your";
  document.getElementById("turn-info").textContent = `${currentPlayer} turn (you are "${playerSymbol}")`;
}

function resetBoard() {
  gameActive = false;
  cells.forEach((cell) => (cell.textContent = ""));
  currentPlayer = "Your";
  document.getElementById("turn-info").textContent = `${currentPlayer} turn (you are "${playerSymbol}")`;
  closeCustomAlert();
}

function minimax(board, depth, isMaximizing) {
  const scores = {
    X: -1,
    O: 1,
    draw: 0,
  };

  const result = checkWin(board);
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = computerSymbol;
        const score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (cells[i].textContent === "") {
      cells[i].textContent = computerSymbol;
      const score = minimax(cells.map((cell) => cell.textContent), 0, false);
      cells[i].textContent = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function checkWin(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== "")) {
    return "draw";
  }

  return null;
}

document.addEventListener("DOMContentLoaded", function () {
    var homeSection = document.getElementById("home");

    if (!homeSection) {
        console.error("Error: Home section not found in the document");
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !homeSection.classList.contains("active")) {
            homeSection.classList.add("active");
        }
    }, { threshold: 0 });

    try {
        observer.observe(homeSection);
    } catch (error) {
        console.error("Error observing home section:", error);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const target = document.querySelector('#projects');
    
    if (!target) {
        console.error("Error: Projects section not found in the document");
        return;
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const callback = function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          try {
            const projects = document.querySelectorAll('.project');
            if (projects.length === 0) {
                console.warn("No project elements found to animate");
            }
            
            projects.forEach(function (project, index) {
              project.classList.add('animate');
              // Add staggered delay for smoother animation
              project.style.animationDelay = (index * 0.15) + 's';
            });
            
            observer.disconnect();
          } catch (error) {
            console.error("Error animating projects:", error);
          }
        }
      });
    };

    try {
        const observer = new IntersectionObserver(callback, options);
        observer.observe(target);
    } catch (error) {
        console.error("Error observing projects section:", error);
    }
});

// Enhanced page load with error handling and loading indicator
window.addEventListener('load', function() {
    try {
        // Create and display a loading indicator
        const loadingOverlay = document.createElement('div');
        loadingOverlay.classList.add('loading-overlay');
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading Hacktoberfest Portfolio...</div>
        `;
        document.body.appendChild(loadingOverlay);
        
        // Show body with fade-in effect after a short delay
        setTimeout(() => {
            document.body.style.display = 'block';
            document.body.style.animation = 'fadeIn 1s ease-in-out';
            
            // Remove loading overlay with animation
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(loadingOverlay)) {
                    document.body.removeChild(loadingOverlay);
                }
            }, 500);
        }, 800);
    } catch (error) {
        console.error("Error during page load:", error);
        // Fallback display in case of error
        document.body.style.display = 'block';
    }
});

// Improved cursor functionality with error handling
try {
    const cursor = document.querySelector(".cursor");
    const links = document.querySelectorAll("nav ul li a");
    const navlinks = document.querySelectorAll("nav ul li");

    if (!cursor) {
        console.warn("Custom cursor element not found");
    } else {
        // Add smoother animation to cursor
        cursor.style.transition = "transform 0.05s ease, left 0.08s ease-out, top 0.08s ease-out";
        
        document.addEventListener("mousemove", (e) => {
            try {
                let leftPosition = e.pageX + 4;
                let topPosition = e.pageY + 4;

                cursor.style.left = leftPosition + "px";
                cursor.style.top = topPosition + "px";
            } catch (error) {
                console.error("Error updating cursor position:", error);
            }
        });

        // Mouse enter effects with error handling
        if (links.length > 0) {
            links.forEach(link => {
                link.addEventListener("mouseenter", () => {
                    try {
                        cursor.classList.add("large");
                        // Add a scale effect
                        cursor.style.transform = "scale(1.5)";
                    } catch (error) {
                        console.error("Error handling mouseenter on links:", error);
                    }
                });
                
                link.addEventListener("mouseleave", () => {
                    try {
                        cursor.classList.remove("large");
                        // Reset scale
                        cursor.style.transform = "scale(1)";
                    } catch (error) {
                        console.error("Error handling mouseleave on links:", error);
                    }
                });
            });
        } else {
            console.warn("No navigation links found for cursor interaction");
        }
    }
} catch (error) {
    console.error("Error initializing custom cursor:", error);
}

window.addEventListener('scroll', function() {
  var header = document.getElementById('header');
  var scrollPosition = window.scrollY;

  if (scrollPosition > 0) {
      header.classList.add('fixed');
  } else {
      header.classList.remove('fixed');
  }
});

navlinks.forEach((li, i) => {
    li.style.animationDelay = 0 + i * 140 + "ms";
})

const elements = document.querySelectorAll('.a1, .a2, .a3, .a4');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

elements.forEach(element => {
    observer.observe(element);
});

(function() {
  var follower, init, mouseX, mouseY, positionElement, printout, timer;

  follower = document.getElementById('follower');
  printout = document.getElementById('printout');

  mouseX = (event) => {
    return event.clientX;
  };

  mouseY = (event) => {
    return event.clientY;
  };

  positionElement = (event) => {
    var mouse;
    mouse = {
      x: mouseX(event),
      y: mouseY(event)
    };
    follower.style.top = mouse.y + 'px';
    return follower.style.left = mouse.x + 'px';
  };

  timer = false;

  window.onmousemove = init = (event) => {
    var _event;
    _event = event;
    return timer = setTimeout(() => {
      return positionElement(_event);
    }, 1);
  };

}).call(this);

var loadingBar = document.getElementById('loading-bar');
if (loadingBar) {
    loadingBar.remove();
}

/**
 * Enhanced viewport detection with more robust error handling
 * and partial visibility support for smoother animations
 */
function isInViewport(element) {
  try {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Element is partially visible (at least 40% of its height must be visible)
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.bottom - rect.top;
    const visiblePercentage = visibleHeight / elementHeight;
    
    return visiblePercentage > 0.4;
  } catch (error) {
    console.error("Error in isInViewport:", error);
    return false;
  }
}

/**
 * Enhanced scroll animation with error handling, performance optimization,
 * and staggered animation effects
 */
function animateOnScroll() {
  try {
    const sections = document.querySelectorAll('.animate-on-scroll');
    if (!sections || sections.length === 0) return;
    
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      sections.forEach((section, index) => {
        try {
          if (isInViewport(section)) {
            if (!section.classList.contains('animate')) {
              // Add staggered delay based on position
              section.style.animationDelay = (index * 0.15) + 's';
              section.classList.add('animate');
              
              // Add floating animation to elements that are already visible
              if (section.classList.contains('project') || section.classList.contains('skill-card')) {
                section.style.animation += ', floatAnimation 3s ease-in-out infinite';
              }
            }
          } else if (section.classList.contains('animate') && 
                    !section.classList.contains('animate-once')) {
            // Only remove animation if it's not meant to stay animated
            section.classList.remove('animate');
          }
        } catch (sectionError) {
          console.error("Error processing section:", sectionError);
        }
      });
    });
  } catch (error) {
    console.error("Error in animateOnScroll:", error);
  }
}

// Use debounced scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(animateOnScroll, 10);
});

// Initial animation check
window.addEventListener('load', animateOnScroll);

// Scroll to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  // Show/hide scroll button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) { // Show after scrolling 300px
      scrollToTopBtn.classList.add('show');
      scrollToTopBtn.classList.remove('hide');
    } else {
      scrollToTopBtn.classList.add('hide');
      scrollToTopBtn.classList.remove('show');
    }
  });
  
  // Smooth scroll to top when button is clicked
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});