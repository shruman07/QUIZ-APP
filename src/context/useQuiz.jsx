import { useContext } from "react";
import QuizContext from "./QuizContext";

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    console.warn("useQuiz must be used inside QuizProvider");
    return {
      questions: [],
      currentIndex: 0,
      answers: [],
      category: null,
      difficulty: null,
      startTime: null,
      isActive: false,
      isFinished: false,
      correctCount: 0,
      score: 0,
      startQuiz: () => {},
      answerQuestion: () => {},
      skipQuestion: () => {},
      resetQuiz: () => {},
    };
  }
  return ctx;
}
