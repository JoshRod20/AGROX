import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyle } from '../styles/loginStyle';
import { auth } from '../services/database';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signUpStyle } from '../styles/signUpStyle';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Evita que el Splash se oculte antes de tiempo
SplashScreen.preventAutoHideAsync();

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignIn = async () => {
    let newErrors = {};
    if (!email) newErrors.email = 'El correo es obligatorio.';
    if (!password) newErrors.password = 'La contraseña es obligatoria.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Drawer');
    } catch (error) {
      setErrors({ password: 'Correo o contraseña incorrectos.' });
    } finally {
      setLoading(false);
    }
  };

  // Carga la fuente
  const [fontsLoaded] = useFonts({
    CarterOne: require('../utils/fonts/CarterOne-Regular.ttf'),
    QuicksandBold: require('../utils/fonts/Quicksand-Bold.ttf'),
    QuicksandRegular: require('../utils/fonts/Quicksand-Regular.ttf'),
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
        source={require('../assets/LogoSignIn.png')}
        style={loginStyle.logoSignIn}
        resizeMode="contain"
      />

      <Text style={[{ fontFamily: 'CarterOne', color: '#2E7D32' }, loginStyle.logtext]}>
        Inicio de sesión
      </Text>

      <Text style={[{ fontFamily: 'QuicksandBold'}, loginStyle.sesionText]}>
        Inicia sesión con tu cuenta de <Text style={[{ fontFamily: 'QuicksandBold' }, loginStyle.agroxText]}>AGROX</Text>
      </Text>

      {/* Label e Input de usuario/correo */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, loginStyle.textEmail]}>Nombre de usuario o correo</Text>
      <TextInput
        style={[{ fontFamily: 'QuicksandBold'}, loginStyle.inputEmail]}
        placeholder="Introduzca su nombre o correo"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={text => {
          setEmail(text);
          setErrors(prev => ({ ...prev, email: undefined }));
        }}
      />
      {errors.email && <Text style={{ color: 'red', marginTop: -30, alignSelf: 'center' }}>{errors.email}</Text>}

      {/* Label e Input de contraseña */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, loginStyle.textPassword]}>Contraseña</Text>
      <View style={signUpStyle.inputPasswordContainer}>
        <TextInput
          style={[{ fontFamily: 'QuicksandBold'}, loginStyle.inputPassword]}
          placeholder="Introduzca su contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: undefined }));
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={{ color: 'red', marginBottom: 4, alignSelf: 'center', marginLeft: '5%' }}>{errors.password}</Text>}

      {/* Botón de inicio */}
      <TouchableOpacity onPress={handleSignIn} disabled={loading}>
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={loginStyle.buttonSignIn}
        >
          <Text style={[loginStyle.buttonText, { fontFamily: 'CarterOne' }]}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Botón de registro */}
      <TouchableOpacity
        style={loginStyle.signUpTextContainer}
        onPress={() => navigation.navigate('SignUp2')}
        disabled={loading}
      >
        <Text style={[{ fontFamily: 'QuicksandBold'}, loginStyle.signUpText]}>
          ¿No tienes cuenta? <Text style={[{ fontFamily: 'QuicksandBold'}, loginStyle.signUpLink]}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
