import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { onboardingStyle } from "../styles/onboardingStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");

const slides = [
  { id: "1", image: require("../assets/imagen_1.jpg"), text: "Registra tus parcelas y lleva el control de cada cultivo." },
  { id: "2", image: require("../assets/imagen_2.jpg"), text: "Lleva un historial completo de tu producción, sin papeles." },
  { id: "3", image: require("../assets/imagen_3.webp"), text: "Ten a mano la trazabilidad de tus cultivos para vender mejor." },
  { id: "4", image: require("../assets/agricultor2.png"), text: "Gestiona todo desde tu celular, de forma fácil y rápida." },
];

const Onboarding = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    navigation.replace("Drawer");
  };

  // Escuchar scrollX para actualizar índice
  scrollX.addListener(({ value }) => {
    const index = Math.round(value / width);
    if (index !== currentIndex) setCurrentIndex(index);
  });

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      finishOnboarding();
    }
  };

  return (
    <LinearGradient
      colors={["#4CAF50", "#2E7D32"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        style={[onboardingStyle.container, { backgroundColor: "transparent" }]}
        onLayout={onLayoutRootView}
      >
        <Animated.FlatList
          data={slides}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          ref={slidesRef}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item, index }) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [50, 0, 50],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: "clamp",
            });

            return (
              <View style={onboardingStyle.slide}>
                <Animated.Image
                  source={item.image}
                  style={[onboardingStyle.image, { transform: [{ translateY }], opacity }]}
                />
                <Text style={[onboardingStyle.text, { fontFamily: "CarterOne" }]}>{item.text}</Text>
              </View>
            );
          }}
        />

        {/* Indicadores */}
        <View style={onboardingStyle.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                onboardingStyle.indicator,
                { backgroundColor: index === currentIndex ? "#FF5722" : "#ccc" },
              ]}
            />
          ))}
        </View>

        {/* Botones */}
        <View style={onboardingStyle.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={onboardingStyle.button}
              onPress={() => slidesRef.current.scrollToIndex({ index: currentIndex - 1 })}
            >
              <Text style={[onboardingStyle.buttonText, { fontFamily: "CarterOne" }]}>Anterior</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={onboardingStyle.button} onPress={scrollTo}>
            <Text style={[onboardingStyle.buttonText, { fontFamily: "CarterOne" }]}>
              {currentIndex === slides.length - 1 ? "Empezar" : "Siguiente"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Onboarding;
