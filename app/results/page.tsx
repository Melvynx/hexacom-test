"use client";

import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResultsPage() {
  const router = useRouter();
  const { results, answers, questionOrder, resetQuiz, computeResults } =
    useQuizStore();

  useEffect(() => {
    // Si pas de résultats mais des réponses, calculer les résultats
    if (!results && answers.length > 0) {
      computeResults();
    }

    // Si pas de réponses, rediriger vers la page de quiz
    if (answers.length === 0 || questionOrder.length === 0) {
      router.push("/quiz");
    }
  }, [results, answers.length, questionOrder.length, computeResults, router]);

  const handleRestart = () => {
    resetQuiz();
    router.push("/quiz");
  };

  if (!results) {
    return (
      <div className="container max-w-3xl mx-auto py-16 px-4 text-center">
        <p className="text-xl">Calcul de vos résultats en cours...</p>
      </div>
    );
  }

  if (!results || Object.keys(results.totals).length === 0) {
    return (
      <div className="container max-w-3xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Aucun résultat trouvé</h1>
        <p className="mb-8">
          Vous devez d'abord compléter le questionnaire pour voir vos résultats.
        </p>
        <Link href="/quiz">
          <Button>Commencer le test</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Vos résultats HEXACOMM
      </h1>
      <ResultsDisplay results={results} />

      <div className="mt-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          Ce test est conçu à titre éducatif uniquement. Pour une évaluation
          professionnelle complète, consultez un coach spécialisé en analyse
          comportementale.
        </p>

        <div className="flex justify-center">
          <Button variant="outline" onClick={handleRestart}>
            Refaire le test
          </Button>
        </div>
      </div>
    </div>
  );
}
