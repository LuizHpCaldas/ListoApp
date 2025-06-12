import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

const BudgetDisplay = () => {
  const { budget, setBudget, totalSpent, remaining } = useAppContext();
  const [editingBudget, setEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());

  const updateBudget = () => {
    const num = parseFloat(newBudget) || 0;
    setBudget(num);
    setEditingBudget(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.budgetRow}>
        <Feather name="target" size={16} color="#94a3b8" />
        <Text style={styles.label}>Orçamento:</Text>

        {editingBudget ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={newBudget}
              onChangeText={setNewBudget}
              keyboardType="numeric"
              autoFocus
            />
            <TouchableOpacity onPress={updateBudget}>
              <Feather name="check" size={20} color="#4ade80" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingBudget(false)}>
              <Feather name="x" size={20} color="#f87171" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.budgetValueContainer}>
            <Text style={styles.budgetValue}>R$ {budget.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => setEditingBudget(true)}>
              <Feather name="edit-2" size={14} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Gasto</Text>
          <Text style={styles.statValue}>R$ {totalSpent.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Restante</Text>
          <Text
            style={[
              styles.statValue,
              { color: remaining >= 0 ? "#4ade80" : "#f87171" },
            ]}
          >
            R$ {remaining.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min((totalSpent / budget) * 100, 100)}%`,
              backgroundColor: totalSpent > budget ? "#ef4444" : "#10b981",
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: "#94a3b8",
    marginLeft: 8,
    fontSize: 14,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 8,
  },
  input: {
    backgroundColor: "#334155",
    color: "#f8fafc",
    padding: 4,
    borderRadius: 4,
    width: 80,
  },
  budgetValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 8,
  },
  budgetValue: {
    color: "#f8fafc",
    fontWeight: "bold",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  statValue: {
    color: "#f8fafc",
    fontWeight: "bold",
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default BudgetDisplay;
