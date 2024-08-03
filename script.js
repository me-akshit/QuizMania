const categoryParent = document.querySelector('.category')
const questionNumParent = document.querySelector('.questionNum')
const difficultyLevelParent = document.querySelector('.difficulty')
const startBtn = document.querySelector('.start')
const userInputForm = document.querySelector('.userInput')
const quizSection = document.querySelector('.quizSection')
const questionText = document.querySelector('.questionText')
const options = document.querySelectorAll('.options')
const next = document.querySelector('.next')
const countdown = document.querySelector('.countdown')
const countdownCircle= document.querySelector('.timer')
const userScoreElement=document.querySelector('.userScore')
const totalQuesElement=document.querySelector('.totalQues')
const saveScoreBtn=document.querySelector('.saveScore')
const playAgainBtn=document.querySelector('.playAgain')
const userName= document.querySelector('#name')

// score update Elements
const scoreContainer= document.querySelector('.container')
const highScoreSection=document.querySelector('.highScoreSection')
const highScorersParent=document.querySelectorAll('.highScorers')
const playerNameElement=document.querySelectorAll('.playerName')
const playertopScoreElement=document.querySelectorAll('.topScore')
const playerQuesElement=document.querySelectorAll('.userQuestions')

// question label update
const progress=document.querySelector('.progress')
const currentQuestionLabel=document.querySelector('.currentQuestionLabel')
const totalQuestionLabel=document.querySelector('.totalQuestionLabel')

// loader
const loader = document.querySelector('.loader')

// score messages
const compliment=document.querySelector('.compliment')
const scoreComment=document.querySelector('.scoreComment')

// local storage
let localHighScores=JSON.parse(localStorage.getItem('highscores')) || []


// Api call parameters-----
let categoryValue
let questionNum

// question count-----
let questionCount = 0

// Question and answer arrays-----
let questions
let answers
let correct_answer //correct answer
let correctAnswerDiv //div in which correct answer will be contained
let selectedAns

// handler variables
let score = 0
let timer = 30
let timerInterval;
let acceptingAnswers

let dataFetched

categoryParent.addEventListener('click', function (event) {
  if (event.target.classList.contains('categoryOpt')) {
    categoryParent.querySelectorAll('.categoryOpt').forEach(button=>{
      button.classList.remove('buttonBackground')
    })
    categoryValue = event.target.getAttribute('data-value')
    event.target.classList.add('buttonBackground')

    if((categoryValue || categoryValue==='') && questionNum && userName.value.trim()){
      startBtn.classList.add('buttonBackground')
      startBtn.style.color='white'
    }
  }
})

questionNumParent.addEventListener('click', function (event) {
  if (event.target.classList.contains('numOption')) {
    questionNum = parseInt(event.target.getAttribute('data-value'))
    questionNumParent.querySelectorAll('.numOption').forEach(button=>{
      button.classList.remove('buttonBackground')
    })
    event.target.classList.add('buttonBackground')

    if((categoryValue || categoryValue==='') && questionNum && userName.value.trim()){
      startBtn.classList.add('buttonBackground')
      startBtn.style.color='white'
    }
  }
})

userName.addEventListener('input', function() {
  if (categoryValue !== undefined && questionNum !== undefined && userName.value.trim() !== '') {
    startBtn.classList.add('buttonBackground')
    startBtn.style.color = 'white'
  }
})


startBtn.addEventListener('click', function (event) {
  if (categoryValue === undefined || questionNum === undefined || !userName.value.trim()) {
  } else {
    loader.style.display='block'
    fetch(
      `https://opentdb.com/api.php?amount=${questionNum}&category=${categoryValue}&type=multiple`
    )
      .then(response => response.json())
      .then(data => {
        if(data.results){
        loader.style.display='none'
        quizSection.style.display = 'flex'
        questions = data.results
        dataFetched=true
        startGame()
        }})
      .catch(error=>{
        console.log(error)
        dataFetched=false
        alert('Error fetching data. Please check your internet or try again later.')
      })

    userInputForm.style.display = 'none'
  }
})

window.addEventListener('load', loadQuizState);


