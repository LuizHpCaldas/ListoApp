import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

const AnalyticsScreen = ({ navigation }) => {
  const { lists, completedLists, avgSpentPerList, totalSpent, remaining } =
    useAppContext();

  const totalProducts = lists.reduce((sum, list) => sum + list.items.length, 0);
  const totalPurchased = lists.reduce(
    (sum, list) => sum + list.items.filter((item) => item.inCart).length,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Analytics</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Lists</Text>
          <Text style={styles.statValue}>{lists.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Completed Lists</Text>
          <Text style={[styles.statValue, styles.completed]}>
            {completedLists.length}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Products</Text>
          <Text style={styles.statValue}>{totalProducts}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg. Spent</Text>
          <Text style={styles.statValue}>R$ {avgSpentPerList.toFixed(2)}</Text>
        </View>
      </View>

      {completedLists.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Purchases</Text>
          <FlatList
            data={completedLists.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const total = item.items.reduce(
                (sum, item) => sum + (item.price || 0),
                0
              );
              return (
                <TouchableOpacity style={styles.purchaseItem}>
                  <View>
                    <Text style={styles.purchaseTitle}>{item.name}</Text>
                    <Text style={styles.purchaseDate}>
                      {new Date(item.completedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.purchaseRight}>
                    <Text style={styles.purchaseAmount}>
                      R$ {total.toFixed(2)}
                    </Text>
                    <Text style={styles.purchaseItems}>
                      {item.items.length} items
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      <View style={styles.tipContainer}>
        <Feather name="info" size={20} color="#6b7280" />
        <Text style={styles.tipText}>
          {avgSpentPerList > 0
            ? `Your average spending is R$ ${avgSpentPerList.toFixed(
                2
              )} per list.`
            : "Complete some purchases to see analytics."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e293b",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  completed: {
    color: "#10b981",
  },
  historyContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  purchaseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  purchaseDate: {
    fontSize: 12,
    color: "#64748b",
  },
  purchaseRight: {
    alignItems: "flex-end",
  },
  purchaseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  purchaseItems: {
    fontSize: 12,
    color: "#64748b",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
  },
  tipText: {
    marginLeft: 8,
    color: "#64748b",
    flex: 1,
  },
});

export default AnalyticsScreen;
