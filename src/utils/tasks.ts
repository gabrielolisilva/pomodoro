export interface Task {
  id: string;
  name: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: number;
  updatedAt: number;
  note?: string;
}

const TASKS_KEY = "tasks";

export const saveTasksInLocalStorage = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getTasksFromLocalStorage = (): Task[] => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const createTask = (
  name: string,
  estimatedPomodoros: number,
  note?: string
): Task => {
  const now = Date.now();
  return {
    id: `task-${now}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    estimatedPomodoros,
    completedPomodoros: 0,
    createdAt: now,
    updatedAt: now,
    note,
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

  return updateTask(taskId, { completedPomodoros: newCompletedPomodoros });
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
