import React, { useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyle } from '../styles/loginStyle';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Evita que se oculte el SplashScreen automáticamente
SplashScreen.preventAutoHideAsync();

export default function Login() {
  const navigation = useNavigation();

  // Carga la fuente
  const [fontsLoaded] = useFonts({
    CarterOne: require('../utils/fonts/CarterOne-Regular.ttf'), // 👈 ajusta la ruta según tu proyecto
  });

  // Oculta el Splash cuando ya cargó la fuente
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // mientras carga la fuente
  }

  return (
    <SafeAreaView style={loginStyle.container} onLayout={onLayoutRootView}>
      <Image
        source={require('../assets/AgroxLogo.jpg')}
        style={loginStyle.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={loginStyle.buttonLogin}
        >
          <Text style={[{ fontFamily: 'CarterOne', color: '#fff' }, loginStyle.buttonText ]}>
            Iniciar Sesión
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={loginStyle.buttonSignUp}
        onPress={() => navigation.navigate('SignUp2')}
      >
        <Text style={loginStyle.buttonTextSignUp}>Registrar cuenta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
