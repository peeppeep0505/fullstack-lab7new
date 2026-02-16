import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
}


export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  
  const { favId } = useLocalSearchParams();

  useEffect(() => {
    if (favId) {
      setFavoriteId(String(favId));
    }
  }, [favId]);


  // useEffect(() => {
  //   fetch("https://openlibrary.org/search.json?q=react")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setBooks(data.docs.slice(0, 10));
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  const fetchBooks = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      "https://openlibrary.org/search.json?q=javascript&limit=10"
    );

    const data = await response.json();

    // เซ็ตข้อมูลหนังสือ (docs คือ array ที่ได้จาก API)
    setBooks(data.docs);

  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchBooks();
}, []);


  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: item.key, title: item.title },
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
      {favoriteId === item.key && <Text>❤️ Favorite</Text>}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
