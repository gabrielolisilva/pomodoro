import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { ModeSelector } from "./components/ModeSelector";
import { Timer } from "./components/Timer";
import { TimerControls } from "./components/TimerControls";
import {
  DEFAULT_DURATIONS,
  DESCANSO_PERIODO,
  type Mode,
} from "./utils/helpers";
import {
  getDurationsFromLocalStorage,
  saveDurationsInLocalStorage,
} from "./utils/durations";
import {
  getDescansoPeriodFromLocalStorage,
  getPomodoroCounterFromLocalStorage,
  incrementPomodoroCounter,
  saveDescansoPeriodInLocalStorage,
} from "./utils/pomodoro";

const MODE_STATUS: { [key in Mode]: string } = {
  foco: "Hora de focar",
  pausa: "Hora de fazer uma pausa",
  descanso: "Hora de descansar",
};

function App() {
  const [modeDurations, setModeDurations] =
    useState<{ [key in Mode]: number }>(DEFAULT_DURATIONS);
  const [descansoPeriod, setDescansoPeriod] =
    useState<number>(DESCANSO_PERIODO);
  const [mode, setMode] = useState<Mode>("foco");
  const [timeLeft, setTimeLeft] = useState<number>(modeDurations.foco);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [workingPomodoroCount, setWorkingPomodoroCount] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  useEffect(() => {
    setModeDurations(getDurationsFromLocalStorage());
    setPomodoroCount(getPomodoroCounterFromLocalStorage());
    setDescansoPeriod(getDescansoPeriodFromLocalStorage());
  }, []);

  useEffect(() => {
    const status = MODE_STATUS[mode];
    const timeString = `${formatTime(minutes)}:${formatTime(seconds)}`;
    document.title = `${timeString} - ${status}`;
  }, [minutes, seconds, mode]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);

            switch (mode) {
              case "foco":
                handleTriggerFoco();
                break;
              case "pausa":
                handleTriggerPausa();
                break;
              case "descanso":
                handleTriggerDescanso();
                break;
              default:
                break;
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  useEffect(() => {
    setTimeLeft(modeDurations[mode]);
    setIsRunning(false);
  }, [mode, modeDurations]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[mode]);
  };

  const handleUpdateDurations = (newDurations: { [key in Mode]: number }) => {
    saveDurationsInLocalStorage(newDurations);

    setModeDurations(newDurations);
    setTimeLeft(newDurations[mode]);
    setIsRunning(false);
  };

  const handleUpdateDescansoPeriod = (newPeriod: number) => {
    setDescansoPeriod(newPeriod);
    saveDescansoPeriodInLocalStorage(newPeriod);
  };

  const handleTriggerFoco = () => {
    setWorkingPomodoroCount(workingPomodoroCount + 1);

    if (pomodoroCount % descansoPeriod === 0) {
      setMode("descanso");
    } else {
      setMode("pausa");
    }
  };

  const handleTriggerPausa = () => {
    const newCount = incrementPomodoroCounter();
    setPomodoroCount(newCount);

    setMode("foco");
  };

  const handleTriggerDescanso = () => {
    const newCount = incrementPomodoroCounter();
    setPomodoroCount(newCount);

    setMode("foco");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Radial glow background effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
        }}
      ></div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header
          onUpdateDurations={handleUpdateDurations}
          handleUpdateDescansoPeriod={handleUpdateDescansoPeriod}
          currentDurations={modeDurations}
          pomodoroCount={pomodoroCount}
        />

        <div className="flex flex-col items-center justify-start flex-1 max-w-md w-full mt-[100px]">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />

          <Timer
            minutes={minutes}
            seconds={seconds}
            status={MODE_STATUS[mode]}
            mode={mode}
            workingPomodoroCount={workingPomodoroCount}
          />

          <TimerControls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
