const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

/* when receiving data from a web server, the data is always a string
JSON.parse converts the data into an object
"|| []" means if you're starting the application for the first time and 
highScores array is null, it initializes it to an empty array */
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;
console.log(highScores);

// Updating the finalScore to the mostRecentScore
finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
    // if the username placeholder value is empty, the saveScoreBtn is disabled
    // if it isn't, the saveScoreBtn is enabled
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
    console.log("Clicked the Save button");
    //this will prevent the default form attribute that posts form data to a different page
    e.preventDefault();

    // creating the score object and passing it the score and name attribute
const score = {
    // checking the highScore system
    score: Math.floor(Math.random() * 100),
    name: username.value
};
// pushing the score object into the highScores array
highScores.push(score);

// Sorting out the array with an arrow function which basically says
// if the b score is higher than the a score then put b before a
highScores.sort( (a,b) => b.score - a.score)

// cutting off the index array at index 5
highScores.splice(5);

// permanently scores the highScore in localStorage
 localStorage.setItem("highScores", JSON.stringify(highScores));
// goes home after saving score 
 window.location.assign("index.html");

};