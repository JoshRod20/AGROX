import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { seedsAndInputsStyle } from "../../styles/inventoryStyles/seedsAndInputsStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const SeedsAndInputs = () => {
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
    <SafeAreaView style={seedsAndInputsStyle.container} onLayout={onLayoutRootView}>
      <View>
        <Text style={seedsAndInputsStyle.moduleTitle}>Semillas e insumos</Text>
      </View>
    </SafeAreaView>
  );
};

export default SeedsAndInputs;