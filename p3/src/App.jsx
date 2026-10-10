import { useEffect, useState } from 'react'
import './App.css'

const QUIZ_DURATION = 60

const questions = [
  {
    category: 'GEOGRAPHY',
    prompt: 'What is the capital city of Australia?',
    options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'],
    correctAnswer: 1,
  },
  {
    category: 'NATURE',
    prompt: 'Which is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3,
  },
  {
    category: 'TECHNOLOGY',
    prompt: 'What does HTML stand for?',
    options: [
      'HyperText Markup Language',
      'High Transfer Machine Logic',
      'Home Tool Markup Language',
      'Hyperlink Text Management Language',
    ],
    correctAnswer: 0,
  },
  {
    category: 'SCIENCE',
    prompt: 'What process do plants use to turn sunlight into energy?',
    options: ['Respiration', 'Fermentation', 'Photosynthesis', 'Evaporation'],
    correctAnswer: 2,
  },
  {
    category: 'SPACE',
    prompt: 'Which planet is best known for its prominent rings?',
    options: ['Jupiter', 'Neptune', 'Uranus', 'Saturn'],
    correctAnswer: 3,
  },
]

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function App() {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [secondsRemaining, setSecondsRemaining] = useState(QUIZ_DURATION)
  const [phase, setPhase] = useState('playing')

  useEffect(() => {
    if (phase !== 'playing' || secondsRemaining === 0) return undefined

    const timerId = window.setTimeout(() => {
      setSecondsRemaining(secondsRemaining - 1)
    }, 1000)

    return () => window.clearTimeout(timerId)
  }, [phase, secondsRemaining])

  const currentQuestion = questions[questionIndex]
  const selectedAnswer = answers[questionIndex]
  const isFinished = phase === 'finished' || secondsRemaining === 0
  const score = answers.reduce(
    (total, answer, index) => total + (answer === questions[index].correctAnswer ? 1 : 0),
    0,
  )

  function selectAnswer(optionIndex) {
    setAnswers((currentAnswers) =>
      currentAnswers.map((answer, index) => index === questionIndex ? optionIndex : answer),
    )
  }

  function moveToNextQuestion() {
    if (questionIndex === questions.length - 1) {
      setPhase('finished')
      return
    }

    setQuestionIndex((currentIndex) => currentIndex + 1)
  }

  function restartQuiz() {
    setQuestionIndex(0)
    setAnswers(Array(questions.length).fill(null))
    setSecondsRemaining(QUIZ_DURATION)
    setPhase('playing')
  }

  const isLowTime = secondsRemaining <= 15

  return (
    <main className="quiz-page">
      <header className="topbar">
        <a className="brand" href="#quiz" aria-label="Quick Study home">QS<span>.</span></a>
        <span className="topbar-title">QUICK STUDY / GENERAL KNOWLEDGE</span>
        <span className="topbar-edition">EDITION 01</span>
      </header>

      <section className="quiz-heading" id="quiz">
        <div>
          <p className="eyebrow"><span /> FIVE QUESTIONS. ONE MINUTE.</p>
          <h1>Curiosity<br /><em>under pressure.</em></h1>
        </div>
        <p className="heading-aside">A quick tour through the things worth knowing.</p>
      </section>

      <section className="quiz-shell" aria-label="Timed general knowledge quiz">
        {!isFinished ? (
          <>
            <div className="quiz-meta">
              <div className="progress-copy">
                <span>QUESTION</span>
                <strong>{String(questionIndex + 1).padStart(2, '0')} <i>/</i> {String(questions.length).padStart(2, '0')}</strong>
              </div>
              <div className={`timer ${isLowTime ? 'timer-low' : ''}`} role="timer" aria-label={`${formatTime(secondsRemaining)} remaining`}>
                <span className="timer-label">TIME LEFT</span>
                <strong>{formatTime(secondsRemaining)}</strong>
              </div>
            </div>

            <div className="progress-track" aria-label={`Question ${questionIndex + 1} of ${questions.length}`}>
              <span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
            </div>

            <div className="question-content" key={questionIndex}>
              <p className="question-category">{currentQuestion.category}</p>
              <h2>{currentQuestion.prompt}</h2>
              <fieldset className="answer-list">
                <legend className="visually-hidden">Choose one answer</legend>
                {currentQuestion.options.map((option, optionIndex) => (
                  <label className={`answer-option ${selectedAnswer === optionIndex ? 'is-selected' : ''}`} key={option}>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      checked={selectedAnswer === optionIndex}
                      onChange={() => selectAnswer(optionIndex)}
                    />
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span className="option-text">{option}</span>
                    <span className="option-indicator" aria-hidden="true" />
                  </label>
                ))}
              </fieldset>
            </div>

            <div className="quiz-actions">
              <span className="answer-hint">{selectedAnswer === undefined || selectedAnswer === null ? 'Choose your answer to continue' : 'Answer saved'}</span>
              <button className="next-button" type="button" onClick={moveToNextQuestion}>
                {questionIndex === questions.length - 1 ? 'Finish quiz' : 'Next question'}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        ) : (
          <div className="results-view">
            <p className="question-category">QUIZ COMPLETE</p>
            <h2>{secondsRemaining === 0 ? 'Time is up.' : 'Nicely done.'}</h2>
            <div className="score-line">
              <strong>{score}<span> / {questions.length}</span></strong>
              <p>correct answers</p>
            </div>
            <p className="results-note">
              {score === questions.length
                ? 'A perfect round. Your curiosity is showing.'
                : 'Every answer is another thing learned.'}
            </p>
            <div className="results-list" aria-label="Answer review">
              {questions.map((question, index) => (
                <div className="result-row" key={question.prompt}>
                  <span className={answers[index] === question.correctAnswer ? 'result-mark is-correct' : 'result-mark'}>
                    {answers[index] === question.correctAnswer ? '✓' : '×'}
                  </span>
                  <span>{question.prompt}</span>
                  {answers[index] !== question.correctAnswer && (
                    <small>Answer: {question.options[question.correctAnswer]}</small>
                  )}
                </div>
              ))}
            </div>
            <button className="next-button restart-button" type="button" onClick={restartQuiz}>
              Play again <span aria-hidden="true">↻</span>
            </button>
          </div>
        )}
      </section>

      <footer className="page-footer">
        <span>TRUST YOUR FIRST THOUGHT</span>
        <span>QUICK STUDY <span aria-hidden="true">/</span> 01</span>
      </footer>
    </main>
  )
}

export default App
