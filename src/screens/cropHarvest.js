import React, { useState,useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView,Animated } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import InputsFormFields from '../components/inputsFormFields';
import FormButton from '../components/formButton'
import FormCheckBox from '../components/formCheckBox';


const CropHarvest = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    totalYield: '',
    laborPeople: '',
    harvestMethod: '',
    investedTime: '',
    observations: '',
    laborCost: '',
    machineCost: '',
    transportCost: '',
    totalCost: '',
  });
 const shakeAnim = {
  totalYield: useRef(new Animated.Value(0)).current,
  laborPeople: useRef(new Animated.Value(0)).current,
  harvestMethod: useRef(new Animated.Value(0)).current,
  investedTime: useRef(new Animated.Value(0)).current,
  observations: useRef(new Animated.Value(0)).current,
  laborCost: useRef(new Animated.Value(0)).current,
  machineCost: useRef(new Animated.Value(0)).current,
  transportCost: useRef(new Animated.Value(0)).current,
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

  // Lógica de cálculo automático del total adaptada
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      const laborCost = parseInt(updated.laborCost) || 0;
      const machineCost = parseInt(updated.machineCost) || 0;
      const transportCost = parseInt(updated.transportCost) || 0;
      const totalCost = laborCost + machineCost + transportCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

  const initialForm = {
    totalYield: '',
    laborPeople: '',
    harvestMethod: '',
    investedTime: '',
    observations: '',
    laborCost: '',
    machineCost: '',
    transportCost: '',
    totalCost: '',
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.totalYield) {
      newErrors.totalYield = 'Ingresa el rendimiento total.';
      triggerShake(shakeAnim.totalYield);
    }
    if (!formData.laborPeople) {
      newErrors.laborPeople = 'Ingresa la cantidad de personas.';
      triggerShake(shakeAnim.laborPeople);
    }
    if (!formData.harvestMethod) {
      newErrors.harvestMethod = 'Selecciona el método de cosecha.';
      triggerShake(shakeAnim.harvestMethod);
    }
    if (!formData.investedTime) {
      newErrors.investedTime = 'Ingresa el tiempo invertido.';
      triggerShake(shakeAnim.investedTime);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = 'Ingresa el costo de mano de obra.';
      triggerShake(shakeAnim.laborCost);
    }     
    if (!formData.machineCost) {
      newErrors.machineCost = 'Ingresa el costo de maquinaria.';
      triggerShake(shakeAnim.machineCost);
    }
    if (!formData.transportCost) {
      newErrors.transportCost = 'Ingresa el costo de transporte.';
      triggerShake(shakeAnim.transportCost);
    }
    if (!formData.totalCost) {
      newErrors.totalCost = 'Ingresa el costo total de cosecha.';
      triggerShake(shakeAnim.totalCost);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `Crops/${crop.id}/activities`), {
        ...formData,
        totalYield: parseInt(formData.totalYield) || 0,
        laborPeople: parseInt(formData.laborPeople) || 0,
        investedTime: parseInt(formData.investedTime) || 0,
        laborCost: parseInt(formData.laborCost) || 0,
        machineCost: parseInt(formData.machineCost) || 0,
        transportCost: parseInt(formData.transportCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        name: 'Cosecha',
        createdAt: Timestamp.now(),
      });
      setFormData(initialForm);
      navigation.navigate('CropScreen', { crop });
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la actividad.');
    }finally {
      setLoading(false);
    }

  };

  return (
    <ScrollView contentContainerStyle={[
      { flexGrow: 1, paddingBottom: 40 },
      { alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#fff' }
    ]}>
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Cosecha</Text>

      {/* Rendimiento total */}
      <InputsFormFields
        label="Rendimiento total"
        value={formData.totalYield}
        onChangeText={text => handleInputChange('totalYield', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.totalYield}
        shakeAnim={shakeAnim.totalYield}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>Kg</Text>}
      />

      {/* Mano de obra (personas) */}
      <InputsFormFields
        label="Mano de obra (personas)"
        value={formData.laborPeople}
        onChangeText={text => handleInputChange('laborPeople', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.laborPeople}
        shakeAnim={shakeAnim.laborPeople}
      />
      {/* Método de cosecha */}
      <FormCheckBox
        label="Método de cosecha"
        options={['Manual', 'Mecánico']}
        selectedValue={formData.harvestMethod}
        onValueChange={value => handleInputChange('harvestMethod', value)}
        error={errors.harvestMethod}
        shakeAnim={shakeAnim.harvestMethod}
      />

      {/* Tiempo invertido */}
      <InputsFormFields
        label="Tiempo invertido"
        value={formData.investedTime}
        onChangeText={text => handleInputChange('investedTime', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.investedTime}
        shakeAnim={shakeAnim.investedTime}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>Horas</Text>}
      />
      {/* Observaciones */}
      <InputsFormFields
        label="Observaciones"
        value={formData.observations}
        onChangeText={text => handleInputChange('observations', text)}
        placeholder="Escriba aquí"
        multiline
        numberOfLines={4}
        style={{ textAlignVertical: 'top' }}
      />

      {/* Mano de obra cosecha */}
      <InputsFormFields
        label="Costo de mano de obra"
        value={formData.laborCost}
        onChangeText={text => handleInputChange('laborCost', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.laborCost}
        shakeAnim={shakeAnim.laborCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />

      {/* Costo de maquinaria */}
      <InputsFormFields
        label="Costo de maquinaria"
        value={formData.machineCost}
        onChangeText={text => handleInputChange('machineCost', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.machineCost}
        shakeAnim={shakeAnim.machineCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />
      {/* Transporte/almacenamiento */}
      <InputsFormFields
        label="Transporte / almacenamiento"
        value={formData.transportCost}
        onChangeText={text => handleInputChange('transportCost', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.transportCost}
        shakeAnim={shakeAnim.transportCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />
      {/* Costo total de cosecha */}
      <InputsFormFields
        label="Costo total de cosecha"
        value={formData.totalCost}
        onChangeText={() => {}}
        placeholder="0"
        keyboardType="numeric"
        error={errors.totalCost}
        shakeAnim={shakeAnim.totalCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
        editable={false}
      />
      {/* Botón Guardar */}
     <FormButton
        title={loading ? 'Guardando...' : 'Guardar'}
        onPress={handleSave}
        disabled={loading}
      />
    </ScrollView>
  );
}

export default CropHarvest;
