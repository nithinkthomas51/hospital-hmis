import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function getInitialToken() {
  return localStorage.getItem("authToken");
}

function getInitialUsername() {
  return localStorage.getItem("authUsername");
}

function getInitialRoles() {
  const savedRoles = localStorage.getItem("authRoles");
  if (!savedRoles) return [];
  try {
    return JSON.parse(savedRoles);
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getInitialToken());
  const [username, setUsername] = useState(() => getInitialUsername());
  const [roles, setRoles] = useState(() => getInitialRoles());

  const login = (newToken, newUsername, rolesArray) => {
    setToken(newToken);
    setUsername(newUsername);
    setRoles(rolesArray) || [];

    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUsername", newUsername);
    localStorage.setItem("authRoles", JSON.stringify(rolesArray || []));
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRoles([]);

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authRoles");
  };

  const isAuthenticated = !!token;

  const hasRole = (roleName) => {
    if (!roles) return false;
    return roles.some(
      (r) => r === roleName || r === `ROLE_${roleName}` || r.endsWith(roleName)
    );
  };

  const value = {
    token,
    username,
    roles,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
