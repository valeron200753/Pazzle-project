document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".puzzle-container");
    const pieces = [];
    const rows = 3, cols = 3;
    let placedPieces = 0;

    // Створення шматків пазлу
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let piece = document.createElement("div");
            piece.classList.add("puzzle-piece");
            piece.style.backgroundPosition = `-${j * 100}px -${i * 100}px`;
            piece.dataset.row = i;
            piece.dataset.col = j;

            // Випадкове розміщення шматка
            piece.style.left = `${Math.random() * 200}px`;
            piece.style.top = `${Math.random() * 200}px`;

            makeDraggable(piece);
            container.appendChild(piece);
            pieces.push(piece);
        }
    }

    function makeDraggable(piece) {
        let offsetX, offsetY, isDragging = false;

        piece.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - piece.offsetLeft;
            offsetY = e.clientY - piece.offsetTop;
            piece.style.zIndex = 1000;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                piece.style.left = `${e.clientX - offsetX}px`;
                piece.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                piece.style.zIndex = 1;
                checkPosition(piece);
            }
        });
    }

    function checkPosition(piece) {
        const correctX = piece.dataset.col * 100;
        const correctY = piece.dataset.row * 100;
        const tolerance = 10;

        let currentX = parseInt(piece.style.left);
        let currentY = parseInt(piece.style.top);

        if (Math.abs(currentX - correctX) <= tolerance && Math.abs(currentY - correctY) <= tolerance) {
            piece.style.left = `${correctX}px`;
            piece.style.top = `${correctY}px`;
            piece.style.pointerEvents = "none"; // Блокування переміщення правильно встановленого шматка
            placedPieces++;

            if (placedPieces === rows * cols) {
                setTimeout(() => alert("Вітаю! Ви зібрали пазл!"), 200);
            }
        }
    }
});