const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

// fetch highscores or create one
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = `Your score: ${mostRecentScore}`;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value
  }

  highScores.push(score);

  // sort by score
  highScores.sort((a, b) => b.score - a.score);

  // list top 5
  highScores.splice(5);
  
  // update highscores 
  localStorage.setItem("highScores", JSON.stringify(highScores));
};
