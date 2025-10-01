// Tic-Tac-Toe Game Variables
const board = document.getElementById("board");
const cells = [];
let currentPlayer = "";
let playerSymbol = "X";
let computerSymbol = "O";
let gameActive = false;
let playerName = "";

// Custom Alert Modal Functions
/**
 * Displays a custom alert modal with message and appropriate icon based on game result.
 * @param {string} message - The message to display in the alert.
 * @param {boolean} isWin - Whether the alert is for a win (unused in current implementation).
 */
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

  // Reset animation after it completes
  setTimeout(() => {
    icon.style.animation = '';
  }, 600);
}

/**
 * Closes the custom alert modal.
 */
function closeCustomAlert() {
  const modal = document.getElementById('custom-alert');
  modal.classList.remove('show');
}

/**
 * Initializes and starts a new Tic-Tac-Toe game.
 * Randomly decides who goes first and clears the board.
 */
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

// Create Tic-Tac-Toe board cells and add click event listeners
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cells.push(cell);
  board.appendChild(cell);

  // Handle player move on cell click
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

// AI Functions for Tic-Tac-Toe
/**
 * Minimax algorithm to evaluate the best move for the computer.
 * @param {Array} board - Current state of the board.
 * @param {number} depth - Current depth in the game tree.
 * @param {boolean} isMaximizing - Whether to maximize or minimize the score.
 * @returns {number} The score of the board state.
 */
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

/**
 * Finds the best move for the computer using minimax.
 * @returns {number} The index of the best cell to play.
 */
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

/**
 * Checks if there's a winner or draw on the given board.
 * @param {Array} board - The board state to check.
 * @returns {string|null} 'X', 'O', 'draw', or null if no winner.
 */
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

// DOM Event Listeners and Animations
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