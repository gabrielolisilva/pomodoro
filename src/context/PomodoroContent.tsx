import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  DEFAULT_DURATIONS,
  DESCANSO_PERIODO,
  formatTimerDigits,
  type Mode,
} from "../utils/helpers";
import {
  getDurationsFromLocalStorage,
  saveDurationsInLocalStorage,
} from "../utils/durations";
import {
  getDescansoPeriodFromLocalStorage,
  getPomodoroCounterFromLocalStorage,
  incrementPomodoroCounter,
  saveDescansoPeriodInLocalStorage,
  savePomodoroCounterInLocalStorage,
} from "../utils/pomodoro";
import {
  getFirstNotCompletedTaskId,
  getTasksFromLocalStorage,
  incrementTaskPomodoro,
  moveTaskToCompleted,
  type Task,
} from "../utils/tasks";

const MODE_STATUS: { [key in Mode]: string } = {
  foco: "Hora de focar",
  pausa: "Hora de fazer uma pausa",
  descanso: "Hora de descansar",
};

interface PomodoroContextType {
  // Estado
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  modeDurations: { [key in Mode]: number };
  descansoPeriod: number;
  mode: Mode;
  timeLeft: number;
  isRunning: boolean;
  pomodoroCount: number;
  workingPomodoroCount: number;
  activeTaskId: string | null;
  minutes: number;
  seconds: number;
  modeStatus: string;

  // Ações
  setMode: (mode: Mode) => void;
  handleStart: () => void;
  handlePause: () => void;
  handleReset: () => void;
  handleUpdateDurations: (newDurations: { [key in Mode]: number }) => void;
  handleUpdateDescansoPeriod: (newPeriod: number) => void;
  setActiveTaskId: (taskId: string | null) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [modeDurations, setModeDurations] =
    useState<{ [key in Mode]: number }>(DEFAULT_DURATIONS);
  const [descansoPeriod, setDescansoPeriod] =
    useState<number>(DESCANSO_PERIODO);
  const [mode, setMode] = useState<Mode>("foco");
  const [timeLeft, setTimeLeft] = useState<number>(modeDurations.foco);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [workingPomodoroCount, setWorkingPomodoroCount] = useState<number>(0);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const intervalRef = useRef<number | null>(null);
  const modeRef = useRef<Mode>(mode);
  const hasTransitionedRef = useRef<boolean>(false);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const modeStatus = MODE_STATUS[mode];

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadedTasks = getTasksFromLocalStorage();
    setTasks(loadedTasks);

    const firstNotCompletedId = getFirstNotCompletedTaskId();
    if (firstNotCompletedId) {
      setActiveTaskId(firstNotCompletedId);
    }

    setModeDurations(getDurationsFromLocalStorage());
    setPomodoroCount(getPomodoroCounterFromLocalStorage());
    setDescansoPeriod(getDescansoPeriodFromLocalStorage());
  }, []);

  // Baseado no workingPomodoroCount, atualizar as tasks e novo activeTaskId
  useEffect(() => {
    const updatedTasks = getTasksFromLocalStorage();

    updatedTasks.forEach((task) => {
      if (task.completedPomodoros >= task.estimatedPomodoros) {
        moveTaskToCompleted(task.id);
      }
    });

    const remainingTasks = getTasksFromLocalStorage();
    setTasks(remainingTasks);

    if (activeTaskId) {
      const activeTask = remainingTasks.find((t) => t.id === activeTaskId);
      if (!activeTask) {
        const nextTaskId = getFirstNotCompletedTaskId();
        if (nextTaskId) {
          setActiveTaskId(nextTaskId);
        } else {
          setActiveTaskId(null);
        }
      }
    } else {
      const firstNotCompletedId = getFirstNotCompletedTaskId();
      if (firstNotCompletedId) {
        setActiveTaskId(firstNotCompletedId);
      }
    }
  }, [workingPomodoroCount]);

  // Atualizar título da página
  useEffect(() => {
    const status = MODE_STATUS[mode];
    const timeString = `${formatTimerDigits(minutes)}:${formatTimerDigits(
      seconds
    )}`;
    document.title = `${timeString} - ${status}`;
  }, [minutes, seconds, mode]);

  // Atualizar refs quando o modo muda
  useEffect(() => {
    modeRef.current = mode;
    hasTransitionedRef.current = false;
  }, [mode]);

  // Lógica do timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (hasTransitionedRef.current) {
              return 0;
            }

            hasTransitionedRef.current = true;
            setIsRunning(false);

            switch (modeRef.current) {
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
  }, [isRunning]);

  // Atualizar tempo quando modo ou durações mudam
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
    setMode("foco");
    setIsRunning(false);
    setTimeLeft(modeDurations["foco"]);
    setWorkingPomodoroCount(0);
    setPomodoroCount(0);
    savePomodoroCounterInLocalStorage(0);
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
    setWorkingPomodoroCount((prev) => prev + 1);

    if (activeTaskId) {
      incrementTaskPomodoro(activeTaskId);
    }

    if (
      pomodoroCount >= descansoPeriod &&
      pomodoroCount % descansoPeriod === 0
    ) {
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

  const value: PomodoroContextType = {
    tasks,
    setTasks,
    modeDurations,
    descansoPeriod,
    mode,
    timeLeft,
    isRunning,
    pomodoroCount,
    workingPomodoroCount,
    activeTaskId,
    minutes,
    seconds,
    modeStatus,
    setMode: handleModeChange,
    handleStart,
    handlePause,
    handleReset,
    handleUpdateDurations,
    handleUpdateDescansoPeriod,
    setActiveTaskId,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error("usePomodoro deve ser usado dentro de um PomodoroProvider");
  }
  return context;
}
