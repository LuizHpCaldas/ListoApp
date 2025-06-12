import React, { createContext, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePersistedState } from "../hooks/usePersistedState";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [budget, setBudget] = usePersistedState("budget", 700);
  const [lists, setLists] = usePersistedState("lists", []);
  const [activeList, setActiveList] = usePersistedState("activeList", null);
  const [mode, setMode] = usePersistedState("mode", "home");

  // Calcular gasto total
  const totalSpent = lists.reduce((total, list) => {
    return (
      total +
      list.items.reduce((listTotal, item) => {
        return listTotal + (item.inCart && item.price ? item.price : 0);
      }, 0)
    );
  }, 0);

  const remaining = budget - totalSpent;

  // Métodos para manipular o estado
  const createList = (newListName) => {
    if (newListName.trim()) {
      const newList = {
        id: Date.now(),
        name: newListName.trim(),
        items: [],
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      setLists([...lists, newList]);
      setActiveList(newList.id);
      return true;
    }
    return false;
  };

  const deleteList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId));
    if (activeList === listId) {
      setActiveList(lists.length > 1 ? lists[0].id : null);
    }
  };

  const addProduct = (productName) => {
    if (!activeList || !productName.trim()) return;

    const newItem = {
      id: Date.now(),
      name: productName.trim(),
      price: null,
      inCart: false,
      addedAt: new Date().toISOString(),
    };

    setLists(
      lists.map((list) =>
        list.id === activeList
          ? { ...list, items: [...list.items, newItem] }
          : list
      )
    );
  };

  // Outros métodos (addToCart, removeFromCart, etc.) continuam como no original

  return (
    <AppContext.Provider
      value={{
        budget,
        setBudget,
        lists,
        setLists,
        activeList,
        setActiveList,
        mode,
        setMode,
        totalSpent,
        remaining,
        createList,
        deleteList,
        addProduct,
        // Adicione todos os outros métodos necessários
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
