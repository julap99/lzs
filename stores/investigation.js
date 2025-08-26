import { defineStore } from "pinia";

export const useInvestigationStore = defineStore({
  id: "investigation",
  state: () => ({
    latestSubmission: null,
  }),
  persist: false,
  actions: {
    setSubmission(payload) {
      this.latestSubmission = payload ? { ...payload } : null;
    },
    clearSubmission() {
      this.latestSubmission = null;
    },
  },
});



