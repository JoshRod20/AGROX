import React, { useState, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Animated } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import InputsFormFields from '../components/inputsFormFields';
import FormButton from '../components/formButton';

const CropMonitoring = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(activityData ? {
    growthObservations: activityData.growthObservations || '',
    pestObservations: activityData.pestObservations || '',
    actionsTaken: activityData.actionsTaken || '',
    laborCost: activityData.laborCost !== undefined ? String(activityData.laborCost) : '',
    totalCost: activityData.totalCost !== undefined ? String(activityData.totalCost) : '',
  } : {
    growthObservations: '',
    pestObservations: '',
    actionsTaken: '',
    laborCost: '',
    totalCost: '',
  });
  const shakeAnim = {
    growthObservations: useRef(new Animated.Value(0)).current,
    pestObservations: useRef(new Animated.Value(0)).current,
    actionsTaken: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    machineCost: useRef(new Animated.Value(0)).current,
    totalCost: useRef(new Animated.Value(0)).current,
  };
  // 2. Función para activar la animación shake
  // Llama a triggerShake(shakeAnim.tillageType) cuando haya error en ese campo
  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };
  const [errors, setErrors] = useState({});
  const handleInputChange = (field, value) => {
    if (field === 'laborCost') {
      const laborCost = parseInt(value) || 0;
      setFormData(prev => ({
        ...prev,
        laborCost: value,
        totalCost: String(laborCost)
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  const initialForm = {
    growthObservations: '',
    pestObservations: '',
    actionsTaken: '',
    laborCost: '',
    totalCost: '',
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.growthObservations) {
      newErrors.growthObservations = 'Ingresa las observaciones de crecimiento.';
      triggerShake(shakeAnim.growthObservations);
    }
    if (!formData.pestObservations) {
      newErrors.pestObservations = 'Ingresa las plagas o enfermedades detectadas.';
      triggerShake(shakeAnim.pestObservations);
    }
    if (!formData.actionsTaken) {
      newErrors.actionsTaken = 'Ingresa las acciones tomadas.';
      triggerShake(shakeAnim.actionsTaken);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = 'Ingresa el costo de mano de obra.';
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.totalCost) {
      newErrors.totalCost = 'Ingresa el costo total de monitoreo.';
      triggerShake(shakeAnim.totalCost);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      if (activityData && activityData.id) {
        // Modo edición
        const docRef = doc(db, `Crops/${crop.id}/activities/${activityData.id}`);
        await updateDoc(docRef, {
          ...formData,
          laborCost: parseInt(formData.laborCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          laborCost: parseInt(formData.laborCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          name: 'Monitoreo del cultivo',
          createdAt: Timestamp.now(),
        });
      }
      setFormData(initialForm);
      navigation.navigate('CropScreen', { crop });
    } catch (e) {
      console.log('Error al guardar:', e);
      Alert.alert('Error', 'No se pudo guardar la actividad.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={[
      { flexGrow: 1, paddingBottom: 40 },
      { alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#fff' }
    ]}>
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Monitoreo del cultivo</Text>
      {/* Observaciones de crecimiento */}
      <InputsFormFields
        label="Observaciones de crecimiento"
        value={formData.growthObservations}
        onChangeText={text => handleInputChange('growthObservations', text)}
        placeholder="Ej: Crecimiento vigoroso, buen desarrollo de hojas, etc."
        multiline
        numberOfLines={4}
        style={{ textAlignVertical: 'top' }}
        error={errors.growthObservations}
        shakeAnim={shakeAnim.growthObservations}
      />
      {/* Plagas o enfermedades */}
      <InputsFormFields
        label="Plagas o enfermedades detectadas"
        value={formData.pestObservations}
        onChangeText={text => handleInputChange('pestObservations', text)}
        placeholder="Ej: Presencia de pulgón, roya, etc."
        multiline
        numberOfLines={4}
        style={{ textAlignVertical: 'top' }}
        error={errors.pestObservations}
        shakeAnim={shakeAnim.pestObservations}
      />
      {/* Acciones tomadas */}
      <InputsFormFields
        label="Acciones tomadas"
        value={formData.actionsTaken}
        onChangeText={text => handleInputChange('actionsTaken', text)}
        placeholder="Ej: Aplicación de insecticida, riego, etc."
        multiline
        numberOfLines={4}
        style={{ textAlignVertical: 'top' }}
        error={errors.actionsTaken}
        shakeAnim={shakeAnim.actionsTaken}
      />
      {/* Mano de obra de monitoreo */}
     <InputsFormFields
        label="Costo de mano de obra de monitoreo"
        value={formData.laborCost}
        onChangeText={text => handleInputChange('laborCost', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.laborCost}
        shakeAnim={shakeAnim.laborCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />
      {/* Costo total de monitoreo */}
      <InputsFormFields
        label="Costo total de monitoreo"
        value={formData.totalCost}
        onChangeText={text => handleInputChange('totalCost', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.totalCost}
        shakeAnim={shakeAnim.totalCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />
       <FormButton
        title={loading ? 'Guardando...' : 'Guardar'}
        onPress={handleSave}
        disabled={loading}
      />
    </ScrollView>
  );
}
export default CropMonitoring;
