import { STORAGE_KEYS } from "../constants/storage";

export interface Task {
  id: string;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: number;
  updatedAt: number;
  note?: string;
  tags?: string[];
}

export const saveTasksInLocalStorage = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const getTasksFromLocalStorage = (): Task[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getFirstNotCompletedTaskId = (): string | null => {
  const tasks = getTasksFromLocalStorage();
  return (
    tasks.find((t) => t.completedPomodoros < t.estimatedPomodoros)?.id || null
  );
};

export const createTask = (
  name: string,
  completedPomodoros: number,
  estimatedPomodoros: number,
  note?: string,
  tags?: string[]
): Task => {
  const now = Date.now();
  return {
    id: `task-${now}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    estimatedPomodoros,
    completedPomodoros,
    createdAt: now,
    updatedAt: now,
    note,
    tags,
  };
};

export const updateTask = (
  taskId: string,
  updates: Partial<Task>
): Task | null => {
  const tasks = getTasksFromLocalStorage();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) return null;

  const updatedTask: Task = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: Date.now(),
  };

  tasks[taskIndex] = updatedTask;
  saveTasksInLocalStorage(tasks);

  return updatedTask;
};

export const deleteTask = (taskId: string): boolean => {
  const tasks = getTasksFromLocalStorage();
  const filteredTasks = tasks.filter((t) => t.id !== taskId);

  if (filteredTasks.length === tasks.length) return false;

  saveTasksInLocalStorage(filteredTasks);
  return true;
};

export const incrementTaskPomodoro = (taskId: string): Task | null => {
  const task = getTasksFromLocalStorage().find((t) => t.id === taskId);
  if (!task) return null;

  const newCompletedPomodoros = Math.min(
    task.completedPomodoros + 1,
    task.estimatedPomodoros
  );

  const updatedTask = updateTask(taskId, {
    completedPomodoros: newCompletedPomodoros,
  });

  if (updatedTask && newCompletedPomodoros >= task.estimatedPomodoros) {
    moveTaskToCompleted(taskId);
  }

  return updatedTask;
};

export const getCompletedTasksFromLocalStorage = (): Task[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCompletedTasksInLocalStorage = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(tasks));
};

export const moveTaskToCompleted = (taskId: string): boolean => {
  const tasks = getTasksFromLocalStorage();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return false;

  const filteredTasks = tasks.filter((t) => t.id !== taskId);
  saveTasksInLocalStorage(filteredTasks);

  const completedTasks = getCompletedTasksFromLocalStorage();
  const taskWithCompletedAt: Task = {
    ...task,
    updatedAt: Date.now(),
  };
  completedTasks.push(taskWithCompletedAt);
  saveCompletedTasksInLocalStorage(completedTasks);

  return true;
};

export const deleteCompletedTask = (taskId: string): boolean => {
  const completedTasks = getCompletedTasksFromLocalStorage();
  const filteredTasks = completedTasks.filter((t) => t.id !== taskId);

  if (filteredTasks.length === completedTasks.length) return false;

  saveCompletedTasksInLocalStorage(filteredTasks);
  return true;
};

export const calculateEstimatedTime = (
  remainingPomodoros: number,
  pomodoroDurationSeconds: number
): { finishTime: Date; durationHours: number } => {
  const now = new Date();
  const totalSeconds = remainingPomodoros * pomodoroDurationSeconds;
  const finishTime = new Date(now.getTime() + totalSeconds * 1000);
  const durationHours = totalSeconds / 3600;

  return { finishTime, durationHours };
};

export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}min`;
  }
  return `${hours.toFixed(1)}h`;
};
