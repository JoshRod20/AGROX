import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/aboutUsCardStyle";

const AboutUsCard = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>Nosotros</Text>
      <View style={styles.separator} />
      <View style={styles.card}>
        <Image
          source={require("../assets/agricultor2.png")}
          style={styles.image}
        />
        <Text style={styles.text}>
          <Text style={styles.highlight}>AGROX</Text> es una herramienta digital
          pensada para el pequeño y mediano productor, que ayuda a registrar y
          dar seguimiento a la trazabilidad de sus cultivos de forma sencilla.
        </Text>
      </View>
    </View>
  );
};

export default AboutUsCard;
