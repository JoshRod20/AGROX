import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyle } from '../styles/loginStyle';

export default function Login() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={loginStyle.container}>
      <Image
        source={require('../assets/AgroxLogo.jpg')}
        style={loginStyle.logo}
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={() => navigation.replace('Drawer')}
      >
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']} // Gradiente de verde oscuro a verde claro
          start={{ x: 0, y: 0 }} // Comienza en la esquina superior izquierda.
          end={{ x: 1, y: 1 }}   // Termina en la esquina inferior derecha (diagonal)
          style={loginStyle.buttonsesion}
        >
          <Text style={loginStyle.buttonText}>Iniciar Sesión</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={loginStyle.buttonregister}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={loginStyle.buttonTextRegister}>Registrar cuenta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}