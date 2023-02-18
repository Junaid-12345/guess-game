const gameTitle = "S J S J S F K E N";
let counter = 0;
const gameBoard = document.querySelector(".game-board")
const typewriter = function () {
	if (counter < gameTitle.length) {
		document.querySelector(".container-body>h3").textContent += gameTitle.charAt(counter)
		counter++;
		setTimeout(typewriter, 50);
	}
}

const observer = new IntersectionObserver((entries)=> entries.forEach((item)=>{
	if (item.isIntersecting) typewriter()
}))
observer.observe(gameBoard)

document.querySelector("[data-check-word]").onclick = function () {
	alert("ss")
}
document.querySelector("#start").onclick = function () {
	this.parentElement.style.display = "none"
	document.querySelector(".game-board").style.display = "block"
}