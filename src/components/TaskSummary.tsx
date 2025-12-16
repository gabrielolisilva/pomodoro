import { useState, useEffect } from "react";
import {
  getTasksFromLocalStorage,
  calculateEstimatedTime,
  formatTime,
  formatDuration,
  type Task,
} from "../utils/tasks";

interface TaskSummaryProps {
  pomodoroDurationSeconds: number;
  refreshTrigger?: number;
}

export function TaskSummary({
  pomodoroDurationSeconds,
  refreshTrigger,
}: TaskSummaryProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasksFromLocalStorage());
  }, [refreshTrigger]);

  const totalEstimated = tasks.reduce(
    (sum, task) => sum + task.estimatedPomodoros,
    0
  );
  const totalCompleted = tasks.reduce(
    (sum, task) => sum + task.completedPomodoros,
    0
  );
  const remainingPomodoros = totalEstimated - totalCompleted;

  const { finishTime, durationHours } = calculateEstimatedTime(
    remainingPomodoros,
    pomodoroDurationSeconds
  );

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
