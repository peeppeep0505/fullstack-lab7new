import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function LinkButton({ link, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress(link.title);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>{link.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginVertical: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});
