import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QUESTIONS } from "./data";
import { computeScore } from "./scoring";
import { Answer, Question, Results } from "./types";

interface QuizState {
  // Questions et ordre
  questionOrder: string[]; // IDs des questions dans un ordre aléatoire
  currentQuestionIndex: number;
  answers: Answer[];
  results: Results | null;

  // Actions
  initialize: () => void;
  answerQuestion: (questionId: string, value: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  getCurrentQuestion: () => Question | null;
  computeResults: () => Results;
  resetQuiz: () => void;
  hasAnswer: (questionId: string) => boolean;
  getAnswer: (questionId: string) => number | undefined;
}

// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questionOrder: [],
      currentQuestionIndex: 0,
      answers: [],
      results: null,

      initialize: () => {
        const questionIds = QUESTIONS.map((q) => q.id);
        const shuffledQuestionIds = shuffleArray(questionIds);

        set({
          questionOrder: shuffledQuestionIds,
          currentQuestionIndex: 0,
          answers: [],
          results: null,
        });
      },

      answerQuestion: (questionId: string, value: number) => {
        const { answers } = get();
        const existingAnswerIndex = answers.findIndex(
          (a) => a.questionId === questionId
        );

        if (existingAnswerIndex >= 0) {
          // Mise à jour d'une réponse existante
          const newAnswers = [...answers];
          newAnswers[existingAnswerIndex] = { questionId, value };
          set({ answers: newAnswers });
        } else {
          // Nouvelle réponse
          set({ answers: [...answers, { questionId, value }] });
        }
      },

      goToNextQuestion: () => {
        const { currentQuestionIndex, questionOrder } = get();
        if (currentQuestionIndex < questionOrder.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      goToPreviousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      getCurrentQuestion: () => {
        const { questionOrder, currentQuestionIndex } = get();
        if (questionOrder.length === 0) return null;

        const currentQuestionId = questionOrder[currentQuestionIndex];
        const question =
          QUESTIONS.find((q) => q.id === currentQuestionId) || null;
        return question as Question | null;
      },

      computeResults: () => {
        const { answers } = get();
        const results = computeScore(answers);
        set({ results });
        return results;
      },

      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: [],
          results: null,
        });
      },

      hasAnswer: (questionId: string) => {
        const { answers } = get();
        return answers.some((a) => a.questionId === questionId);
      },

      getAnswer: (questionId: string) => {
        const { answers } = get();
        return answers.find((a) => a.questionId === questionId)?.value;
      },
    }),
    {
      name: "hexacomm-quiz-storage",
      partialize: (state) => ({
        questionOrder: state.questionOrder,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
      }),
    }
  )
);
