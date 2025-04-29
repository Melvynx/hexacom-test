"use client";
import { SingleQuestionView } from "@/components/SingleQuestionView";
import { useQuizStore } from "@/lib/store";
import { useEffect } from "react";

export default function QuizPageEn() {
  const { setLang } = useQuizStore();
  useEffect(() => {
    setLang("en");
  }, [setLang]);
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">HEXACOMM Test</h1>
      <SingleQuestionView />
    </div>
  );
}
