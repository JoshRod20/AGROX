import React, { useState,useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView,Animated } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import FormCheckBox from '../components/formCheckBox';
import InputsFormFields from '../components/inputsFormFields';
import FormButton from '../components/formButton';

const CropFertilization = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fertilizerType: '',
    productName: '',
    dose: '',
    applicationMethod: '',
    soilCondition: '',
    cropObservations: '',
    fertilizerCost: '',
    laborCost: '',
    transportCost: '',
    totalCost: '',
  });

  const [errors, setErrors] = useState({});

  const shakeAnim = {
    fertilizerType: useRef(new Animated.Value(0)).current,
    productName: useRef(new Animated.Value(0)).current,
    dose: useRef(new Animated.Value(0)).current,
    applicationMethod: useRef(new Animated.Value(0)).current,
    soilCondition: useRef(new Animated.Value(0)).current,
    fertilizerCost: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
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

  // Lógica de cálculo automático del total adaptada de cropPreparation
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Parsear valores numéricos
      const fertilizerCost = parseInt(updated.fertilizerCost) || 0;
      const laborCost = parseInt(updated.laborCost) || 0;
      const transportCost = parseInt(updated.transportCost) || 0;
      const totalCost = fertilizerCost + laborCost + transportCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

  const initialForm = {
    fertilizerType: '',
    productName: '',
    dose: '',
    applicationMethod: '',
    soilCondition: '',
    cropObservations: '',
    fertilizerCost: '',
    laborCost: '',
    transportCost: '',
    totalCost: '',
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.fertilizerType){ 
      newErrors.fertilizerType = 'Selecciona el tipo de fertilizante.';
      triggerShake(shakeAnim.fertilizerType);
    }
    if (!formData.productName){ 
      newErrors.productName = 'Ingresa el nombre del producto.';
      triggerShake(shakeAnim.productName);
    }
    if (!formData.dose){ 
      newErrors.dose = 'Ingresa la dosis aplicada.';
      triggerShake(shakeAnim.dose);
    }
    if (!formData.applicationMethod){ 
      newErrors.applicationMethod = 'Ingresa el método de aplicación.';
      triggerShake(shakeAnim.applicationMethod);
    }
    if (!formData.soilCondition){ 
      newErrors.soilCondition = 'Ingresa la condición del suelo.';
      triggerShake(shakeAnim.soilCondition);
    }
    if (!formData.fertilizerCost){ 
      newErrors.fertilizerCost = 'Ingresa el costo de fertilizante.';
      triggerShake(shakeAnim.fertilizerCost);
    }
    if (!formData.laborCost){ 
      newErrors.laborCost = 'Ingresa el costo de mano de obra.';
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.transportCost){ 
      newErrors.transportCost = 'Ingresa el costo de transporte.';
      triggerShake(shakeAnim.transportCost);
    }
    if (!formData.totalCost){ 
      newErrors.totalCost = 'Ingresa el costo total de fertilización.';
      triggerShake(shakeAnim.totalCost);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `Crops/${crop.id}/activities`), {
        ...formData,
        fertilizerCost: parseInt(formData.fertilizerCost) || 0,
        laborCost: parseInt(formData.laborCost) || 0,
        transportCost: parseInt(formData.transportCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        name: 'Fertilización',
        createdAt: Timestamp.now(),
      });
      setFormData(initialForm);
       navigation.navigate('CropScreen', { crop });
    } catch (e) {
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
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Fertilización</Text>

      {/* Tipo de fertilizante */}
      <FormCheckBox
        label="Tipo de fertilizante"
        options={['Orgánico', 'Químico']}
        value={formData.fertilizerType}
        onChange={val => handleInputChange('fertilizerType', val)}
        error={errors.fertilizerType}
        shakeAnim={shakeAnim.fertilizerType}
      />

      {/* Nombre del producto */}
      <InputsFormFields
        label="Nombre del producto"
        value={formData.productName}
        onChangeText={text => handleInputChange('productName', text)}
        error={errors.productName}
        shakeAnim={shakeAnim.productName}
        placeholder="Escriba aquí"
      />

      {/* Dosis aplicada */}
      <InputsFormFields
        label="Dosis aplicada"
        value={formData.dose}
        onChangeText={text => handleInputChange('dose', text)}
        placeholder="0"
        keyboardType="numeric"
        error={errors.dose}
        shakeAnim={shakeAnim.dose}
      />
     

      {/* Método de aplicación */}
      <InputsFormFields
        label="Método de aplicación"
        value={formData.applicationMethod}
        onChangeText={text => handleInputChange('applicationMethod', text)}
        placeholder="Manual, mecánico, etc."
        error={errors.applicationMethod}
        shakeAnim={shakeAnim.applicationMethod}
      />
      

      {/* Condición del suelo */}
      <InputsFormFields
        label="Condición del suelo"
        value={formData.soilCondition}
        onChangeText={text => handleInputChange('soilCondition', text)}
        placeholder="Ej: húmedo, seco"
        error={errors.soilCondition}
        shakeAnim={shakeAnim.soilCondition}
      />

      {/* Observaciones del cultivo */}
      <InputsFormFields
        label="Observaciones del cultivo"
        value={formData.cropObservations}
        onChangeText={text => handleInputChange('cropObservations', text)}
        placeholder="Escriba aquí"
        error={errors.cropObservations}
        shakeAnim={shakeAnim.cropObservations}
        multiline
        numberOfLines={4}
        style={{ textAlignVertical: 'top' }}
      />


      {/* Costo de fertilizante */}
      <InputsFormFields
        label="Costo de fertilizante"
        value={formData.fertilizerCost}
        onChangeText={text => handleInputChange('fertilizerCost', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.fertilizerCost}
        shakeAnim={shakeAnim.fertilizerCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />

      {/* Costo de mano de obra */}
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

      {/* Costo de transporte/logística */}
      < InputsFormFields
        label="Costo de transporte/logística"
        value={formData.transportCost}
        onChangeText={text => handleInputChange('transportCost', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
        error={errors.transportCost}
        shakeAnim={shakeAnim.transportCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />

      {/* Costo total de fertilización */}
      <InputsFormFields
        label="Costo total de fertilización"
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
        loading={loading}
      />
    </ScrollView>
  );
}

export default CropFertilization;
