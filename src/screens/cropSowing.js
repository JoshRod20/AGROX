import React, { useState, useRef} from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView,Animated } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import FormCheckBox from '../components/formCheckBox';
import InputsFormFields from '../components/inputsFormFields';
import FormButton from '../components/formButton';



const CropSowing = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(activityData ? {
    sowingMethod: activityData.sowingMethod || '',
    sowingMark: activityData.sowingMark || '',
    seedType: activityData.seedType || '',
    variety: activityData.variety || '',
    sowingDensity: activityData.sowingDensity || '',
    supplierName: activityData.supplierName || '',
    seedCost: activityData.seedCost !== undefined ? String(activityData.seedCost) : '',
    laborCost: activityData.laborCost !== undefined ? String(activityData.laborCost) : '',
    machineCost: activityData.machineCost !== undefined ? String(activityData.machineCost) : '',
    transportCost: activityData.transportCost !== undefined ? String(activityData.transportCost) : '',
    totalCost: activityData.totalCost !== undefined ? activityData.totalCost : '',
  } : {
    sowingMethod: '',
    sowingMark: '',
    seedType: '',
    variety: '',
    sowingDensity: '',
    supplierName: '',
    seedCost: '',
    laborCost: '',
    machineCost: '',
    transportCost: '',
    totalCost: ''
  });

  // ScrollView ref para scroll a errores
    const scrollViewRef = useRef(null);
  
    // 1. Referencias Animated para animación shake de cada campo relevante
    // Solo los campos que quieres que tiemblen (ejemplo: tillageType y soilCondition)
  const shakeAnim = {
    sowingMethod: useRef(new Animated.Value(0)).current,
    sowingMark: useRef(new Animated.Value(0)).current, // <-- Faltaba esta línea
    seedType: useRef(new Animated.Value(0)).current,
    variety: useRef(new Animated.Value(0)).current,
    sowingDensity: useRef(new Animated.Value(0)).current,
    supplierName: useRef(new Animated.Value(0)).current,
    seedCost: useRef(new Animated.Value(0)).current,
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

  // Calcula el costo total automáticamente cada vez que cambian los valores relevantes
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Parsear valores numéricos
      const seedCost = parseFloat(updated.seedCost) || 0;
      const laborCost = parseFloat(updated.laborCost) || 0;
      const machineCost = parseFloat(updated.machineCost) || 0;
      const transportCost = parseFloat(updated.transportCost) || 0;
      const totalCost = seedCost + laborCost + machineCost + transportCost;
      return { ...updated, totalCost };
    });
  };

  const initialForm = {
    sowingMethod: '',
    sowingMark: '',
    seedType: '',
    variety: '',
    sowingDensity: '',
    supplierName: '',
    seedCost: '',
    laborCost: '',
    machineCost: '',
    transportCost: '',
    totalCost: ''
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.sowingMethod) {
      newErrors.sowingMethod = 'Selecciona el método de siembra.';
      triggerShake(shakeAnim.sowingMethod);
    }
    if (!formData.sowingMark) {
      newErrors.sowingMark = 'Ingresa la densidad o marca de siembra.';
      triggerShake(shakeAnim.sowingMark);
    }
    if (!formData.seedType) {
      newErrors.seedType = 'Selecciona el tipo de semilla.';
      triggerShake(shakeAnim.seedType);
    }
    if (!formData.variety) {
      newErrors.variety = 'Ingresa la variedad.';
      triggerShake(shakeAnim.variety);
    }
    if (!formData.sowingDensity) {
      newErrors.sowingDensity = 'Ingresa la densidad de siembra.';
      triggerShake(shakeAnim.sowingDensity);
    }
    if (!formData.supplierName) {
      newErrors.supplierName = 'Ingresa el nombre del proveedor.';
      triggerShake(shakeAnim.supplierName);
    }
    if (!formData.seedCost) {
      newErrors.seedCost = 'Ingresa el costo de semilla.';
      triggerShake(shakeAnim.seedCost);
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
      newErrors.totalCost = 'Ingresa el costo total.';
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
          seedCost: parseFloat(formData.seedCost) || 0,
          laborCost: parseFloat(formData.laborCost) || 0,
          machineCost: parseFloat(formData.machineCost) || 0,
          transportCost: parseFloat(formData.transportCost) || 0,
          totalCost: parseFloat(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          seedCost: parseFloat(formData.seedCost) || 0,
          laborCost: parseFloat(formData.laborCost) || 0,
          machineCost: parseFloat(formData.machineCost) || 0,
          transportCost: parseFloat(formData.transportCost) || 0,
          totalCost: parseFloat(formData.totalCost) || 0,
          name: 'Siembra',
          createdAt: Timestamp.now(),
        });
      }
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
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Siembra</Text>

      {/* Método de siembra */}
      <FormCheckBox
        label="Método de siembra"
        options={['Manual', 'Mecanizado']}
        value={formData.sowingMethod}
        onChange={val => handleInputChange('sowingMethod', val)}
        error={errors.sowingMethod}
        shakeAnim={shakeAnim.sowingMethod}
      />

      {/* Densidad o marca de siembra */}
      <InputsFormFields
        label="Densidad o marca de siembra"
        value={formData.sowingMark}
        placeholder="Ingrese la densidad o marca de siembra"
        onChangeText={text => handleInputChange('sowingMark', text)}
        error={errors.sowingMark}
        shakeAnim={shakeAnim.sowingMark}
      />

      {/* Tipo de semilla */}
      <FormCheckBox
        label="Tipo de semilla"
        options={['Criolla', 'Certificada']}
        value={formData.seedType}
        onChange={val => handleInputChange('seedType', val)}
        error={errors.seedType}
        shakeAnim={shakeAnim.seedType}
      />

      {/* Variedad */}
      <InputsFormFields
        label="Variedad"
        value={formData.variety}
        placeholder="Ingrese la variedad"
        onChangeText={text => handleInputChange('variety', text)}
        error={errors.variety}
        shakeAnim={shakeAnim.variety}
      />

      {/* Densidad de siembra */}
      <InputsFormFields
        label="Densidad de siembra"
        placeholder="Ingrese la densidad de siembra"
        value={formData.sowingDensity}
        onChangeText={text => handleInputChange('sowingDensity', text)}
        error={errors.sowingDensity}
        shakeAnim={shakeAnim.sowingDensity}
      />

      {/* Nombre del proveedor */}
      <InputsFormFields
        label="Nombre del proveedor"
        placeholder="Ingrese el nombre del proveedor"
        value={formData.supplierName}
        onChangeText={text => handleInputChange('supplierName', text)}
        error={errors.supplierName}
        shakeAnim={shakeAnim.supplierName}
      />

      {/* Costo de semilla */}
      <InputsFormFields
        label="Costo de semilla"
        placeholder="0"
        value={formData.seedCost}
        onChangeText={text => handleInputChange('seedCost', text.replace(/[^0-9]/g, ''))}
        error={errors.seedCost}
        keyboardType="numeric"
        shakeAnim={shakeAnim.seedCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />

      {/* Costo de mano de obra para siembra */}
      <InputsFormFields
        label="Costo de mano de obra para siembra"
        placeholder="0"
        value={formData.laborCost}
        onChangeText={text => handleInputChange('laborCost', text.replace(/[^0-9]/g, ''))}
        error={errors.laborCost}
        keyboardType="numeric"
        shakeAnim={shakeAnim.laborCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />


      {/* Costo de maquinaria */}
      <InputsFormFields
        label="Costo de maquinaria"
        placeholder="0"
        value={formData.machineCost}
        onChangeText={text => handleInputChange('machineCost', text.replace(/[^0-9]/g, ''))}
        error={errors.machineCost}
        keyboardType="numeric"
        shakeAnim={shakeAnim.machineCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />


      {/* Transporte de semillas/insumos */}
      <InputsFormFields
        label="Transporte de semillas/insumos"
        placeholder="0"
        value={formData.transportCost}
        onChangeText={text => handleInputChange('transportCost', text.replace(/[^0-9]/g, ''))}
        error={errors.transportCost}
        keyboardType="numeric"
        shakeAnim={shakeAnim.transportCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
      />

      {/* Costo total de siembra */}
      <InputsFormFields
        label="Costo total de siembra"
        placeholder="Costo total calculado"
        value={formData.totalCost.toString()}
        onChangeText={() => { }}
        error={errors.totalCost}
        keyboardType="numeric"
        shakeAnim={shakeAnim.totalCost}
        rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
        editable={false}
      />

      {/* Botón Guardar */}
      <FormButton
        onPress={handleSave}
          loading={loading}
          disabled={loading}
      />

    </ScrollView>
  );
}

export default CropSowing;
