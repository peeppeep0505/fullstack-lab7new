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

export const syncQueue = async (onUpdate) => {
  const tasks = await loadTasks();
  const pending = tasks.filter((t) => t.status === "pending");

  if (pending.length === 0) {
    return tasks;
  }

  let updatedTasks = tasks;

  for (const task of pending) {
    // Simulate sending each pending task to server.
    await new Promise((resolve) => setTimeout(resolve, 800));

    updatedTasks = updatedTasks.map((t) =>
      t.id === task.id ? { ...t, status: "synced" } : t
    );

    await saveTasks(updatedTasks);

    if (onUpdate) {
      onUpdate(updatedTasks);
    }
  }

  return updatedTasks;
};
