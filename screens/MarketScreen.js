import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";
import BudgetDisplay from "../components/BudgetDisplay";
import ProductItem from "../components/ProductItem";

const MarketScreen = ({ navigation }) => {
  const {
    lists,
    activeList,
    completeList,
    addToCart,
    removeFromCart,
    remaining,
  } = useAppContext();

  const currentList = lists.find((list) => list.id === activeList);
  const itemsInCart = currentList
    ? currentList.items.filter((item) => item.inCart).length
    : 0;
  const totalItems = currentList ? currentList.items.length : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Modo Mercado</Text>
        <View style={{ width: 24 }} />
      </View>

      <BudgetDisplay />

      <View style={styles.marketNotice}>
        <Feather name="shopping-cart" size={16} color="#f97316" />
        <Text style={styles.marketNoticeText}>
          Adicione preços conforme pega os produtos
        </Text>
      </View>

      {currentList ? (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{currentList.name}</Text>
            <Text style={styles.listStats}>
              {itemsInCart}/{totalItems} • R${" "}
              {currentList.items
                .reduce(
                  (total, item) =>
                    total + (item.inCart && item.price ? item.price : 0),
                  0
                )
                .toFixed(2)}
            </Text>
          </View>

          <FlatList
            data={currentList.items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductItem
                item={item}
                mode="market"
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
              />
            )}
            style={styles.productsList}
          />

          {totalItems > 0 && itemsInCart === totalItems && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                completeList(currentList.id);
                navigation.goBack();
              }}
            >
              <Text style={styles.completeButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma lista selecionada</Text>
          <Text style={styles.emptySubtext}>
            Volte para a tela inicial e selecione uma lista
          </Text>
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
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  marketNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f9731610",
    borderWidth: 1,
    borderColor: "#f9731630",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  marketNoticeText: {
    color: "#f97316",
    fontSize: 14,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  listStats: {
    color: "#94a3b8",
    fontSize: 14,
  },
  productsList: {
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
});

export default MarketScreen;
