const succesfullyCreatedQuizz = document.querySelector(".succesfully-created-quizz");
let currentQuizz;

function getAllQuizzOptions() {
  const allQuizz = axios.get(
    `https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/`
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
function getSavedQuizzes() {
  let values = localStorage.getItem("quizzes");

  if (values !== null) {
    const data = JSON.parse(values);
    return data;
  } else {
    return [];
  }
}
function displayQuizz(selectedQuizz) {
  currentQuizz = selectedQuizz;
  document.querySelector(".questions").innerHTML = "";
  document.querySelector(".banner h1").innerHTML = selectedQuizz.data.title;
  document.querySelector(
    ".banner"
  ).style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${selectedQuizz.data.image})`;
  selectedQuizz.data.questions.sort(scrambleAlternatives);
  for (let i = 0; i < selectedQuizz.data.questions.length; i++) {
    document.querySelector(".questions").innerHTML += `
            <div class="question ord${i + 1}">
                <div class="question-title" style="background-color:${
                  selectedQuizz.data.questions[i].color
                }">
                    <h2>${selectedQuizz.data.questions[i].title}</h2>
                </div>
                <div class="answer-options">
                </div>
            </div>`;
    displayAlternatives(selectedQuizz.data.questions[i].answers, i + 1);
  }
  document.querySelector(".screen1").classList.add("hidden");
  if (document.querySelector(".screen2.hidden") !== null) {
    document.querySelector(".screen2.hidden").classList.remove("hidden");
  }
  document.querySelector(".banner").scrollIntoView();
}
function displayAlternatives(alternatives, order) {
  alternatives.sort(scrambleAlternatives);
  for (let j = 0; j < alternatives.length; j++) {
    let isRightOrWrong = isCorrect(alternatives[j].isCorrectAnswer);
    document.querySelector(
      `.question.ord${order} .answer-options`
    ).innerHTML += `
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
  if (
    document.querySelector(`.ord${order} .answer-options.show-answer`) !== null
  ) {
    return;
  } else {
    if (rightOrWrong === true) {
      rightAnswers++;
    }
    alternative.classList.add("clicked");
    alternative.parentNode.classList.add("show-answer");
    setTimeout(() => {
      if (document.querySelector(`.ord${order + 1}`) !== null) {
        document.querySelector(`.ord${order + 1}`).scrollIntoView();
      } else {
        let finalScore = (rightAnswers / order) * 100;
        displayFinalScore(finalScore);
        document.querySelector(".score").scrollIntoView();
        rightAnswers = 0;
      }
    }, 2000);
  }
}
function displayFinalScore(score) {
  let scoreAverage = 0;
  let levelIndex = 0;
  for (i = 0; i < currentQuizz.data.levels.length; i++) {
    if (score >= currentQuizz.data.levels[i].minValue && currentQuizz.data.levels[i].minValue >= scoreAverage) {
      scoreAverage = currentQuizz.data.levels[i].minValue;
      levelIndex = i;
    }
  }
  document.querySelector(".score-screen.hidden").classList.remove("hidden");
  document.querySelector(".score-result h2").innerHTML = `${Math.round(score)}% de acerto: ${currentQuizz.data.levels[levelIndex].title}`;
  document.querySelector(".image-text img").src = currentQuizz.data.levels[levelIndex].image;
  document.querySelector(".image-text h3").innerHTML = currentQuizz.data.levels[levelIndex].text;
}
function restartQuizz() {
  document.querySelector(".score-screen").classList.add("hidden");
  displayQuizz(currentQuizz);
}
function screen2ToScreen1() {
  document.querySelector(".score-screen").classList.add("hidden");
  document.querySelector(".screen2").classList.add("hidden");
  document.querySelector(".screen1.hidden").classList.remove("hidden");
}
//Js Perguntas
let preQuizz = {
  title: "",
  image: "",
  numberOfQuestions: "",
  numberOfLevels: "",
  questions: [],
  levels: [],
};
let quizz = {
  title: "",
  image: "",
  questions:[],
  levels: [],}
let questionsTitleAndColor = [];
let questionAnswer = [];
let quizzToSend = {
  title: "",
  image: "",
  questions:[],
  levels: [],
}

function createQuizz() {
  document.querySelector(".screen1").classList.add("hidden");
  document.querySelector(".screen3").classList.remove("hidden");
}

let conditionValues = [];

