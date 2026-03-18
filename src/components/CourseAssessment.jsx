import { useState, useEffect } from 'react';
import { assessmentQuestions } from '../data/assessmentQuestions';

const CourseAssessment = ({ courseId, onClose, userId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  // Map numeric course IDs to question sets
  const getQuestionsForCourse = () => {
    const courseIdMap = {
      '1': 'set1',  // Soil Preparation
      '2': 'set2',  // Irrigation
      '3': 'set3',  // Organic Farming
      '4': 'set4',  // Pest Management
      '5': 'set5'   // Crop Rotation
    };
    
    const setKey = courseIdMap[courseId] || 'set1';
    return assessmentQuestions[setKey]?.questions || [];
  };

  const questions = getQuestionsForCourse();
  const currentQuestion = questions[currentQuestionIndex] || {};

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    setScore(percentage);
    const passed = correctCount >= 6; // 6 or more correct answers required
    setIsPassed(passed);

    // Save certificate if passed
    if (passed) {
      saveCertificate(correctCount, percentage);
    }

    setShowResults(true);
  };

  const saveCertificate = (correctCount, percentage) => {
    const certificates = JSON.parse(localStorage.getItem('courseCertificates') || '[]');
    
    // Map numeric course IDs to certificate course mapping
    const courseIdMap = {
      '1': 'soil-health',
      '2': 'irrigation',
      '3': 'organic-farming',
      '4': 'pest-management',
      '5': 'crop-rotation'
    };
    
    const certificate = {
      id: `cert_${Date.now()}`,
      courseId: courseIdMap[courseId] || courseId,
      userId: userId || 'user',
      correctAnswers: correctCount,
      score: percentage,
      totalQuestions: questions.length,
      completionDate: new Date().toLocaleDateString(),
      completionTime: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    };
    certificates.push(certificate);
    localStorage.setItem('courseCertificates', JSON.stringify(certificates));

    // Dispatch event for certificate earned
    window.dispatchEvent(new CustomEvent('certificateEarned', { detail: certificate }));
  };

  if (!questions.length) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-md w-full mx-4">
          <p className="text-center text-gray-600 dark:text-gray-300">No assessment available for this course.</p>
          <button
            onClick={onClose}
            className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showResults ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Course Assessment
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? 'border-primary bg-primary'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {selectedAnswers[currentQuestionIndex] === index && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  Submit Assessment
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Results Screen */}
            <div className="text-center">
              <div className="mb-8">
                {isPassed ? (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      Congratulations!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You have successfully completed the assessment
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      Assessment Complete
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You need at least 60% to earn a certificate
                    </p>
                  </>
                )}
              </div>

              {/* Score Display */}
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl mb-8">
                <div className="text-center">
                  <div className={`text-5xl font-bold mb-2 ${
                    isPassed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {score}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    You answered {Object.keys(selectedAnswers).length} out of {questions.length} questions correctly
                  </p>
                </div>
              </div>

              {/* Certificate Status */}
              {isPassed && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-xl mb-8">
                  <p className="text-green-800 dark:text-green-300 font-semibold">
                    ✓ Certificate has been awarded to your profile!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                    You can view it in your profile under "Certificates" tab
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
                >
                  {isPassed ? 'View Certificate' : 'Close'}
                </button>
                {!isPassed && (
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers({});
                      setShowResults(false);
                      setScore(0);
                    }}
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Retry Assessment
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseAssessment;
