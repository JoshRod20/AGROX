import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // ✅ Importación correcta
import { cropStyle } from "../styles/cropStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Evita que se oculte el SplashScreen automáticamente
SplashScreen.preventAutoHideAsync();

const Crop = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const cropTypes = [
    {
      label: "Granos Básicos",
      value: "Granos Básicos",
      image: require("../assets/granos basicos.webp"),
    },
    {
      label: "Hortalizas",
      value: "Hortalizas",
      image: require("../assets/hortalizas.jpg"),
    },
    {
      label: "Frutas",
      value: "Frutas",
      image: require("../assets/frutas.jpg"),
    },
    {
      label: "Tubérculos",
      value: "Tubérculos",
      image: require("../assets/tuberculos.jpg"),
    },
  ];

  // Carga la fuente
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={cropStyle.containerCrop} onLayout={onLayoutRootView}>
      {/* Botón de retroceso */}
      <View style={cropStyle.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={cropStyle.backButtonCrop}
        >
          <Image
            source={require("../assets/arrow-left.png")}
            style={cropStyle.backIconCrop}
          />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text
        style={[
          { fontFamily: "CarterOne", color: "#2E7D32" },
          cropStyle.titleCrop,
        ]}
      >
        Seleccione el tipo de cultivo
      </Text>

      {/* Botones con imagen + texto */}
      <View style={{ gap: 18, marginBottom: 24 }}>
        {cropTypes.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() =>
              navigation.navigate("FormCrop", { cropType: option.value })
            }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["rgba(46, 125, 50, 1)", "rgba(76, 175, 80, 0.7)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={cropStyle.buttonSR2}
            >
              <View style={cropStyle.buttonContent}>
                <Image source={option.image} style={cropStyle.cropIcon} />
                <Text
                  style={[
                    { fontFamily: "QuicksandBold", color: "#fff" },
                    cropStyle.buttonTextCropTypes,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Crop;
