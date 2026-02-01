"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// DEMO MODE - No backend required
const DEMO_MODE = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("farmchain_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (identifier, password, role) => {
    // DEMO MODE - Accept any credentials
    const demoUser = {
      id: "demo-user-123",
      name: identifier.split("@")[0] || "Demo User",
      email: identifier,
      phone: "9999999999",
      role: role || "farmer",
    };
    
    localStorage.setItem("farmchain_token", "demo-token-12345");
    localStorage.setItem("farmchain_user", JSON.stringify(demoUser));
    setUser(demoUser);
    return { success: true, user: demoUser };
  };

  const signup = async (name, email, phone, password, role) => {
    // DEMO MODE - Accept any signup
    const demoUser = {
      id: "demo-user-" + Date.now(),
      name: name,
      email: email,
      phone: phone,
      role: role || "farmer",
    };
    
    localStorage.setItem("farmchain_token", "demo-token-12345");
    localStorage.setItem("farmchain_user", JSON.stringify(demoUser));
    setUser(demoUser);
    return { success: true, user: demoUser };
  };

  const businessLogin = async (identifier, password) => {
    // DEMO MODE - Accept any business login
    const demoBusiness = {
      id: "demo-business-123",
      name: identifier.split("@")[0] || "Demo Business",
      email: identifier,
      role: "business",
    };
    
    localStorage.setItem("farmchain_token", "demo-token-12345");
    localStorage.setItem("farmchain_user", JSON.stringify(demoBusiness));
    setUser(demoBusiness);
    return { success: true, user: demoBusiness };
  };

  const businessSignup = async (businessData) => {
    // DEMO MODE - Accept any business signup
    const demoBusiness = {
      id: "demo-business-" + Date.now(),
      name: businessData.name || "Demo Business",
      email: businessData.email,
      role: "business",
    };
    
    localStorage.setItem("farmchain_token", "demo-token-12345");
    localStorage.setItem("farmchain_user", JSON.stringify(demoBusiness));
    setUser(demoBusiness);
    return { success: true, user: demoBusiness };
  };

  const logout = () => {
    localStorage.removeItem("farmchain_token");
    localStorage.removeItem("farmchain_user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isFarmer: user?.role === "farmer",
        isConsumer: user?.role === "consumer",
        isBusiness: user?.role === "business",
        login,
        signup,
        businessLogin,
        businessSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
