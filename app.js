function openTab(id) {
  document.querySelectorAll('.content').forEach(content => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  setTimeout(() => {
    document.getElementById(id).classList.add('active');
    document.getElementById(`btn-${id}`).classList.add('active');
  }, 100);
}

function responder(button, isCorrect) {
  // Localiza o contêiner pai do botão clicado
  const parent = button.closest('div');

  // Localiza o feedback dentro do contêiner pai
  const feedback = parent.querySelector('.feedback');

  // Define o texto e a cor do feedback com base na resposta
  if (isCorrect) {
    feedback.textContent = 'Correto!';
    feedback.style.color = 'green';
  } else {
    feedback.textContent = 'Errado! Tente novamente.';
    feedback.style.color = 'red';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const pairs = [
    {
      name: "abelha",
      image: "bee.png",
      text: "Inseto conhecido por produzir mel e viver em colmeias."
    },
    {
      name: "formiga",
      image: "ant.png",
      text: "Inseto famoso por sua força e vida em colônia."
    },
    {
      name: "borboleta",
      image: "butterfly.png",
      text: "Inseto com asas escamosas coloridas e metamorfose completa."
    },
    {
      name: "gafanhoto",
      image: "grasshopper.png",
      text: "Inseto com pernas traseiras adaptadas para saltar grandes distâncias."
    },
    {
      name: "joaninha",
      image: "ladybug.png",
      text: "Inseto colorido com pintinhas pretas, conhecido por combater pulgões."
    },
    {
      name: "vespa",
      image: "wasp.png",
      text: "Inseto com ferrão doloroso e corpo afilado, aparentado com as abelhas."
    },
    {
      name: "besouro",
      image: "beetle.png",
      text: "Inseto com élitros duros que protegem as asas traseiras."
    },
    {
      name: "mariposa",
      image: "moth.png",
      text: "Inseto noturno com asas peludas e corpo robusto, aparentado com as borboletas."
    }
  ];

  const memoryGame = document.getElementById("memory-game");
  const scoreDisplay = document.getElementById("score");
  const cards = [];
  let score = 0;

  // Criar cartas
  pairs.forEach(pair => {
    cards.push({ type: "image", name: pair.name, content: `<img src="${pair.image}" alt="${pair.name}">` });
    cards.push({ type: "text", name: pair.name, content: pair.text });
  });

  // Embaralhar
  cards.sort(() => 0.5 - Math.random());

  // Criar elementos no DOM
  cards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("memory-card");
    cardElement.dataset.name = card.name;

    cardElement.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-front"></div>
        <div class="memory-card-back">${card.content}</div>
      </div>
    `;
    memoryGame.appendChild(cardElement);
  });

  let flippedCards = [];
  let lockBoard = false;

  memoryGame.addEventListener("click", e => {
    const card = e.target.closest(".memory-card");
    if (!card || lockBoard || card.classList.contains("matched") || flippedCards.includes(card)) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      lockBoard = true;
      const [card1, card2] = flippedCards;
      const isMatch = card1.dataset.name === card2.dataset.name && card1 !== card2;

      setTimeout(() => {
        if (isMatch) {
          card1.classList.add("matched");
          card2.classList.add("matched");
          score++;
          scoreDisplay.textContent = score;
          if (score === pairs.length) {
            alert("Parabéns! Você encontrou todos os pares! 🐞");
          }
        } else {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
        }
        flippedCards = [];
        lockBoard = false;
      }, 700);
    }
  });
});

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

  // Embaralha de forma mais eficiente
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

      const img = document.createElement("img");
      img.src = src;
      img.alt = src;
      img.draggable = true;
      img.classList.add("puzzle-piece");
      img.dataset.index = index;

      img.addEventListener("dragstart", dragStart);
      img.addEventListener("dragover", dragOver);
      img.addEventListener("drop", dropPiece);

      pieceContainer.appendChild(img);
      puzzleContainer.appendChild(pieceContainer);
    });
  }

  let draggedIndex = null;

  function dragStart(e) {
    draggedIndex = +e.target.dataset.index;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dropPiece(e) {
    const targetIndex = +e.target.dataset.index;
    if (draggedIndex === null || targetIndex === null || draggedIndex === targetIndex) return;

    [pieceOrder[draggedIndex], pieceOrder[targetIndex]] = [pieceOrder[targetIndex], pieceOrder[draggedIndex]];
    moves++;
    movesDisplay.textContent = moves;

    // Verifica antes de redesenhar
    if (JSON.stringify(pieceOrder) === JSON.stringify(correctOrder)) {
      setTimeout(() => alert("Parabéns! Você montou o lagostim!"), 200);
    }

    renderPuzzle();
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
