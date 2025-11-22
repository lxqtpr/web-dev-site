const quizData = [
    {
        question: "А когда с человеком может произойти дрожемент?",
        answers: [
            { text: "Когда он влюбляется", correct: false },
            { text: "Когда он идет шопиться", correct: false },
            { text: "Когда он слышит смешную шутку", correct: false },
            { text: "Когда он боится, пугается", correct: true, explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»." }
        ]
    },
    {
        question: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
            { text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", correct: false },
            { text: "Антон очень надоедливый и въедливый человек, всех задолбал", correct: false },
            { text: "Молодец, Антон, всех победил!", correct: true, explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»." },
            { text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", correct: false }
        ]
    },
    {
        question: "А фразу «заскамить мамонта» как понимать?",
        answers: [
            { text: "Разозлить кого-то из родителей", correct: false },
            { text: "Увлекаться археологией", correct: false },
            { text: "Развести недотепу на деньги", correct: true, explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца." },
            { text: "Оскорбить пожилого человека", correct: false }
        ]
    },
    {
        question: "Кто такие бефефе?",
        answers: [
            { text: "Вши?", correct: false },
            { text: "Милые котики, такие милые, что бефефе", correct: false },
            { text: "Лучшие друзья", correct: true, explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever." },
            { text: "Люди, которые не держат слово", correct: false }
        ]
    }
];

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let totalQuestions = quizData.length;
let answeredQuestions = [];
let isAnswering = false;

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function initQuiz() {
    shuffledQuestions = shuffle(quizData).map(q => ({
        ...q,
        answers: shuffle(q.answers)
    }));

    answeredQuestions = new Array(totalQuestions).fill(null);
    showNextQuestion();
}

function showNextQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        showEndMessage();
        return;
    }

    const question = shuffledQuestions[currentQuestionIndex];
    const quizArea = document.getElementById('quizArea');

    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';
    questionBlock.dataset.index = currentQuestionIndex;

    const questionHeader = document.createElement('div');
    questionHeader.className = 'question-header';

    const questionNumber = document.createElement('div');
    questionNumber.className = 'question-number';
    questionNumber.textContent = `${currentQuestionIndex + 1}.`;

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = question.question;

    questionHeader.appendChild(questionNumber);
    questionHeader.appendChild(questionText);
    questionBlock.appendChild(questionHeader);

    const answersContainer = document.createElement('div');
    answersContainer.className = 'answers-container';

    question.answers.forEach((answer, index) => {
        const answerBlock = document.createElement('div');
        answerBlock.className = 'answer-block';
        answerBlock.textContent = answer.text;
        answerBlock.dataset.answerIndex = index;

        answerBlock.addEventListener('mousedown', () => {
            if (!isAnswering) {
                answerBlock.classList.add('active');
            }
        });

        answerBlock.addEventListener('mouseleave', () => {
            answerBlock.classList.remove('active');
        });

        answerBlock.addEventListener('click', () => handleAnswerClick(answer, answerBlock, questionBlock, answersContainer));

        answersContainer.appendChild(answerBlock);
    });

    questionBlock.appendChild(answersContainer);
    quizArea.appendChild(questionBlock);

    questionBlock.addEventListener('mousedown', () => {
        if (!isAnswering) {
            questionBlock.classList.add('active');
        }
    });

    questionBlock.addEventListener('mouseup', () => {
        questionBlock.classList.remove('active');
    });

    questionBlock.addEventListener('mouseleave', () => {
        questionBlock.classList.remove('active');
    });
}

// Обработка клика по ответу
function handleAnswerClick(answer, answerBlock, questionBlock, answersContainer) {
    if (isAnswering) return;

    isAnswering = true;
    const questionIndex = currentQuestionIndex;

    // Сохраняем результат
    answeredQuestions[questionIndex] = {
        correct: answer.correct,
        question: shuffledQuestions[questionIndex].question,
        correctAnswer: shuffledQuestions[questionIndex].answers.find(a => a.correct)
    };

    if (answer.correct) {
        correctAnswersCount++;
        handleCorrectAnswer(answerBlock, questionBlock, answersContainer, answer.explanation);
    } else {
        handleIncorrectAnswer(questionBlock, answersContainer);
    }

    currentQuestionIndex++;
}

function handleCorrectAnswer(answerBlock, questionBlock, answersContainer, explanation) {
    const marker = document.createElement('div');
    marker.className = 'answer-marker correct';
    marker.textContent = '✓';
    questionBlock.querySelector('.question-header').appendChild(marker);

    answerBlock.classList.add('correct-answer');

    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'answer-explanation';
    explanationDiv.textContent = explanation;
    answerBlock.appendChild(explanationDiv);

    const allAnswers = answersContainer.querySelectorAll('.answer-block');
    allAnswers.forEach(block => {
        if (block !== answerBlock) {
            setTimeout(() => {
                block.classList.add('slide-right');
            }, 500);
        }
    });

    setTimeout(() => {
        answerBlock.classList.add('fade-out');
    }, 2000);

    setTimeout(() => {
        questionBlock.classList.add('slide-right');
        setTimeout(() => {
            questionBlock.remove();
            isAnswering = false;
            showNextQuestion();
        }, 1000);
    }, 2500);
}

function handleIncorrectAnswer(questionBlock, answersContainer) {
    const marker = document.createElement('div');
    marker.className = 'answer-marker incorrect';
    marker.textContent = '✗';
    questionBlock.querySelector('.question-header').appendChild(marker);

    const allAnswers = answersContainer.querySelectorAll('.answer-block');
    setTimeout(() => {
        allAnswers.forEach(block => {
            block.classList.add('slide-right');
        });
    }, 500);

    setTimeout(() => {
        questionBlock.classList.add('slide-right');
        setTimeout(() => {
            questionBlock.remove();
            isAnswering = false;
            showNextQuestion();
        }, 1000);
    }, 2000);
}

function showEndMessage() {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = 'Вопросы закончились';

    showStatistics();
    showAnsweredQuestions();
}

function showStatistics() {
    const statistics = document.getElementById('statistics');
    statistics.innerHTML = `
        <h2>Результаты</h2>
        <p>Правильных ответов: <strong>${correctAnswersCount}</strong> из <strong>${totalQuestions}</strong></p>
        <p>Процент: <strong>${Math.round((correctAnswersCount / totalQuestions) * 100)}%</strong></p>
    `;
    statistics.classList.add('show');
}

function showAnsweredQuestions() {
    const quizArea = document.getElementById('quizArea');

    answeredQuestions.forEach((result, index) => {
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block answered';
        questionBlock.dataset.index = index;

        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';

        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = `${index + 1}.`;

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = result.question;

        const marker = document.createElement('div');
        marker.className = `answer-marker ${result.correct ? 'correct' : 'incorrect'}`;
        marker.textContent = result.correct ? '✓' : '✗';

        questionHeader.appendChild(questionNumber);
        questionHeader.appendChild(questionText);
        questionHeader.appendChild(marker);
        questionBlock.appendChild(questionHeader);

        const hiddenAnswer = document.createElement('div');
        hiddenAnswer.className = 'hidden-answer';
        hiddenAnswer.textContent = `Правильный ответ: ${result.correctAnswer.text}`;
        if (result.correctAnswer.explanation) {
            const explanationDiv = document.createElement('div');
            explanationDiv.style.marginTop = '10px';
            explanationDiv.style.fontStyle = 'italic';
            explanationDiv.textContent = result.correctAnswer.explanation;
            hiddenAnswer.appendChild(explanationDiv);
        }
        questionBlock.appendChild(hiddenAnswer);

        questionBlock.addEventListener('click', () => {
            document.querySelectorAll('.question-block.answered').forEach(block => {
                if (block !== questionBlock) {
                    block.classList.remove('show-answer');
                }
            });

            questionBlock.classList.toggle('show-answer');
        });

        quizArea.appendChild(questionBlock);
    });
}

document.addEventListener('DOMContentLoaded', initQuiz);
