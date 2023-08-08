import { shuffleNumbers } from "./utility.js";

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
const CHOICES = 4;
const randomNumbers = shuffleNumbers(CHOICES);

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

document.body.innerHTML = `
	<div class="container">
    <div id="loader"></div>
		<div id="game" class="justify-center flex-column hidden">
			<div id="hud">
				<div id="hud-item">
					<p id="progressText" class="hud-prefix">
						Question
					</p>
					<div id="progressBar">
						<div id="progressBarFull"></div>
					</div>
				</div>
				<div id="hud-item">
					<p class="hud-prefix">
						Score
					</p>
					<h1 class="hud-main-text" id="score">
						0
					</h1>
				</div>
			</div>
			<h2 id="question"></h2>
			<div class="choice-container">
				<p class="choice-prefix">A</p>
				<p class="choice-text" data-number="${randomNumbers[0]}"></p>
			</div>
			<div class="choice-container">
				<p class="choice-prefix">B</p>
				<p class="choice-text" data-number="${randomNumbers[1]}"></p>
			</div>
			<div class="choice-container">
				<p class="choice-prefix">C</p>
				<p class="choice-text" data-number="${randomNumbers[2]}"></p>
			</div>
			<div class="choice-container">
				<p class="choice-prefix">D</p>
				<p class="choice-text" data-number="${randomNumbers[3]}"></p>
			</div>
		</div>
	</div>
`;

const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

document.addEventListener("DOMContentLoaded", () => {
  // fetch questions / api
  fetch(
    `https://opentdb.com/api.php?amount=${MAX_QUESTIONS}&difficulty=easy&type=multiple`
  )
    .then((res) => {
      return res.json();
    })
    .then((loadedQuestions) => {
      questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
          question: loadedQuestion.question.replace(/&quot;/g,'"')
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];

        // assign a random number for the correct answer
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        // put correct answer to assigned position
        answerChoices.splice(
          formattedQuestion.answer - 1,
          0,
          loadedQuestion.correct_answer
        );

        // format choices
        answerChoices.forEach((choice, index) => {
          formattedQuestion["choice" + (index + 1)] = choice;
        });
        return formattedQuestion;
      });
      startGame();
    })
    .catch((err) => console.log(err));

  const startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    // event listeners
    choices.forEach((choice) => {
      choice.addEventListener("click", (e) => {
        if (!acceptingAnswers) {
          return;
        }
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply =
          selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
          incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
          selectedChoice.parentElement.classList.remove(classToApply);
          getNewQuestion();
        }, 1000);
      });
    });
    game.classList.remove("hidden");
    loader.classList.add("hidden");
  };

  const getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      // update the score
      localStorage.setItem("mostRecentScore", score);
      //go to the end page
      return window.location.assign("/trivia-quiz/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
      const number = choice.dataset["number"];
      choice.innerText = currentQuestion["choice" + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
  };

  // utility
  const incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
  };
});
