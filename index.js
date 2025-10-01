const board = document.getElementById("board");
const cells = [];
let currentPlayer = "";
let playerSymbol = "X";
let computerSymbol = "O";
let gameActive = false;
let playerName = "";

function startGame() {
  gameActive = true;

  if (Math.random() < 0.5) {
    currentPlayer = "Your";
  } else {
    currentPlayer = "Raj's";
    setTimeout(computerMove, 500);
  }

  document.getElementById(
    "turn-info"
  ).textContent = `${currentPlayer} turn (you are "${playerSymbol}")`;

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
        document.getElementById("turn-info").textContent = "You Won!";
        gameActive = false;
      } else if (cells.every((cell) => cell.textContent !== "")) {
        document.getElementById("turn-info").textContent = "It's a draw!";
        gameActive = false;
      } else {
        currentPlayer = "Raj's";
        document.getElementById(
          "turn-info"
        ).textContent = `${currentPlayer} turn`;
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
      document.getElementById("turn-info").textContent = "Raj Won!";
      gameActive = false;
    } else if (cells.every((cell) => cell.textContent !== "")) {
      document.getElementById("turn-info").textContent = "It's a draw!";
      gameActive = false;
    } else {
      currentPlayer = "Your";
      document.getElementById(
        "turn-info"
      ).textContent = `${currentPlayer} turn (you are "${playerSymbol}")`;
    }
  }
}

function resetBoard() {
  gameActive = false;
  cells.forEach((cell) => (cell.textContent = ""));
  currentPlayer = "Your";
  document.getElementById(
    "turn-info"
  ).textContent = `${currentPlayer} turn (you are "${playerSymbol}")`;
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
      const score = minimax(
        cells.map((cell) => cell.textContent),
        0,
        false
      );
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

// function slider(input) {
//                     // const item = document.querySelector(`#${input}`);
//                     // const slideArr = document.querySelectorAll(".slides");
//                     // const slideArr = [...document.querySelector(".slides").children];

//                     // slideArr.forEach((element) => element.classList.remove("active"));
//                     // item.classList.add("active");

//                     const item = document.querySelector(`#${input}`);
//                     const slideArr = document.querySelectorAll(".slides");

//                     if (item && slideArr) {
//                         slideArr.forEach((element) => element.classList.remove("active"));
//                         item.classList.add("active");
//                     } else {
//                         console.error("Slider elements not found");
//                     }

//                   }

//                   let slideIndex = 1;
//                   setInterval(() => {
//                     slideIndex++;
//                     if (slideIndex === 7)
//                     slideIndex = 1;
//                     slider(`slide${slideIndex}`);
//                   }, 2000);
//                   document.addEventListener("DOMContentLoaded", function () {
//                         var container = document.querySelector(".container");
//                         var scrollThreshold = container.offsetTop;

//                         window.addEventListener("scroll", function () {
//                           if (window.pageYOffset > scrollThreshold) {
//                             container.classList.add("fixed");
//                           } else {
//                             container.classList.remove("fixed");
//                           }
//                         });
//                       });

// document.addEventListener("DOMContentLoaded", function () {
//                 const textElements = [
//                 "Text for Slide 1",
//                 "Text for Slide 2",
//                 "Text for Slide 3",
//                 "Text for Slide 4",
//                 "Text for Slide 5",
//                 "Text for Slide 6",
//                 ];

//                 let currentSlideIndex = 0;
//                 const textContainer = document.getElementById("text-container");

//                 function typeWriter() {
//                 if (currentSlideIndex < textElements.length) {
//                     const currentText = textElements[currentSlideIndex];
//                     const currentSlide = document.getElementById(`slide${currentSlideIndex + 1}`);
//                     const overlay = currentSlide.querySelector(".overlay div");

//                     let charIndex = 0;
//                     function type() {
//                     if (charIndex < currentText.length) {
//                         overlay.textContent += currentText.charAt(charIndex);
//                         charIndex++;
//                         setTimeout(type, 50);
//                     } else {
//                         setTimeout(erase, 1000);
//                     }
//                     }

//                     function erase() {
//                     if (charIndex > 0) {
//                         overlay.textContent = currentText.substring(0, charIndex - 1);
//                         charIndex--;
//                         setTimeout(erase, 30);
//                     } else {
//                         currentSlideIndex++;
//                         setTimeout(typeWriter, 500);
//                     }
//                     }

//                     type();
//                 }
//                 }
//                 typeWriter();
//             });

document.addEventListener("DOMContentLoaded", function () {
  var homeSection = document.getElementById("home");

  var observer = new IntersectionObserver(
    function (entries) {
      if (
        entries[0].isIntersecting &&
        !homeSection.classList.contains("active")
      ) {
        homeSection.classList.add("active");
      }
    },
    { threshold: 0 }
  );

  observer.observe(homeSection);
});

document.addEventListener("DOMContentLoaded", function () {
  // Select the target node
  const target = document.querySelector("#projects");

  // Set up the Intersection Observer options
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // Adjust the threshold as needed
  };

  // Callback function to handle the intersection changes
  const callback = function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // If the section is in view, add the "animate" class to each project
        document
          .querySelectorAll(".project")
          .forEach(function (project, index) {
            project.classList.add("animate");
          });

        // Disconnect the observer once animation is triggered
        observer.disconnect();
      }
    });
  };

  // Create an Intersection Observer
  const observer = new IntersectionObserver(callback, options);

  // Start observing the target node
  observer.observe(target);
});

