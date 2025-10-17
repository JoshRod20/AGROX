import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { loginStyle } from "../styles/loginStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Evita que se oculte el SplashScreen automáticamente
SplashScreen.preventAutoHideAsync();

export default function Login() {
  const navigation = useNavigation();

  // Carga la fuente
  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../utils/fonts/Quicksand-Regular.ttf"),
  });

  // Oculta el Splash cuando ya cargó la fuente
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // mientras carga la fuente
  }

  return (
    <SafeAreaView style={loginStyle.container} onLayout={onLayoutRootView}>
      <Image
        source={require("../assets/Logo_AGROX-sinFondo.png")}
        style={loginStyle.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <LinearGradient
          colors={["rgba(46, 125, 50, 1)", "rgba(76, 175, 80, 0.7)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={loginStyle.buttonLogin}
        >
          <Text
            style={[
              { fontFamily: "CarterOne", color: "#fff" },
              loginStyle.buttonText,
            ]}
          >
            Iniciar Sesión
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={loginStyle.buttonSignUp}
        onPress={() => navigation.navigate("SignUp2")}
      >
        <Text
          style={[
            { fontFamily: "QuicksandBold", color: "#ffffffff" },
            loginStyle.buttonTextSignUp,
          ]}
        >
          Registrar cuenta 
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
