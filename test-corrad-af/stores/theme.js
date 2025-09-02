import { defineStore, skipHydrate } from "pinia";

export const useThemeStore = defineStore({
  id: "theme",
  state: () => ({
    theme: "default",
    layoutType: "vertical",
    codeTheme: "oneDark",
  }),
  persist: true,
  actions: {
    setTheme(theme) {
      this.theme = theme;
    },
    setLayoutType(layoutType) {
      this.layoutType = layoutType;
    },
    setCodeTheme(codeTheme) {
      this.codeTheme = codeTheme;
    },
  },
});
