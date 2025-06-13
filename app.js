// QUEBRA-CABEÇA FUNCIONAL
const puzzleContainer = document.getElementById("puzzle-container");
const movesDisplay = document.getElementById("puzzle-moves");
let moves = 0;

const correctOrder = [
  "posicao1.png", "posicao2.png", "posicao3.png",
  "posicao4.png", "posicao5.png", "posicao6.png",
  "posicao7.png", "posicao8.png", "posicao9.png",
  "posicao10.png", "posicao11.png", "posicao12.png",
  "posicao13.png", "posicao14.png", "posicao15.png"
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let pieceOrder = shuffle(correctOrder);

function renderPuzzle() {
  puzzleContainer.innerHTML = "";
  pieceOrder.forEach((src, index) => {
    const pieceContainer = document.createElement("div");
    pieceContainer.className = "puzzle-piece-container";
    pieceContainer.dataset.index = index;

    const img = document.createElement("img");
    img.src = src;
    img.alt = src;
    img.draggable = true;
    img.classList.add("puzzle-piece");

    pieceContainer.appendChild(img);
    puzzleContainer.appendChild(pieceContainer);

    // DRAG AND DROP
    pieceContainer.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
    });

    pieceContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    pieceContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      const toIndex = index;

      if (fromIndex === toIndex) return;

      [pieceOrder[fromIndex], pieceOrder[toIndex]] = [pieceOrder[toIndex], pieceOrder[fromIndex]];
      moves++;
      movesDisplay.textContent = moves;

      if (JSON.stringify(pieceOrder) === JSON.stringify(correctOrder)) {
        setTimeout(() => alert("Parabéns! Você montou o lagostim! 🦞"), 100);
      }

      renderPuzzle();
    });
  });
}

document.getElementById("reset-puzzle").addEventListener("click", () => {
  pieceOrder = shuffle(correctOrder);
  moves = 0;
  movesDisplay.textContent = moves;
  renderPuzzle();
});

renderPuzzle();
