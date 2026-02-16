import React from "react";
import {
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

const CurrencyInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ width: "100%" }}
    >
      <TextInput
        placeholder="Enter THB"
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad" // ✅ numeric keyboard
        style={styles.input}
        placeholderTextColor="#ddd"
      />
    </KeyboardAvoidingView>
  );
};

export default CurrencyInput;

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "white",
  },
});
