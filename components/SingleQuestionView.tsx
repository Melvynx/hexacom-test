import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuizStore } from "@/lib/store";
import { SCALE } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SingleQuestionView() {
  const router = useRouter();
  const {
    initialize,
    getCurrentQuestion,
    answerQuestion,
    goToPreviousQuestion,
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
          <CardDescription>
            {currentQuestion.type} · {currentQuestion.dimension}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleValueChange(parseInt(value))}
            className="grid grid-cols-1 gap-3"
          >
            {SCALE.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent"
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`${currentQuestion.id}-${option.value}`}
                />
                <Label
                  htmlFor={`${currentQuestion.id}-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
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

          {isLastQuestion && (
            <Button
              onClick={handleFinish}
              disabled={!hasAnswer(currentQuestion.id)}
            >
              Terminer
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
