const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
let scoreDisplay = document.querySelector(".scoredisplay");

score = 0;
scoreDisplay.innerHTML = score;

function jump() {
    if (dispatchEvent.classList != "jump") {
        // First it checks if the dino is mid-jump. If not, it makes it jump.
        dino.classList.add("jump");
        
        setTimeout(function() {
            dino.classList.remove("jump");
            // removes the jump class from dino once it has jump
           
        }, 500);
    }
}

let checkAlive = setInterval(function() {
    let dinoTop = parseInt(
        window.getComputedStyle(dino).getPropertyValue("top")
    );

    let cactusLeft = parseInt(
        window.getComputedStyle(cactus).getPropertyValue("left")
    );

    if(cactusLeft > 0 && cactusLeft < 60 && dinoTop >= 239) {
        dino.style.animationPlayState = "paused";
        cactus.style.animationPlayState = "paused";
        gameScoreKept();
        alert("ouch!");
        playGameAgain();
    } else {
        if ((cactusLeft < 0) && (dino.classList.contains("jump"))) {
            scoreDisplay.innerHTML = score++;
        }
    } 


}, 10 );

document.addEventListener("keydown", function(event) {
    jump();
});


function gameScoreKept() {
    if (score > 0 ) {
        inserToScoreTable();
        gameScore(score, document.getElementById("gameID").value, document.getElementById("username").value);
    }
}

function replay() {
    let popup = document.querySelector(".popup");
    popup.style.display = "none";

    score = 0;
    scoreDisplay.innerHTML = score;
    dino.style.animationPlayState = "running";
    cactus.style.animationPlayState = "running";

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