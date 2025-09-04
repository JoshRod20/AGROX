import React, { useCallback, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Animated, ScrollView } from 'react-native';
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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
  const [department, setDepartment] = useState(null);
  const [municipality, setMunicipality] = useState(null);
  const [community, setCommunity] = useState(null);
  const [openDep, setOpenDep] = useState(false);
  const [openMun, setOpenMun] = useState(false);
  const [openCom, setOpenCom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation refs for shake effect
  const shakeAnimName = useRef(new Animated.Value(0)).current;
  const shakeAnimPassword = useRef(new Animated.Value(0)).current;
  const shakeAnimDep = useRef(new Animated.Value(0)).current;
  const shakeAnimMun = useRef(new Animated.Value(0)).current;
  const shakeAnimCom = useRef(new Animated.Value(0)).current;

  // ScrollView ref for scrolling to errors
  const scrollViewRef = useRef(null);

  // Refs for field positions
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const departmentRef = useRef(null);
  const municipalityRef = useRef(null);
  const communityRef = useRef(null);

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

  // Shake animation function
  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Trigger shake and scroll to first error
  const handleValidation = () => {
    let newErrors = {};
    if (!name) {
      newErrors.name = 'El nombre es obligatorio.';
      triggerShake(shakeAnimName);
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
      triggerShake(shakeAnimPassword);
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password = 'Debe tener al menos 8 caracteres, una letra mayúscula, letras y un carácter especial.';
        triggerShake(shakeAnimPassword);
      }
    }
    if (!department) {
      newErrors.department = 'El departamento es obligatorio.';
      triggerShake(shakeAnimDep);
    }
    if (!municipality) {
      newErrors.municipality = 'El municipio es obligatorio.';
      triggerShake(shakeAnimMun);
    }
    if (!community) {
      newErrors.community = 'La comunidad es obligatoria.';
      triggerShake(shakeAnimCom);
    }
    setErrors(newErrors);

    // Scroll to the first error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldRefs = {
        name: nameRef,
        password: passwordRef,
        department: departmentRef,
        municipality: municipalityRef,
        community: communityRef,
      };
      const targetRef = fieldRefs[firstErrorField];
      if (targetRef.current) {
        targetRef.current.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current.scrollTo({ y, animated: true });
          },
          () => console.log('Error measuring layout')
        );
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={signUpStyle.container} onLayout={onLayoutRootView}>
      <ScrollView
        ref={scrollViewRef}
        style={signUpStyle.scrollContainer}
        contentContainerStyle={signUpStyle.scrollContent}
        scrollEnabled={Object.keys(errors).length > 0}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[{ fontFamily: 'CarterOne' }, signUpStyle.logtext]}>Registro</Text>
        <Text style={[{ fontFamily: 'QuicksandBold' }, signUpStyle.sesionText]}>
          Crea una cuenta de <Text style={[{ fontFamily: 'QuicksandBold' }, signUpStyle.agroxText]}>AGROX</Text>
        </Text>

        {/* Nombre */}
        <Text style={[{ fontFamily: 'QuicksandBold' }, signUpStyle.textEmail]}>Nombre</Text>
        <Animated.View
          ref={nameRef}
          style={[signUpStyle.inputEmailContainer, errors.name && signUpStyle.errorInput, { transform: [{ translateX: shakeAnimName }] }]}
        >
          <TextInput
            style={signUpStyle.inputEmail}
            placeholder="Ingrese su nombre"
            placeholderTextColor="#888"
            value={name}
            onChangeText={text => {
              setName(text);
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
          />
        </Animated.View>
        {errors.name && <Text style={signUpStyle.errorText}>{errors.name}</Text>}

        {/* Contraseña */}
        <Text style={[{ fontFamily: 'QuicksandBold' }, signUpStyle.textPassword]}>Contraseña</Text>
        <Animated.View
          ref={passwordRef}
          style={[signUpStyle.inputPasswordContainer, errors.password && signUpStyle.errorInput, { transform: [{ translateX: shakeAnimPassword }] }]}
        >
          <TextInput
            style={signUpStyle.inputPassword}
            placeholder="Ingrese su contraseña"
            placeholderTextColor="#888"
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
        </Animated.View>
        {errors.password && <Text style={signUpStyle.errorText}>{errors.password}</Text>}

        {/* Departamento */}
        <Text style={[{ fontFamily: 'QuicksandBold' }, signUpStyle.textInputTitle]}>Departamento</Text>
        <Animated.View
          ref={departmentRef}
          style={[signUpStyle.inputEmailContainer, errors.department && signUpStyle.errorInput, { transform: [{ translateX: shakeAnimDep }], zIndex: openDep ? 5000 : 1000 }]}
        >
          <DropDownPicker
            open={openDep}
            value={department}
            items={departments.map((dep) => ({ label: dep, value: dep }))}
            setOpen={setOpenDep}
            setValue={setDepartment}
            placeholder="Seleccione un departamento"
            placeholderStyle={[{ fontFamily: 'QuicksandRegular' }, signUpStyle.placeholder]}
            style={[signUpStyle.inputEmail, { borderWidth: 0, backgroundColor: '#fff' }]}
            textStyle={{ fontFamily: 'QuicksandRegular', fontSize: wp('3.5%') }}
            dropDownContainerStyle={[signUpStyle.dropDownContainer, errors.department && signUpStyle.errorInput]}
            listMode="SCROLLVIEW"
            scrollViewProps={{ nestedScrollEnabled: true, maxHeight: hp('30%') }}
            zIndex={openDep ? 6000 : 1000}
            zIndexInverse={openDep ? 1000 : 6000}
          />
        </Animated.View>
        {errors.department && <Text style={signUpStyle.errorText}>{errors.department}</Text>}

        {/* Municipio */}
        <Text style={[{ fontFamily: 'QuicksandBold' }, signUpStyle.textInputTitle]}>Municipio</Text>
        <Animated.View
          ref={municipalityRef}
          style={[signUpStyle.inputEmailContainer, errors.municipality && signUpStyle.errorInput, { transform: [{ translateX: shakeAnimMun }], zIndex: openMun ? 4000 : 800 }]}
        >
          <DropDownPicker
            open={openMun}
            value={municipality}
            items={municipalities.map((mun) => ({ label: mun, value: mun }))}
            setOpen={setOpenMun}
            setValue={setMunicipality}
            placeholder="Seleccione un municipio"
            placeholderStyle={[{ fontFamily: 'QuicksandRegular' }, signUpStyle.placeholder]}
            style={[signUpStyle.inputEmail, { borderWidth: 0, backgroundColor: '#fff' }]}
            textStyle={{ fontFamily: 'QuicksandRegular', fontSize: wp('3.5%') }}
            dropDownContainerStyle={[signUpStyle.dropDownContainer, errors.municipality && signUpStyle.errorInput]}
            listMode="SCROLLVIEW"
            scrollViewProps={{ nestedScrollEnabled: true, maxHeight: hp('30%') }}
            zIndex={openMun ? 5000 : 800}
            zIndexInverse={openMun ? 800 : 5000}
          />
        </Animated.View>
        {errors.municipality && <Text style={signUpStyle.errorText}>{errors.municipality}</Text>}

        {/* Comunidad */}
        <Text style={[{ fontFamily: 'QuicksandBold' }, signUpStyle.textInputTitle]}>Comunidad o comarca</Text>
        <Animated.View
          ref={communityRef}
          style={[signUpStyle.inputEmailContainer, errors.community && signUpStyle.errorInput, { transform: [{ translateX: shakeAnimCom }], zIndex: openCom ? 3000 : 600 }]}
        >
          <DropDownPicker
            open={openCom}
            value={community}
            items={communities.map((com) => ({ label: com, value: com }))}
            setOpen={setOpenCom}
            setValue={setCommunity}
            placeholder="Seleccione una comunidad"
            placeholderStyle={[{ fontFamily: 'QuicksandRegular' }, signUpStyle.placeholder]}
            style={[signUpStyle.inputEmail, { borderWidth: 0, backgroundColor: '#fff' }]}
            textStyle={{ fontFamily: 'QuicksandRegular', fontSize: wp('3.5%') }}
            dropDownContainerStyle={[signUpStyle.dropDownContainer, errors.community && signUpStyle.errorInput]}
            listMode="SCROLLVIEW"
            scrollViewProps={{ nestedScrollEnabled: true, maxHeight: hp('30%') }}
            zIndex={openCom ? 4000 : 600}
            zIndexInverse={openCom ? 600 : 4000}
          />
        </Animated.View>
        {errors.community && <Text style={signUpStyle.errorText}>{errors.community}</Text>}

        {/* Botón */}
        <TouchableOpacity
          style={signUpStyle.buttonSignIn}
          onPress={async () => {
            if (!handleValidation()) return;
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
            colors={['rgba(46, 125, 50, 1)', 'rgba(76, 175, 80, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={signUpStyle.buttonSignIn}
          >
            <Text style={[{ fontFamily: 'CarterOne' }, signUpStyle.buttonTextSR]}>
              {loading ? 'Cargando...' : 'Siguiente'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp2;