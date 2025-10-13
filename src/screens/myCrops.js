// screens/MisCultivos.js
import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import CropCard from "../components/cropCard";
import cropCardStyle from "../styles/cropCardStyle";
import { ScrollView } from "react-native-gesture-handler";

const MyCrops = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
            Cultivos
        </Text>
        {/* 👇 Usa CropCard en modo "full" para mostrar todos los datos */}
        <CropCard mode="full" />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyCrops;