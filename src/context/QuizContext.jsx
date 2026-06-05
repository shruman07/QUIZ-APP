import { createContext, useContext, useState, useCallback } from "react";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quizState, setQuizState] = useState({
    questions: [],
    currentIndex: 0,
    answers: [], // { question, correctAnswer, userAnswer, isCorrect }
    category: null,
    difficulty: null,
    startTime: null,
    isActive: false,
  });

  const startQuiz = useCallback((questions, category, difficulty) => {
    setQuizState({
      questions,
      currentIndex: 0,
      answers: [],
      category,
      difficulty,
      startTime: Date.now(),
      isActive: true,
    });
  }, []);

  const answerQuestion = useCallback((userAnswer) => {
    setQuizState((prev) => {
      const current = prev.questions[prev.currentIndex];
      const isCorrect = userAnswer === current.correctAnswer;
      const answerRecord = {
        question: current.question,
        correctAnswer: current.correctAnswer,
        userAnswer,
        isCorrect,
      };
      return {
        ...prev,
        answers: [...prev.answers, answerRecord],
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);

  const skipQuestion = useCallback(() => {
    setQuizState((prev) => {
      const current = prev.questions[prev.currentIndex];
      return {
        ...prev,
        answers: [
          ...prev.answers,
          {
            question: current.question,
            correctAnswer: current.correctAnswer,
            userAnswer: null,
            isCorrect: false,
          },
        ],
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizState({
      questions: [],
      currentIndex: 0,
      answers: [],
      category: null,
      difficulty: null,
      startTime: null,
      isActive: false,
    });
  }, []);

  const isFinished = quizState.isActive && quizState.currentIndex >= quizState.questions.length && quizState.questions.length > 0;
  const correctCount = quizState.answers.filter((a) => a.isCorrect).length;
  const score = quizState.answers.length > 0 ? Math.round((correctCount / quizState.questions.length) * 100) : 0;

  return (
    <QuizContext.Provider
      value={{
        ...quizState,
        isFinished,
        correctCount,
        score,
        startQuiz,
        answerQuestion,
        skipQuestion,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
