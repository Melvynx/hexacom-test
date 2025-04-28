"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuizStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { initialize, resetQuiz } = useQuizStore();

  const handleStartQuiz = () => {
    resetQuiz();
    initialize();
    router.push("/quiz");
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Test HEXACOMM
        </h1>
        <p className="text-xl text-muted-foreground">
          Découvrez votre profil de personnalité selon le modèle HEXACOMM
        </p>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Qu'est-ce que le modèle HEXACOMM?</CardTitle>
          <CardDescription>
            Un outil puissant pour comprendre votre personnalité et vos
            interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Le modèle HEXACOMM est un outil psychométrique qui identifie 6 types
            de personnalité distincts. Contrairement à d'autres tests, HEXACOMM
            reconnaît que chacun possède un mélange unique de ces types, avec
            une dominante (Base) et une secondaire (Phase).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">6 types de personnalité</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Empathique - Chaleureux et attentif</li>
                <li>Travaillomane - Organisé et logique</li>
                <li>Persévérant - Dévoué et observateur</li>
                <li>Promoteur - Persuasif et adaptatif</li>
                <li>Rebelle - Spontané et créatif</li>
                <li>Rêveur - Réfléchi et imaginatif</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">3 dimensions analysées</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Motivation - Ce qui vous dynamise</li>
                <li>Force - Vos talents naturels</li>
                <li>Stress - Vos réactions sous pression</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>À propos de ce test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Ce test comporte 108 questions qui vous seront présentées une par
            une. Pour chaque affirmation, indiquez la fréquence à laquelle elle
            s'applique à vous.
          </p>
          <p>
            Comptez environ 15-20 minutes pour compléter le questionnaire. Pour
            des résultats fiables, répondez de manière spontanée et honnête.
          </p>
          <div className="bg-muted p-4 rounded-md mt-4">
            <p className="text-sm">
              Note: Cette version est conçue à titre éducatif uniquement. Pour
              une analyse professionnelle certifiée, consultez un coach
              spécialisé.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" className="px-8" onClick={handleStartQuiz}>
          Commencer le test
        </Button>
      </div>
    </div>
  );
}
