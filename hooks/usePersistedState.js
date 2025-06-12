import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(key);
        if (savedValue !== null) {
          setState(JSON.parse(savedValue));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(key, JSON.stringify(state)).catch((error) => {
        console.error("Error saving data:", error);
      });
    }
  }, [state, key, loading]);

  return [state, setState];
};
