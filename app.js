"use strict";
// Gameboard Element Selector
const gameBoard = document.querySelector(".game-board")
const userInputElementInDOM = document.querySelector(`[name="userinput"]`)
//---------------------------------------------------------------------------------------------------------------------

//UX controls ------------  TYPEWRITER EFFECT 
const typewriter = function (word,elementSelector,delayLength=50,counter=0) {
	if (counter < word.length) {
		document.querySelector(elementSelector).textContent += word.charAt(counter)
		counter++;
		setTimeout(()=>typewriter(word,elementSelector,delayLength,counter), delayLength);
	}

}
//---------------------------------------------------------------------------------------------------------------------
// UX controls ------------ event handlers
document.querySelector("#start").onclick = function () {
	this.parentElement.dataset.display = "false"
	gameBoard.dataset.display = "true"

}
window.addEventListener("keypress",(e)=> e.keyCode === 32 && gameBoard.dataset.display === "true" && checkWordElementInDOM.click())
//----------------------------------- Game Logic Processing Starts From Here --------------------------------------------
const checkWordElementInDOM = document.querySelector("[data-check-word]")
checkWordElementInDOM.onclick = function (e) {
	controller.processPlayerAnswer(e)

}
//--------------------------------------------------------------------------------------------------------------------
//----------------------------------- MVC PATTERN STARTS HERE ------------------------------------------------------------
const controller = {
	processPlayerAnswer:function(eventObj){
	eventObj.preventDefault()
	const userInputValue = eventObj.target.form.userinput.value.trim().toLowerCase()
	if(userInputValue) model.checkCorrectAnswer(userInputValue)
	else view.showSnackBar("Input Can't be blank")
	}
}
// ------------------------------------------Helper function for Model --------------------------------------------------
// scrambler takes in either array or strings scrambles it an returns either an arr or string 
const scrambler = (item,dataTypeToBeReturned="string") => {
if (dataTypeToBeReturned === "string") return [...item].slice().sort(()=> Math.random() - 0.5).toString()
return [...item].slice().sort(()=> Math.random() - 0.5)

}
//- parse Next question
function nextQuestionParser(questionIndex) {
currentQuestionToBeDisplayedOnScreen = questionsToBeDisplayedOnScreen[questionIndex]
view.updateVirtualProgressTrackerInDom(questionIndex)
view.showCurrentQuestionToBeDisplayInDom(currentQuestionToBeDisplayedOnScreen)
}
//- Question Factory
function QuestionFactory(word,hint) {
	this.actualWord = word
	this.scrambledWord = scrambler(word)
	this.hint = hint
}
//----------------------------------------------------------------------------------------------------------------------
const model = {
	noOfCorrectAnswers: 0,
	questionsToBeDisplayed: [
		new QuestionFactory("control","To take over something"),
		new QuestionFactory("laptop","an electronic device that takes in data,process data and convert it into information"),
		new QuestionFactory("keyboard","a rectangular device used for typing"),
		new QuestionFactory("project","something you wanna work on"),
		new QuestionFactory("cartoon","an animated moving character that appears in a movie"),
		new QuestionFactory("calculator","an electronic device used for calculating"),
	],
	noOfQuestions: 6,
	checkCorrectAnswer:function (inputValue) {
	if(inputValue === currentQuestionToBeDisplayedOnScreen.actualWord) {
	view.gameResultModal("Success")
	 // this.nextQuestion()

	}else alert("Incorrect")
	},
	generateRandQuestions: function () {
	return scrambler(this.questionsToBeDisplayed,"array")
	},
	nextQuestion:function () {
	if (1+(+gameBoard.dataset.index) < questionsToBeDisplayedOnScreen.length){
	view.clearQuestionArea()
	nextQuestionParser(++gameBoard.dataset.index)
	}else alert("End of Game")
	 
	}
}
// ---------------------------------------- Helper functions for view ----------------------------------------
// - snackbar
function showSnackBarFn(msg) {
		const snackBar = document.querySelector('.snackBar')
		snackBar.textContent = msg
		snackBar.classList.add("show")
		setTimeout(()=>snackBar.classList.remove("show"),3000)
	}
// - observer
function intersectionObserver(scrambledWord) {
	const observer = new IntersectionObserver((entries)=> {
	if (entries[0].isIntersecting) {
		typewriter(scrambledWord,".container-body>h3")

	}
	})
	observer.observe(gameBoard)
}
//- variables for view
//- timer
let timer = 30
const timerInDom = document.querySelector(".game-info #timer");
const timerFn = () => timerInDom.textContent = --timer+"s";
// question arena
const hintElementInDom = document.querySelector(".game-info #hint")

const view = {
	showSnackBar: msg => showSnackBarFn(msg),
	showCurrentQuestionToBeDisplayInDom: function (questionsToBeDisplayed) {
	const {scrambledWord,hint} = questionsToBeDisplayed
	intersectionObserver(scrambledWord)
	view.activateTimer()
	hintElementInDom.textContent += hint

	},
	activateTimer:function() {
	const interval = setInterval(()=>timerFn(),1000)
	setTimeout(()=>{ 
		clearInterval(interval)	
		const timerMsgBody = document.querySelector(".game-info #time-left")
		timerMsgBody.innerHTML = `<strong style="color:tomato">Time out !!!</strong>`
		timerInDom.textContent = "";
	}, 31000); 
	},
	updateVirtualProgressTrackerInDom:function (index) {
	document.querySelector(".progress").style.width = (((1+(+index)) % 7/6)*100) +"%" 
	},
	clearQuestionArea:function () {
	hintElementInDom.textContent = ""
	document.querySelector(".container-body>h3").textContent = ""
	userInputElementInDOM.value = ""
	},
	gameResultModal:function (msg) {
	 const modal = document.querySelector(".result-modal")
	if (msg === "Success") {
	 modal.querySelector("p").textContent = "Correct !!!"
	 modal.querySelector("img").src = "img/right-decision.gif"
	 modal.querySelector("button").innerHTML = "Next &raquo;"
	 modal.querySelector("button").addEventListener("click",model.nextQuestion)
	 modal.classList.add("show")	
	 modal.querySelector("button").addEventListener("click",e=>e.target.parentElement.classList.remove("show"))
	}
	

	}

}

// init
typewriter("Word Scrable",".intro>h1",120)
const questionsToBeDisplayedOnScreen = model.generateRandQuestions()
const questionIndex = gameBoard.dataset.index
let currentQuestionToBeDisplayedOnScreen = questionsToBeDisplayedOnScreen[questionIndex]
view.showCurrentQuestionToBeDisplayInDom(currentQuestionToBeDisplayedOnScreen)
view.updateVirtualProgressTrackerInDom(questionIndex)
console.log(questionsToBeDisplayedOnScreen)
// console.log(`${1+(+questionIndex)} of 6`)
// ----------------------- Counter PROTOTYPE READY FOR USE -----------------------------``
// let time = 0
// const countdown = setInterval(()=>{
// 	time++
// 	console.log(time)
// if (time === 5) clearInterval(countdown)
// },1000)
