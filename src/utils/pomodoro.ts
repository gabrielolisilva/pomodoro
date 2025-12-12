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
