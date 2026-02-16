import {
  type NavigationProp,
  type RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Book {
  key: string;
  title: string;
  isFavorite?: boolean;
}

type RootStackParamList = {
  index: { favId?: string; t?: string } | undefined;
  details: { book: Book };
};

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "index">>();
  const favId = route.params?.favId;
  const t = route.params?.t;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  //c3
  useEffect(() => {
    if (favId) {
      const id = String(favId);

      setBooks((prev) =>
        prev.map((book) =>
          book.key === id ? { ...book, isFavorite: !book.isFavorite } : book,
        ),
      );
    }
  }, [favId, t]);

  const fetchBooks = () => {
    setLoading(true);

    fetch("https://openlibrary.org/search.json?q=javascript&limit=10")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.docs.map((item: any) => ({
          key: item.key,
          title: item.title,
          isFavorite: false,
        }));

        setBooks(formatted);
      })
      .catch((error) => {
        console.log("Error:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  //c2
  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={[styles.card, item.isFavorite && { backgroundColor: "#ffe5e5" }]}
      onPress={() => navigation.navigate("details", { book: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      {item.isFavorite && <Text>❤️ Favorite</Text>}
    </TouchableOpacity>
  );

  //c4

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading books...</Text>
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
