import { usePomodoro } from "../context/PomodoroContent";
import { formatTimerDigits } from "../utils/helpers";

export function Timer() {
  const { minutes, seconds, modeStatus, mode, workingPomodoroCount } =
    usePomodoro();

  return (
    <div className="flex flex-col items-center justify-center mb-18">
      <p className="text-white text-lg mb-8">{modeStatus}</p>
      <div className="relative">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              mode === "foco"
                ? "radial-gradient(circle, rgba(249, 72, 4, 0.7) 0%, transparent 70%)"
                : mode === "pausa"
                ? "radial-gradient(circle, rgba(6, 209, 90, 0.7) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(0, 110, 255, 0.7) 0%, transparent 70%)",
            transform: "scale(1.5)",
          }}
        ></div>

        {/* Timer circle */}
        <div className="relative w-64 h-64 rounded-full border-4 border-orange-500/30 flex items-center justify-center bg-black/20">
          <div className="text-center">
            <span className="text-orange-500 text-6xl font-bold tabular-nums">
              {formatTimerDigits(minutes)}:{formatTimerDigits(seconds)}
            </span>
          </div>
        </div>
      </div>
      {mode === "foco" && (
        <p className="text-white mt-4"># {workingPomodoroCount}</p>
      )}
    </div>
  );
}
