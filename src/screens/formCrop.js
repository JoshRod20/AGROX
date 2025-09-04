import React, { useState, useCallback, useRef } from 'react';
import { Text, TextInput, TouchableOpacity, Alert, Animated, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../services/database';
import { collection, addDoc } from 'firebase/firestore';
import { cropStyle } from '../styles/cropStyle';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

SplashScreen.preventAutoHideAsync();

const FormCrop = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const cropType = route.params?.cropType || '';
  const [cropName, setCropName] = useState('');
  const [lotLocation, setLotLocation] = useState('');
  const [technicalManager, setTechnicalManager] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ScrollView ref para scroll a errores
  const scrollViewRef = useRef(null);

  // Animation refs para shake effect
  const shakeAnimCropName = useRef(new Animated.Value(0)).current;
  const shakeAnimCropType = useRef(new Animated.Value(0)).current;
  const shakeAnimLotLocation = useRef(new Animated.Value(0)).current;
  const shakeAnimTechnicalManager = useRef(new Animated.Value(0)).current;

  // Refs para field positions
  const cropNameRef = useRef(null);
  const cropTypeRef = useRef(null);
  const lotLocationRef = useRef(null);
  const technicalManagerRef = useRef(null);

  // Carga de fuentes
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

  // Función para activar animación de shake
  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSave = async () => {
    let newErrors = {};
    if (!cropName) {
      newErrors.cropName = 'El nombre del cultivo es obligatorio.';
      triggerShake(shakeAnimCropName);
    }
    if (!cropType) {
      newErrors.cropType = 'El tipo de cultivo es obligatorio.';
      triggerShake(shakeAnimCropType);
    }
    if (!lotLocation) {
      newErrors.lotLocation = 'La ubicación del lote es obligatoria.';
      triggerShake(shakeAnimLotLocation);
    }
    setErrors(newErrors);

    // Scroll al primer error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldRefs = {
        cropName: cropNameRef,
        cropType: cropTypeRef,
        lotLocation: lotLocationRef,
      };
      const targetRef = fieldRefs[firstErrorField];
      if (targetRef?.current && scrollViewRef?.current) {
        targetRef.current.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current.scrollTo({ y, animated: true });
          },
          () => console.log('Error measuring layout')
        );
      }
      return;
    }

    setLoading(true);
    try {
      console.log('Intentando guardar en Firestore:', { cropName, cropType, lotLocation, technicalManager });
      const docRef = await addDoc(collection(db, 'Crops'), {
        cropName,
        cropType,
        lotLocation,
        technicalManager: technicalManager || null,
        createdAt: new Date().toISOString(),
      });
      console.log('Documento guardado con ID:', docRef.id);

      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      await AsyncStorage.setItem('hasSeenAboutUs', 'true');

      setCropName('');
      setLotLocation('');
      setTechnicalManager('');
      setErrors({});
      navigation.replace('Drawer');
    } catch (e) {
      console.error('Error detallado:', e);
      Alert.alert('Error', e.message || 'Error al guardar el cultivo. Verifica tu conexión o las reglas de Firestore.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={cropStyle.container} onLayout={onLayoutRootView}>
      <ScrollView
        ref={scrollViewRef}
        style={cropStyle.scrollContainer}
        contentContainerStyle={cropStyle.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[{ fontFamily: 'CarterOne', color: '#2E7D32' }, cropStyle.title]}>Datos generales del cultivo</Text>

        {/* Nombre del cultivo */}
        <Text style={[cropStyle.label, { fontFamily: 'QuicksandBold' }]}>Nombre del cultivo</Text>
        <Animated.View
          ref={cropNameRef}
          style={[
            cropStyle.inputContainer,
            errors.cropName && cropStyle.errorInput,
            { transform: [{ translateX: shakeAnimCropName }] },
          ]}
        >
          <TextInput
            style={[cropStyle.input, { fontFamily: 'QuicksandRegular' }]}
            placeholder="Ingrese el nombre del cultivo"
            placeholderTextColor="#888"
            placeholderStyle={{ fontFamily: 'QuicksandRegular', fontSize: wp('3.5%'), color: '#888' }}
            value={cropName}
            onChangeText={(text) => {
              setCropName(text);
              setErrors((prev) => ({ ...prev, cropName: undefined }));
            }}
          />
        </Animated.View>
        {errors.cropName && <Text style={cropStyle.errorText}>{errors.cropName}</Text>}

        {/* Tipo de cultivo (no editable) */}
        <Text style={[cropStyle.label, { fontFamily: 'QuicksandBold' }]}>Tipo de cultivo</Text>
        <Animated.View
          ref={cropTypeRef}
          style={[
            cropStyle.inputContainer,
            errors.cropType && cropStyle.errorInput,
            { transform: [{ translateX: shakeAnimCropType }], backgroundColor: '#f0f0f0' },
          ]}
        >
          <TextInput
            style={[cropStyle.input, { fontFamily: 'QuicksandRegular' }]}
            placeholder="Tipo de cultivo"
            placeholderTextColor="#888"
            placeholderStyle={{ fontFamily: 'QuicksandRegular', fontSize: wp('3.5%'), color: '#888' }}
            value={cropType}
            editable={false}
          />
        </Animated.View>
        {errors.cropType && <Text style={cropStyle.errorText}>{errors.cropType}</Text>}

        {/* Ubicación del lote */}
        <Text style={[cropStyle.label, { fontFamily: 'QuicksandBold' }]}>Ubicación del lote</Text>
        <Animated.View
          ref={lotLocationRef}
          style={[
            cropStyle.inputContainer,
            errors.lotLocation && cropStyle.errorInput,
            { transform: [{ translateX: shakeAnimLotLocation }] },
          ]}
        >
          <TextInput
            style={[cropStyle.input, { fontFamily: 'QuicksandRegular' }]}
            placeholder="Ingrese la ubicación del lote"
            placeholderTextColor="#888"
            placeholderStyle={{ fontFamily: 'QuicksandRegular', fontSize: wp('3.5%'), color: '#888' }}
            value={lotLocation}
            onChangeText={(text) => {
              setLotLocation(text);
              setErrors((prev) => ({ ...prev, lotLocation: undefined }));
            }}
          />
        </Animated.View>
        {errors.lotLocation && <Text style={cropStyle.errorText}>{errors.lotLocation}</Text>}

        {/* Responsable técnico (opcional) */}
        <Text style={[cropStyle.label, { fontFamily: 'QuicksandBold' }]}>Responsable técnico (opcional)</Text>
        <Animated.View
          ref={technicalManagerRef}
          style={[cropStyle.inputContainer, { transform: [{ translateX: shakeAnimTechnicalManager }] }]}
        >
          <TextInput
            style={[cropStyle.input, { fontFamily: 'QuicksandRegular' }]}
            placeholder="Ingrese el responsable técnico"
            placeholderTextColor="#888"
            placeholderStyle={{ fontFamily: 'QuicksandRegular', fontSize: wp('3.5%'), color: '#888' }}
            value={technicalManager}
            onChangeText={(text) => {
              setTechnicalManager(text);
              setErrors((prev) => ({ ...prev, technicalManager: undefined }));
            }}
          />
        </Animated.View>
        {errors.technicalManager && <Text style={cropStyle.errorText}>{errors.technicalManager}</Text>}

        {/* Botón Guardar */}
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <LinearGradient
            colors={['rgba(46, 125, 50, 1)', 'rgba(76, 175, 80, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={cropStyle.buttonSR}
          >
            <Text style={[cropStyle.buttonText, { fontFamily: 'CarterOne' }]}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormCrop;