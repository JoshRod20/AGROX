
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { signUpStyle } from '../styles/signUpStyle';
import { db, auth } from '../services/database';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Evita que se oculte el SplashScreen automáticamente
SplashScreen.preventAutoHideAsync();

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [productionType, setProductionType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [plotsNumber, setPlotsNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const genderOptions = ['Masculino', 'Femenino', 'Otro'];
  // Data from signUp2
  const prevData = route.params || {};

  const handleRegister = async () => {
    let newErrors = {};
    if (!email) newErrors.email = 'El correo electrónico es obligatorio.';
    if (!gender) newErrors.gender = 'El sexo es obligatorio.';
    if (!productionType) newErrors.productionType = 'El tipo de cultivos o producción es obligatorio.';
    if (!farmSize) newErrors.farmSize = 'El tamaño de la finca es obligatorio.';
    if (!plotsNumber) newErrors.plotsNumber = 'El número de parcelas es obligatorio.';
    if (!prevData.name) newErrors.name = 'El nombre es obligatorio.';
    if (!prevData.password) newErrors.password = 'La contraseña es obligatoria.';
    if (!prevData.department) newErrors.department = 'El departamento es obligatorio.';
    if (!prevData.municipality) newErrors.municipality = 'El municipio es obligatorio.';
    if (!prevData.community) newErrors.community = 'La comunidad es obligatoria.';
    if (!prevData.userId) newErrors.userId = 'Error interno de ID de usuario.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      // Crear usuario en Firebase Auth
      await createUserWithEmailAndPassword(auth, email, prevData.password);

      // Save in Firestore (without password)
      const { password, ...restPrevData } = prevData;
      const user = {
        userId: prevData.userId,
        ...restPrevData,
        email,
        gender,
        productionType,
        farmSize,
        plotsNumber,
        registrationDate: new Date().toISOString(),
      };
      await addDoc(collection(db, 'Users'), user);
      Alert.alert('Registro exitoso', 'Usuario registrado correctamente.');
      navigation.replace('SignIn');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setErrors((prev) => ({ ...prev, email: 'El correo electrónico ya está en uso.' }));
      } else {
        Alert.alert('Error', e.message || 'Error al registrar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

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
    <SafeAreaView style={signUpStyle.container}>
      {/* Correo electrónico */}
      <Text style={signUpStyle.label2}>Correo electrónico</Text>
      <TextInput
        style={signUpStyle.input}
        placeholder="Ingrese su correo electrónico"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.email}</Text>}
      {/* Sexo */}
      <Text style={signUpStyle.label2}>Sexo</Text>
      <View style={signUpStyle.input}>
        <Picker
          selectedValue={gender}
          onValueChange={(value) => {
            setGender(value);
            setErrors((prev) => ({ ...prev, gender: undefined }));
          }}
        >
          <Picker.Item label="Seleccione su sexo" value="" />
          {genderOptions.map((g) => (
            <Picker.Item key={g} label={g} value={g} />
          ))}
        </Picker>
      </View>
      {errors.gender && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.gender}</Text>}
      {/* Tipo de cultivos o producción */}
      <Text style={signUpStyle.label2}>Tipo de cultivos o producción</Text>
      <TextInput
        style={signUpStyle.input}
        placeholder="Ej: maíz, café, ganado, etc."
        value={productionType}
        onChangeText={(text) => {
          setProductionType(text);
          setErrors((prev) => ({ ...prev, productionType: undefined }));
        }}
      />
      {errors.productionType && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.productionType}</Text>}
      {/* Tamaño de la finca */}
      <Text style={signUpStyle.label2}>Tamaño de la finca (mz/ha)</Text>
      <TextInput
        style={signUpStyle.input}
        placeholder="Ej: 5 mz o 3 ha"
        value={farmSize}
        onChangeText={(text) => {
          setFarmSize(text);
          setErrors((prev) => ({ ...prev, farmSize: undefined }));
        }}
        keyboardType="numeric"
      />
      {errors.farmSize && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.farmSize}</Text>}
      {/* Número de parcelas */}
      <Text style={signUpStyle.label2}>Número de parcelas</Text>
      <TextInput
        style={signUpStyle.input}
        placeholder="Ingrese el número de parcelas"
        value={plotsNumber}
        onChangeText={(text) => {
          setPlotsNumber(text);
          setErrors((prev) => ({ ...prev, plotsNumber: undefined }));
        }}
        keyboardType="numeric"
      />
      {errors.plotsNumber && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.plotsNumber}</Text>}
      {/* Botón de registrarse */}
      <TouchableOpacity
        style={signUpStyle.buttonSR}
        onPress={handleRegister}
        disabled={loading}
      >
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={signUpStyle.button}
        >
          <Text style={signUpStyle.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
        </LinearGradient>
      </TouchableOpacity>
       {/* Botón de registro */}
      <TouchableOpacity
        style={signUpStyle.signUpTextContainer}
        onPress={() => navigation.navigate('SignIn')}
      >
  <Text style={signUpStyle.signUpText2}>¿Ya tienes cuenta? <Text style={signUpStyle.signUpLink2}>Inicia sesión</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
export default SignUp;