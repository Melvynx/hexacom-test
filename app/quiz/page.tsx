"use client";

import { SingleQuestionView } from "@/components/SingleQuestionView";

export default function QuizPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Test PCM</h1>
      <SingleQuestionView />
    </div>
  );
}
