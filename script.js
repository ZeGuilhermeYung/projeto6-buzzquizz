const allQuizz = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
allQuizz.then(renderQuizz)

function renderQuizz(info){
    const obj = info.data;
    const quizzSpace = document.querySelector(".row")

    for(let i = 0; i <= obj.length; i++){
        quizzSpace.innerHTML += `<div class="divImg"><img class="image2" src="https://johto.legiaodosherois.com.br/wp-content/uploads/2021/11/legiao_IdFmPnXrUVjJ.png"><p>${obj.title}</p></div>`
    }
}