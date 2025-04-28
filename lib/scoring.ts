import { QUESTIONS } from "./data";
import { Answer, Dimension, PcmType, Question, Results } from "./types";

export function computeScore(answers: Answer[]): Results {
  const pcmTypes: PcmType[] = [
    "Empathique",
    "Travaillomane",
    "Persévérant",
    "Promoteur",
    "Rebelle",
    "Rêveur",
  ];

  // Initialize scores
  const totals: Record<PcmType, number> = {
    Empathique: 0,
    Travaillomane: 0,
    Persévérant: 0,
    Promoteur: 0,
    Rebelle: 0,
    Rêveur: 0,
  };

  const dimensionScores: Record<
    PcmType,
    Record<Dimension, number>
  > = {} as Record<PcmType, Record<Dimension, number>>;
  pcmTypes.forEach((type) => {
    dimensionScores[type] = {
      Motivation: 0,
      Force: 0,
      Stress: 0,
    };
  });

  // Count responses by value
  const countByTypeAndValue: Record<
    PcmType,
    Record<number, number>
  > = {} as Record<PcmType, Record<number, number>>;
  pcmTypes.forEach((type) => {
    countByTypeAndValue[type] = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };
  });

  // Calculate totals
  answers.forEach((answer) => {
    const question = QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) return;

    // @ts-expect-error osef
    totals[question.type] += answer.value;
    // @ts-expect-error osef
    dimensionScores[question.type][question.dimension] += answer.value;
    // @ts-expect-error osef
    countByTypeAndValue[question.type][answer.value]++;
  });

  // Determine base and phase
  let base: PcmType = pcmTypes[0];
  let phase: PcmType = pcmTypes[0];
  let maxScore = -1;
  let secondMaxScore = -1;

  pcmTypes.forEach((type) => {
    if (totals[type] > maxScore) {
      secondMaxScore = maxScore;
      phase = base;
      maxScore = totals[type];
      base = type;
    } else if (totals[type] > secondMaxScore) {
      secondMaxScore = totals[type];
      phase = type;
    }
  });

  // Tie-breaking logic
  const tiedTypes = pcmTypes.filter((type) => totals[type] === maxScore);
  if (tiedTypes.length > 1) {
    // First check "Toujours (4)" responses
    let maxCountToujours = -1;
    tiedTypes.forEach((type) => {
      if (countByTypeAndValue[type][4] > maxCountToujours) {
        maxCountToujours = countByTypeAndValue[type][4];
        base = type;
      }
    });

    // If still tied, check "Souvent (3)"
    const tiedTypesToujours = tiedTypes.filter(
      (type) => countByTypeAndValue[type][4] === maxCountToujours
    );
    if (tiedTypesToujours.length > 1) {
      let maxCountSouvent = -1;
      tiedTypesToujours.forEach((type) => {
        if (countByTypeAndValue[type][3] > maxCountSouvent) {
          maxCountSouvent = countByTypeAndValue[type][3];
          base = type;
        }
      });
    }
  }

  // Calculate stress index for dominant types
  const stressIndex: Partial<Record<PcmType, number>> = {
    [base]: dimensionScores[base].Stress,
    [phase]: dimensionScores[phase].Stress,
  };

  return {
    base,
    phase,
    totals,
    stressIndex,
    dimensionScores,
  };
}

export function getQuestionsForPage(
  page: number,
  questionsPerPage: number = 12
): Question[] {
  const startIndex = (page - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  return QUESTIONS.slice(startIndex, endIndex) as Question[];
}

export function getTotalPages(questionsPerPage: number = 12): number {
  return Math.ceil(QUESTIONS.length / questionsPerPage);
}
