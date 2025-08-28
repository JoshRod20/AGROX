// WeatherCard.js
import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import styles from "../styles/weatherCardStyles";

const { width } = Dimensions.get("window");

const WeatherCard = () => {
  return (
    <>
      {/* Encabezado de sección con separador */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Clima</Text>
        <View style={styles.sectionLine} />
      </View>

      {/* Tarjeta de clima */}
      <View style={[styles.cardWrapper, { width: width * 0.9 }]}>
        <Image
          source={require("../assets/agricultor.png")}
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text style={styles.temperature}>28°</Text>
          <Text style={styles.range}>24° / 29°</Text>
          <Text style={styles.status}>Templado</Text>
        </View>
      </View>
    </>
  );
};

export default WeatherCard;
