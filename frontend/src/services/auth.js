const ADMIN_EMAIL = "admin@gstore.com";
const ADMIN_PASSWORD = "admin123";

export function login(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("isAdmin");
}

export function isAuthenticated() {
  return localStorage.getItem("isAdmin") === "true";
}
