// WeatherCard.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } from "@env";
import styles from "../styles/weatherCardStyles";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../utils/fonts/Quicksand-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const { data } = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
          lang: "es",
        },
      });
      setWeather({
        temp: Math.round(data.main.temp),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max),
        status: data.weather[0].description,
        icon: data.weather[0].main.toLowerCase(),
      });
    } catch (e) {
      console.error("Error al obtener el clima:", e);
    } finally {
      setLoading(false);
    }
  };

  const getLocationAndWeather = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permiso de ubicación denegado");
      setLoading(false);
      return;
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});
    fetchWeatherByCoords(latitude, longitude);
  };

  useEffect(() => {
    if (!fontsLoaded) return;
    getLocationAndWeather();
    const id = setInterval(getLocationAndWeather, 300_000); // 5 min
    return () => clearInterval(id);
  }, [fontsLoaded]);

  const getIconSource = (icon) => {
    switch (icon) {
      case "clear": return require("../assets/clear.png");
      case "clouds": return require("../assets/nublado.png");
      case "rain": return require("../assets/rain.png");
      default: return require("../assets/clear.png");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontFamily: "CarterOne" }]}>Clima</Text>
        <View style={styles.sectionLine} />
      </View>

      <View style={[styles.cardWrapper, styles[weather?.icon] || styles.clear]}>
        <Image source={getIconSource(weather?.icon)} style={styles.icon} />
        <Text style={[styles.status, { fontFamily: "QuicksandBold" }]}>{weather?.status}</Text>
        <View style={styles.tempBlock}>
          <Text style={[styles.temperature, { fontFamily: "CarterOne" }]}>{weather?.temp}°</Text>
          <Text style={[styles.range, { fontFamily: "QuicksandBold" }]}>{weather?.min}° / {weather?.max}°</Text>
        </View>
      </View>
    </View>
  );
};

export default WeatherCard;