function startGame () {
  selectedAns=0
  next.classList.remove('buttonBackground')
  countdown.innerHTML=timer
  acceptingAnswers = true

  questionText.innerHTML = questions[questionCount].question
  correct_answer = questions[questionCount].correct_answer

  // populating answers array with incorrect answer
  answers = [...questions[questionCount].incorrect_answers]

  // putting correct answer at random position in answers array
  const randomIndex = Math.floor(Math.random() * 4)
  answers.splice(randomIndex, 0, correct_answer)
  startTimer()

  options.forEach(function (element, index) {
    element.innerHTML = answers[index]
    if (answers[index] === correct_answer) {
      correctAnswerDiv = element
    }
  })

  options.forEach(option => {
    option.style.background = ''
  })
  questionCount++
  progress.style.width= `${(questionCount/questionNum)*100}%`
  currentQuestionLabel.innerHTML=questionCount
  totalQuestionLabel.innerHTML=questionNum
 
}





function startTimer () {
  timerInterval = setInterval(function () {
    if (timer <= 0) {
      endTimer()
    } else {
        timer--
      countdown.innerHTML = timer
      if(timer<20){
        timerStyles()
      }
      
    }

    

  },1000)

 

}

let nextQuestionInterval

function endTimer(){
    clearInterval(timerInterval)
    next.classList.add('buttonBackground')
    resetTimerStyles()
    acceptingAnswers = false
    timer=8
    nextQuestionInterval=setInterval(function(){
      if(timer>0){
        timer--
        countdown.innerHTML=timer
      }
      else{
        clearInterval(nextQuestionInterval)
        if(questionCount<questionNum){
          timer=30
          nextQuestionInterval=null
          startGame()
        }
        else{
          showScoreCard()
        }
      }
      
    },1000)

    correctAnswerDiv.style.background='rgb(0,171,102, 0.85)'
    
}

function clear8SecTimer(){
  clearInterval(nextQuestionInterval)
  nextQuesDisplayTime=null
  nextQuestionInterval=null
}

function timerStyles(){
  if(timer<20){
    countdown.classList.add('yellow')
  }

  if(timer<10){
    countdown.classList.add('red')
    countdownCircle.classList.add('pulse')
    countdown.classList.add('pulse')

  }
}

function resetTimerStyles(){
  countdown.classList.remove('yellow')
  countdown.classList.remove('red')
  countdown.style.color=''
  countdownCircle.classList.remove('pulse')
  countdown.classList.remove('pulse')
}

options.forEach(option => {
    option.addEventListener('click', function (event) {
      if (acceptingAnswers) {
        acceptingAnswers = false
        const index= event.target.getAttribute('data-value')
        selectedAns=index

        if (answers[index]===correct_answer) {
          clearInterval(timerInterval)

          next.classList.add('buttonBackground')

          // clearing timer pulsing styles and updation of timer
          countdownCircle.classList.remove('pulse')
          countdown.classList.remove('pulse')
          option.style.background = 'rgb(0,171,102, 0.85)'
          score++
        } else {
          clearInterval(timerInterval)
          next.classList.add('buttonBackground')
          countdownCircle.classList.remove('pulse')
          countdown.classList.remove('pulse')
          correctAnswerDiv.style.background = 'rgb(0,171,102, 0.85)'
          option.style.background = 'hsl(0, 100%, 60%,0.7)'
        }
        
      }
    })
  })


next.addEventListener('click', function () {
  if (!acceptingAnswers && questionCount<questionNum) {
    clear8SecTimer()
    resetTimerStyles()
    timer=30
    startGame()
  }
  else if(questionCount===questionNum){
    clear8SecTimer()
    showScoreCard()
  }
    
  })


  // Score card ------


function showScoreCard(){
  clearingGameCurrentState()
  userInputForm.style.display = 'none';
    quizSection.classList.add('hide')
    setTimeout(function(){
      quizSection.style.display='none'
      scoreContainer.style.display='flex'
    },300)

    userScoreElement.innerHTML=score
    totalQuesElement.innerHTML=questionNum
    highScoreUpdate()


}

saveScoreBtn.addEventListener('click', function(){
  

  const scoreObj = {
    username: userName.value.trim(),
    userscore: score,
    userquestions:questionNum
  }

  const existingIndex = localHighScores.findIndex(obj => obj.userscore === score && obj.username === userName.value.trim() && obj.userquestions === questionNum)
  if (existingIndex !== -1) return

  if(localHighScores.length<3){
    localHighScores.push(scoreObj)
    localHighScores.sort((a, b) => {
      const ratioA= a.userscore/a.userquestions
      const ratioB= b.userscore/b.userquestions
      return ratioB - ratioA
    })
    
  }
  else {
      const index = localHighScores.findIndex(obj =>{
        return (obj.userscore/obj.userquestions) < (score/questionNum)
      })

      if (index !== -1) {
        localHighScores.splice(index, 0, scoreObj)
        localHighScores.splice(localHighScores.length-1, 1)
      }
  
  }

  localStorage.setItem('highscores', JSON.stringify(localHighScores))
  highScoreUpdate()

})

