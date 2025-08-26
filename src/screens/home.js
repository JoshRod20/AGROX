import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { homeStyle } from '../styles/homeStyle'; 
import menuBurger from '../assets/menu-burger.png';

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={homeStyle.container}>
      {/* Botón menú con imagen personalizada */}
      <TouchableOpacity
        style={homeStyle.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Image
          source={menuBurger}
          style={{ width: 30, height: 30, resizeMode: 'contain' }}
        />
      </TouchableOpacity>

      <View style={homeStyle.content}>
        <Text>Esta es la pantalla Home</Text>
      </View>
    </SafeAreaView>
  );
}
