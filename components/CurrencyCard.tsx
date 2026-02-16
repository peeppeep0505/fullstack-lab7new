import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CurrencyInput from "./CurrencyInput";
import { CurrencyRate } from "../types";

interface Props {
  amount: string;
  setAmount: (value: string) => void;
  selectedRate: CurrencyRate;
  onSwitch: () => void;
}

const CurrencyCard: React.FC<Props> = ({
  amount,
  setAmount,
  selectedRate,
  onSwitch,
}) => {
  const converted =
    amount !== ""
      ? (parseFloat(amount) * selectedRate.rate).toFixed(2)
      : "0.00";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Currency Converter</Text>

      <CurrencyInput value={amount} onChange={setAmount} />

      <TouchableOpacity style={styles.button} onPress={onSwitch}>
        <Text style={styles.buttonText}>
          Switch Currency ({selectedRate.code})
        </Text>
      </TouchableOpacity>

      <Text style={styles.result}>
        Converted: {converted} {selectedRate.code}
      </Text>
    </View>
  );
};

export default CurrencyCard;

const styles = StyleSheet.create({
  card: {
    width: "85%",
    padding: 30,
    borderRadius: 20,

    // ✅ C2 Glassmorphism
    backgroundColor: "rgba(255,255,255,0.2)",

    alignItems: "center",

    // ✅ Android shadow
    elevation: 8,

    // ✅ iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#6a11cb",
    fontWeight: "bold",
  },
  result: {
    fontSize: 20,
    color: "white",
  },
});
