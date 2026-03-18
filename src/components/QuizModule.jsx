import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Contexts';
import '../styles/QuizModule.css';

/**
 * Quiz Module - Assessment system with questions, scoring, and feedback
 * Features: Multiple choice questions, timer, instant feedback, scoring logic
 */
const QuizModule = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/lms/quiz/${moduleId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to load quiz');
        const data = await response.json();

        setQuiz(data.quiz);
        setQuestions(data.questions || []);
        
        // Set timer if available
        const timeLimit = data.quiz?.time_limit_minutes || 30;
        setTimeRemaining(timeLimit * 60);
        setTimerActive(true);

        setError(null);
      } catch (err) {
        console.error('Quiz error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchQuiz();
  }, [moduleId, user]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || submitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, submitted]);

  const currentQuestion = questions[currentQuestionIdx];

  const handleSelectAnswer = (optionIndex) => {
    if (submitted) return; // Don't allow changes after submission

    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleJumpToQuestion = (idx) => {
    setCurrentQuestionIdx(idx);
  };

  const handleSubmitQuiz = async () => {
    try {
      setTimerActive(false);
      
      const response = await fetch(
        `/api/lms/quiz/${moduleId}/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answers: answers,
            time_taken_seconds: (quiz?.time_limit_minutes || 30) * 60 - timeRemaining
          })
        }
      );

      if (!response.ok) throw new Error('Failed to submit quiz');
      const data = await response.json();

      setQuizScore(data);
      setSubmitted(true);
      setTimerActive(false);
    } catch (err) {
      console.error('Submission error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isAnswered = answers[currentQuestion?.id] !== undefined;

  if (loading) {
    return (
      <div className="quiz-module loading">
        <div className="spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-module error">
        <div className="error-box">
          <h2>⚠️ Error Loading Quiz</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // Quiz Results View
  if (submitted && quizScore) {
    const isPassed = quizScore.score >= (quiz?.passing_score || 70);
    
    return (
      <div className="quiz-results">
        <div className="results-container">
          {/* Score Display */}
          <div className={`score-box ${isPassed ? 'passed' : 'failed'}`}>
            <div className="score-circle">
              <span className="score-number">{Math.round(quizScore.score)}</span>
              <span className="score-label">%</span>
            </div>
            {isPassed ? (
              <div className="success-message">
                <h2>🎉 Congratulations!</h2>
                <p>You passed the quiz with an excellent score!</p>
              </div>
            ) : (
              <div className="failure-message">
                <h2>⚠️ Quiz Not Passed</h2>
                <p>You need {quiz?.passing_score || 70}% to pass. Try again!</p>
              </div>
            )}
          </div>

          {/* Detailed Results */}
          <div className="results-details">
            <h3>Quiz Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Total Questions</span>
                <span className="value">{questions.length}</span>
              </div>
              <div className="summary-item">
                <span className="label">Correct Answers</span>
                <span className="value">{quizScore.correct_count} / {questions.length}</span>
              </div>
              <div className="summary-item">
                <span className="label">Time Taken</span>
                <span className="value">{quizScore.time_taken_formatted}</span>
              </div>
              <div className="summary-item">
                <span className="label">Passing Score</span>
                <span className="value">{quiz?.passing_score || 70}%</span>
              </div>
            </div>
          </div>

          {/* Question-by-Question Review */}
          <div className="question-review">
            <h3>Question Review</h3>
            {questions.map((q, idx) => {
              const answer = answers[q.id];
              const isCorrect = answer === q.correct_option;
              
              return (
                <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    <span className={`status-icon ${isCorrect ? '✓' : '✗'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="question-num">Question {idx + 1}</span>
                    <span className={`status ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="question-text">{q.question_text}</p>
                  <div className="options-review">
                    {q.options?.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`option-review ${
                          optIdx === answer ? 'selected' : ''
                        } ${optIdx === q.correct_option ? 'correct' : ''}`}
                      >
                        <span className="option-label">{String.fromCharCode(65 + optIdx)}</span>
                        <span className="option-text">{opt}</span>
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="explanation">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="results-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              ← Back to Module
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                window.location.reload(); // Reload quiz
              }}
            >
              {isPassed ? '✓ Continue →' : 'Retake Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking View
  return (
    <div className="quiz-module">
      {/* Header */}
      <div className="quiz-header">
        <div className="header-left">
          <h1>{quiz?.title || 'Quiz'}</h1>
          <p className="quiz-description">{quiz?.description}</p>
        </div>
        <div className="header-right">
          <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
          <div className="progress-indicator">
            {answeredCount} / {questions.length} answered
          </div>
        </div>
      </div>

      <div className="quiz-container">
        {/* Main Content */}
        <div className="quiz-content">
          {/* Question */}
          <div className="question-section">
            <div className="question-number">
              Question {currentQuestionIdx + 1} of {questions.length}
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`
                }}
              ></div>
            </div>
            <h2 className="question-text">{currentQuestion?.question_text}</h2>

            {/* Options */}
            <div className="options-container">
              {currentQuestion?.options?.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${
                    answers[currentQuestion.id] === index ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={submitted}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>

            {/* Question Tips/Hints */}
            {currentQuestion?.hint && (
              <div className="question-hint">
                <strong>💡 Hint:</strong> {currentQuestion.hint}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="quiz-sidebar">
          {/* Questions Overview */}
          <div className="questions-overview">
            <h3>Questions</h3>
            <div className="questions-grid">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  className={`question-btn ${
                    idx === currentQuestionIdx ? 'current' : ''
                  } ${answers[q.id] !== undefined ? 'answered' : ''}`}
                  onClick={() => handleJumpToQuestion(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Info */}
          <div className="quiz-info">
            <h4>Quiz Info</h4>
            <p>
              <strong>Type:</strong> {quiz?.quiz_type || 'Multiple Choice'}
            </p>
            <p>
              <strong>Pass Score:</strong> {quiz?.passing_score || 70}%
            </p>
            <p>
              <strong>Attempts:</strong> {quiz?.max_attempts || 'Unlimited'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="quiz-navigation">
        <button
          className="btn-secondary"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIdx === 0}
        >
          ← Previous
        </button>

        <div className="nav-center">
          {isAnswered && (
            <span className="answered-badge">✓ Question Answered</span>
          )}
        </div>

        {currentQuestionIdx < questions.length - 1 ? (
          <button
            className="btn-secondary"
            onClick={handleNextQuestion}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn-primary submit-btn"
            onClick={handleSubmitQuiz}
            disabled={answeredCount < questions.length}
          >
            ✓ Submit Quiz
          </button>
        )}
      </div>

      {/* Warning if not all answered */}
      {answeredCount < questions.length && currentQuestionIdx === questions.length - 1 && (
        <div className="warning-message">
          ⚠️ You have not answered all questions. Complete all questions before submitting.
        </div>
      )}
    </div>
  );
};

export default QuizModule;