function refreshConditionValues (screen) {
  if (screen === "firstUl" || screen === "screen3") {
    conditionValues = [
      (document.querySelector(".preQuizz.title").value.length >= 20 && document.querySelector(".preQuizz.title").value.length <= 65),
      validateURL(document.querySelector(".preQuizz.url").value),
      (Number(document.querySelector(".preQuizz.number-questions").value) >= 3),
      (Number(document.querySelector(".preQuizz.number-levels").value) >= 2),
    ];
  } 
}
document.querySelector(".creatingQuizzForms").addEventListener("keydown", function(e) {
  if (e.key === "Tab") {
    let screenClass = document.querySelector(`.${document.activeElement.classList[1]}`).parentNode.parentNode.classList[0];
    refreshConditionValues(screenClass);
    let conditionValue;
    for (let i = 0; i < conditionValues.length; i++) {
      if (document.activeElement.classList[1] === document.querySelectorAll(`.${document.activeElement.classList[0]}`)[i].classList[1]) {
        conditionValue = conditionValues[i];
      }
    } 
    checkInitialQuizzValues(conditionValue, document.activeElement.classList[1]);
  }
  if (e.key === "Enter") {
    document.querySelector(`.${document.querySelector(`.${document.activeElement.classList[1]}`).parentNode.parentNode.parentNode.parentNode.classList[0]} .submit`).click();
  }
  });

function checkInitialQuizzValues(condition, type) {
  
  if (condition === false && document.querySelector(`.${type}-alert.hidden`) !== null) {
    document.querySelector(`.${type}-alert.hidden`).classList.remove("hidden");
  }
  if (condition === true && document.querySelector(`.${type}-alert.hidden`) === null){
    document.querySelector(`.${type}-alert`).classList.add("hidden");
  }
}

function validateInitialQuizzValues(submit, className) {
  let screenClass = submit.parentNode.classList[0];
  refreshConditionValues(screenClass);
  let validateAll = 0;
  for (let i = 0; i < conditionValues.length; i++) {
    if (conditionValues[i] === true) {
      checkInitialQuizzValues(conditionValues[i], document.querySelectorAll(`${className}`)[i].classList[1]);
      validateAll++;
    } else {
      checkInitialQuizzValues(conditionValues[i], document.querySelectorAll(`${className}`)[i].classList[1]);
    }
  }
  if (validateAll === conditionValues.length) {
    questionMaker();
  }
}

function questionMaker() {
  const quizzDetails = document.querySelectorAll(".preQuizz");
  
  preQuizz.title = quizzDetails[0].value;
  preQuizz.image = quizzDetails[1].value;
  preQuizz.numberOfQuestions = Number(quizzDetails[2].value);
  preQuizz.numberOfLevels = Number(quizzDetails[3].value);
  
  quizzToSend.title = preQuizz.title
  quizzToSend.image = preQuizz.image
  
  console.log(preQuizz.title)

  document.querySelector(".screen3").classList.add("hidden");
  document.querySelector(".screen3_2.hidden").classList.remove("hidden");
  
  document.querySelector(".secondUl").innerHTML = "";
  for (let i = 0; i < preQuizz.numberOfQuestions; i++) {
    document.querySelector(".secondUl").innerHTML += `
                      <h1>Pergunta ${i + 1}<ion-icon class="icon${i + 1}" name="create"></ion-icon></h1>      
                      <div class="dropdown closed" onclick="dropdown(this)">
                        <ul class="menu">
                          <li>
                            <ul>
                              <li><input class="question${i + 1}" type="text" placeholder="Texto da pergunta" required></li>
                              <li><input class="questionColor${i + 1}" type="text" placeholder="Cor de fundo da pergunta" required></li>
                            </ul>
                          </li>
                          <li>
                            <ul>
                              <li><h1>Resposta Correta</h1></li>                    
                              <li><input class="questionAnswer${i + 1}" type="text" placeholder="Resposta Correta" required></li>
                              <li><input class="questionURL${i + 1}" type="text" placeholder="URL da Imagem"required></li>
                            </ul>
                          </li>
                          <li>
                            <ul>
                            <li><h1>Respostas Incorretas</h1></li>
                                <li><input class="questionAnswer${i + 1}" type="text" placeholder="Resposta Incorreta 1" required></li>
                                <li><input class="questionURL${i + 1}" type="text" placeholder="URL da Imagem"required></li>
                                <li> <br><br></li>
                            </ul>
                          </li>
                          <li>
                            <ul>
                              <li><input class="questionAnswer${i + 1}" type="text" placeholder="Resposta Incorreta 2"></li>
                              <li><input class="questionURL${i + 1}" type="text" placeholder="URL da Imagem"required></li>
                              <li><br><br></li>
                            </ul>
                          </li>
                          <li>
                            <ul>
                                <li><input class="questionAnswer${i + 1}" type="text" placeholder="Resposta Incorreta 3"></li>
                                <li><input class="questionURL${i + 1}" type="text" placeholder="URL da Imagem"required></li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    `;
                  }
  dropdownQuestions()
}

function dropdownQuestions(){
  const dropdown = document.querySelectorAll(".dropdown")
  for(let i = 0; i < dropdown.length; i++){
    const icon = document.querySelector(`.icon${i + 1}`)
    icon.addEventListener("click",() => {
      dropdown[i].classList.toggle("closed")
    })
    }
  }

