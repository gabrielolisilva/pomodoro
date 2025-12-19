import { useState } from "react";
import {
  type Task,
  getTasksFromLocalStorage,
  saveTasksInLocalStorage,
  createTask,
  updateTask,
  deleteTask,
  getFirstNotCompletedTaskId,
  moveTaskToCompleted,
} from "../utils/tasks";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { HiEllipsisVertical } from "react-icons/hi2";
import { usePomodoro } from "../context/PomodoroContent";

export function TaskList() {
  const { tasks, setTasks, activeTaskId, setActiveTaskId } = usePomodoro();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleSave = (
    name: string,
    completedPomodoros: number,
    estimatedPomodoros: number,
    note?: string
  ) => {
    if (editingTask) {
      const updated = updateTask(editingTask.id, {
        name,
        completedPomodoros,
        estimatedPomodoros,
        note,
      });
      if (updated) {
        setTasks(getTasksFromLocalStorage());
      }
      setEditingTask(null);
    } else {
      const newTask = createTask(
        name,
        completedPomodoros,
        estimatedPomodoros,
        note
      );
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksInLocalStorage(updatedTasks);
      setIsAddingTask(false);

      if (!activeTaskId) {
        setActiveTaskId(newTask.id);
      }
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setIsAddingTask(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsAddingTask(false);
  };

  const handleDelete = (taskId: string) => {
    if (deleteTask(taskId)) {
      setTasks(getTasksFromLocalStorage());
      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
    }
  };

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const isCurrentlyCompleted =
        task.completedPomodoros >= task.estimatedPomodoros;

      if (isCurrentlyCompleted) {
        return;
      }

      const newCompletedPomodoros = task.estimatedPomodoros;
      updateTask(taskId, { completedPomodoros: newCompletedPomodoros });

      moveTaskToCompleted(taskId);

      const updatedTasks = getTasksFromLocalStorage();
      setTasks(updatedTasks);

      if (activeTaskId === taskId) {
        const nextTaskId = getFirstNotCompletedTaskId();
        if (nextTaskId) {
          setActiveTaskId(nextTaskId);
        } else {
          setActiveTaskId(null);
        }
      }
    }
  };

  const handleSetActiveTask = (taskId: string) => {
    const newActiveTaskId = taskId === activeTaskId ? null : taskId;
    setActiveTaskId(newActiveTaskId);
  };

  const displayTasks = editingTask
    ? tasks.filter((t) => t.id !== editingTask.id)
    : tasks;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">Tarefas</h2>
        <button
          className="text-gray-400 hover:text-orange-500 transition-colors p-1"
          aria-label="Opções"
        >
          <HiEllipsisVertical size={20} />
        </button>
      </div>

      <div className="mb-4">
        {displayTasks.map((task) => (
          <div key={task.id} className="mb-2">
            <div
              onClick={() => handleSetActiveTask(task.id)}
              className={`cursor-pointer ${
                activeTaskId === task.id
                  ? "ring-2 ring-orange-500 rounded-lg"
                  : ""
              }`}
            >
              <TaskItem
                task={task}
                onEdit={handleEdit}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          </div>
        ))}
      </div>

      {(isAddingTask || editingTask) && (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={editingTask ? handleDelete : undefined}
        />
      )}

      {!isAddingTask && !editingTask && (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full border-2 border-dashed border-gray-700 text-gray-400 hover:border-orange-500 hover:text-orange-500 rounded-lg py-4 transition-colors cursor-pointer"
        >
          + Adicionar Tarefa
        </button>
      )}
    </div>
  );
}
