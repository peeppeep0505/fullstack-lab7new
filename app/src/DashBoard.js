import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Dashboard() {
  const [crypto, setCrypto] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [errorStatus, setErrorStatus] = useState({
    crypto: false,
    weather: false,
  });

  const apiClient = axios.create({
    timeout: 5000,
  });

  const fetchData = async () => {
  setLoading(true);
  setErrorStatus({ crypto: false, weather: false });
  setIsOffline(false);

  const cryptoURL =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

  const weatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=bangkok&APPID=1234=metric";

  try {
    const [cryptoRes, weatherRes] = await Promise.allSettled([
      apiClient.get(cryptoURL),
      apiClient.get(weatherURL),
    ]);

    // 🔥 ถ้าทั้งสองล้มเหลว = ไม่มีเน็ต → โหลด cache
    if (
      cryptoRes.status === "rejected" &&
      weatherRes.status === "rejected"
    ) {
      throw new Error("Network Error");
    }

    // ===== CRYPTO =====
    if (cryptoRes.status === "fulfilled") {
      const price = cryptoRes.value.data.bitcoin.usd;
      setCrypto(price);
      await AsyncStorage.setItem("crypto", JSON.stringify(price));
    } else {
      setErrorStatus((prev) => ({ ...prev, crypto: true }));
    }

    // ===== WEATHER =====
    if (weatherRes.status === "fulfilled") {
      const temp = weatherRes.value.data.main.temp;
      setWeather(temp);
      await AsyncStorage.setItem("weather", JSON.stringify(temp));
    } else {
      setErrorStatus((prev) => ({ ...prev, weather: true }));
    }

  } catch (error) {
    // ✅ ไม่มีเน็ต → โหลด Cache
    setIsOffline(true);

    const cachedCrypto = await AsyncStorage.getItem("crypto");
    const cachedWeather = await AsyncStorage.getItem("weather");

    if (cachedCrypto) setCrypto(JSON.parse(cachedCrypto));
    if (cachedWeather) setWeather(JSON.parse(cachedWeather));
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={{ color: "white" }}>
            Offline Mode: Showing Cached Data
          </Text>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Crypto Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bitcoin Price (USD)</Text>
        {errorStatus.crypto ? (
          <Text style={styles.errorText}>Service Unavailable</Text>
        ) : (
          <Text style={styles.dataText}>
            {crypto ? `$${crypto}` : "--"}
          </Text>
        )}
      </View>

      {/* Weather Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bangkok Weather (°C)</Text>
        {errorStatus.weather ? (
          <Text style={styles.errorText}>Service Unavailable</Text>
        ) : (
          <Text style={styles.dataText}>
            {weather ? `${weather}°C` : "--"}
          </Text>
        )}
      </View>

      <Button title="Sync Data" onPress={fetchData} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dataText: {
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
  offlineBanner: {
    backgroundColor: "orange",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});
