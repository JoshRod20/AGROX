import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transportStyle } from "../../styles/inventoryStyles/transportStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const Transport = () => {
  const navigation = useNavigation();
  
  const [fontsLoaded] = useFonts({
    CarterOne: require("../../utils/fonts/CarterOne-Regular.ttf"),
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
    <SafeAreaView style={transportStyle.container} onLayout={onLayoutRootView}>
      <View>
        <Text style={transportStyle.moduleTitle}>Transporte</Text>
      </View>
    </SafeAreaView>
  );
};

export default Transport;