function grabAnswers() {
  let questions = []

  for (let i = 0; i < preQuizz.numberOfQuestions; i++) {
    let answers = [];
    const texts = document.querySelectorAll(`.questionAnswer${i + 1}`);
    const url = document.querySelectorAll(`.questionURL${i + 1}`);

    const title = document.querySelector(`.question${i + 1}`)
    const color = document.querySelector(`.questionColor${i + 1}`)
    
    
    for (let i = 0; i < texts.length; i++) {
      
      let answer = {
        text: texts[i].value,
        image: url[i].value,
        isCorrectAnswer: i === 0 ? true : false,
      };

      if(!(answer.text === "")){
       answers.push(answer);
      }

    }
    let question = {
      title: title.value,
      color: color.value,
      answers: answers,
    }
      questions.push(question)
  }
  quizzToSend.questions = questions
}

function quizzDone(response){  
  saveQuizzLocalStorage(response)
  const screen = document.querySelector(".screen3_3")
  screen.classList.add("hidden")
  
  const newScreen = document.querySelector(".screen3_4")
  newScreen.classList.remove("hidden")
  
  image = document.getElementById("quizzDoneImage")
  image.src = quizzToSend.image
  
  text = document.getElementById("quizzDoneTitle")
  text.textContent = quizzToSend.title
}
  
function postQuizz() {
  const post = axios.post("https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes", quizzToSend)
  post.then(quizzDone)
  post.catch(() => alert("Algo deu errado"))
}

function levelMaker() {
  levels = preQuizz.numberOfLevels;

  document.querySelector(".screen3_2").classList.add("hidden");
  document.querySelector(".screen3_3").classList.remove("hidden");

  //REVER ISSO TBM!!
  for (let i = 0; i < levels; i++) {
    document.querySelector(".thirdUl").innerHTML += `
        <h1>Nível ${i + 1}<ion-icon class="iconLevel${i + 1}" name="create"></ion-icon></h1>
        <div class="dropdownLevel closed">
          <ul>
              <li><input class="level-${i}-title" type="text" placeholder="Título do nível" required></li>
              <li><input class="level-${i}-minimum-hit" type="text" placeholder="% de acerto mínima" required></li>
              <li><input class="level-${i}-url" type="text" placeholder="URL da imagem do nível" required></li>
              <li><input class="level-${i}-description" type="text" placeholder="Descrição do nível" required></li>
          </ul> 
        </div>
        `;
  }
  dropdownLevels()
}

function dropdownLevels(){
  const dropdown = document.querySelectorAll(".dropdownLevel")
  for(let i = 0; i < dropdown.length; i++){
    const icon = document.querySelector(`.iconLevel${i + 1}`)
    icon.addEventListener("click",() => {
      dropdown[i].classList.toggle("closed")
    })
    }
  }

function registerLevelValues() {
  let levels = [];
  for (let i = 0; i < preQuizz.numberOfLevels; i++) {
    const level = {
      title: document.querySelector(`.level-${i}-title`).value,
      minValue: parseInt(document.querySelector(`.level-${i}-minimum-hit`).value),
      image: document.querySelector(`.level-${i}-url`).value,
      text: document.querySelector(`.level-${i}-description`).value,
    };

    levels.push(level);
  }
  quizzToSend.levels = levels
}
function validateLevelValues() {
  registerLevelValues();
  let levelZero = false;

  for (let i = 0; i < preQuizz.levels.length; i++) {
    const level = preQuizz.levels[i];

    if (level.minValue === 0) {
      levelZero = true;
    }

    if (level.title.length < 10) {
      return false;
    } else if (level.minValue < 0 || level.minValue > 100) {
      return false;
    } else if (!validateURL(level.image)) {
      return false;
    } else if (level.text.length < 30) {
      return false;
    }
  }
  return levelZero;
}
//Verificar!
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
  document.querySelector(".firstUl")
  preQuizz.title = title;
  preQuizz.image = image;
  preQuizz.numberOfQuestions = parseInt(numberOfQuestions);
  preQuizz.numberOfLevels = parseInt(numberOfLevels);
}

function validateColor(color) {
  const rule = /^\#([0-9]|[A-F]|[a-f]){6}$/;
  return rule.test(color);
}
function finalizeQuizz() {
  const valid = validateLevelValues();

  if (!valid) {
    alert("Por favor, preencha os dados corretamente!");
    return;
  }
  saveQuizz();
}
function saveQuizzLocalStorage(response) {
  const quizz = response.data;

  const valuesLocalStorage = getSavedQuizzes();

  valuesLocalStorage.push({
    id: quizz.id,
    key: quizz.key,
  });

  localStorage.setItem("quizzes", JSON.stringify(valuesLocalStorage));
  quizzSuccesfullyCreated(quizz.id);
}
const insertSuccessMessage = document.querySelector('.succesfully-created-quizz');
function quizzSuccesfullyCreated(id) {
  insertSuccessMessage.innerHTML = `
  
      <h1>Seu quizz está pronto!</h1>
      <div class="divImg" onclick="">
        <img id="quizzDoneImage" class="image2" src="${preQuizz.image}">
        <p id="quizzDoneTitle">${preQuizz.title}</p>
      </div>
      <input class='submit' type="submit" value="Acessar Quizz" onclick="getAllQuizzOptions(${id})">`    
}