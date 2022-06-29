
function getAllQuizzOptions () {
    const allQuizz = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    allQuizz.then (renderQuizzOptions);
    //allQuizz.catch(catchQuizzOptions);
}

getAllQuizzOptions();

function renderQuizzOptions (info) {
    const quizzSpace = document.querySelector(".row");   
    for (let i = 0; i < info.data.length; i++) {
        quizzSpace.innerHTML += `
        <div class="divImg" id="${info.data[i].id}" onclick="getQuizz(this);">
            <img class="image2" src="${info.data[i].image}">
            <p>${info.data[i].title}</p>
        </div>`;
    }
}

function getQuizz (quizz) {
    const id = quizz.id;
    const quizzID = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);
    quizzID.then (displayQuizz);
}

function displayQuizz (selectedQuizz) {
    const backImg = `url(${selectedQuizz.data.image})`;
    document.querySelector(".screen2").innerHTML = `
    <div class="banner" style="background-image: ${backImg};">
        <h1>${selectedQuizz.data.title}</h1>
    </div>`;
    selectedQuizz.data.questions.sort(scrambleAlternatives);
    for (let i = 0; i < selectedQuizz.data.questions.length; i++) {
        document.querySelector(".screen2").innerHTML += `
        <div class="question">
            <div class="question-title" style="background-color=${selectedQuizz.data.questions[i].color}">
                <h2>${selectedQuizz.data.questions[i].title}</h2>
            </div>
            <div class="answer-options">`;
        selectedQuizz.data.questions[i].answers.sort(scrambleAlternatives);
        for (let j = 0; j < 4; j++) {
            let isRightOrWrong = isCorrect(selectedQuizz.data.questions[i].answers[j].isCorrectAnswer);
            document.querySelector(".answer-options").innerHTML += `
            <div class="alternative ${isRightOrWrong}">
                <img src="${selectedQuizz.data.questions[i].answers[j].image}" alt="">
                <h3>${selectedQuizz.data.questions[i].answers[j].text}</h3>
            </div>`;
        }  
    }
    document.querySelector(".screen2").innerHTML +=
        `</div>
    </div>`;
    document.querySelector(".screen1").classList.add("hidden");
    document.querySelector(".screen2.hidden").classList.remove("hidden");
}

function scrambleAlternatives () { 
	return Math.random() - 0.5; 
}

function isCorrect(alternative) {
    if (alternative === true) {
        return "right";
    } else {
        return "wrong";
    }
}