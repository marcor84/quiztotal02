const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// innerHTML sets or returns the content of an HTML content
/* what map does is that it takes the highScores array and allows
you to convert each of those items into something new in a new array */
/* we're taking in the score object and then returning 
the string version of a list that has what we need */
highScoresList.innerHTML = highScores
.map( score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`
})
.join("");