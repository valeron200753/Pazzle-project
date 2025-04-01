document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".puzzle-container");
    const imageLoader = document.getElementById("imageLoader");
    let img = new Image();
    
    let rows = 6, cols = 4; // Можна змінити на іншу кількість шматків
    let pieces = [], pieceWidth, pieceHeight, placedPieces = 0;

    imageLoader.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    img.onload = function () {
        setupPuzzle();
    };

    function setupPuzzle() {
        container.innerHTML = ""; // Очистити попередній пазл
        placedPieces = 0;
        pieces = [];

        container.style.width = `${img.width}px`;
        container.style.height = `${img.height}px`;
        container.style.backgroundImage = `url(${img.src})`;
        container.style.backgroundSize = `${img.width}px ${img.height}px`;
        
        pieceWidth = img.width / cols;
        pieceHeight = img.height / rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let piece = document.createElement("div");
                piece.classList.add("puzzle-piece");
                piece.style.width = `${pieceWidth}px`;
                piece.style.height = `${pieceHeight}px`;
                piece.style.backgroundImage = `url(${img.src})`;
                piece.style.backgroundSize = `${img.width}px ${img.height}px`;
                piece.style.backgroundPosition = `-${j * pieceWidth}px -${i * pieceHeight}px`;
                piece.dataset.row = i;
                piece.dataset.col = j;

                // Випадкове розташування
                piece.style.left = `${Math.random() * (img.width - pieceWidth)}px`;
                piece.style.top = `${Math.random() * (img.height - pieceHeight)}px`;

                makeDraggable(piece);
                container.appendChild(piece);
                pieces.push(piece);
            }
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
        const correctX = piece.dataset.col * pieceWidth;
        const correctY = piece.dataset.row * pieceHeight;
        const tolerance = pieceWidth * 0.1; // Допускаємо 10% похибки

        let currentX = parseInt(piece.style.left);
        let currentY = parseInt(piece.style.top);

        if (Math.abs(currentX - correctX) <= tolerance && Math.abs(currentY - correctY) <= tolerance) {
            piece.style.left = `${correctX}px`;
            piece.style.top = `${correctY}px`;
            piece.style.pointerEvents = "none";
            placedPieces++;

            if (placedPieces === rows * cols) {
                setTimeout(() => alert("Вітаю! Ви зібрали пазл!"), 200);
            }
        }
    }
});
