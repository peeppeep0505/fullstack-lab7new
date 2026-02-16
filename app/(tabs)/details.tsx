import {
  type NavigationProp,
  type RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
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

export default function Details() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "details">>();
  const { book } = route.params; //c2

  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
//c1
        const res = await fetch(`https://openlibrary.org${book.key}.json`);
        const data = await res.json();

        if (!isMounted) return;

        if (typeof data.description === "string") {
          setDescription(data.description);
        } else if (data.description?.value) {
          setDescription(data.description.value);
        } else {
          setDescription("No description available.");
        }
      } catch (error) {
        if (isMounted) {
          setDescription("Failed to load description.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [book.key]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{book.title}</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="tomato" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <Text style={styles.desc}>{description}</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("index", {
            favId: book.key,
            t: Date.now().toString(),
          })
        }
      >
        <Text style={styles.buttonText}>Favorite ❤️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 90,
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
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
  },
});
