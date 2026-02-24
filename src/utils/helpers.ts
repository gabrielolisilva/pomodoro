import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);

export type Mode = "foco" | "pausa" | "descanso";

export const DEFAULT_DURATIONS: { [key in Mode]: number } = {
  foco: 25 * 60, // 25 * 60
  pausa: 5 * 60, // 5 * 60
  descanso: 15 * 60, // 15 * 60
};

export const DESCANSO_PERIODO = 4;

export const formatTimerDigits = (value: number) => {
  return value.toString().padStart(2, "0");
};

export const DEFAULT_TASKS_TAGS: string[] = [
  "Estudo",
  "Trabalho",
  "Leitura",
  "Exercício",
  "Programação",
  "Reunião",
  "Pesquisa",
  "Descanso",
  "Idiomas",
  "Acadêmico",
  "Projeto",
  "Planejamento",
  "Revisão",
  "Saúde",
];
