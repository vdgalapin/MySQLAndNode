let popup = document.querySelector(".popup");
let playAgain = document.querySelector(".playAgain");

function playGameAgain() {
    popup.style.display = "flex";
}

playAgain.addEventListener("click", replay);