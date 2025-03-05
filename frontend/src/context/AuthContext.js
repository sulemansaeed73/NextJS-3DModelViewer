"use client";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
export const LoginContext = createContext(null);

function AuthContext({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const CheckCookie = async () => {
      const response = await axios.get("http://localhost:5000/checklogin", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLoggedIn(true);
      }
      if (response.status === 500) {
        setLoggedIn(false);
      }
    };
    CheckCookie();
  }, []);

  function login(data) {
    setLoggedIn(true);
    localStorage.setItem("name", data.username);
    localStorage.setItem("id", data._id);
  }
  async function logout() {
    localStorage.removeItem("id");
    setLoggedIn(false);
    try {
      const response = await axios.get("http://localhost:5000/user_logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("Error is = ", error);
      setLoggedIn(false);
    }
  }

  return (
    <LoginContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
}

export default AuthContext;
