"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TaskStatus } from "@/data/tasks";
import type { DecisionStatus } from "@/data/decisions";
import type { SimParams, ScenarioId } from "@/lib/finance/types";
import { DEFAULT_PARAMS, SCENARIO_PARAMS } from "@/data/finance-defaults";
import type { Feature } from "@/data/product";

export interface TaskState {
  status: TaskStatus;
  evidence: string;
  nextAction: string;
  updatedAt?: string;
}
export interface DecisionState {
  status: DecisionStatus;
  owner: string;
  notes: string;
  updatedAt?: string;
}
export interface GrowthOps {
  clubsProspected: number;
  clubsNegotiating: number;
  clubsActive: number;
  racesNegotiating: number;
  leadsClubs: number;
  leadsRaces: number;
  leadsSocial: number;
  vipList: number;
  trials: number;
  subscriptions: number;
}
export type GoalId = "subscribers" | "vip" | "clubs" | "races";

interface RunzState {
  tasks: Record<string, TaskState>;
  decisions: Record<string, DecisionState>;
  params: SimParams;
  scenario: ScenarioId;
  baseScenario: Exclude<ScenarioId, "personalizado">;
  channelScale: { clubs: number; social: number; races: number };
  targetSubscribers: number;
  growth: GrowthOps;
  features: Record<string, Feature["status"]>;
  blockers: { id: string; text: string; owner: string; createdAt: string }[];
  setTask: (id: string, patch: Partial<TaskState>) => void;
  setDecision: (id: string, patch: Partial<DecisionState>) => void;
  setParam: <K extends keyof SimParams>(key: K, value: SimParams[K]) => void;
  setScenario: (s: ScenarioId) => void;
  setChannelScale: (patch: Partial<{ clubs: number; social: number; races: number }>) => void;
  setTarget: (n: number) => void;
  setGrowth: (patch: Partial<GrowthOps>) => void;
  setFeature: (id: string, status: Feature["status"]) => void;
  addBlocker: (text: string, owner: string) => void;
  removeBlocker: (id: string) => void;
  resetAll: () => void;
}

const initialGrowth: GrowthOps = {
  clubsProspected: 0, clubsNegotiating: 0, clubsActive: 0, racesNegotiating: 0,
  leadsClubs: 0, leadsRaces: 0, leadsSocial: 0, vipList: 0, trials: 0, subscriptions: 0,
};

const now = () => new Date().toISOString();

export const useRunz = create<RunzState>()(
  persist(
    (set) => ({
      tasks: {},
      decisions: {},
      params: { ...DEFAULT_PARAMS, ...SCENARIO_PARAMS.referencia },
      scenario: "referencia",
      baseScenario: "referencia",
      channelScale: { clubs: 1, social: 1, races: 1 },
      targetSubscribers: 1500,
      growth: initialGrowth,
      features: {},
      blockers: [],
      setTask: (id, patch) => set((s) => ({ tasks: { ...s.tasks, [id]: { ...({ status: "pendente", evidence: "", nextAction: "" } as TaskState), ...s.tasks[id], ...patch, updatedAt: now() } } })),
      setDecision: (id, patch) => set((s) => ({ decisions: { ...s.decisions, [id]: { ...({ status: "pendente", owner: "", notes: "" } as DecisionState), ...s.decisions[id], ...patch, updatedAt: now() } } })),
      setParam: (key, value) => set((s) => ({ params: { ...s.params, [key]: value }, scenario: "personalizado" })),
      setScenario: (sc) => set(() => sc === "personalizado" ? { scenario: sc } : { scenario: sc, baseScenario: sc, channelScale: { clubs: 1, social: 1, races: 1 }, params: { ...DEFAULT_PARAMS, ...SCENARIO_PARAMS[sc] } }),
      setChannelScale: (patch) => set((s) => ({ channelScale: { ...s.channelScale, ...patch }, scenario: "personalizado" })),
      setTarget: (n) => set({ targetSubscribers: n }),
      setGrowth: (patch) => set((s) => ({ growth: { ...s.growth, ...patch } })),
      setFeature: (id, status) => set((s) => ({ features: { ...s.features, [id]: status } })),
      addBlocker: (text, owner) => set((s) => ({ blockers: [...s.blockers, { id: `b${Date.now()}`, text, owner, createdAt: now() }] })),
      removeBlocker: (id) => set((s) => ({ blockers: s.blockers.filter((b) => b.id !== id) })),
      resetAll: () => set({ tasks: {}, decisions: {}, params: { ...DEFAULT_PARAMS, ...SCENARIO_PARAMS.referencia }, scenario: "referencia", baseScenario: "referencia", channelScale: { clubs: 1, social: 1, races: 1 }, targetSubscribers: 1500, growth: initialGrowth, features: {}, blockers: [] }),
    }),
    {
      name: "runz-executive-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export function useHydrated(): boolean {
  // zustand persist hydrates on client; components use this to avoid SSR mismatch
  return typeof window !== "undefined";
}
