
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("auth_token") ? true : false;
};

export const login = () => {
  // Set a mock token for demo. Replace with real login logic later.
  localStorage.setItem("auth_token", "demo-token");
};

export const logout = () => {
  localStorage.removeItem("auth_token");
};

