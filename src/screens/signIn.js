import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyle } from '../styles/loginStyle';
import { auth } from '../services/database';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signUpStyle } from '../styles/signUpStyle';

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Drawer');
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyle.container}>
<Image
  source={require('../assets/LogoSignIn.png')}
  style={loginStyle.logoSignIn}
  resizeMode="contain"
/>
<Text style={loginStyle.logtext}>Inicio de sesión</Text>
<Text style={loginStyle.sesionText}>Inicia sesión con tu cuenta de <Text style={loginStyle.agroxText}>Agrox</Text></Text>
      {/* Label y Input de usuario/correo */}
      <Text style={loginStyle.textEmail}>Nombre de usuario o correo</Text>
      <TextInput
        style={loginStyle.inputEmail}
        placeholder="Introduzca su nombre o correo"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Label y Input de contraseña */}
      <Text style={loginStyle.textPassword}>Contraseña</Text>
      <View style={signUpStyle.inputPasswordContainer}>
        <TextInput
          style={loginStyle.inputPassword}
          placeholder="Introduzca su contraseña"
          secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
          </TouchableOpacity>
      </View>

      {/* Botón de inicio */}
      <TouchableOpacity onPress={handleSignIn} disabled={loading}>
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={loginStyle.buttonSignIn}
        >
          <Text style={loginStyle.buttonText}>
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
        <Text style={loginStyle.signUpText}>¿No tienes cuenta? <Text style={loginStyle.signUpLink}>Regístrate</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
