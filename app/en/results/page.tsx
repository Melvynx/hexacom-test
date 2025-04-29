"use client";

import { ResultsDisplayEn } from "@/components/ResultsDisplayEn";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResultsPageEn() {
  const router = useRouter();
  const { results, answers, questionOrder, resetQuiz, computeResults } =
    useQuizStore();

  useEffect(() => {
    if (!results && answers.length > 0) {
      computeResults();
    }
    if (answers.length === 0 || questionOrder.length === 0) {
      router.push("/en/quiz");
    }
  }, [results, answers.length, questionOrder.length, computeResults, router]);

  const handleRestart = () => {
    resetQuiz();
    router.push("/en/quiz");
  };

  if (!results) {
    return (
      <div className="container max-w-3xl mx-auto py-16 px-4 text-center">
        <p className="text-xl">Calculating your results...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your HEXACOMM Results
      </h1>
      <ResultsDisplayEn results={results} />
      <div className="mt-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          This test is for educational purposes only. For a professional
          assessment, consult a certified coach.
        </p>
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleRestart}>
            Retake the test
          </Button>
        </div>
      </div>
    </div>
  );
}
