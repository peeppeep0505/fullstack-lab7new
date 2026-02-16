import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CurrencyCard from "../../components/CurrencyCard";
import { currencyRates } from "../../data/currencyRates";

export default function HomeScreen() {
  const [amount, setAmount] = useState("");
  const [index, setIndex] = useState(0);

  const selectedRate = currencyRates[index];

  const handleSwitch = () => {
    setIndex((prev) => (prev + 1) % currencyRates.length);
  };

  return (
    <View style={styles.container}>
      <CurrencyCard
        amount={amount}
        setAmount={setAmount}
        selectedRate={selectedRate}
        onSwitch={handleSwitch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181222",
  },
});
