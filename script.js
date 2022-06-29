
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
        <div class="divImg" id="${info.data[i].id}" onclick="displayQuizz(this);">
            <img class="image2" src="${info.data[i].image}">
            <p>${info.data[i].title}</p>
        </div>`;
    }
}

function getQuizz (id) {
    const quizzID = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);
    quizzID.then (displayQuizz);
}

function displayQuizz (quizz) {

}