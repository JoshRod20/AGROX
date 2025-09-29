import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/aboutUsCardStyle";

const AboutUsCard = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nosotros</Text>
        <View style={styles.sectionLine} />
      </View>
      <View style={styles.cardWrapper}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/agricultor.png")}
            style={styles.image}
          />
          <View style={styles.overlay}>
            <Image
              source={require("../assets/AGROX-Blanco.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardText}>
            <Text style={styles.highlight}>AGROX</Text> es una herramienta
            digital pensada para el pequeño y mediano productor, que ayuda a
            registrar y dar seguimiento a la trazabilidad de sus cultivos de
            forma sencilla.
          </Text>
        </View>
      </View>
    </>
  );
};

export default AboutUsCard;
