function getAllQuizzOptions() {
  const allQuizz = axios.get(
    "https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes"
  );
  allQuizz.then(renderQuizzOptions);
  //allQuizz.catch(catchQuizzOptions);
}

getAllQuizzOptions();

function renderQuizzOptions(info) {
  const quizzSpace = document.querySelector(".row");
  for (let i = 0; i < info.data.length; i++) {
    quizzSpace.innerHTML += `
        <div class="divImg" id="${info.data[i].id}" onclick="getQuizz(this);">
            <img class="image2" src="${info.data[i].image}">
            <p>${info.data[i].title}</p>
        </div>`;
  }
}

function getQuizz(quizz) {
  const id = quizz.id;
  const quizzID = axios.get(
    `https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${id}`
  );
  quizzID.then(displayQuizz);
}

function displayQuizz(selectedQuizz) {
    document.querySelector(".questions").innerHTML = "";
    document.querySelector(".banner h1").innerHTML = selectedQuizz.data.title;
    document.querySelector(".banner").style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${selectedQuizz.data.image})`;
    selectedQuizz.data.questions.sort(scrambleAlternatives);
    for (let i = 0; i < selectedQuizz.data.questions.length; i++) {
        document.querySelector(".questions").innerHTML += `
            <div class="question ord${i}">
                <div class="question-title" style="background-color:${selectedQuizz.data.questions[i].color}">
                    <h2>${selectedQuizz.data.questions[i].title}</h2>
                </div>
                <div class="answer-options">
                </div>
            </div>`;
        displayAlternatives(selectedQuizz.data.questions[i].answers, i);
    }
    document.querySelector(".screen1").classList.add("hidden");
    document.querySelector(".screen2.hidden").classList.remove("hidden");
}
function displayAlternatives (alternatives, order) {
    alternatives.sort(scrambleAlternatives);
    for (let j = 0; j < 4; j++) {
        let isRightOrWrong = isCorrect(alternatives[j].isCorrectAnswer);
        document.querySelector(`.question.ord${order} .answer-options`).innerHTML += `
            <div class="alternative ${isRightOrWrong}" onclick="answerQuestion(this, ${order}, ${alternatives[j].isCorrectAnswer});">
                <img src="${alternatives[j].image}" alt="">
                <h3>${alternatives[j].text}</h3>
            </div>`;
  }
}
function scrambleAlternatives() {
  return Math.random() - 0.5;
}
function isCorrect(alternative) {
  if (alternative === true) {
    return "right";
  } else {
    return "wrong";
  }
}

let rightAnswers = 0;

function answerQuestion(alternative, order, rightOrWrong) {
    if (document.querySelector(`.ord${order} .answer-options.show-answer`) !== null) {
        return;
    } else {
        if (rightOrWrong === true) {
            rightAnswers++;
        }
        alternative.classList.add("clicked");
        alternative.parentNode.classList.add("show-answer");
        setTimeout(() => {
            document.querySelector(`.ord${order + 1}`).scrollIntoView();
        }, 2000)
    }
}
//Js Perguntas
let obj;
let quizz = [];
let questionsTitleAndColor = [];
let questionAnswer = [];

function createQuizz(){
  const screen = document.querySelector(".screen1")
  screen.classList.add("hidden")

  const newScreen = document.querySelector(".screen3")
  newScreen.classList.remove("hidden")
}

function questionMaker() {
  const quizzDetails = document.querySelectorAll(".preQuizz");
  let preQuizz = {
    title: "",
    image: "",
    numberOfQuestions: "",
    numberOfLevels: "",
  };
  obj = preQuizz;

  preQuizz.title = quizzDetails[0].value;
  preQuizz.image = quizzDetails[1].value;
  preQuizz.numberOfQuestions = Number(quizzDetails[2].value);
  preQuizz.numberOfLevels = Number(quizzDetails[3].value);

  quizz.push(preQuizz.title);
  quizz.push(preQuizz.image);

  const screen = document.querySelector(".screen3");
  screen.classList.add("hidden");

  const newScreen = document.querySelector(".screen3_2");
  newScreen.classList.remove("hidden");

  const questionList = document.querySelector(".secondUl");

  for (let i = 0; i < preQuizz.numberOfQuestions; i++) {
    questionList.innerHTML += `
                    <ul>
                        <li><h1>Pergunta ${i + 1}</h1></li>
                        <li><input class="question${i + 1
      }" type="text" placeholder="Texto da pergunta" required></li>
                        <li><input class="questionColor${i + 1
      }" type="text" placeholder="Cor de fundo da pergunta" required></li>
                    </ul>
                    <ul>
                        <li><h1>Resposta Correta</h1></li>                    
                        <li><input class="questionAnswer${i + 1
      }" type="text" placeholder="Resposta Correta" required></li>
                        <li><input class="questionURL${i + 1
      }" type="text" placeholder="URL da Imagem"required></li>
                        </ul>
                    <ul>
                        <li><h1>Respostas Incorretas</h1></li>
                        <li><input class="questionAnswer${i + 1
      }" type="text" placeholder="Resposta Incorreta 1" required></li>
                        <li><input class="questionURL${i + 1
      }" type="text" placeholder="URL da Imagem"required></li>
                        <li> <br><br></li>
                    </ul>
                    <ul>
                        <li><input class="questionAnswer${i + 1
      }" type="text" placeholder="Resposta Incorreta 2" required></li>
                        <li><input class="questionURL${i + 1
      }" type="text" placeholder="URL da Imagem"required></li>
                        <li><br><br></li>
                    </ul>
                    <ul>
                        <li><input class="questionAnswer${i + 1
      }" type="text" placeholder="Resposta Incorreta 3" required></li>
                        <li><input class="questionURL${i + 1
      }" type="text" placeholder="URL da Imagem"required></li>
                    </ul>
            `;
  }
}

function grabQuestions() {
  let answers = [];

  for (let i = 0; i < obj.numberOfQuestions; i++) {
    const title = document.querySelectorAll(`.question${i + 1}`);
    const color = document.querySelectorAll(`questionColor${i + 1}`);

    const texts = document.querySelectorAll(`.questionAnswer${i + 1}`);
    const url = document.querySelectorAll(`.questionURL${i + 1}`);

    let answer = {
      text: texts[i].value,
      image: url[i].value,
      isCorrectAnswer: false,
    };

    if (i === 0) {
      answer.isCorrectAnswer = true;
    }

    answers.push(answer);
  }
}

function levelMaker() {
  levels = obj.numberOfLevels;

  const screen = document.querySelector(".screen3_2");
  screen.classList.add("hidden");

  const newScreen = document.querySelector(".screen3_3");
  newScreen.classList.remove("hidden");

  const levelList = document.querySelector(".thirdUl");

  for (let i = 0; i < levels; i++) {
    levelList.innerHTML += `
        <ul>
            <li><h1>Nível ${i + 1}</h1></li>
            <li><input class="level" type="text" placeholder="Título do nível" required></li>
            <li><input class="level" type="text" placeholder="% de acerto mínima" required></li>
            <li><input class="level" type="text" placeholder="URL da imagem do nível" required></li>
            <li><input class="level" type="text" placeholder="Descrição do nível" required></li>
        </ul>
        `;
  }
}
function validateURL(url) {
  const rule =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  return rule.test(url);
}
function registerInitialQuizzValues() {
  const title = document.querySelector(".firstUl .title").value;
  const image = document.querySelector(".firstUl .url").value;
  const numberOfQuestions = document.querySelector(
    ".firstUl .number-questions"
  ).value;
  const numberOfLevels = document.querySelector(
    ".firstUl .number-levels"
  ).value;

  preQuizz.title = title;
  preQuizz.image = image;
  preQuizz.numberOfQuestions = parseInt(numberOfQuestions);
  preQuizz.numberOfLevels = parseInt(numberOfLevels);
}
function validateInitialQuizzValues() {
  if (preQuizz.title.length < 20 || preQuizz.title.length > 65) {
    return false;
  } else if (!validateURL(preQuizz.image)) {
    return false;
  } else if (preQuizz.numberOfQuestions < 3) {
    return false;
  } else if (preQuizz.numberOfLevels < 2) {
    return false;
  }

  return true;
}
