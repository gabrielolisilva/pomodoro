import { useState, useEffect, useRef } from "react";
import {
  calculateEstimatedTime,
  formatTime,
  formatDuration,
} from "../utils/tasks";
import { usePomodoro } from "../context/PomodoroContent";

export function TaskSummary() {
  const { tasks, modeDurations } = usePomodoro();

  const [finishTime, setFinishTime] = useState<Date>(new Date());
  const [durationHours, setDurationHours] = useState<number>(0);

  const totalEstimated = tasks.reduce(
    (sum, task) => sum + task.estimatedPomodoros,
    0
  );
  const totalCompleted = tasks.reduce(
    (sum, task) => sum + task.completedPomodoros,
    0
  );
  const remainingPomodoros = totalEstimated - totalCompleted;

  const intervalRef = useRef<number | null>(null);

  const updateEstimatedTime = () => {
    const { finishTime: newFinishTime, durationHours: newDurationHours } =
      calculateEstimatedTime(remainingPomodoros, modeDurations.foco);

    setFinishTime(newFinishTime);
    setDurationHours(newDurationHours);
  };

  useEffect(() => {
    updateEstimatedTime();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      updateEstimatedTime();
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [remainingPomodoros, modeDurations.foco]);

  if (tasks.length === 0 || remainingPomodoros === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3 z-10">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between text-white text-sm gap-2">
        <div className="flex items-center gap-4">
          <span>
            Pomos: <span className="font-bold">{totalCompleted}</span> /{" "}
            <span className="font-bold">{totalEstimated}</span>
          </span>
        </div>
        <div className="text-center sm:text-right">
          Terminar às:{" "}
          <span className="font-bold">{formatTime(finishTime)}</span> (
          {formatDuration(durationHours)})
        </div>
      </div>
    </div>
  );
}
