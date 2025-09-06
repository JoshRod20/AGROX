import React, { useState, useCallback, useRef } from 'react';
import { Text, Alert, Animated, ScrollView,TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../services/database';
import { collection, addDoc } from 'firebase/firestore';
import { cropStyle } from '../styles/cropStyle';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputsFormFields from '../components/inputsFormFields';
import FormButton from '../components/formButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

SplashScreen.preventAutoHideAsync();

const FormCrop = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const cropType = route.params?.cropType || '';
  const [formData, setFormData] = useState({
    cropName: '',
    cropType: cropType,
    lotLocation: '',
    cultivatedArea: '',
    technicalManager: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  // ScrollView ref para scroll a errores
  const scrollViewRef = useRef(null);

  // Animation refs para shake effect
  const shakeAnim = {
    cropName: useRef(new Animated.Value(0)).current,
    cropType: useRef(new Animated.Value(0)).current,
    lotLocation: useRef(new Animated.Value(0)).current,
    cultivatedArea: useRef(new Animated.Value(0)).current,
    technicalManager: useRef(new Animated.Value(0)).current,
  };


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
    if (!formData.cropName) {
      newErrors.cropName = 'El nombre del cultivo es obligatorio.';
      triggerShake(shakeAnim.cropName);
    }
    if (!formData.cropType) {
      newErrors.cropType = 'El tipo de cultivo es obligatorio.';
      triggerShake(shakeAnim.cropType);
    }
    if (!formData.lotLocation) {
      newErrors.lotLocation = 'La ubicación del lote es obligatoria.';
      triggerShake(shakeAnim.lotLocation);
    }
    if (!formData.cultivatedArea) {
      newErrors.cultivatedArea = 'El área cultivada es obligatoria.';
      triggerShake(shakeAnim.cultivatedArea);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'Crops'), {
        cropName: formData.cropName,
        cropType: formData.cropType,
        lotLocation: formData.lotLocation,
        technicalManager: formData.technicalManager || null,
        cultivatedArea: formData.cultivatedArea,
        createdAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      await AsyncStorage.setItem('hasSeenAboutUs', 'true');
      setFormData({ cropName: '', cropType: cropType, lotLocation: '', cultivatedArea: '', technicalManager: '' });
      setErrors({});
      navigation.replace('Drawer');
    } catch (e) {
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

        {/* Inputs reutilizables con shake y validación */}
        <InputsFormFields
          label="Nombre del cultivo"
          value={formData.cropName}
          onChangeText={val => setFormData({ ...formData, cropName: val })}
          placeholder="Ingrese el nombre del cultivo"
          error={errors.cropName}
          shakeAnim={shakeAnim.cropName}
        />
        <InputsFormFields
          label="Tipo de cultivo"
          value={formData.cropType}
          onChangeText={val => setFormData({ ...formData, cropType: val })}
          placeholder="Tipo de cultivo"
          error={errors.cropType}
          shakeAnim={shakeAnim.cropType}
          editable={false}
          inputStyle={[cropStyle.input, { backgroundColor: '#f0f0f0' }]}
        />
        <InputsFormFields
          label="Ubicación del lote"
          value={formData.lotLocation}
          onChangeText={val => setFormData({ ...formData, lotLocation: val })}
          placeholder="Ingrese la ubicación del lote"
          error={errors.lotLocation}
          shakeAnim={shakeAnim.lotLocation}
        />
        <InputsFormFields
          label="Área cultivada (mz/ha)"
          value={formData.cultivatedArea}
          onChangeText={val => setFormData({ ...formData, cultivatedArea: val })}
          placeholder="Ingrese el área cultivada"
          error={errors.cultivatedArea}
          shakeAnim={shakeAnim.cultivatedArea}
        />
        <InputsFormFields
          label="Responsable técnico (opcional)"
          value={formData.technicalManager}
          onChangeText={val => setFormData({ ...formData, technicalManager: val })}
          placeholder="Ingrese el responsable técnico"
          error={errors.technicalManager}
          shakeAnim={shakeAnim.technicalManager}
        />
        {/* Botón Guardar */}
        <FormButton
          onPress={handleSave}
          loading={loading}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default FormCrop;