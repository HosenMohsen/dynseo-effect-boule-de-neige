const arrowsData = ['→', '↓', '←', '↑']; 
const gameContainer = document.getElementById('game-container');
const containerWidth = gameContainer.clientWidth;
const containerHeight = gameContainer.clientHeight;
const minDistance = 100; 

let positions = []; 
let directions = []; 
let score = 0; 


const timerElement = document.getElementById('timer');
let timeLeft = 100;  
const timerInterval = setInterval(updateTimer, 1000);  

const scoreContainer = document.getElementById('score-container');


function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        clearInterval(timerInterval);
        showFinalScore();  
    }
}


function getRandomPosition() {
    const x = Math.floor(Math.random() * (containerWidth - 50));  
    const y = Math.floor(Math.random() * (containerHeight - 50));
    return { x, y };
}


function isTooClose(newPos, existingPositions) {
    for (let pos of existingPositions) {
        const distance = Math.sqrt(Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2));
        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}


function generateArrowPath() {
    positions = []; 
    directions = []; 

    
    let startX = Math.floor(Math.random() * (containerWidth - 50)) + 50;
    let startY = Math.floor(Math.random() * (containerHeight - 50)) + 50;
    positions.push({ x: startX, y: startY });

    let currentPos = { x: startX, y: startY };
    let usedDirections = [];

    let direction = arrowsData[Math.floor(Math.random() * arrowsData.length)];
    directions.push(direction);
    usedDirections.push(direction);

    
    for (let i = 0; i < 3; i++) {
        let newX = currentPos.x;
        let newY = currentPos.y;

        
        if (direction === '→') newX = Math.min(newX + 100, containerWidth - 50);
        else if (direction === '↓') newY = Math.min(newY + 100, containerHeight - 50);
        else if (direction === '←') newX = Math.max(newX - 100, 50);
        else if (direction === '↑') newY = Math.max(newY - 100, 50);

   
        currentPos = { x: newX, y: newY };

        while (isTooClose(currentPos, positions)) {
        
            currentPos = getRandomPosition();
        }

        positions.push(currentPos);

   
        direction = arrowsData[Math.floor(Math.random() * arrowsData.length)];
        directions.push(direction);
    }

  
    for (let i = 0; i < 4; i++) {
        const arrow = document.createElement('div');
        arrow.classList.add('arrow');
        
   
        arrow.textContent = directions[i];
        arrow.style.left = `${positions[i].x}px`;
        arrow.style.top = `${positions[i].y}px`;

   
        arrow.addEventListener('click', async () => {
            if (i === 0) {
                score++;  
                scoreContainer.textContent = `Score: ${score}`; 
                await showBallAnimation();  
                alert("Bien joué, tu as trouvé la bonne flèche !");  
            } else {
                alert("Dommage réessaye encore !");  
            }

            
            resetGame();
        });

       
        gameContainer.appendChild(arrow);
    }
}


async function showBallAnimation() {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.left = `${positions[0].x}px`;
    ball.style.top = `${positions[0].y}px`;
    gameContainer.appendChild(ball);

    let ballIndex = 0;
    while (ballIndex < positions.length - 1) {
        ballIndex++;
        ball.style.left = `${positions[ballIndex].x}px`;
        ball.style.top = `${positions[ballIndex].y}px`;
        await new Promise(resolve => setTimeout(resolve, 300));  
    }
}


function showFinalScore() {
    
    const finalScoreElement = document.createElement('div');
    finalScoreElement.classList.add('final-score');
    finalScoreElement.textContent = `Score Final: ${score}`;

    
    finalScoreElement.style.position = 'absolute';
    finalScoreElement.style.left = '50%';
    finalScoreElement.style.top = '50%';
    finalScoreElement.style.transform = 'translate(-50%, -50%)';
    finalScoreElement.style.fontSize = '3rem';
    finalScoreElement.style.color = 'white';
    finalScoreElement.style.backgroundColor = 'black';
    finalScoreElement.style.padding = '20px';
    finalScoreElement.style.borderRadius = '10px';

 
    gameContainer.appendChild(finalScoreElement);

 
    setTimeout(() => {
        resetGame();  
    }, 3000);  
}


function resetGame() {
    
    scoreContainer.textContent = `Score: ${score}`;

  
    gameContainer.innerHTML = '';

   
    if (timeLeft > 0) {
        generateArrowPath();
    }
}


generateArrowPath();
