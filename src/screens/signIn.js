import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyle } from '../styles/loginStyle';
import { auth } from '../services/database';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

  // Animaciones de errores
  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passErrorAnim = useRef(new Animated.Value(0)).current;

  // Animaciones de sacudida
  const shakeAnimEmail = useRef(new Animated.Value(0)).current;
  const shakeAnimPassword = useRef(new Animated.Value(0)).current;

  // Función para animación de sacudida
  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Función para animación de errores
  const animateError = (anim, visible) => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  // Validación y manejo de inicio de sesión
  const handleValidation = async () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = 'El correo es obligatorio.';
      triggerShake(shakeAnimEmail);
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
      triggerShake(shakeAnimPassword);
    }

    setErrors(newErrors);

    animateError(emailErrorAnim, !!newErrors.email);
    animateError(passErrorAnim, !!newErrors.password);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('Drawer');
    } catch (error) {
      console.log("Firebase login error:", error.code, error.message);
      setErrors({ password: 'Correo o contraseña incorrectos.' });
      animateError(passErrorAnim, true);
      triggerShake(shakeAnimPassword);
    } finally {
      setLoading(false);
    }
  };

  // Fuentes
  const [fontsLoaded] = useFonts({
    CarterOne: require('../utils/fonts/CarterOne-Regular.ttf'),
    QuicksandBold: require('../utils/fonts/Quicksand-Bold.ttf'),
    QuicksandRegular: require('../utils/fonts/Quicksand-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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

      {/* EMAIL */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, loginStyle.textEmail]}>
        Nombre de usuario o correo
      </Text>
      <Animated.View
        style={[
          loginStyle.inputEmailContainer,
          errors.email && loginStyle.errorInput,
          { transform: [{ translateX: shakeAnimEmail }] }
        ]}
      >
        <TextInput
          style={loginStyle.inputEmail}
          placeholder="Introduzca su nombre o correo"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: undefined }));
            animateError(emailErrorAnim, false);
          }}
        />
      </Animated.View>
      {errors.email && (
        <Animated.View
          style={{
            opacity: emailErrorAnim,
            transform: [{ translateY: emailErrorAnim.interpolate({ inputRange: [0, 1], outputRange: [-5, 0] }) }],
            marginBottom: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: "#ff0000", fontSize: 13, fontFamily: "QuicksandBold" }}>
            {errors.email}
          </Text>
        </Animated.View>
      )}

      {/* PASSWORD */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, loginStyle.textPassword]}>
        Contraseña
      </Text>
      <Animated.View
        style={[
          loginStyle.inputPasswordContainer,
          errors.password && loginStyle.errorInput,
          { transform: [{ translateX: shakeAnimPassword }] }
        ]}
      >
        <TextInput
          style={loginStyle.inputPassword}
          placeholder="Introduzca su contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: undefined }));
            animateError(passErrorAnim, false);
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </Animated.View>
      {errors.password && (
        <Animated.View
          style={{
            opacity: passErrorAnim,
            transform: [{ translateY: passErrorAnim.interpolate({ inputRange: [0, 1], outputRange: [-5, 0] }) }],
            marginBottom: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: "#ff0000", fontSize: 13, fontFamily: "QuicksandBold" }}>
            {errors.password}
          </Text>
        </Animated.View>
      )}

      {/* Botón de inicio */}
      <TouchableOpacity onPress={handleValidation} disabled={loading}>
        <LinearGradient
          colors={['rgba(46, 125, 50, 1)', 'rgba(76, 175, 80, 0.7)']}
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