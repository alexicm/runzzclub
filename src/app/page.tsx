"use client";
import { Deck } from "@/components/presentation/Deck";
import { CHAPTER_COMPONENTS } from "@/components/chapters";

export default function PresentationPage() {
  return <Deck components={CHAPTER_COMPONENTS} />;
}
