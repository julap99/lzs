import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    username: null,
    roles: null,
    isAuth: false,
  }),
  persist: true,
  actions: {
    setUsername(username) {
      this.username = username;
    },
    setRoles(roles) {
      this.roles = roles;
    },
    setIsAuthenticated(isAuth) {
      this.isAuth = isAuth;
    },
  },
});
