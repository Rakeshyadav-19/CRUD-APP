/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import { apiFetch } from "../api/api.jsx";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/team/all");
      setTeams(data);
      return data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <AppContext.Provider
      value={{
        teams,
        fetchTeams,
        refreshData,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
