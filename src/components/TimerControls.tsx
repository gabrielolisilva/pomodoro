import { LuRefreshCcw } from "react-icons/lu";
import { MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onReset}
        className="w-12 h-12 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Resetar timer"
      >
        <LuRefreshCcw size={24} />
      </button>

      <div
        onClick={isRunning ? onPause : onStart}
        className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors cursor-pointer flex items-center gap-2"
      >
        {isRunning ? (
          <>
            <MdPauseCircleOutline size={24} />
            <span>Pausar</span>
          </>
        ) : (
          <>
            <MdPlayCircleOutline size={24} />
            <span>Iniciar</span>
          </>
        )}
      </div>
    </div>
  );
}
