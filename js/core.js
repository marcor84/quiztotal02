class Answer {
	/**
	 * @param {number} id
	 * @param {string} answer
	 */
	constructor(id, answer) {
		this.ID        = id;
		this.Answer    = answer;
		this.IsChecked = false;
		this.IsGood    = false;
		this.IsWrong   = false;
	}
}

class Question {
	/**
	 * @param {string} question
	 * @param {string[]} answers
	 * @param {number[]} correct
	 */
	constructor(question, answers, correct) {
		this.Question      = question;
		this.AllAnswers    = this.generateIDs(answers);
		this.StayedAnswers = this.AllAnswers.slice();
		this.Correct       = correct;
	}

	generateIDs(answers) {
		var tmpArr = [];

		for (var i = 0; i < answers.length; i++) {						
			tmpArr.push(new Answer(i, answers[i]));
		}

		return tmpArr;
	}

	/**
	 * @returns {Answer}
	 */
	getRandomAnswer() {
		var answerIndex = Math.floor(Math.random() * this.StayedAnswers.length);

		var answer = this.StayedAnswers[answerIndex];

		this.removeIndex(answerIndex);

		return answer;
	}

	/**
	 * Removes the specified index from the StayedAnswers array
	 * 
	 * @param {number} index
	 */
	removeIndex(index) {
		this.StayedAnswers.splice(index, 1);
	}

	/**
	 * @returns {Answer[]}
	 */
	shuffledAnswers() {
		var answers = [];

		while (this.StayedAnswers.length != 0) {
			answers.push(this.getRandomAnswer());
		}

		return answers;
	}
}

class Quiz {
	constructor(quiz) {
		this.ID             = 0;
		this.Name           = quiz.name;
		this.Questions      = quiz.questions;
		this.RandomQuestion = null;
		this.MaxCount       = this.Questions.length;
		this.QuestionsCount = this.MaxCount;
		this.View 			= null;
	}

	/**
	 * @returns {Question}
	 */
	getRandomQuestion() {
		var questionIndex = Math.floor(Math.random() * this.Questions.length);
		var      question = this.Questions[questionIndex];

		this.removeIndex(questionIndex);

		return new Question(question['question'], question['answers'], question['correctIndexes']);
	}

	/**
	 * Removes the specified index from the Questions array
	 * 
	 * @param {int} index 
	 */
	removeIndex(index) {
		this.Questions.splice(index, 1);
		this.QuestionsCount--;
	}

	/**
	 * Pick a random Question and display it on the UI
	 */
	nextQuestion() {
		this.RandomQuestion = quizzes.ActiveQuiz.getRandomQuestion();

		this.View.updateQuestion(this.RandomQuestion.Question);

		var progBarValue = quizzes.ActiveQuiz.MaxCount - quizzes.ActiveQuiz.QuestionsCount;
		this.View.updateProgressBar(progBarValue);
		
		this.View.updateAnswers(this.RandomQuestion.shuffledAnswers());
		
		if (quizzes.ActiveQuiz.QuestionsCount == 0) {
			this.View.disableNextButton();
		}

		this.View.showCheckButton();
	}

	/**
	 * Validate the User answers
	 */
	checkAnswers() {
		var answers = this.View.getAnswers();
		
		for (var i = 0; i < answers.length; i++) {
			var answer = answers[i];

			if ( answer.IsChecked && this.RandomQuestion.Correct.includes(answer.ID) )
			{
				answer.IsGood = true;
			}
			else if ( answer.IsChecked && !this.RandomQuestion.Correct.includes(answer.ID) )
			{
				answer.IsWrong = true;
			}
			else if ( !answer.IsChecked && this.RandomQuestion.Correct.includes(answer.ID) )
			{
				answer.IsWrong = true;
			}
		}
		
		this.View.updateAnswers(answers);
		
		this.View.hideCheckButton();
	}
}

class QuizView {
	constructor(htmlDOM) {
		this.Container    = htmlDOM;

		this.QuestionDOM  = document.createElement("p");
		this.AnswersDOM   = document.createElement("p");

		this.NextButton   = document.createElement("button");
		this.NextButton.innerHTML = 'Következő!';
		this.NextButton.setAttribute("onclick","nextQuestionEvent();");

		this.CheckButton  = document.createElement("button");
		this.CheckButton.innerHTML = 'Ellenőrzés!';
		this.CheckButton.setAttribute("onclick","checkQuestionEvent();");
	}
	
