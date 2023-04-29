"use strict";
// Gameboard Element Selector
const gameBoardInDom = document.querySelector(".game-board")
const userInputElementInDOM = document.querySelector(`[name="userinput"]`)
const timerMsgBodyInDom = document.querySelector(".game-info #time-left")
const timerInDom = document.querySelector(".game-info #timer");
const resultModalInDom = document.querySelector(".result-modal")
const hintElementInDom = document.querySelector(".game-info #hint")

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
	new Audio("sounds/data-reveal-sound.mp3").play()
	this.parentElement.dataset.display = "false"
	gameBoardInDom.dataset.display = "true"

}
window.addEventListener("keypress",e => e.keyCode === 32 && gameBoardInDom.dataset.display === "true" && checkWordElementInDOM.click())
//----------------------------------- Game Logic Processing Starts From Here --------------------------------------------
const checkWordElementInDOM = document.querySelector("[data-check-word]")
checkWordElementInDOM.onclick =  e => controller.processPlayerAnswer(e)
//--------------------------------------------------------------------------------------------------------------------
//----------------------------------- MVC PATTERN STARTS HERE ------------------------------------------------------------
let countdownID;
const controller = {
	processPlayerAnswer:function(eventObj){
	eventObj.preventDefault()
	const userInputValue = eventObj.target.form.userinput.value.trim().toLowerCase()
	if(userInputValue) model.checkCorrectAnswer(userInputValue)
	else view.showSnackBar("Input Can't be blank")
	},
	activateTimer:function() {
		countdownID && clearInterval(countdownID)
		let timer = 30
		countdownID = setInterval(()=>{
		timerInDom.textContent = --timer+"s"
		if (timer === 0) {
		new Audio("sounds/negative_beeps.mp3").play()
		clearInterval(countdownID)
		timerMsgBodyInDom.innerHTML = `<strong style="color:tomato">Time out !!!</strong>`
		timerInDom.textContent = "";
	}
	},1000) 
	}
}
// ------------------------------------------Helper function for Model --------------------------------------------------
// scrambler takes in either array or strings scrambles it an returns either an arr or string 
const scrambler = (item,dataTypeToBeReturned="string") => {
if (dataTypeToBeReturned === "string") return [...item].sort(()=> Math.random() - 0.5).toString()
return [...item].sort(()=> Math.random() - 0.5)

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
	clearInterval(countdownID)
	if(inputValue === currentQuestionToBeDisplayedOnScreen.actualWord){
	new Audio("sounds/success.mp3").play()
	if(+gameBoardInDom.dataset.index !== questionsToBeDisplayedOnScreen.length-1) view.gameResultModal("Correct !!!","img/right-decision.gif","Next &raquo;")
	else view.gameResultModal("You've reached the end of Game","img/crystals.gif","Show Result &raquo;")
	}else{
		new Audio("sounds/negative_beeps.mp3").play()
		view.gameResultModal("Incorrect !!!","img/wrong-decision.gif","Try again &raquo;")
	}
	},
	generateRandQuestions: function () {
	return scrambler(this.questionsToBeDisplayed,"array")
	},
	nextQuestion:function () {
	if (1+(+gameBoardInDom.dataset.index) < questionsToBeDisplayedOnScreen.length){
	view.clearQuestionArea()
	nextQuestionParser(++gameBoardInDom.dataset.index)
	}
	}
}
// ---------------------------------------- Helper functions for view ---------------------s-------------------
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
		controller.activateTimer()
	}
	})
	observer.observe(gameBoardInDom)
}

const view = {
	showSnackBar: msg => showSnackBarFn(msg),
	showCurrentQuestionToBeDisplayInDom: function (questionsToBeDisplayed) {
	const {scrambledWord,hint} = questionsToBeDisplayed
	intersectionObserver(scrambledWord)
	hintElementInDom.textContent += hint
	},
	updateVirtualProgressTrackerInDom: index => document.querySelector(".progress").style.width = (((1+(+index)) % 7/6)*100) +"%",
	clearQuestionArea:function () {
	this.reintiateTimerElementInDom()
	hintElementInDom.textContent = ""
	document.querySelector(".container-body>h3").textContent = ""
	userInputElementInDOM.value = ""
	document.querySelector(".result-modal").querySelector("button").removeEventListener("click",model.nextQuestion)
	},
	gameResultModal:function (msg,imgSrc,msgOnBtn) {
	resultModalInDom.querySelector("p").textContent = msg
	resultModalInDom.querySelector("img").src = imgSrc
	resultModalInDom.querySelector("button").innerHTML = msgOnBtn
	msg === "Correct !!!" && resultModalInDom.querySelector("button").addEventListener("click",model.nextQuestion)
	msg === "Incorrect !!!" && resultModalInDom.querySelector("button").addEventListener("click",()=>{
		this.reintiateTimerElementInDom()
		controller.activateTimer()
	})	
	resultModalInDom.classList.add("show")
	resultModalInDom.querySelector("button").addEventListener("click",e=>e.target.parentElement.classList.remove("show"))
	
	},
	reintiateTimerElementInDom:  ()=> {timerMsgBodyInDom.innerHTML = `<b>Time Left : </b>`;timerInDom.textContent = "30s"}	
}

// init
typewriter("Word Scrable",".intro>h1",120)
const questionsToBeDisplayedOnScreen = model.generateRandQuestions()
const questionIndex = gameBoardInDom.dataset.index
let currentQuestionToBeDisplayedOnScreen = questionsToBeDisplayedOnScreen[questionIndex]
view.showCurrentQuestionToBeDisplayInDom(currentQuestionToBeDisplayedOnScreen)
view.updateVirtualProgressTrackerInDom(questionIndex)
console.log(questionsToBeDisplayedOnScreen)

const user = {
	name:"rahman",
	age:22,
	DOB:"12th feb 2003"
}
console.log("name" in user)
for(var i = 0, j=10; i < 10; i++,j--) {
	console.log(i*j);
}

// const newUser = Object.assign({},test:"var")
// newUser.age = 4
// console.log(user)