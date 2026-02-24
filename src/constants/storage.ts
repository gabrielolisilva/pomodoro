export const STORAGE_KEYS = {
  TASKS: "tasks",
  COMPLETED_TASKS: "completedTasks",
  POMODORO_COUNTER: "pomodoroCounter",
  DESCANSO_PERIODO: "descansoPeriod",
  DURATIONS: "durations",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
