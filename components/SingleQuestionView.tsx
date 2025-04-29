import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup } from "@/components/ui/radio-group";
import { useQuizStore } from "@/lib/store";
import { SCALE } from "@/lib/types";
import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function SingleQuestionView() {
  const router = useRouter();
  const { lang, ...store } = useQuizStore();

  // Initialiser l'ordre des questions si nécessaire
  useEffect(() => {
    if (store.questionOrder.length === 0) {
      store.initialize();
    }
  }, [store.initialize, store.questionOrder.length]);

  const currentQuestion = store.getCurrentQuestion();
  const currentAnswer = currentQuestion
    ? store.getAnswer(currentQuestion.id)
    : undefined;
  const progress =
    store.questionOrder.length > 0
      ? ((store.currentQuestionIndex + 1) / store.questionOrder.length) * 100
      : 0;
  const isLastQuestion =
    store.currentQuestionIndex === store.questionOrder.length - 1;
  const allQuestionsAnswered =
    store.questionOrder.length > 0 &&
    store.answers.length === store.questionOrder.length;

  const handleValueChange = (value: number) => {
    if (currentQuestion) {
      store.answerQuestion(currentQuestion.id, value);
    }
  };

  const handlePrevious = () => {
    store.goToPreviousQuestion();
  };

  const handleNext = () => {
    if (currentQuestion && store.hasAnswer(currentQuestion.id)) {
      store.goToNextQuestion();
    }
  };

  const handleFinish = () => {
    store.computeResults();
    router.push("/results");
  };

  // Raccourcis clavier pour répondre aux questions (touches 1-5)
  useHotkeys("1", () => currentQuestion && handleValueChange(0), [
    currentQuestion,
  ]);
  useHotkeys("2", () => currentQuestion && handleValueChange(1), [
    currentQuestion,
  ]);
  useHotkeys("3", () => currentQuestion && handleValueChange(2), [
    currentQuestion,
  ]);
  useHotkeys("4", () => currentQuestion && handleValueChange(3), [
    currentQuestion,
  ]);
  useHotkeys("5", () => currentQuestion && handleValueChange(4), [
    currentQuestion,
  ]);

  // Raccourci pour passer à la question suivante ou terminer (touche Enter)
  useHotkeys(
    "enter",
    () => {
      if (currentQuestion && store.hasAnswer(currentQuestion.id)) {
        if (isLastQuestion) {
          handleFinish();
        } else {
          handleNext();
        }
      }
    },
    [currentQuestion, store.hasAnswer, isLastQuestion]
  );

  // Raccourci pour revenir à la question précédente (touche Backspace)
  useHotkeys("backspace", handlePrevious, []);

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {store.currentQuestionIndex === 0 && (
        <div className="mb-6 p-4 bg-accent/20 rounded-lg">
          <h2 className="font-medium mb-2">Comment ça marche :</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>
              Choisissez l'option qui vous correspond le mieux pour chaque
              question
            </li>
            <li>
              Utilisez les touches{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">1</kbd> à{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">5</kbd> pour
              répondre rapidement
            </li>
            <li>
              Appuyez sur{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Entrée</kbd>{" "}
              pour passer à la question suivante
            </li>
            <li>
              Utilisez{" "}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Retour</kbd>{" "}
              pour revenir en arrière
            </li>
          </ol>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {store.currentQuestionIndex + 1} sur{" "}
            {store.questionOrder.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {lang === "en" ? currentQuestion.en : currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={
              currentAnswer !== undefined ? currentAnswer.toString() : undefined
            }
            onValueChange={(value) => handleValueChange(parseInt(value))}
            className="grid grid-cols-1 gap-3"
            key={currentQuestion.id}
          >
            {SCALE.map((option, index) => (
              <RadioGroupPrimitive.Item
                key={option.value}
                className={cn(buttonVariants({ variant: "outline" }), {
                  "!border-primary": currentAnswer === option.value,
                })}
                value={option.value.toString()}
              >
                <div className="size-3 rounded-full border border-primary flex items-center justify-center">
                  <RadioGroupPrimitive.Indicator
                    data-slot="radio-group-indicator"
                    className="relative flex items-center justify-center"
                  >
                    <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
                  </RadioGroupPrimitive.Indicator>
                </div>
                <Label
                  htmlFor={`${currentQuestion.id}-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  <span className="mr-2 text-xs text-muted-foreground">
                    {index + 1}.
                  </span>{" "}
                  {option.label}
                </Label>
              </RadioGroupPrimitive.Item>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={store.currentQuestionIndex === 0}
          >
            Précédent
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleFinish}
              disabled={!store.hasAnswer(currentQuestion.id)}
            >
              Terminer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!store.hasAnswer(currentQuestion.id)}
            >
              Suivant
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          {store.answers.length} questions répondues sur{" "}
          {store.questionOrder.length}
        </p>
        {allQuestionsAnswered && (
          <Button onClick={handleFinish} variant="link" className="mt-2">
            Voir les résultats
          </Button>
        )}
      </div>
    </div>
  );
}
