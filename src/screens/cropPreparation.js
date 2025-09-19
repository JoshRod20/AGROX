import React, { useState, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Animated } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import FormCheckBox from '../components/formCheckBox';
import FormSelectPicker from '../components/formSelectPicker';
import InputsFormFields from '../components/inputsFormFields';
import FormButton from '../components/formButton';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
const CropPreparation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  // Estado para los datos del formulario
  const [formData, setFormData] = useState(activityData ? {
    laborType: activityData.laborType || '',
    tillageType: activityData.tillageType || '',
    soilCondition: activityData.soilCondition || '',
    tools: activityData.tools || '',
    amendments: activityData.amendments || '',
    weedControl: activityData.weedControl || '',
    manHours: activityData.manHours !== undefined ? String(activityData.manHours) : '',
    laborCost: activityData.laborCost !== undefined ? String(activityData.laborCost) : '',
    machineHours: activityData.machineHours !== undefined ? String(activityData.machineHours) : '',
    machineCost: activityData.machineCost !== undefined ? String(activityData.machineCost) : '',
    inputCost: activityData.inputCost !== undefined ? String(activityData.inputCost) : '',
    totalCost: activityData.totalCost !== undefined ? activityData.totalCost : 0,
    observations: activityData.observations || '',
  } : {
    laborType: '',
    tillageType: '',
    soilCondition: '',
    tools: '',
    amendments: '',
    weedControl: '',
    manHours: '',
    laborCost: '',
    machineHours: '',
    machineCost: '',
    inputCost: '',
    totalCost: 0,
    observations: '',
  });
  // Estado para controlar la apertura de los selectores
  const [openTillageType, setOpenTillageType] = useState(false);
  const [openSoilCondition, setOpenSoilCondition] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [openAmendments, setOpenAmendments] = useState(false);


  // ScrollView ref para scroll a errores
  const scrollViewRef = useRef(null);

  // 1. Referencias Animated para animación shake de cada campo relevante
  // Solo los campos que quieres que tiemblen (ejemplo: tillageType y soilCondition)
  const shakeAnim = {
    tillageType: useRef(new Animated.Value(0)).current,
    soilCondition: useRef(new Animated.Value(0)).current,
    laborType: useRef(new Animated.Value(0)).current,
    tools: useRef(new Animated.Value(0)).current,
    amendments: useRef(new Animated.Value(0)).current,
    weedControl: useRef(new Animated.Value(0)).current,
    manHours: useRef(new Animated.Value(0)).current,
    machineHours: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    machineCost: useRef(new Animated.Value(0)).current,
    inputCost: useRef(new Animated.Value(0)).current,
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
      const laborCost = parseFloat(updated.laborCost) || 0;
      const machineCost = parseFloat(updated.machineCost) || 0;
      const inputCost = parseFloat(updated.inputCost) || 0;
      const totalCost = laborCost + machineCost + inputCost;
      return { ...updated, totalCost };
    });
  };

  const initialForm = {
    laborType: '',
    tillageType: '',
    soilCondition: '',
    tools: '',
    amendments: '',
    weedControl: '',
    manHours: 0,
    machineHours: 0,
    laborCost: 0,
    machineCost: 0,
    inputCost: 0,
    totalCost: 0,
    observations: '',
  };
  // 3. Validación con animación shake: dispara triggerShake si hay error en el campo
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.laborType) {
      newErrors.laborType = 'Selecciona el tipo de labor.';
      triggerShake(shakeAnim.laborType);
    }
    if (!formData.tillageType) {
      newErrors.tillageType = 'Selecciona el tipo de labranza.';
      triggerShake(shakeAnim.tillageType);
    }
    if (!formData.soilCondition) {
      newErrors.soilCondition = 'Selecciona la condición del suelo.';
      triggerShake(shakeAnim.soilCondition);
    }
    if (!formData.tools) {
      newErrors.tools = 'Ingresa las herramientas.';
      triggerShake(shakeAnim.tools);
    }
    if (!formData.amendments) {
      newErrors.amendments = 'Ingresa las enmiendas.';
      triggerShake(shakeAnim.amendments);
    }
    if (!formData.weedControl) {
      newErrors.weedControl = 'Selecciona el control de malezas.';
      triggerShake(shakeAnim.weedControl);
    }
    if (!formData.manHours) {
      newErrors.manHours = 'Ingresa las horas hombre.';
      triggerShake(shakeAnim.manHours);
    }
    if (!formData.machineHours) {
      newErrors.machineHours = 'Ingresa las horas máquina.';
      triggerShake(shakeAnim.machineHours);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = 'Ingresa el costo de mano de obra.';
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.machineCost) {
      newErrors.machineCost = 'Ingresa el costo de maquinaria.';
      triggerShake(shakeAnim.machineCost);
    }
    if (!formData.inputCost) {
      newErrors.inputCost = 'Ingresa el costo de insumos.';
      triggerShake(shakeAnim.inputCost);
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
        // Modo edición: actualizar documento existente
        const docRef = doc(db, `Crops/${crop.id}/activities/${activityData.id}`);
        await updateDoc(docRef, {
          ...formData,
          manHours: parseInt(formData.manHours) || 0,
          machineHours: parseInt(formData.machineHours) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          machineCost: parseInt(formData.machineCost) || 0,
          inputCost: parseInt(formData.inputCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          observations: formData.observations,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          manHours: parseInt(formData.manHours) || 0,
          machineHours: parseInt(formData.machineHours) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          machineCost: parseInt(formData.machineCost) || 0,
          inputCost: parseInt(formData.inputCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          name: 'Preparación del terreno',
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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[
        { flexGrow: 1, paddingBottom: 40 },
        { alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#fff' }
      ]}>
        <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Preparación del terreno</Text>
        <FormCheckBox
          label="Tipo de laboreo"
          options={['Manual', 'Mecanizado', 'Otro']}
          value={formData.laborType}
          onChange={val => handleInputChange('laborType', val)}
          error={errors.laborType}
          shakeAnim={shakeAnim.laborType}
        />
        <Text style={cropStyle.label}>Tipo de labranza</Text>
        {/*
          FormSelectPicker es un componente reutilizable para mostrar un selector tipo dropdown.
          - open: controla si el menú está abierto (usa un estado local)
          - setOpen: función para cambiar el estado de apertura
          - value y setValue: valor seleccionado y función para actualizarlo
          - items: opciones del selector
          - error: mensaje de error si existe
        */}
        {/* Selector para Tipo de labranza */}
        {/*
          4. Pasa la prop shakeAnim al FormSelectPicker para que reciba la animación.
          Así, cuando hay error, el campo tiembla visualmente.
        */}
        <FormSelectPicker
          label={null}
          value={formData.tillageType}
          setValue={callback => setFormData(prev => ({ ...prev, tillageType: callback(prev.tillageType) }))}
          open={openTillageType}
          setOpen={setOpenTillageType}
          items={[
            { label: 'Convencional', value: 'Convencional' },
            { label: 'Mínima', value: 'Mínima' },
            { label: 'Cero (siembra directa)', value: 'Cero (siembra directa)' },
            { label: 'Vertical', value: 'Vertical' },
          ]}
          placeholder="Seleccione"
          error={errors.tillageType}
          shakeAnim={shakeAnim.tillageType}
        />
        <Text style={cropStyle.label}>Condiciones del suelo previas</Text>
        {/* Selector para Condiciones del suelo previas */}
        <FormSelectPicker
          label={null}
          value={formData.soilCondition}
          setValue={callback => setFormData(prev => ({ ...prev, soilCondition: callback(prev.soilCondition) }))}
          open={openSoilCondition}
          setOpen={setOpenSoilCondition}
          items={[
            { label: 'Seco', value: 'Seco' },
            { label: 'Húmedo', value: 'Húmedo' },
            { label: 'Compactado', value: 'Compactado' },
            { label: 'Con rastrojo', value: 'Con rastrojo' },
            { label: 'Con malezas', value: 'Con malezas' },
          ]}
          placeholder="Seleccione"
          error={errors.soilCondition}
          shakeAnim={shakeAnim.soilCondition}
        />
        <Text style={cropStyle.label}>Herramientas o maquinaria usada</Text>
        <FormSelectPicker
          label={null}
          value={formData.tools}
          setValue={callback => setFormData(prev => ({ ...prev, tools: callback(prev.tools) }))}
          open={openTools}
          setOpen={setOpenTools}
          items={[
            { label: 'Arado de disco', value: 'Arado de disco' },
            { label: 'Arado de vertedera', value: 'Arado de vertedera' },
            { label: 'Rastra', value: 'Rastra' },
            { label: 'Subsolador', value: 'Subsolador' },
            { label: 'Con Cincel', value: 'Con Cincel' },
          ]}
          placeholder="Seleccione"
          error={errors.tools}
          shakeAnim={shakeAnim.tools}
        />
        <Text style={cropStyle.label}>Enmiendas aplicadas (cal, abono, etc)</Text>
        <FormSelectPicker
          label={null}
          value={formData.amendments}
          setValue={callback => setFormData(prev => ({ ...prev, amendments: callback(prev.amendments) }))}
          open={openAmendments}
          setOpen={setOpenAmendments}
          items={[
            { label: 'Ninguna', value: 'Ninguna' },
            { label: 'Cal agrícola', value: 'Cal agrícola' },
            { label: 'Yeso agrícola', value: 'Yeso agrícola' },
            { label: 'Compost', value: 'Compost' },
            { label: 'Estiércol', value: 'Estiércol' },
            { label: 'Humus de lombriz', value: 'Humus de lombriz' },
            { label: 'Ceniza', value: 'Ceniza' },
          ]}
          placeholder="Seleccione"
          error={errors.amendments}
          shakeAnim={shakeAnim.amendments}
        />
        <FormCheckBox
          label="Control de malezas previo"
          options={['Sí', 'No']}
          value={formData.weedControl}
          onChange={val => handleInputChange('weedControl', val)}
          error={errors.weedControl}
          shakeAnim={shakeAnim.weedControl}
        />
        <InputsFormFields
          label="Horas hombre invertidas"
          value={formData.manHours}
          onChangeText={val => handleInputChange('manHours', val.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
          error={errors.manHours}
          shakeAnim={shakeAnim.manHours}
          rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>horas</Text>}
        />
        <InputsFormFields
          label="Horas de maquinaria utilizadas"
          value={formData.machineHours}
          onChangeText={val => handleInputChange('machineHours', val.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
          error={errors.machineHours}
          shakeAnim={shakeAnim.machineHours}
          rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>horas</Text>}
        />
        <InputsFormFields
          label="Costo de mano de obra"
          value={formData.laborCost}
          onChangeText={val => handleInputChange('laborCost', val.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
          error={errors.laborCost}
          shakeAnim={shakeAnim.laborCost}
          rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
        />
        <InputsFormFields
          label="Costo de maquinaria"
          value={formData.machineCost}
          onChangeText={val => handleInputChange('machineCost', val.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
          error={errors.machineCost}
          shakeAnim={shakeAnim.machineCost}
          rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
        />
        {/* Los campos de costo de mano de obra y maquinaria ahora se calculan automáticamente */}
        <InputsFormFields
          label="Costo de insumos aplicados"
          value={formData.inputCost}
          onChangeText={val => handleInputChange('inputCost', val.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
          error={errors.inputCost}
          shakeAnim={shakeAnim.inputCost}
          rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
        />
        <InputsFormFields
          label="Costo total"
          value={formData.totalCost.toString()}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.totalCost}
          shakeAnim={shakeAnim.totalCost}
          rightAdornment={<Text style={{ color: '#888', fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        <InputsFormFields
          label="Observaciones (opcional)"
          value={formData.observations}
          onChangeText={val => setFormData({ ...formData, observations: val })}
          placeholder="Ingrese sus observaciones"
          keyboardType="default"
          error={errors.observations}
          shakeAnim={shakeAnim.observations}
        />
        {/* Botón Guardar */}
        <FormButton
           onPress={handleSave}
          loading={loading}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
}
export default CropPreparation;