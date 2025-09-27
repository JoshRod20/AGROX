import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import homeStyle from "../styles/homeStyle";
import menuBurger from "../assets/menu-burger.png";
import agroxLogo from "../assets/AGROX.png";
import WelcomeMessage from "../components/welcomeMessage";
import AboutUsCard from "../components/aboutUsCard";
import WeatherCard from "../components/weatherCard";
import CropCard from "../components/cropCard";

export default function Home() {
  const navigation = useNavigation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await AsyncStorage.setItem("hasSeenWelcome", "true");
      await AsyncStorage.setItem("hasSeenAboutUs", "true");
      setShowWelcome(false);
      setShowAboutUs(false);
    } catch (error) {
      console.log("Error durante el refresco:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const checkWelcome = async () => {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
        if (hasSeenWelcome === "false" || !hasSeenWelcome) {
          setShowWelcome(true);
          await AsyncStorage.setItem("hasSeenWelcome", "true");
        }
      } catch (error) {
        console.log("Error revisando hasSeenWelcome:", error);
      }
    };
    checkWelcome();
  }, []);

  useEffect(() => {
    const checkCards = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
        const hasSeenAboutUs = await AsyncStorage.getItem("hasSeenAboutUs");
        if (
          hasOnboarded === "true" &&
          (!hasSeenAboutUs || hasSeenAboutUs === "false")
        ) {
          setShowAboutUs(true);
        }
      } catch (error) {
        console.log("Error revisando tarjetas:", error);
      }
    };
    checkCards();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => setShowWelcome(false);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      return async () => {
        setShowAboutUs(false);
        await AsyncStorage.setItem("hasSeenAboutUs", "true");
      };
    }, [])
  );

  return (
    <SafeAreaView style={homeStyle.container}>
      <View style={homeStyle.header}>
        <TouchableOpacity
          style={homeStyle.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={menuBurger}
            style={{ width: 30, height: 30, resizeMode: "contain" }}
          />
        </TouchableOpacity>
        <View style={homeStyle.logoContainer}>
          <Image source={agroxLogo} style={homeStyle.logo} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={homeStyle.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3A8D2D"]}
          />
        }
      >
        <View>
          <WelcomeMessage isVisible={showWelcome} />
          <WeatherCard />
        </View>
        <AboutUsCard isVisible={showAboutUs} />
        <CropCard />
      </ScrollView>
    </SafeAreaView>
  );
}
