import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Details() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();

  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // ✅ สำคัญมาก
    setLoading(true);

    const loadData = async () => {
      try {
        const res = await fetch(`https://openlibrary.org${id}.json`);
        const data = await res.json();

        if (typeof data.description === "string") {
          setDescription(data.description);
        } else if (data.description?.value) {
          setDescription(data.description.value);
        } else {
          setDescription("No description available.");
        }
      } catch (error) {
        setDescription("Failed to load description.");
      } finally {
        setLoading(false); // ✅ ปิด loading เสมอ
      }
    };

    loadData();
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="tomato" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      ) : (
        <Text style={styles.desc}>{description}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.replace({
            pathname: "/",
            params: { favId: id },
          })
        }
      >
        <Text style={{ color: "white" }}>Mark as Favorite ❤️</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  desc: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  center: {
  justifyContent: "center",
  alignItems: "center",
  marginTop: 20,
}
});
