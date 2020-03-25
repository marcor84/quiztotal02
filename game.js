const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

// first we fetch questions from a web API called open trivia db
// then we return the response(promise)
/* Secondly we map through the results of the loadedQuestions array, for everytime we
map through formattedQuestion is being returned. we're going to get the original question
(loadedQuestion) and then format it into the format that we need and return that..
 and then we'll have the array of questions in the array format that we need */
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      };

// this copies the array of incorrect answers for the loadedQuestion into answerChoices
      const answerChoices = [...loadedQuestion.incorrect_answers];

// this gives the answer of the formattedQuestion a random index between 0 and 3
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

/* Because our answerChoices array is'nt a 0 based index and that's what we need,
we do formattedQuestion.answer -1. 0 because we are'nt removing any element */
/* this basically mean our answerChoices should haveall the choices in it 
with the correct answer with them in a random position */
      answerChoices.splice(
        formattedQuestion.answer - 1, 
        0, 
        loadedQuestion.correct_answer);

/* this iterates through the answerChoices array with a reference to the choice and index.
to put them as choice 1, choice 2, choice 3 or choice 4 for the formattedQuestion,
we dynamically added choice to whatever the index is +1 and assign it to choice */
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      })

      return formattedQuestion;
    });

    startGame();
  })
  .catch(err => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
/* this shows the loader whenever questions are loaded by 
swapping the class hidden */
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {

  if(availableQuesions === 0 || questionCounter === MAX_QUESTIONS) {
    // this saves the score to the key attribute "mostRecentScore"
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }

  // incrementing the questionCounter from 0
questionCounter++;

/* using ES6 template literal syntax to render the 
questionCounter dynamically by interpolating variables */
progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

// Updating Progress Bar
progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`

/* there are 3 questions in availableQuestions, this will generate a random question from 0 to 3
and store it as questionIndex */
const questionIndex = Math.floor(Math.random() * availableQuesions.length);
currentQuestion = availableQuesions[questionIndex];
question.innerText = currentQuestion.question;

// foreach would iterate through each choice and give us a refrence to each choice
choices.forEach( choice => {
  // getting access to the number attribute as a reference to data-number
  const number = choice.dataset['number'];
  // out of the currentQuestion we want to use that number to get the specific choice  
  choice.innerText = currentQuestion['choice' + number];
})

/* this is going to take the availableQuestions array and 
take away the question we just used by splicing 1 question at the questionIndex 
because we don't want to load questions we've already used */
availableQuesions.splice(questionIndex, 1);

// now we can accept answers
acceptingAnswers = true;

};

//adding event listener click to the choices
choices.forEach(choice => {

 // with this we're able to click and get a reference to each choice they click
  choice.addEventListener("click", e => {

// if we're not ready to accept answers it returns 
  if(!acceptingAnswers) return;

// we don't want them to click immediately so we set it to false
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    /* Using the ternary operator to check if answer is correct or incorrect
    and assigning it to classToApply accordingly */
    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if(classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    // This is how to apply class in javascript
    //Applying classToApply to the selected choice be it correct or incorrect
    selectedChoice.parentElement.classList.add(classToApply);

/* setting a timeout function which takes a callback function of 
removing the class applied to the selected in one second */
    setTimeout( () => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
    
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

