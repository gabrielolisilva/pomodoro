import { calculateEstimatedTime, formatTime, type Task } from "../utils/tasks";
import { HiEllipsisVertical } from "react-icons/hi2";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { usePomodoro } from "../context/PomodoroContent";
import { useEffect, useRef, useState } from "react";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskItem({ task, onEdit, onToggleComplete }: TaskItemProps) {
  const { modeDurations } = usePomodoro();
  const [finishTime, setFinishTime] = useState<Date>(new Date());

  const isCompleted = task.completedPomodoros >= task.estimatedPomodoros;

  const intervalRef = useRef<number | null>(null);

  const updateEstimatedTime = () => {
    const remainingPomodoros =
      task.estimatedPomodoros - task.completedPomodoros;

    const { finishTime: newFinishTime } = calculateEstimatedTime(
      remainingPomodoros,
      modeDurations.foco
    );

    setFinishTime(newFinishTime);
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
  }, [task.estimatedPomodoros, task.completedPomodoros, modeDurations.foco]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-2 flex items-center gap-3">
      <button
        onClick={() => onToggleComplete(task.id)}
        className="shrink-0 text-gray-400 hover:text-orange-500 transition-colors"
        aria-label={
          isCompleted ? "Marcar como não concluída" : "Marcar como concluída"
        }
      >
        {isCompleted ? (
          <MdCheckCircle size={24} className="text-orange-500" />
        ) : (
          <MdRadioButtonUnchecked size={24} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-white ${
            isCompleted ? "line-through text-gray-500" : ""
          }`}
        >
          {task.name}
        </p>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">
          {task.completedPomodoros}/{task.estimatedPomodoros}
        </span>
        <span className="text-gray-400">{formatTime(finishTime)}</span>
      </div>

      <button
        onClick={() => onEdit(task)}
        className="shrink-0 text-gray-400 hover:text-orange-500 transition-colors p-1"
        aria-label="Editar tarefa"
      >
        <HiEllipsisVertical size={20} />
      </button>
    </div>
  );
}
