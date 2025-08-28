import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/welcomeMessageStyle';

const WelcomeMessage = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <View>
      <Text style={styles.title}>
        ¡Bienvenido a <Text style={styles.highlight}>AGROX</Text>!
      </Text>
      <Text style={styles.subtitle}>
        Comenzá a registrar, cuidar y hacer crecer tus cultivos con el poder de
        la tecnología, desde el campo hasta la cosecha.
      </Text>
    </View>
  );
};

export default WelcomeMessage;