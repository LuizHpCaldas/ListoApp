import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import BudgetDisplay from "../components/BudgetDisplay";
import AddProductForm from "../components/AddProductForm";
import ProductItem from "../components/ProductItem";

const HomeScreen = ({ navigation }) => {
  const {
    lists,
    activeList,
    setActiveList,
    createList,
    deleteList,
    addProduct,
    mode,
    setMode,
  } = useAppContext();
  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(false);

  const currentList = lists.find((list) => list.id === activeList);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <AntDesign name="check" size={12} color="#a78bfa" />
            <AntDesign name="check" size={12} color="#60a5fa" />
          </View>
          <View>
            <Text style={styles.title}>Listo.ai</Text>
            <Text style={styles.subtitle}>Smart Shopping Lists</Text>
          </View>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === "home" && styles.activeMode]}
            onPress={() => setMode("home")}
          >
            <Feather
              name="home"
              size={16}
              color={mode === "home" ? "#7c3aed" : "#94a3b8"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === "market" && styles.activeMode]}
            onPress={() => navigation.navigate("Market")}
          >
            <Feather
              name="shopping-cart"
              size={16}
              color={mode === "market" ? "#7c3aed" : "#94a3b8"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === "analytics" && styles.activeMode,
            ]}
            onPress={() => navigation.navigate("Analytics")}
          >
            <Feather
              name="bar-chart-2"
              size={16}
              color={mode === "analytics" ? "#7c3aed" : "#94a3b8"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <BudgetDisplay />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Minhas Listas</Text>
        <TouchableOpacity
          onPress={() => setShowNewList(true)}
          style={styles.addButton}
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {showNewList && (
        <View style={styles.newListContainer}>
          <TextInput
            placeholder="Nome da lista"
            value={newListName}
            onChangeText={setNewListName}
            style={styles.input}
            onSubmitEditing={() => {
              if (createList(newListName)) {
                setNewListName("");
                setShowNewList(false);
              }
            }}
          />
          <View style={styles.newListButtons}>
            <TouchableOpacity
              onPress={() => setShowNewList(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (createList(newListName)) {
                  setNewListName("");
                  setShowNewList(false);
                }
              }}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {lists.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyLogo}>
            <AntDesign name="check" size={24} color="#a78bfa" />
            <AntDesign name="check" size={24} color="#60a5fa" />
          </View>
          <Text style={styles.emptyText}>Nenhuma lista criada ainda</Text>
          <Text style={styles.emptySubtext}>
            Clique no + para criar sua primeira lista
          </Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const listTotal = item.items.reduce(
              (total, item) =>
                total + (item.inCart && item.price ? item.price : 0),
              0
            );
            const itemsInCartCount = item.items.filter(
              (item) => item.inCart
            ).length;
            const isCompleted = item.completedAt;

            return (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  activeList === item.id && styles.activeListItem,
                  isCompleted && styles.completedListItem,
                ]}
                onPress={() => setActiveList(item.id)}
              >
                <View style={styles.listItemContent}>
                  <View style={styles.listItemLeft}>
                    <View
                      style={[
                        styles.listStatus,
                        isCompleted
                          ? styles.completedStatus
                          : itemsInCartCount > 0
                          ? styles.inProgressStatus
                          : styles.pendingStatus,
                      ]}
                    />
                    <View>
                      <Text style={styles.listName}>{item.name}</Text>
                      <Text style={styles.listDetails}>
                        {itemsInCartCount}/{item.items.length} itens • R${" "}
                        {listTotal.toFixed(2)}
                        {isCompleted && (
                          <Text style={styles.completedText}>
                            {" "}
                            • ✓ Concluída
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                  {!isCompleted && (
                    <TouchableOpacity
                      onPress={() => deleteList(item.id)}
                      style={styles.deleteButton}
                    >
                      <Feather name="trash-2" size={18} color="#f87171" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          style={styles.listsContainer}
        />
      )}

      {currentList && (
        <View style={styles.currentListContainer}>
          <View style={styles.currentListHeader}>
            <Text style={styles.currentListTitle}>{currentList.name}</Text>
            <Text style={styles.currentListStats}>
              {currentList.items.filter((item) => item.inCart).length}/
              {currentList.items.length} • R${" "}
              {currentList.items
                .reduce(
                  (total, item) =>
                    total + (item.inCart && item.price ? item.price : 0),
                  0
                )
                .toFixed(2)}
            </Text>
          </View>

          <AddProductForm onAdd={addProduct} />

          <FlatList
            data={currentList.items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductItem
                item={item}
                mode="home"
                onRemoveProduct={() => {
                  // Implementar função para remover produto
                }}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyProducts}>
                <Text style={styles.emptyProductsText}>
                  Nenhum produto na lista
                </Text>
                <Text style={styles.emptyProductsSubtext}>
                  Adicione produtos acima
                </Text>
              </View>
            }
            style={styles.productsList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 12,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeMode: {
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  newListContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#7c3aed30",
  },
  input: {
    backgroundColor: "#334155",
    color: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  newListButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: "#94a3b8",
  },
  createButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    color: "#94a3b8",
    fontSize: 14,
  },
  listsContainer: {
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  activeListItem: {
    borderColor: "#7c3aed",
    backgroundColor: "#7c3aed20",
  },
  completedListItem: {
    borderColor: "#10b98130",
    backgroundColor: "#10b98110",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pendingStatus: {
    backgroundColor: "#64748b",
  },
  inProgressStatus: {
    backgroundColor: "#f59e0b",
  },
  completedStatus: {
    backgroundColor: "#10b981",
  },
  listName: {
    color: "#fff",
    fontWeight: "500",
  },
  listDetails: {
    color: "#94a3b8",
    fontSize: 12,
  },
  completedText: {
    color: "#10b981",
  },
  deleteButton: {
    padding: 4,
  },
  currentListContainer: {
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 16,
  },
  currentListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  currentListTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  currentListStats: {
    color: "#94a3b8",
    fontSize: 14,
  },
  emptyProducts: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyProductsText: {
    color: "#fff",
    marginBottom: 4,
  },
  emptyProductsSubtext: {
    color: "#94a3b8",
    fontSize: 12,
  },
  productsList: {
    maxHeight: 300,
  },
});

export default HomeScreen;
