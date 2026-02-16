import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function ProfileCard({ borderColor }) {
  const size = 150;

  return (
    <View style={styles.container}>
      <Image
        source={require("../../public/profile.jpg")} 
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: borderColor,
          },
        ]}
      />
      <Text style={styles.name}>Sirikorn Jaisri</Text>
      <Text style={styles.role}>FullStack Developer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    borderWidth: 4,
    resizeMode: "cover",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  role: {
    fontSize: 14,
    color: "gray",
  },
});
