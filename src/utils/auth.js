export const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];

export const register = (username, password) => {
  let users = getUsers();
  if (users.find(u => u.username === username)) return false; // user exists
  users.push({ username, password: btoa(password) });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};

export const login = (username, password) => {
  let users = getUsers();
  let user = users.find(u => u.username === username && u.password === btoa(password));
  if (user) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", username);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("currentUser");
};

export const isAuthenticated = () => localStorage.getItem("isAuthenticated") === "true";
