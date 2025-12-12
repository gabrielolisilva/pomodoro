import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);

export type Mode = "foco" | "pausa" | "descanso";

export const DEFAULT_DURATIONS: { [key in Mode]: number } = {
  foco: 2, // 25 * 60
  pausa: 2, // 5 * 60
  descanso: 2, // 15 * 60
};

export const DESCANSO_PERIODO = 4;
