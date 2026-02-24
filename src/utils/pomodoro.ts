import { STORAGE_KEYS } from "../constants/storage";
import { DESCANSO_PERIODO } from "./helpers";

export const getPomodoroCounterFromLocalStorage = (): number => {
  const raw = localStorage.getItem(STORAGE_KEYS.POMODORO_COUNTER);
  if (!raw) return 1;
  try {
    const value = parseInt(raw, 10);
    return Number.isFinite(value) && value >= 1 ? value : 1;
  } catch {
    return 1;
  }
};

export const savePomodoroCounterInLocalStorage = (counter: number) => {
  localStorage.setItem(STORAGE_KEYS.POMODORO_COUNTER, counter.toString());
};

export const incrementPomodoroCounter = (): number => {
  const current = getPomodoroCounterFromLocalStorage();
  const newCounter = current + 1;
  savePomodoroCounterInLocalStorage(newCounter);
  return newCounter;
};

export const getDescansoPeriodFromLocalStorage = (): number => {
  const raw = localStorage.getItem(STORAGE_KEYS.DESCANSO_PERIODO);
  if (!raw) return DESCANSO_PERIODO;
  try {
    const value = parseInt(raw, 10);
    return Number.isFinite(value) && value >= 1 ? value : DESCANSO_PERIODO;
  } catch {
    return DESCANSO_PERIODO;
  }
};

export const saveDescansoPeriodInLocalStorage = (period: number) => {
  localStorage.setItem(STORAGE_KEYS.DESCANSO_PERIODO, period.toString());
};