	/**
	 * Display an empty quiz UI
	 */
	show() {
		this.Container.innerHTML = "";

		this.Container.appendChild(this.QuestionDOM);
		this.Container.appendChild(this.AnswersDOM);
		this.Container.appendChild(this.NextButton);
		this.Container.appendChild(this.CheckButton);
	}

	/**
	 * Re-draw the question on the UI
	 * 
	 * @param {string} question 
	 */
	updateQuestion(question) {
		this.QuestionDOM.innerText = question;
	}
	
	/**
	 * Re-draw the User's progress indicator
	 * 
	 * @param {int} value 
	 */
	updateProgressBar(value) {
		document.getElementById("progressBar").value = value;
	}
	
	/**
	 * Changes the progress indicator max value
	 * 
	 * @param {int} value 
	 */
	setProgressBarMax(value) {
		document.getElementById("progressBar").max = value;
	}

	/**
	 * Re-draw the answers to display the correct and bad answers
	 * 
	 * @param {Answer[]} answers 
	 */
	updateAnswers(answers) {
		this.AnswersDOM.innerHTML = "";

		for (var i = 0; i < answers.length; i++) {
			var answer = answers[i];

			var label = document.createElement('label');

			var paragraph = document.createElement('p');
			paragraph.className = 'answer';

			if (answer.IsGood)
				paragraph.className += ' good';
			else if (answer.IsWrong)
				paragraph.className += ' wrong';
			
			var checkBox = document.createElement("input");
			checkBox.setAttribute("type", "checkbox");
			checkBox.value = answer.ID;
			checkBox.checked = answer.IsChecked;

			paragraph.appendChild(checkBox);
			paragraph.appendChild(document.createTextNode(answer.Answer));
			
			label.appendChild(paragraph);

			this.AnswersDOM.appendChild(label);
		}
	}
	
	/**
	 * Extract User's answer from the UI
	 * 
	 * @return {Answer[]}
	 */
	getAnswers() {
		var ancestor = this.AnswersDOM;
		var descendents = ancestor.getElementsByTagName('input');

		var answers = [];
	
		for (var i = 0; i < descendents.length; i++) {
			var answerDOM = descendents[i];
			answerDOM.disabled = true;
			
			var answerID = parseInt(answerDOM.value);

			var answer = new Answer(answerID, answerDOM.parentNode.innerText);
			answer.IsChecked = answerDOM.checked;

			answers.push(answer);
		}

		return answers;
	}

	disableNextButton() {
		this.NextButton.disabled = true;
	}

	hideCheckButton() {
		this.CheckButton.style.display = 'none';
	}

	showCheckButton() {
		this.CheckButton.style.display = 'inline';
	}
}

class QuizManager {
	constructor(htmlDOM) {
		this.Quizzes    = [];
		this.ActiveQuiz = null;
		this.View		= new QuizManagerView(htmlDOM);
	}

	/**
	 * @param {Quiz} quiz 
	 */
	addQuiz(quiz) {
		quiz.View = new QuizView(this.View.Container);

		quiz.ID = this.Quizzes.length;

		this.Quizzes.push(quiz);
	}

	/**
	 * @param {Quiz} quiz 
	 */
	changeQuiz(quiz) {
		this.ActiveQuiz = quiz;

		this.ActiveQuiz.View.setProgressBarMax(this.ActiveQuiz.MaxCount);

		this.updateQuizName(this.ActiveQuiz);

		this.ActiveQuiz.nextQuestion();

		this.ActiveQuiz.View.show();
	}

	/**
	 * @param {int} id 
	 */
	changeQuizByID(id) {
		for (var i = 0; i < this.Quizzes.length; i++) {
			var quiz = this.Quizzes[i];

			if (id == quiz.ID) {
				this.changeQuiz(quiz);
				break;
			}
		}
	}

	/**
	 * @param {Quiz} quiz 
	 */
	updateQuizName(quiz) {
		this.View.updateQuizHeader(quiz.Name);
	}

	displayQuizSelector() {
		this.View.showSelector(this.Quizzes);
	}
}

class QuizManagerView {
	constructor(htmlDOM) {
		this.Container = htmlDOM;
	}

	showSelector(quizzes) {
		for (var i = 0; i < quizzes.length; i++) {
			var quiz = quizzes[i];

			this.Container.innerHTML += '<p><a href="#" onClick="selectQuizEvent(' + quiz.ID + ');">' + quiz.Name  + '</p>';
		}
	}

	updateQuizHeader(content) {
		document.getElementById("quizName").innerHTML = content + " Quiz";
	}
}

module.exports = {
	Answer      : Answer,
	Question    : Question,
	Quiz        : Quiz,
	QuizManager : QuizManager
}
