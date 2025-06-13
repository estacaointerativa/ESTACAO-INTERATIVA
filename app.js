document.addEventListener("DOMContentLoaded", () => {
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

  const pieceOrder = shuffle(correctOrder);

  function renderPuzzle() {
    puzzleContainer.innerHTML = "";
    pieceOrder.forEach((src, index) => {
      const pieceContainer = document.createElement("div");
      pieceContainer.className = "puzzle-piece-container";
      pieceContainer.dataset.index = index;

      const img = document.createElement("img");
      img.src = src;
      img.alt = src;
      img.classList.add("puzzle-piece");
      img.draggable = false;
      img.setAttribute("unselectable", "on");
      img.setAttribute("aria-hidden", "true");
      img.style.userSelect = "none";
      img.style.webkitUserDrag = "none";
      img.style.touchAction = "manipulation";
      img.setAttribute("role", "presentation");

      pieceContainer.appendChild(img);
      puzzleContainer.appendChild(pieceContainer);
    });

    document.querySelectorAll(".puzzle-piece-container").forEach(container => {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", handleTouchEnd);

      container.addEventListener("dragstart", handleDragStart);
      container.addEventListener("dragover", handleDragOver);
      container.addEventListener("drop", handleDrop);
    });
  }

  let draggedIndex = null;
  let touchStartTarget = null;

  function handleDragStart(e) {
    draggedIndex = +e.currentTarget.dataset.index;
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    const targetIndex = +e.currentTarget.dataset.index;
    if (draggedIndex === null || targetIndex === null || draggedIndex === targetIndex) return;

    [pieceOrder[draggedIndex], pieceOrder[targetIndex]] = [pieceOrder[targetIndex], pieceOrder[draggedIndex]];
    moves++;
    movesDisplay.textContent = moves;

    if (JSON.stringify(pieceOrder) === JSON.stringify(correctOrder)) {
      setTimeout(() => alert("Parabéns! Você montou o lagostim!"), 200);
    }

    renderPuzzle();
  }

  function handleTouchStart(e) {
    touchStartTarget = e.currentTarget;
  }

  function handleTouchMove(e) {
    e.preventDefault();
  }

  function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const touchEndTarget = document.elementFromPoint(touch.clientX, touch.clientY)?.closest(".puzzle-piece-container");

    if (touchStartTarget && touchEndTarget && touchStartTarget !== touchEndTarget) {
      const startIndex = +touchStartTarget.dataset.index;
      const endIndex = +touchEndTarget.dataset.index;

      [pieceOrder[startIndex], pieceOrder[endIndex]] = [pieceOrder[endIndex], pieceOrder[startIndex]];
      moves++;
      movesDisplay.textContent = moves;

      if (JSON.stringify(pieceOrder) === JSON.stringify(correctOrder)) {
        setTimeout(() => alert("Parabéns! Você montou o lagostim!"), 200);
      }

      renderPuzzle();
    }
  }

  document.getElementById("reset-puzzle").addEventListener("click", () => {
    pieceOrder.length = 0;
    pieceOrder.push(...shuffle(correctOrder));
    moves = 0;
    movesDisplay.textContent = moves;
    renderPuzzle();
  });

  renderPuzzle();
});
