
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






































































/*Js perguntas*/
function questionMaker(){
    const quizzDetails = document.querySelectorAll("input")
    let preQuizz = {title:"",image:"",numberOfQuestions:"",numberOfLevels:""}

    preQuizz.title = quizzDetails[0].value
    preQuizz.image = quizzDetails[1].value
    preQuizz.numberOfQuestions = Number(quizzDetails[2].value)
    preQuizz.numberOfLevels = Number(quizzDetails[3].value)

    const screen = document.querySelector(".screen3")
    screen.classList.add("hidden")

    const newScreen = document.querySelector(".screen3_2")
    newScreen.classList.remove("hidden")

    const questionList = document.querySelector(".secondUl")

    for(let i = 0; i < preQuizz.numberOfQuestions; i++){
        questionList.innerHTML += `
                    <ul>
                        <li><h1>Pergunta ${i + 1}</h1></li>
                        <li><input type="text" placeholder="Texto da pergunta" required></li>
                        <li><input type="text" placeholder="Cor de fundo da pergunta" required></li>
                    </ul>
                    <ul>
                        <li><h1>Resposta Correta</h1></li>                    
                        <li><input type="text" placeholder="Resposta Correta" required></li>
                        <li><input type="text" placeholder="URL da Imagem"required></li>
                        </ul>
                    <ul>
                        <li><h1>Respostas Incorretas</h1></li>
                        <li><input type="text" placeholder="Resposta Correta" required></li>
                        <li><input type="text" placeholder="URL da Imagem"required></li>
                        <li> <br><br></li>
                    </ul>
                    <ul>
                        <li><input type="text" placeholder="Resposta Correta" required></li>
                        <li><input type="text" placeholder="URL da Imagem"required></li>
                        <li><br><br></li>
                    </ul>
                    <ul>
                        <li><input type="text" placeholder="Resposta Correta" required></li>
                        <li><input type="text" placeholder="URL da Imagem"required></li>
                    </ul>
            `
    }
}