import type { ChapterComponent } from "@/components/presentation/Deck";
import { Ch01Hero } from "./Ch01Hero";
import { Ch02Agora } from "./Ch02Agora";
import { Ch03Meta } from "./Ch03Meta";
import { Ch04Mercado } from "./Ch04Mercado";
import { Ch05Runz } from "./Ch05Runz";
import { Ch06Mvp } from "./Ch06Mvp";
import { Ch07Canais } from "./Ch07Canais";
import { Ch08Clubs } from "./Ch08Clubs";
import { Ch09Conteudo } from "./Ch09Conteudo";
import { Ch10Modelo } from "./Ch10Modelo";
import { Ch11Simulador } from "./Ch11Simulador";
import { Ch12DezMil } from "./Ch12DezMil";
import { Ch13Equipe } from "./Ch13Equipe";
import { Ch14Roadmap } from "./Ch14Roadmap";
import { Ch15TrintaDias } from "./Ch15TrintaDias";
import { Ch16Decisoes } from "./Ch16Decisoes";

export const CHAPTER_COMPONENTS: Record<string, ChapterComponent> = {
  hero: Ch01Hero, agora: Ch02Agora, meta: Ch03Meta, mercado: Ch04Mercado, runz: Ch05Runz, mvp: Ch06Mvp,
  canais: Ch07Canais, clubs: Ch08Clubs, conteudo: Ch09Conteudo, modelo: Ch10Modelo, simulador: Ch11Simulador,
  dezmil: Ch12DezMil, equipe: Ch13Equipe, roadmap: Ch14Roadmap, "30dias": Ch15TrintaDias, decisoes: Ch16Decisoes,
};
