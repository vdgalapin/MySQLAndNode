let grid = document.querySelector(".grid");
let scoreDisplay = document.querySelector(".scoredisplay");

let down = document.querySelector(".down");
let up = document.querySelector(".up");
let right = document.querySelector(".right");
let left = document.querySelector(".left");

let width = 10;
let currentIndex = 0;
let appleIndex = 0;
let currentSnake = [2, 1, 0];
// 1 right -1 left -10 Up 10 is down 
let direction = 1;
let score = 0;
let speed = 0.8;
let intervalTime = 0;
let interval = 0;

up.addEventListener("click", () => direction = -width);
down.addEventListener("click", () => direction = width);
left.addEventListener("click", () => direction = -1);
right.addEventListener("click", () => direction = 1);


document.addEventListener("DOMContentLoaded", function() {
    document.onkeydown = control;
    createBoard();
    startGame();
    // playAgain.addEventListener("click", replay);
})

function createBoard() {
    for(let i = 0; i < 100; i++) {
        let div = document.createElement('div');
        div.id = i;
        grid.appendChild(div);
    }
}


function startGame() {

    let squares = document.querySelectorAll(".grid div");
    randomApple(squares);

    direction = 1;
    scoreDisplay.innerHTML = score;
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentIndex = 0;

    // to display the snake. We will loop over 
    currentSnake.forEach((index) => squares[index].classList.add("snake"));

    interval = setInterval(moveOutcome, intervalTime)
}

function moveOutcome() {
    let squares = document.querySelectorAll(".grid div");
    if(checkForHits(squares)) {
        gameScoreKept()
        alert("you hit the wall!");
        playGameAgain();
        return clearInterval(interval);
    } else {
        moveSnake(squares);
    }
}

function moveSnake(squares) {

    // movement starts here
    let tail = currentSnake.pop();

    // removes element at the beginning of the list
    squares[tail].classList.remove("snake");

    // adds element at the beginning of the list
    currentSnake.unshift(currentSnake[0] + direction);
    // movement ends here

    eatApple(squares, tail);
    squares[currentSnake[0]].classList.add("snake");
}

function checkForHits(squares) {
    if(
        (currentSnake[0] + width >= width * width && direction === width) || //  if the head hits the bottom border
        (currentSnake[0] % width === width - 1 && direction === 1) || //  if it hits toward the righ wall
        (currentSnake[0] % width === 0 && direction === -1 ) || // if it hits left the up wall
        (currentSnake[0] % width === 0 && direction == -width) || // if it hits up the left wall
        squares[currentSnake[0] + direction].classList.contains("snake") // if it hits itself
    ) {
        return true;
    } else {
        return false;
    }
}

function eatApple(squares, tail) {
    if(squares[currentSnake[0]].classList.contains("apple")) {
        squares[currentSnake[0]].classList.remove("apple");
        squares[tail].classList.add("snake");
        currentSnake.push(tail);
        
        randomApple(squares);

        score++;
        scoreDisplay.textContent = score;

        clearInterval(interval);

        intervalTime = intervalTime * speed;
        interval = setInterval(moveOutcome, intervalTime);
    }
}

function randomApple(squares) {
    do {
        appleIndex = Math.floor(Math.random() * squares.length); 
    } while(squares[appleIndex].classList.contains("snake"));

    squares[appleIndex].classList.add("apple");

}


function control(e) {
    console.log('key: ' + e);
    if (e.keyCode === 39) {
        direction = 1; // right
    } else if(e.keyCode === 38) {
        direction = -width // up
    } else if (e.keyCode === 37) {
        direction = -1 // left
    } else if (e.keyCode == 40) {
        direction = +width // down
    }

}

function replay() {
    let popup = document.querySelector(".popup");
    popup.style.display = "none";
    grid.innerHTML = "";
    createBoard();
    startGame();
}


function gameScoreKept() {
    if (score > 0 ) {
        inserToScoreTable();
        gameScore(score, document.getElementById("gameID").value, document.getElementById("username").value);
    }
}

function inserToScoreTable() {
    $($("#HighScoreTable tbody tr .score").get().reverse()).each(function(index) {
        var scores = this.children[0].innerHTML;
        if (scores <= score) {

            var date = new Date();
            var current_date = date.toJSON().slice(0, 10).replaceAll('-', '');
            var current_time = date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();

            var row = '<tr>' + 
                '<th score="row"> <div align="center"> ' + document.getElementById("username").value + ' </div> </th>' +
                '<td class="score"> <div align="center"> ' + score + ' </div> </td>' +
                '<td> <div align="center"> ' + current_date  + ' </div> </td>' +
                '<td> <div align="center"> ' + current_time + ' </div> </td>' +
                '</tr>';
            $(this).parent().after(row);
            return;
        }
      });
}