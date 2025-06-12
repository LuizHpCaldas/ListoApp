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

  // Listas completas e média de gastos
  const completedLists = lists.filter((list) => list.completedAt);
  const avgSpentPerList =
    completedLists.length > 0
      ? completedLists.reduce((total, list) => {
          const listTotal = list.items.reduce(
            (sum, item) => sum + (item.price || 0),
            0
          );
          return total + listTotal;
        }, 0) / completedLists.length
      : 0;

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

  const addToCart = (itemId, price) => {
    const currentTime = new Date().toISOString();
    setLists(
      lists.map((list) =>
        list.id === activeList
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      price: parseFloat(price) || 0,
                      inCart: true,
                      purchasedAt: currentTime,
                    }
                  : item
              ),
            }
          : list
      )
    );
  };

  const removeFromCart = (itemId) => {
    setLists(
      lists.map((list) =>
        list.id === activeList
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, price: null, inCart: false, purchasedAt: null }
                  : item
              ),
            }
          : list
      )
    );
  };

  const removeProduct = (itemId) => {
    setLists(
      lists.map((list) =>
        list.id === activeList
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      )
    );
  };

  const completeList = (listId) => {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, completedAt: new Date().toISOString() }
          : list
      )
    );
  };

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
        completedLists,
        avgSpentPerList,
        createList,
        deleteList,
        addProduct,
        addToCart,
        removeFromCart,
        removeProduct,
        completeList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
