import React, { useCallback } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import CropCard from "../components/cropCard";
import cropCardStyle from "../styles/cropCardStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Evita que se oculte el splash screen automáticamente
SplashScreen.preventAutoHideAsync();

const MyCrops = () => {
  // 👇 Hooks dentro del componente
  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../utils/fonts/Quicksand-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Mientras cargan las fuentes, no renderizar nada
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} onLayout={onLayoutRootView}>
      <ScrollView>
        <View style={{ padding: 16 }}>
          {/* Título */}
          <Text
            style={[
              { fontFamily: "CarterOne", color: "#2E7D32", fontSize: 24, marginBottom: 16 },
              cropCardStyle.titleMyCrop,
            ]}
          >
            Mis Cultivos
          </Text>
          {/* Tarjetas en modo completo */}
          <CropCard mode="full" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyCrops;