import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
const CropPreparation = () => {
  const route = useRoute();
  const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
  const crop = route.params?.crop;
  const [formData, setFormData] = useState({
    laborType: '',
    tillageType: '',
    soilCondition: '',
    tools: '',
    amendments: '',
    weedControl: '', // nada seleccionado al inicio
    manHours: 0,
    machineHours: 0,
    laborCost: 0,
    machineCost: 0,
    inputCost: 0,
    totalCost: 0,
    observations: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.laborType) newErrors.laborType = 'Selecciona el tipo de labor.';
    if (!formData.tillageType) newErrors.tillageType = 'Selecciona el tipo de labranza.';
    if (!formData.soilCondition) newErrors.soilCondition = 'Selecciona la condición del suelo.';
    if (!formData.tools) newErrors.tools = 'Ingresa las herramientas.';
    if (!formData.amendments) newErrors.amendments = 'Ingresa las enmiendas.';
    if (!formData.weedControl) newErrors.weedControl = 'Selecciona el control de malezas.';
    if (!formData.manHours) newErrors.manHours = 'Ingresa las horas hombre.';
    if (!formData.machineHours) newErrors.machineHours = 'Ingresa las horas máquina.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.machineCost) newErrors.machineCost = 'Ingresa el costo de maquinaria.';
    if (!formData.inputCost) newErrors.inputCost = 'Ingresa el costo de insumos.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
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
        <Text style={cropStyle.label}>Tipo de laboreo</Text>
        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row' }}>
            {['Manual', 'Mecanizado'].map(option => (
              <TouchableOpacity
                key={option}
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 }}
                onPress={() => handleInputChange('laborType', option)}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: '#2E7D32',
                  borderRadius: 4,
                  backgroundColor: formData.laborType === option ? '#2E7D32' : '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                }}>
                  {formData.laborType === option && (
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
                  )}
                </View>
                <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            key={'Otro'}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginHorizontal: 4 }}
            onPress={() => handleInputChange('laborType', 'Otro')}
            activeOpacity={0.7}
          >
            <View style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: '#2E7D32',
              borderRadius: 4,
              backgroundColor: formData.laborType === 'Otro' ? '#2E7D32' : '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}>
              {formData.laborType === 'Otro' && (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
              )}
            </View>
            <Text style={{ color: '#222', fontSize: 16 }}>Otro</Text>
          </TouchableOpacity>
          {errors.laborType && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.laborType}</Text>}
        </View>
        <Text style={cropStyle.label}>Tipo de labranza</Text>
        <TextInput
          style={cropStyle.input}
          value={formData.tillageType}
          onChangeText={text => handleInputChange('tillageType', text)}
          placeholder="Seleccione"
        />
        {errors.tillageType && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.tillageType}</Text>}
        <Text style={cropStyle.label}>Condiciones del suelo previas</Text>
        <TextInput
          style={cropStyle.input}
          value={formData.soilCondition}
          onChangeText={text => handleInputChange('soilCondition', text)}
          placeholder="Seleccione"
        />
        {errors.soilCondition && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.soilCondition}</Text>}
        <Text style={cropStyle.label}>Herramientas o maquinaria usada</Text>
        <TextInput
          style={cropStyle.input}
          value={formData.tools}
          onChangeText={text => handleInputChange('tools', text)}
          placeholder="Seleccione"
        />
        {errors.tools && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.tools}</Text>}
        <Text style={cropStyle.label}>Enmiendas aplicadas (cal, abono, etc)</Text>
        <TextInput
          style={cropStyle.input}
          value={formData.amendments}
          onChangeText={text => handleInputChange('amendments', text)}
          placeholder="Seleccione"
        />
        {errors.amendments && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.amendments}</Text>}
        <Text style={cropStyle.label}>Control de malezas previo</Text>
        <View style={{ flexDirection: 'row', marginBottom: 4, width: '90%', alignSelf: 'center' }}>
          {['Sí', 'No'].map((option, idx) => (
            <TouchableOpacity
              key={option}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 }}
              onPress={() => handleInputChange('weedControl', idx === 0 ? 'Sí' : 'No')}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: '#2E7D32',
                borderRadius: 4,
                backgroundColor: formData.weedControl === option ? '#2E7D32' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {formData.weedControl === option && (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
                )}
              </View>
              <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.weedControl && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.weedControl}</Text>}
        <Text style={cropStyle.label}>Horas hombre invertidas</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
          <TextInput
            style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
            value={formData.manHours.toString()}
            onChangeText={text => handleInputChange('manHours', parseInt(text) || 0)}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 16, color: '#222' }}>horas</Text>
        </View>
        {errors.manHours && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.manHours}</Text>}
        <Text style={cropStyle.label}>Horas de maquinaria utilizadas</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
          <TextInput
            style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
            value={formData.machineHours.toString()}
            onChangeText={text => handleInputChange('machineHours', parseInt(text) || 0)}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 16, color: '#222' }}>horas</Text>
        </View>
        {errors.machineHours && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.machineHours}</Text>}
        <Text style={cropStyle.label}>Costo de mano de obra</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
          <TextInput
            style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
            value={formData.laborCost.toString()}
            onChangeText={text => handleInputChange('laborCost', parseInt(text) || 0)}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
        </View>
        {errors.laborCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.laborCost}</Text>}
        <Text style={cropStyle.label}>Costo de maquinaria</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
          <TextInput
            style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
            value={formData.machineCost.toString()}
            onChangeText={text => handleInputChange('machineCost', parseInt(text) || 0)}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
        </View>
        {errors.machineCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.machineCost}</Text>}
        <Text style={cropStyle.label}>Costo de insumos aplicados</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
          <TextInput
            style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
            value={formData.inputCost.toString()}
            onChangeText={text => handleInputChange('inputCost', parseInt(text) || 0)}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
        </View>
        {errors.inputCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.inputCost}</Text>}
        <Text style={cropStyle.label}>Costo total de preparación</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
          <TextInput
            style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
            value={formData.totalCost.toString()}
            onChangeText={text => handleInputChange('totalCost', parseInt(text) || 0)}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
        </View>
        {errors.totalCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.totalCost}</Text>}
        <Text style={cropStyle.label}>Observaciones (opcional)</Text>
        <TextInput
          style={[cropStyle.input, { height: 80 }]}
          value={formData.observations}
          onChangeText={text => handleInputChange('observations', text)}
          placeholder="Escriba aquí"
          multiline
        />
       {/* Botón Guardar */}
             <TouchableOpacity
               style={[cropStyle.buttonSR, { backgroundColor: loading ? '#A5D6A7' : '#2E7D32', alignSelf: 'center', marginTop: 30 }]}
               onPress={handleSave}
               disabled={loading}
             >
               <Text style={[cropStyle.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>{loading ? 'Guardando...' : 'Guardar'}</Text>
             </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
export default CropPreparation;