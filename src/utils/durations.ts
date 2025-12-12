import { DEFAULT_DURATIONS, type Mode } from "./helpers";

const DURATIONS_KEY = "durations";

export const saveDurationsInLocalStorage = (durations: {
  [key in Mode]: number;
}) => {
  localStorage.setItem(DURATIONS_KEY, JSON.stringify(durations));
};

export const getDurationsFromLocalStorage = (): {
  [key in Mode]: number;
} => {
  const durations = localStorage.getItem(DURATIONS_KEY);
  return durations ? JSON.parse(durations) : DEFAULT_DURATIONS;
};
