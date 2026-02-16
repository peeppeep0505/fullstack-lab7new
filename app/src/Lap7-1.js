import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import LinkButton from "./LinkButton";
import ProfileCard from "./ProfileCard";

export default function Lab7_1() {
  const [borderColor, setBorderColor] = useState("#3b82f6");
  const links = [
    { title: "GitHub", url: "https://github.com" },
    { title: "LinkedIn", url: "https://linkedin.com" },
  ];

  const handlePress = (title) => {
    Alert.alert("Pressed", `You pressed ${title}`);
    const nextColor = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
    setBorderColor(nextColor);
  };

  return (
    <View style={styles.container}>
      <ProfileCard borderColor={borderColor} />

      {links.map((link, index) => (
        <LinkButton key={index} link={link} onPress={handlePress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
});
