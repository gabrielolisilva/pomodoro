import { GoGear } from "react-icons/go";
import {
  DEFAULT_DURATIONS,
  DESCANSO_PERIODO,
  MySwal,
  type Mode,
} from "../utils/helpers";
import { useRef } from "react";
import Swal from "sweetalert2";

interface HeaderProps {
  onUpdateDurations: (durations: { [key in Mode]: number }) => void;
  currentDurations: { [key in Mode]: number };
  pomodoroCount: number;
  handleUpdateDescansoPeriod: (newPeriod: number) => void;
}

export function Header({
  onUpdateDurations,
  currentDurations,
  pomodoroCount,
  handleUpdateDescansoPeriod,
}: HeaderProps) {
  const focoTimeRef = useRef<HTMLInputElement>(null);
  const pausaTimeRef = useRef<HTMLInputElement>(null);
  const descansoTimeRef = useRef<HTMLInputElement>(null);
  const descansoPeriodRef = useRef<HTMLInputElement>(null);

  const handleSettingsClick = async () => {
    const focoMinutes = Math.floor(currentDurations.foco / 60);
    const pausaMinutes = Math.floor(currentDurations.pausa / 60);
    const descansoMinutes = Math.floor(currentDurations.descanso / 60);

    const result = await MySwal.fire({
      title: "Configurações do Timer",
      html: (
        <div className="text-left mt-4">
          <label className="block mb-2 text-gray-700 font-medium">
            Tempo de Foco (minutos):
          </label>
          <input
            id="swal-foco"
            type="number"
            min="1"
            max="120"
            defaultValue={focoMinutes}
            ref={focoTimeRef}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <label className="block mb-2 text-gray-700 font-medium">
            Tempo de Pausa (minutos):
          </label>
          <input
            id="swal-pausa"
            type="number"
            min="1"
            max="60"
            defaultValue={pausaMinutes}
            ref={pausaTimeRef}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <label className="block mb-2 text-gray-700 font-medium">
            Tempo de Descanso (minutos):
          </label>
          <input
            id="swal-descanso"
            type="number"
            min="1"
            max="60"
            defaultValue={descansoMinutes}
            ref={descansoTimeRef}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <label className="block mb-2 text-gray-700 font-medium">
            Pomodoros descanso:
          </label>
          <input
            id="swal-descanso-period"
            type="number"
            min="1"
            max="10"
            defaultValue={DESCANSO_PERIODO}
            ref={descansoPeriodRef}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      ),
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      preConfirm: () => {
        const focoInput = focoTimeRef.current?.value;
        const pausaInput = pausaTimeRef.current?.value;
        const descansoInput = descansoTimeRef.current?.value;
        const descansoPeriodInput = descansoPeriodRef.current?.value;

        const foco = parseInt(
          focoInput ?? DEFAULT_DURATIONS.foco.toString(),
          10
        );
        const pausa = parseInt(
          pausaInput ?? DEFAULT_DURATIONS.pausa.toString(),
          10
        );
        const descanso = parseInt(
          descansoInput ?? DEFAULT_DURATIONS.descanso.toString(),
          10
        );

        const descansoPeriod = parseInt(
          descansoPeriodInput ?? DESCANSO_PERIODO.toString(),
          10
        );

        if (foco < 1 || foco > 120) {
          MySwal.showValidationMessage(
            "Tempo de foco deve ser entre 1 e 120 minutos"
          );

          return false;
        }

        if (pausa < 1 || pausa > 60) {
          MySwal.showValidationMessage(
            "Tempo de pausa deve ser entre 1 e 60 minutos"
          );

          return false;
        }

        if (descanso < 1 || descanso > 60) {
          MySwal.showValidationMessage(
            "Tempo de descanso deve ser entre 1 e 60 minutos"
          );

          return false;
        }

        if (descansoPeriod < 1) {
          MySwal.showValidationMessage(
            "Pomodoros descanso deve ser maior que 0"
          );

          return false;
        }

        return { foco, pausa, descanso, descansoPeriod };
      },
    });

    if (result.isConfirmed && result.value) {
      const resultValue = result.value as {
        foco: number;
        pausa: number;
        descanso: number;
        descansoPeriod: number;
      };

      const newDurations: { [key in Mode]: number } = {
        foco: resultValue.foco * 60,
        pausa: resultValue.pausa * 60,
        descanso: resultValue.descanso * 60,
      };

      onUpdateDurations(newDurations);

      handleUpdateDescansoPeriod(resultValue.descansoPeriod);

      MySwal.fire({
        toast: true,
        position: "bottom",
        icon: "success",
        title: "Configurações salvas!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    }
  };

  return (
    <header className="flex justify-between items-center p-6 w-full">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
        <h1 className="text-white text-xl font-semibold">Pomodoro</h1>
        {pomodoroCount > 0 && (
          <div className="flex items-center gap-1 ml-3 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
            <span className="text-orange-500 text-sm font-medium">
              {pomodoroCount} {pomodoroCount === 1 ? "pomodoro" : "pomodoros"}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={handleSettingsClick}
        className="text-white hover:text-orange-500 transition-colors cursor-pointer"
        aria-label="Configurações"
      >
        <GoGear size={24} />
      </button>
    </header>
  );
}
