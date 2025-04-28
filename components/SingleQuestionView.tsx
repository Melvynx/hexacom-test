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

export function SingleQuestionView() {
  const router = useRouter();
  const {
    initialize,
    getCurrentQuestion,
    answerQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    questionOrder,
    currentQuestionIndex,
    getAnswer,
    hasAnswer,
    answers,
    computeResults,
  } = useQuizStore();

  // Initialiser l'ordre des questions si nécessaire
  useEffect(() => {
    if (questionOrder.length === 0) {
      initialize();
    }
  }, [initialize, questionOrder.length]);

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = currentQuestion
    ? getAnswer(currentQuestion.id)
    : undefined;
  const progress =
    questionOrder.length > 0
      ? ((currentQuestionIndex + 1) / questionOrder.length) * 100
      : 0;
  const isLastQuestion = currentQuestionIndex === questionOrder.length - 1;
  const allQuestionsAnswered =
    questionOrder.length > 0 && answers.length === questionOrder.length;

  const handleValueChange = (value: number) => {
    if (currentQuestion) {
      answerQuestion(currentQuestion.id, value);
    }
  };

  const handlePrevious = () => {
    goToPreviousQuestion();
  };

  const handleFinish = () => {
    computeResults();
    router.push("/results");
  };

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {currentQuestionIndex === 0 && (
        <div className="mb-6 p-4 bg-accent/20 rounded-lg">
          <h2 className="font-medium mb-2">Comment ça marche :</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>
              Choisissez l'option qui vous correspond le mieux pour chaque
              question
            </li>
            <li>Cliquez sur "Suivant" pour passer à la question suivante</li>
            <li>
              Vous pouvez revenir en arrière avec "Précédent" pour modifier vos
              réponses
            </li>
          </ol>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} sur {questionOrder.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
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
            {SCALE.map((option) => (
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
            disabled={currentQuestionIndex === 0}
          >
            Précédent
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleFinish}
              disabled={!hasAnswer(currentQuestion.id)}
            >
              Terminer
            </Button>
          ) : (
            <Button
              onClick={() => goToNextQuestion()}
              disabled={!hasAnswer(currentQuestion.id)}
            >
              Suivant
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          {answers.length} questions répondues sur {questionOrder.length}
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
