import { writable } from "svelte/store";

function createThemeStore() {
  const stored =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("rocr-panel-theme")
      : null;

  const initial =
    stored ||
    (typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");

  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set(value) {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("rocr-panel-theme", value);
      }
      document.documentElement.setAttribute("data-theme", value);
      set(value);
    },
    toggle() {
      update((current) => {
        const next = current === "dark" ? "light" : "dark";
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("rocr-panel-theme", next);
        }
        document.documentElement.setAttribute("data-theme", next);
        return next;
      });
    },
    init() {
      document.documentElement.setAttribute("data-theme", initial);
    },
  };
}

export const theme = createThemeStore();