window.addEventListener("load", function () {
  // After the page has fully loaded, show the content
  document.body.style.display = "block";
});

//
const cursor = document.querySelector(".cursor");
const links = document.querySelectorAll("nav ul li a");
const navlinks = document.querySelectorAll("nav ul li");

document.addEventListener("mousemove", (e) => {
  let leftPosition = e.pageX + 4;
  let topPosition = e.pageY + 4;

  cursor.style.left = leftPosition + "px";
  cursor.style.top = topPosition + "px";
});

links.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cursor.classList.add("large");
  });
});

links.forEach((link) => {
  link.addEventListener("mouseleave", () => {
    cursor.classList.remove("large");
  });
});

// Animation
window.addEventListener("scroll", function () {
  var header = document.getElementById("header");
  var scrollPosition = window.scrollY;

  if (scrollPosition > 0) {
    header.classList.add("fixed");
  } else {
    header.classList.remove("fixed");
  }
});

navlinks.forEach((li, i) => {
  li.style.animationDelay = 0 + i * 140 + "ms";
});
const elements = document.querySelectorAll(".a1, .a2, .a3, .a4");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

elements.forEach((element) => {
  observer.observe(element);
});

(function () {
  var follower, init, mouseX, mouseY, positionElement, printout, timer;

  follower = document.getElementById("follower");

  printout = document.getElementById("printout");

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
      y: mouseY(event),
    };
    follower.style.top = mouse.y + "px";
    return (follower.style.left = mouse.x + "px");
  };

  timer = false;

  window.onmousemove = init = (event) => {
    var _event;
    _event = event;
    return (timer = setTimeout(() => {
      return positionElement(_event);
    }, 1));
  };
}).call(this);

var loadingBar = document.getElementById("loading-bar");
if (loadingBar) {
  loadingBar.remove();
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to add animation class when section is in viewport
function animateOnScroll() {
  const sections = document.querySelectorAll(".animate-on-scroll");
  sections.forEach((section) => {
    if (isInViewport(section)) {
      section.classList.add("animate");
    } else {
      section.classList.remove("animate");
    }
  });
}

// Initial check when page loads
window.addEventListener("load", animateOnScroll);
// Check when scrolling
window.addEventListener("scroll", animateOnScroll);
