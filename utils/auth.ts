export const AdminAuth = {
  KEY_PREFIX: "admin_auth_",

  setAuthenticated(storeId: string) {
    sessionStorage.setItem(this.KEY_PREFIX + storeId, "true");
  },

  isAuthenticated(storeId: string): boolean {
    return sessionStorage.getItem(this.KEY_PREFIX + storeId) === "true";
  },

  logout(storeId: string) {
    sessionStorage.removeItem(this.KEY_PREFIX + storeId);
  }
};
