// WeatherCard.js

import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Location from "expo-location";
import axios from "axios";
import { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } from "@env";
import styles from "../styles/weatherCardStyles";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

// Recibe isNewUser como prop desde Home
const WeatherCard = ({ isNewUser = false }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

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

      if (!isMounted.current) return;

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
      if (isMounted.current) setLoading(false);
    }
  };

  const getLocationAndWeather = async () => {
    if (!isMounted.current) return;
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permiso de ubicación denegado");
        if (isMounted.current) setLoading(false);
        return;
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      await fetchWeatherByCoords(latitude, longitude);
    } catch (err) {
      console.error("Error obteniendo ubicación:", err);
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    if (fontsLoaded) {
      getLocationAndWeather();
      const intervalId = setInterval(getLocationAndWeather, 60_000); // Cada 60s

      return () => {
        isMounted.current = false;
        clearInterval(intervalId);
      };
    }
  }, [fontsLoaded]);

  const getIconSource = (icon) => {
    switch (icon) {
      case "clear":
        return require("../assets/sun.png");
      case "clouds":
        return require("../assets/cloudy.png");
      case "rain":
        return require("../assets/rain.png");
      case "thunderstorm":
        return require("../assets/storm.png");
      case "fog":
      case "mist":
        return require("../assets/fog.png");
      default:
        return require("../assets/sun.png");
    }
  };

  const getGradientColors = (icon) => {
    switch (icon) {
      case "clear":
        return ["#FFF153", "#145A86"];
      case "clouds":
        return ["#AAAAAA", "#767E86"];
      case "rain":
        return ["#999999", "#145A86"];
      case "thunderstorm":
        return ["#AAAAAA", "#60656A"];
      case "mist":
      case "fog":
        return ["#AAAAAA", "#767E86"];
      default:
        return ["#FFD700", "#4A90E2"];
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontFamily: "CarterOne" }]}>
          Clima
        </Text>
        <View style={styles.sectionLine} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" />
      ) : (
        <LinearGradient
          colors={getGradientColors(weather?.icon)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.cardWrapper,
            {
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowOffset: { width: 0, height: hp("0.5%") },
              shadowRadius: wp("1%"),
              elevation: 4,
            },
          ]}
        >
          {isNewUser ? (
            // ✨ Diseño especial para primer uso
            <>
              <View style={styles.newUserIconContainer}>
                <Image
                  source={getIconSource(weather?.icon)}
                  style={styles.newUserIcon}
                />
                <Text style={[styles.newUserStatus, { fontFamily: "QuicksandBold" }]}>
                  {weather?.status}
                </Text>
              </View>
              <View style={styles.newUserTempContainer}>
                <Text style={[styles.newUserTemperature, { fontFamily: "CarterOne" }]}>
                  {weather?.temp}°
                </Text>
                <Text style={[styles.newUserRange, { fontFamily: "QuicksandBold" }]}>
                  {weather?.min}° / {weather?.max}°
                </Text>
              </View>
            </>
          ) : (
            // 🔄 Diseño normal
            <>
              <Image source={getIconSource(weather?.icon)} style={styles.icon} />
              <Text style={[styles.status, { fontFamily: "QuicksandBold" }]}>
                {weather?.status}
              </Text>
              <View style={styles.tempBlock}>
                <Text style={[styles.temperature, { fontFamily: "CarterOne" }]}>
                  {weather?.temp}°
                </Text>
                <Text style={[styles.range, { fontFamily: "QuicksandBold" }]}>
                  {weather?.min}° / {weather?.max}°
                </Text>
              </View>
            </>
          )}
        </LinearGradient>
      )}
    </View>
  );
};

export default WeatherCard;