import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  {registerStyle}  from '../styles/registerStyle';

export default function Register() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={registerStyle.container}>
      <Text style={registerStyle.title}>Registrarse</Text>
      <TouchableOpacity
        style={registerStyle.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={registerStyle.buttonText}>Volver a Iniciar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}