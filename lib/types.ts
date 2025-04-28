export type PcmType =
  | "Empathique"
  | "Travaillomane"
  | "Persévérant"
  | "Promoteur"
  | "Rebelle"
  | "Rêveur";

export type Dimension = "Motivation" | "Force" | "Stress";

export interface Question {
  id: string; // q001 … q108
  text: string;
  type: PcmType;
  dimension: Dimension;
}

export const SCALE = [
  { label: "Jamais", value: 0 },
  { label: "Rarement", value: 1 },
  { label: "Parfois", value: 2 },
  { label: "Souvent", value: 3 },
  { label: "Toujours", value: 4 },
];

export interface Answer {
  questionId: string;
  value: number;
}

export interface Results {
  base: PcmType;
  phase: PcmType;
  totals: Record<PcmType, number>;
  stressIndex: Partial<Record<PcmType, number>>;
  dimensionScores: Record<PcmType, Record<Dimension, number>>;
}
