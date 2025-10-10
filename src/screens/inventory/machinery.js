import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { machineryStyle } from "../../styles/inventoryStyles/machineryStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const Machinery = () => {
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
    <SafeAreaView style={machineryStyle.container} onLayout={onLayoutRootView}>
      <View>
        <Text style={machineryStyle.moduleTitle}>Maquinaria</Text>
      </View>
    </SafeAreaView>
  );
};

export default Machinery;
