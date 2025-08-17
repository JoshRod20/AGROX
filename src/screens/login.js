import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyle } from '../styles/loginStyle'; 
export default function Login() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={loginStyle.container}>
      <Text style={loginStyle.title}>Iniciar Sesión</Text>
      <TouchableOpacity
        style={loginStyle.buttonsesion}
        onPress={() => navigation.replace('Drawer')}
      >
        <Text style={loginStyle.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={loginStyle.buttonregister}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={loginStyle.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}