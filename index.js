const board = document.getElementById("board");
const cells = [];
let currentPlayer = "";
let playerSymbol = "X";
let computerSymbol = "O";
let gameActive = false;
let playerName = ""; 

// Custom Alert Modal Functions
function showCustomAlert(message, isWin = false) {
  const modal = document.getElementById('custom-alert');
  const messageEl = document.getElementById('alert-message');
  const icon = document.getElementById('alert-icon');
  
  messageEl.textContent = message;
  
  // Change icon based on result
  if (message.includes('Win') || message === 'You Win!') {
    icon.innerHTML = '🏆';
    icon.style.animation = 'bounce 0.6s ease';
  } else if (message.includes('draw')) {
    icon.innerHTML = '🤝';
    icon.style.animation = 'shake 0.5s ease';
  } else {
    icon.innerHTML = '😔';
    icon.style.animation = 'fadeIn 0.5s ease';
  }
  
  modal.classList.add('show');
  
  // Reset animation
  setTimeout(() => {
    icon.style.animation = '';
  }, 600);
}

function closeCustomAlert() {
  const modal = document.getElementById('custom-alert');
  modal.classList.remove('show');
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

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !homeSection.classList.contains("active")) {
            homeSection.classList.add("active");
        }
    }, { threshold: 0 });

    observer.observe(homeSection);
});

document.addEventListener('DOMContentLoaded', function () {
    const target = document.querySelector('#projects');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const callback = function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.project').forEach(function (project, index) {
            project.classList.add('animate');
          });
          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);
});

window.addEventListener('load', function() {
    document.body.style.display = 'block';
});

const cursor = document.querySelector(".cursor");
const links = document.querySelectorAll("nav ul li a");
const navlinks = document.querySelectorAll("nav ul li");

document.addEventListener("mousemove", (e) => {
    let leftPosition = e.pageX + 4;
    let topPosition = e.pageY + 4;

    cursor.style.left = leftPosition + "px";
    cursor.style.top = topPosition + "px";
})

links.forEach(link => {
    link.addEventListener("mouseenter", () => {
        cursor.classList.add("large");
    })
})

links.forEach(link => {
    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("large");
    })
})

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

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function animateOnScroll() {
  const sections = document.querySelectorAll('.animate-on-scroll');
  sections.forEach((section) => {
    if (isInViewport(section)) {
      section.classList.add('animate');
    } else {
      section.classList.remove('animate');
    }
  });
}

window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

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

// Progressive enhancement: make non-hero images lazy by default to improve performance
document.addEventListener('DOMContentLoaded', function() {
  var hero = document.getElementById('home');
  var images = document.querySelectorAll('img');
  images.forEach(function(img) {
    var insideHero = hero && hero.contains(img);
    if (!insideHero) {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    }
    // Attach error fallback to show inline 404 placeholder for missing images
    if (!img._hasErrorHandler) {
      img.addEventListener('error', function onErr() {
        var w = img.clientWidth || img.width || 300;
        var h = img.clientHeight || img.height || 180;
        // Build SVG then base64-encode to avoid encoding issues
        var svgStr = (
          '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 300 180">'
          + '<defs><style>text{font-family:Arial,Helvetica,sans-serif}</style></defs>'
          + '<rect width="100%" height="100%" fill="#eeeeee"/>'
          + '<rect x="8" y="8" width="284" height="164" rx="8" ry="8" fill="none" stroke="#cc0000" stroke-width="4"/>'
          + '<text x="150" y="85" fill="#222222" font-size="44" text-anchor="middle" dominant-baseline="middle">404</text>'
          + '<text x="150" y="120" fill="#666666" font-size="16" text-anchor="middle" dominant-baseline="middle">Image not found</text>'
          + '</svg>'
        );
        var svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
        // Clear srcset/sizes to prevent the browser from retrying with other candidates
        if (img.getAttribute('srcset')) img.setAttribute('srcset', '');
        if (img.getAttribute('sizes')) img.setAttribute('sizes', '');
        // Apply placeholder
        img.src = svgBase64;
        img.alt = img.alt || '404 - Image not found';
        img.setAttribute('data-fallback', 'true');
        img.style.backgroundColor = '#eeeeee';
        img.style.objectFit = 'contain';
        img.removeEventListener('error', onErr);
      }, { once: true });
      img._hasErrorHandler = true;
    }
  });
});

// Theme toggling: persist in localStorage and respect prefers-color-scheme
document.addEventListener('DOMContentLoaded', function() {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    if (toggle) {
      toggle.textContent = theme === 'light' ? '🌞' : '🌙';
      toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      toggle.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }
  }

  var saved = localStorage.getItem('theme');
  var initial = saved || getSystemPreference();
  applyTheme(initial);

  if (toggle) {
    toggle.addEventListener('click', function() {
      var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // React to system changes if user hasn't explicitly chosen
  if (!saved && window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener ? mq.addEventListener('change', function(e) {
      applyTheme(e.matches ? 'light' : 'dark');
    }) : mq.addListener(function(e) {
      applyTheme(e.matches ? 'light' : 'dark');
    });
  }
});