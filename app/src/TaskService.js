import AsyncStorage from "@react-native-async-storage/async-storage";

const TASK_KEY = "TASKS_V2";

export const loadTasks = async () => {
  const data = await AsyncStorage.getItem(TASK_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = async (tasks) => {
  await AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks));
};

export const addTask = async (title) => {
  const tasks = await loadTasks();

  const newTask = {
    id: Date.now().toString(), // ✅ Unique ID
    title,
    status: "pending", // pending | synced
  };

  const updated = [...tasks, newTask];
  await saveTasks(updated);

  return updated;
};

export const markAllSynced = async () => {
  const tasks = await loadTasks();

  const updated = tasks.map((t) =>
    t.status === "pending" ? { ...t, status: "synced" } : t
  );

  await saveTasks(updated);
  return updated;
};
