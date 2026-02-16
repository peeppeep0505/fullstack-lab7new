import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  loadTasks,
  addTask,
  markAllSynced,
} from "./TaskService";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(true);

useEffect(() => {
  init();

  const unsubscribe = NetInfo.addEventListener((state) => {
    const online = state.isConnected;
    setIsOnline(online);

    if (online) {
      autoSync();
    }
  });

  return () => unsubscribe();
}, []);


  const init = async () => {
    const saved = await loadTasks();
    setTasks(saved);
  };

  const handleAdd = async () => {
    if (!input.trim()) return;

    const updated = await addTask(input);
    setTasks(updated);
    setInput("");
  };

const autoSync = async () => {
  const currentTasks = await loadTasks(); // ✅ โหลดใหม่จาก storage

  const hasPending = currentTasks.some(
    (t) => t.status === "pending"
  );

  if (!hasPending) return;

  // จำลอง API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const updated = await markAllSynced();
  setTasks(updated);
};


  return (
    <View style={styles.container}>

      {/* ✅ C2 Status Banner */}
      <View
        style={[
          styles.banner,
          { backgroundColor: isOnline ? "green" : "red" },
        ]}
      >
        <Text style={{ color: "white" }}>
          {isOnline ? "Online" : "Offline"}
        </Text>
      </View>

      <Text style={styles.title}>Offline-First Task App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task..."
        value={input}
        onChangeText={setInput}
      />

      <Button title="Add Task" onPress={handleAdd} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ marginTop: 10 }}>
            • {item.title}{" "}
            {item.status === "pending"
              ? "⏳ Pending"
              : "✅ Synced"}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginVertical: 10 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  banner: {
    padding: 8,
    alignItems: "center",
  },
});
