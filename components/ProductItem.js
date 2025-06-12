import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";

const ProductItem = ({
  item,
  mode,
  onAddToCart,
  onRemoveFromCart,
  onRemoveProduct,
}) => {
  const [price, setPrice] = useState("");
  const [showPriceInput, setShowPriceInput] = useState(false);

  const handleAddToCart = () => {
    if (price.trim()) {
      onAddToCart(item.id, price);
      setPrice("");
      setShowPriceInput(false);
    }
  };

  if (mode === "home") {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.checkbox} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <TouchableOpacity onPress={() => onRemoveProduct(item.id)}>
          <Feather name="trash-2" size={18} color="#f87171" />
        </TouchableOpacity>
      </View>
    );
  }

  if (item.inCart) {
    return (
      <View style={[styles.container, styles.inCartContainer]}>
        <View style={styles.content}>
          <View style={[styles.checkbox, styles.inCartCheckbox]}>
            <Feather name="check" size={12} color="#fff" />
          </View>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onRemoveFromCart(item.id)}>
          <Feather name="x" size={18} color="#f87171" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{item.name}</Text>

      {!showPriceInput ? (
        <TouchableOpacity
          style={styles.priceButton}
          onPress={() => setShowPriceInput(true)}
        >
          <Text style={styles.priceButtonText}>Adicionar Preço</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.priceInputContainer}>
          <TextInput
            placeholder="0,00"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.priceInput}
            autoFocus
          />
          <TouchableOpacity onPress={handleAddToCart}>
            <Feather name="check" size={18} color="#4ade80" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowPriceInput(false);
              setPrice("");
            }}
          >
            <Feather name="x" size={18} color="#f87171" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  inCartContainer: {
    backgroundColor: "#10b98120",
    borderWidth: 1,
    borderColor: "#10b98130",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#64748b",
    justifyContent: "center",
    alignItems: "center",
  },
  inCartCheckbox: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  name: {
    color: "#fff",
    fontWeight: "500",
  },
  price: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "600",
  },
  priceButton: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priceButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceInput: {
    width: 80,
    backgroundColor: "#334155",
    color: "#f8fafc",
    borderRadius: 4,
    padding: 6,
  },
});

export default ProductItem;
