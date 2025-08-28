import { defineStore } from "pinia";

export const useLayoutStore = defineStore({
  id: "layout",
  state: () => ({
    layoutType: "vertical",
    mobileWidth: "1024",
  }),
  actions: {
    setLayoutType(layoutType) {
      this.layoutType = layoutType;
    },
  },
});
