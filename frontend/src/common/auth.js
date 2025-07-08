export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('isLoggedIn');
}

export function getUserRole() {
  const user = getCurrentUser();
  return user?.role || null;
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
}
