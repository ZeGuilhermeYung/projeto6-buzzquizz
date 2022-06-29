const allQuizz = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
allQuizz.then(renderQuizz)

function renderQuizz(info){
    const quizzSpace = document.querySelector(".row")
    quizzSpace.innerHTML = ""

    for(let i = 0; i < info.data.length; i++){
        quizzSpace.innerHTML += `<div id="${info.data[i].id}"class="divImg"><img class="image2" src="${info.data[i].image}"><p>${info.data[i].title}</p></div>`
    }
}