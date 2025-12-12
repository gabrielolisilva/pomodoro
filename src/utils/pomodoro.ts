import { DESCANSO_PERIODO } from "./helpers";

const POMODORO_COUNTER_KEY = "pomodoroCounter";

export const getPomodoroCounterFromLocalStorage = (): number => {
  const counter = localStorage.getItem(POMODORO_COUNTER_KEY);
  return counter ? parseInt(counter, 10) : 1;
};

export const savePomodoroCounterInLocalStorage = (counter: number) => {
  localStorage.setItem(POMODORO_COUNTER_KEY, counter.toString());
};

export const incrementPomodoroCounter = (): number => {
  const current = getPomodoroCounterFromLocalStorage();
  const newCounter = current + 1;
  savePomodoroCounterInLocalStorage(newCounter);
  return newCounter;
};

const DESCANSO_PERIODO_KEY = "descansoPeriod";

export const getDescansoPeriodFromLocalStorage = (): number => {
  const period = localStorage.getItem(DESCANSO_PERIODO_KEY);
  return period ? parseInt(period, 10) : DESCANSO_PERIODO;
};

export const saveDescansoPeriodInLocalStorage = (period: number) => {
  localStorage.setItem(DESCANSO_PERIODO_KEY, period.toString());
};
