"use client";
import { Dashboard } from "@/components/operations/Dashboard";
import { PasswordGate } from "@/components/operations/PasswordGate";

export default function PainelPage() {
  return <PasswordGate><Dashboard /></PasswordGate>;
}
