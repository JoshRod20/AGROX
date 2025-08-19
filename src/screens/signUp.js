import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUpStyle } from '../styles/signUpStyle'; 

export default function SignUp() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={signUpStyle.container}>
      <Text style={signUpStyle.title}>Registrarse</Text>
      <TouchableOpacity 
                onPress={() => navigation.navigate('SignIn')}
              ></TouchableOpacity>
      <TouchableOpacity
        style={signUpStyle.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={signUpStyle.buttonText}>Volver a Iniciar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}