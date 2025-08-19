import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyle } from '../styles/loginStyle';
import { auth } from '../services/database';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
        source={require('../assets/AgroxLogo.jpg')}
        style={loginStyle.logo}
        resizeMode="contain"
      />
      <TextInput
        style={{
          width: '80%',
          height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 16,
          paddingHorizontal: 12,
          fontSize: 16,
        }}
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{
          width: '80%',
          height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 16,
          paddingHorizontal: 12,
          fontSize: 16,
        }}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleSignIn} disabled={loading}>
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={loginStyle.buttonSignIn}
        >
          <Text style={loginStyle.buttonText}>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={loginStyle.buttonSignUp}
        onPress={() => navigation.navigate('SignUp')}
        disabled={loading}
      >
        <Text style={loginStyle.buttonTextSignUp}>Registrar cuenta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
