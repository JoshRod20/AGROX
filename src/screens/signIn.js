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

  // Animaciones de bordes
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;

  // Animaciones de errores
  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passErrorAnim = useRef(new Animated.Value(0)).current;

  const animateBorder = (anim, state) => {
    let toValue = state === "error" ? 1 : state === "ok" ? 2 : 0;
    Animated.timing(anim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animateError = (anim, visible) => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleSignIn = async () => {
    let newErrors = {};
    if (!email) newErrors.email = 'El correo es obligatorio.';
    if (!password) newErrors.password = 'La contraseña es obligatoria.';

    setErrors(newErrors);

    animateError(emailErrorAnim, !!newErrors.email);
    animateError(passErrorAnim, !!newErrors.password);
    animateBorder(emailBorderAnim, newErrors.email ? "error" : email ? "ok" : "default");
    animateBorder(passwordBorderAnim, newErrors.password ? "error" : password ? "ok" : "default");

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('Drawer');
    } catch (error) {
      console.log("Firebase login error:", error.code, error.message);
      setErrors({ password: 'Correo o contraseña incorrectos.' });
      animateError(passErrorAnim, true);
      animateBorder(passwordBorderAnim, "error");
    } finally {
      setLoading(false);
    }
  };

  // Interpolación de colores
  const borderColorInterpolation = (anim) =>
    anim.interpolate({
      inputRange: [0, 1, 2], // default, error, ok
      outputRange: ["#2E7D32", "#D32F2F", "#4CAF50"], // verde base, rojo error, verde claro ok
    });

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
          loginStyle.inputEmailContainer, // 👈 ahora controlas el ancho desde estilos
          { borderBottomColor: borderColorInterpolation(emailBorderAnim) }
        ]}
      >
        <TextInput
          style={[{ fontFamily: 'QuicksandBold'}, loginStyle.inputEmail]}
          placeholder="Introduzca su nombre o correo"
          placeholderTextColor="#9E9E9E"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setErrors(prev => ({ ...prev, email: undefined }));
            animateError(emailErrorAnim, false);
            animateBorder(emailBorderAnim, text ? "ok" : "default");
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
          <Text style={{ color: "#D32F2F", fontSize: 13, fontFamily: "QuicksandBold" }}>
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
          loginStyle.inputPasswordContainer, // 👈 ahora controlas el ancho desde estilos
          { borderBottomColor: borderColorInterpolation(passwordBorderAnim) }
        ]}
      >
        <TextInput
          style={[{ fontFamily: 'QuicksandBold'}, loginStyle.inputPassword]}
          placeholder="Introduzca su contraseña"
          placeholderTextColor="#9E9E9E"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrors(prev => ({ ...prev, password: undefined }));
            animateError(passErrorAnim, false);
            animateBorder(passwordBorderAnim, text ? "ok" : "default");
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
          <Text style={{ color: "#D32F2F", fontSize: 13, fontFamily: "QuicksandBold" }}>
            {errors.password}
          </Text>
        </Animated.View>
      )}

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
