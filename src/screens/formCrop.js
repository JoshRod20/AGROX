import React, { useState,useCallback} from 'react';
import {Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../services/database';
import { collection, addDoc } from 'firebase/firestore';
import { cropStyle } from '../styles/cropStyle';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

// Evita que se oculte el SplashScreen automáticamente
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

  const handleSave = async () => {
    let newErrors = {};
    if (!cropName) newErrors.cropName = 'El nombre del cultivo es obligatorio.';
    if (!cropType) newErrors.cropType = 'El tipo de cultivo es obligatorio.';
    if (!lotLocation) newErrors.lotLocation = 'La ubicación del lote es obligatoria.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'Crops'), {
        cropName,
        cropType,
        lotLocation,
        technicalManager,
        createdAt: new Date().toISOString(),
      });
      setCropName('');
      setLotLocation('');
      setTechnicalManager('');
      setErrors({});
     navigation.replace('Drawer');
    } catch (e) {
      Alert.alert('Error', e.message || 'Error al guardar el cultivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={cropStyle.container} onLayout={onLayoutRootView}>
      <Text style={[{ fontFamily: 'CarterOne', color: '#2E7D32' }, cropStyle.title]}>Datos generales del cultivo</Text>
        {/* Nombre del cultivo */}
        <Text style={[cropStyle.label2, { fontFamily: 'QuicksandBold' }]}>Nombre del cultivo</Text>
        <TextInput
        style={[cropStyle.input, { fontFamily: 'QuicksandRegular' }]}
        placeholder="Ingrese el nombre del cultivo"
        value={cropName}
        onChangeText={setCropName}
      />
      {errors.cropName && <Text style={{ color: 'red', marginBottom: 8, marginLeft: '5%' }}>{errors.cropName}</Text>}

      {/* Tipo de cultivo (no editable) */}
      <Text style={[cropStyle.label2, { fontFamily: 'QuicksandBold' }]}>Tipo de cultivo</Text>
      <TextInput
        style={[cropStyle.input, { fontFamily: 'QuicksandRegular', backgroundColor: '#f0f0f0' }]}
        value={cropType}
        editable={false}
      />
      {errors.cropType && <Text style={{ color: 'red', marginBottom: 8, marginLeft: '5%' }}>{errors.cropType}</Text>}

      {/* Ubicación del lote */}
      <Text style={[cropStyle.label2, { fontFamily: 'QuicksandBold' }]}>Ubicación del lote</Text>
      <TextInput
        style={[cropStyle.input, { fontFamily: 'QuicksandRegular' }]}
        placeholder="Ingrese la ubicación del lote"
        value={lotLocation}
        onChangeText={setLotLocation}
      />
      {errors.lotLocation && <Text style={{ color: 'red', marginBottom: 8, marginLeft: '5%' }}>{errors.lotLocation}</Text>}

      {/* Responsable técnico (opcional) */}
      <Text style={[cropStyle.label2, { fontFamily: 'QuicksandBold' }]}>Responsable técnico (opcional)</Text>
      <TextInput
        style={[cropStyle.input, { fontFamily: 'QuicksandRegular' }]}
        placeholder="Ingrese el responsable técnico"
        value={technicalManager}
        onChangeText={setTechnicalManager}
      />

      {/* Botón Guardar */}
      <TouchableOpacity
        style={[cropStyle.buttonSR, { backgroundColor: loading ? '#A5D6A7' : '#2E7D32', alignSelf: 'center', marginTop: 30 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={[cropStyle.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>{loading ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
        </SafeAreaView>
  );
};

export default FormCrop;
