import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signUpStyle } from '../styles/signUpStyle';
import { db } from '../services/database';
import { collection, getDocs, query } from 'firebase/firestore';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import DropDownPicker from 'react-native-dropdown-picker';

// Evita que se oculte el SplashScreen automáticamente
SplashScreen.preventAutoHideAsync();

function generateUserId(usersLength) {
  const num = usersLength + 1;
  return `U${num.toString().padStart(4, '0')}`;
}

const SignUp2 = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados para los dropdowns
  const [department, setDepartment] = useState(null);
  const [municipality, setMunicipality] = useState(null);
  const [community, setCommunity] = useState(null);

  const [openDep, setOpenDep] = useState(false);
  const [openMun, setOpenMun] = useState(false);
  const [openCom, setOpenCom] = useState(false);

  const [loading, setLoading] = useState(false);

  // Datos
  const departments = [
    'Boaco', 'Carazo', 'Chinandega', 'Chontales', 'Estelí', 'Granada',
    'Jinotega', 'León', 'Madriz', 'Managua', 'Masaya', 'Matagalpa',
    'Nueva Segovia', 'Río San Juan', 'Rivas', 'RAAN', 'RAAS'
  ];
  const municipalities = ['Municipio 1', 'Municipio 2', 'Municipio 3'];
  const communities = ['Comunidad 1', 'Comunidad 2', 'Comunidad 3'];

  // Carga la fuente
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={signUpStyle.container} onLayout={onLayoutRootView}>
      <Text style={[{ fontFamily: 'CarterOne', color: '#2E7D32' }, signUpStyle.title]}>Registro</Text>
      <Text style={[{ fontFamily: 'QuicksandBold'}, signUpStyle.signUpTitle]}>
        Crea una cuenta de <Text style={[{ fontFamily: 'QuicksandBold'}, signUpStyle.signUpLinkTitle]}>AGROX</Text>
      </Text>

      {/* Nombre */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, signUpStyle.label]}>Nombre</Text>
      <TextInput
        style={[{ fontFamily: 'QuicksandRegular'}, signUpStyle.input]}
        placeholder="Ingrese su nombre"
        value={name}
        onChangeText={setName}
      />

      {/* Contraseña */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, signUpStyle.label]}>Contraseña</Text>
      <View style={signUpStyle.inputPasswordContainer}>
        <TextInput
          style={[{ fontFamily: 'QuicksandRegular'}, signUpStyle.inputPassword]}
          placeholder="Ingrese su contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Departamento */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, signUpStyle.label]}>Departamento</Text>
      <DropDownPicker
        open={openDep}
        value={department}
        items={departments.map((dep) => ({ label: dep, value: dep }))}
        setOpen={setOpenDep}
        setValue={setDepartment}
        placeholder="Seleccione un departamento"
        placeholderStyle={{ fontFamily: 'QuicksandRegular', color: '#888' }}
        style={{ borderColor: '#2E7D32', borderWidth: 3, width: '90%', marginLeft: '5%'  }}
        textStyle={{ fontFamily: 'QuicksandRegular' }}
        zIndex={3000}
        zIndexInverse={1000}
      />

      {/* Municipio */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, signUpStyle.label]}>Municipio</Text>
      <DropDownPicker
        open={openMun}
        value={municipality}
        items={municipalities.map((mun) => ({ label: mun, value: mun }))}
        setOpen={setOpenMun}
        setValue={setMunicipality}
        placeholder="Seleccione un municipio"
        placeholderStyle={{ fontFamily: 'QuicksandRegular', color: '#888' }}
        style={{ borderColor: '#2E7D32', borderWidth: 3, width: '90%', marginLeft: '5%' }}
        textStyle={{ fontFamily: 'QuicksandRegular' }}
        zIndex={2000}
        zIndexInverse={2000}
      />

      {/* Comunidad */}
      <Text style={[{ fontFamily: 'QuicksandBold'}, signUpStyle.label]}>Comunidad o comarca</Text>
      <DropDownPicker
        open={openCom}
        value={community}
        items={communities.map((com) => ({ label: com, value: com }))}
        setOpen={setOpenCom}
        setValue={setCommunity}
        placeholder="Seleccione una comunidad"
        placeholderStyle={{ fontFamily: 'QuicksandRegular', color: '#888' }}
        style={{ borderColor: '#2E7D32', borderWidth: 3, width: '90%', marginLeft: '5%' }}
        textStyle={{ fontFamily: 'QuicksandRegular' }}
        zIndex={1000}
        zIndexInverse={3000}
      />

      {/* Botón */}
      <TouchableOpacity
        style={[{ fontFamily: 'CarterOne'}, signUpStyle.button]}
        onPress={async () => {
          if (!name || !password || !department || !municipality || !community) {
            Alert.alert('Campos incompletos', 'Por favor, complete todos los campos.');
            return;
          }
          setLoading(true);
          try {
            const usersSnap = await getDocs(query(collection(db, 'Users')));
            const userId = generateUserId(usersSnap.size);
            navigation.navigate('SignUp', {
              userId,
              name,
              password,
              department,
              municipality,
              community,
            });
          } catch (e) {
            Alert.alert('Error', e.message || 'Error al generar ID de usuario');
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={signUpStyle.button}
        >
          <Text style={[{ fontFamily: 'CarterOne'}, signUpStyle.buttonTextSR]}>
            {loading ? 'Cargando...' : 'Siguiente'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUp2;
