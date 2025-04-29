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

export default function HomePageEn() {
  const router = useRouter();
  const { initialize, resetQuiz } = useQuizStore();

  const handleStartQuiz = () => {
    resetQuiz();
    initialize();
    router.push("/en/quiz");
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          HEXACOMM Test
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover your personality profile with the HEXACOMM model
        </p>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>What is the HEXACOMM model?</CardTitle>
          <CardDescription>
            A powerful tool to understand your personality and interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The HEXACOMM model is a psychometric tool that identifies 6 distinct
            personality types. Unlike other tests, HEXACOMM recognizes that
            everyone has a unique blend of these types, with a dominant (Base)
            and a secondary (Phase).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">6 Personality Types</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Empathic – Warm and attentive</li>
                <li>Workaholic – Organized and logical</li>
                <li>Perseverant – Dedicated and observant</li>
                <li>Promoter – Persuasive and adaptive</li>
                <li>Rebel – Spontaneous and creative</li>
                <li>Dreamer – Thoughtful and imaginative</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">3 Measured Dimensions</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Motivation – What energizes you</li>
                <li>Strength – Your natural talents</li>
                <li>Stress – Your reactions under pressure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>About this test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This test contains 108 questions, presented one by one. For each
            statement, indicate how often it applies to you.
          </p>
          <p>
            It takes about 15-20 minutes to complete. For reliable results,
            answer spontaneously and honestly.
          </p>
          <div className="bg-muted p-4 rounded-md mt-4">
            <p className="text-sm">
              Note: This version is for educational purposes only. For a
              professional assessment, consult a certified coach.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" className="px-8" onClick={handleStartQuiz}>
          Start the test
        </Button>
      </div>
    </div>
  );
}