// High score update through local storage

function highScoreUpdate() {
  highScorersParent.forEach((parent, index) => {
    if (localHighScores[index]) {
      highScoreSection.style.display='flex'
      parent.style.display = 'flex';
      playerNameElement[index].innerHTML = localHighScores[index].username;
      playertopScoreElement[index].innerHTML = localHighScores[index].userscore;
      playerQuesElement[index].innerHTML = localHighScores[index].userquestions;
    } else {
      parent.style.display = 'none';
    }
  })

  if(score/questionNum<0.4){
    compliment.innerHTML='Poor'
    scoreComment.innerHTML='Better luck next time'
  }
  else if(score/questionNum>=0.4 && score/questionNum<0.7){
    compliment.innerHTML='Good'
    scoreComment.innerHTML='Good going, you can do better'
  }
  else{
    compliment.innerHTML='Great'
    scoreComment.innerHTML='You are a genius'
  }
}

// Implementing session storage
function saveQuizState() {
  if(dataFetched && quizSection.style.display!=='none' && questionCount<=questionNum){
  const quizState = {
    dataFetched:dataFetched,
    questions: questions,
    questionCount: questionCount-1,
    selectedAns:selectedAns,
    score: score,
    timer: timer,
    acceptingAnswers: acceptingAnswers,
    correct_answer: correct_answer,
    correctAnswerDiv: correctAnswerDiv,
    categoryValue: categoryValue,
    questionNum: questionNum,
    userName: userName.value.trim()
  }

  if((selectedAns || nextQuestionInterval) && quizState.questionCount<questionNum){
    quizState.timer=30
    quizState.questionCount++
  }
  sessionStorage.setItem('quizState', JSON.stringify(quizState));
}
}


function loadQuizState() {
  const quizState = sessionStorage.getItem('quizState');

  if (quizState) {
    const state = JSON.parse(quizState);

    if(state.questionCount>= state.questionNum){
      score = state.score;
      categoryValue=state.categoryValue
      questionNum = state.questionNum;
      userName.value=state.userName
      showScoreCard()
    }else{
      dataFetched=state.dataFetched
      questions = state.questions;
      questionCount = state.questionCount;
      score = state.score;
      timer = state.timer;
      acceptingAnswers = state.acceptingAnswers;
      correct_answer = state.correct_answer;
      correctAnswerDiv = state.correctAnswerDiv;
      categoryValue = state.categoryValue;
      questionNum = state.questionNum;
      userName.value = state.userName;

      quizSection.style.display = 'flex';
      userInputForm.style.display = 'none';
      startGame()
    }
  }
}


window.addEventListener('beforeunload', saveQuizState)

function clearingGameCurrentState(){
  sessionStorage.clear()
  questionCount = 0;
  questions = null;
  answers = null;
  correct_answer = null;
  correctAnswerDiv = null;
  timer = 30;
  acceptingAnswers = false;
}



playAgainBtn.addEventListener('click', function() {
  questionCount = 0;
  score = 0;
  timer = 30;
  acceptingAnswers = false;
  questions = null;
  answers = null;
  correct_answer = null;
  correctAnswerDiv = null;

  scoreContainer.style.display = 'none';
  loader.style.display='block'

  // Fetch API call to start the game again
  fetch(`https://opentdb.com/api.php?amount=${questionNum}&category=${categoryValue}&type=multiple`)
    .then(response => response.json())
    .then(data => {
      dataFetched=true
      loader.style.display='none'
      quizSection.classList.remove('hide')
      quizSection.style.display='flex'
      questions = data.results;
      startGame();
    })
    .catch(error => {
      dataFetched=false
      console.log(error);
      alert('Error fetching data. Please check your internet or try again later.');
    })
})

// Responsive text change
function textChangeHandler(mediaQuery){
  const anyCategory=document.querySelector('#anyCategory')
  const generalKnowledge=document.querySelector('#generalKnowledge')

  if(mediaQuery.matches){
    anyCategory.textContent='Any'
    generalKnowledge.textContent='GK'
  }
  else{
    anyCategory.textContent='Any Category'
    generalKnowledge.textContent='General Knowledge'
  }
  
}

const mediaQuery=window.matchMedia('(max-width:360px)')
mediaQuery.addEventListener('change',textChangeHandler)

textChangeHandler(mediaQuery)