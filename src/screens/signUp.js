import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { signUpStyle } from '../styles/signUpStyle';
import { db, auth } from '../services/database';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState(null);
  const [productionType, setProductionType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [plotsNumber, setPlotsNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Dropdown states
  const [openGender, setOpenGender] = useState(false);

  // Opciones
  const genderOptions = ['Masculino', 'Femenino', 'Otro'].map(g => ({ label: g, value: g }));

  // Data from SignUp2
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
      await createUserWithEmailAndPassword(auth, email, prevData.password);
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

      await addDoc(collection(db, 'Users'), user);

      // Guardar flag de nuevo usuario
      await AsyncStorage.setItem("isNewUser", "true");
      
  // Limpiar campos después de registro exitoso
  setEmail('');
  setGender(null);
  setProductionType('');
  setFarmSize('');
  setPlotsNumber('');
  setErrors({});
  navigation.replace('Onboarding');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setErrors(prev => ({ ...prev, email: 'El correo electrónico ya está en uso.' }));
      } else {
        Alert.alert('Error', e.message || 'Error al registrar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  // Carga fuentes
  const [fontsLoaded] = useFonts({
    CarterOne: require('../utils/fonts/CarterOne-Regular.ttf'),
    QuicksandBold: require('../utils/fonts/Quicksand-Bold.ttf'),
    QuicksandRegular: require('../utils/fonts/Quicksand-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={signUpStyle.container} onLayout={onLayoutRootView}>
      {/* Correo electrónico */}
      <Text style={[signUpStyle.label2, { fontFamily: 'QuicksandBold' }]}>Correo electrónico</Text>
      <TextInput
        style={[signUpStyle.input, { fontFamily: 'QuicksandRegular' }]}
        placeholder="Ingrese su correo electrónico"
        value={email}
        onChangeText={text => {
          setEmail(text);
          setErrors(prev => ({ ...prev, email: undefined }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.email}</Text>}

      {/* Sexo */}
      <Text style={[signUpStyle.label2, { fontFamily: 'QuicksandBold' }]}>Sexo</Text>
      <DropDownPicker
        open={openGender}
        value={gender}
        items={genderOptions}
        setOpen={setOpenGender}
        setValue={val => {
          setGender(val);
          setErrors(prev => ({ ...prev, gender: undefined }));
        }}
        placeholder="Seleccione su sexo"
        placeholderStyle={{ fontFamily: 'QuicksandRegular', color: '#888' }}
        style={{ borderColor: '#2E7D32', borderWidth: 3, width: '90%', marginLeft: '5%' }}
        textStyle={{ fontFamily: 'QuicksandRegular' }}
        zIndex={3000}
        zIndexInverse={1000}
      />
      {errors.gender && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.gender}</Text>}

      {/* Tipo de cultivos */}
      <Text style={[signUpStyle.label2, { fontFamily: 'QuicksandBold' }]}>Tipo de cultivos o producción</Text>
      <TextInput
        style={[signUpStyle.input, { fontFamily: 'QuicksandRegular' }]}
        placeholder="Ej: maíz, café, ganado, etc."
        value={productionType}
        onChangeText={text => {
          setProductionType(text);
          setErrors(prev => ({ ...prev, productionType: undefined }));
        }}
      />
      {errors.productionType && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.productionType}</Text>}

      {/* Tamaño de la finca */}
      <Text style={[signUpStyle.label2, { fontFamily: 'QuicksandBold' }]}>Tamaño de la finca (mz/ha)</Text>
      <TextInput
        style={[signUpStyle.input, { fontFamily: 'QuicksandRegular' }]}
        placeholder="Ej: 5 mz o 3 ha"
        value={farmSize}
        onChangeText={text => {
          setFarmSize(text);
          setErrors(prev => ({ ...prev, farmSize: undefined }));
        }}
        keyboardType="numeric"
      />
      {errors.farmSize && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.farmSize}</Text>}

      {/* Número de parcelas */}
      <Text style={[signUpStyle.label2, { fontFamily: 'QuicksandBold' }]}>Número de parcelas</Text>
      <TextInput
        style={[signUpStyle.input, { fontFamily: 'QuicksandRegular' }]}
        placeholder="Ingrese el número de parcelas"
        value={plotsNumber}
        onChangeText={text => {
          setPlotsNumber(text);
          setErrors(prev => ({ ...prev, plotsNumber: undefined }));
        }}
        keyboardType="numeric"
      />
      {errors.plotsNumber && <Text style={{ color: 'red', marginBottom: 4 }}>{errors.plotsNumber}</Text>}

      {/* Botón registrarse */}
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
          <Text style={[signUpStyle.buttonText, { fontFamily: 'CarterOne' }]}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Botón inicio sesión */}
      <TouchableOpacity
        style={signUpStyle.signUpTextContainer}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={[signUpStyle.signUpText2, { fontFamily: 'QuicksandRegular' }]}>
          ¿Ya tienes cuenta? <Text style={signUpStyle.signUpLink2}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUp;
