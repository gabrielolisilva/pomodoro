import { calculateEstimatedTime, formatTime, type Task } from "../utils/tasks";
import { HiEllipsisVertical } from "react-icons/hi2";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  pomodoroDurationSeconds: number;
}

export function TaskItem({
  task,
  onEdit,
  onToggleComplete,
  pomodoroDurationSeconds,
}: TaskItemProps) {
  const isCompleted = task.completedPomodoros >= task.estimatedPomodoros;

  const { finishTime } = calculateEstimatedTime(
    task.estimatedPomodoros - task.completedPomodoros,
    pomodoroDurationSeconds
  );

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
