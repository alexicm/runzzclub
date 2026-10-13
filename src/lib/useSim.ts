"use client";
import { useMemo } from "react";
import { useRunz } from "./store";
import { simulate, type MonthlyInputs, type SimOutput, type SimParams } from "./finance";
import { SCENARIO_INPUTS } from "@/data/finance-defaults";

export function scaledInputs(base: MonthlyInputs[], scale: { clubs: number; social: number; races: number }): MonthlyInputs[] {
  return base.map((m) => ({ newClubs: m.newClubs * scale.clubs, socialTrials: m.socialTrials * scale.social, raceTrials: m.raceTrials * scale.races }));
}

/** Simulação compartilhada: qualquer capítulo lê os mesmos parâmetros e resultados. */
export function useSim(): { out: SimOutput; params: SimParams; inputs: MonthlyInputs[] } {
  const params = useRunz((s) => s.params);
  const base = useRunz((s) => s.baseScenario);
  const scale = useRunz((s) => s.channelScale);
  const inputs = useMemo(() => scaledInputs(SCENARIO_INPUTS[base], scale), [base, scale]);
  const out = useMemo(() => simulate(params, inputs), [params, inputs]);
  return { out, params, inputs };
}
