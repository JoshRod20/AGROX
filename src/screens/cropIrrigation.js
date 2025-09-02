import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';


const CropIrrigation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    irrigationMethod: '',
    irrigationFrequency: '',
    irrigationDuration: '',
    irrigationVolume: '',
    laborCost: '',
    energyCost: '',
    maintenanceCost: '',
    totalCost: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const initialForm = {
    irrigationMethod: '',
    irrigationFrequency: '',
    irrigationDuration: '',
    irrigationVolume: '',
    laborCost: '',
    energyCost: '',
    maintenanceCost: '',
    totalCost: '',
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.irrigationMethod) newErrors.irrigationMethod = 'Selecciona el método de riego.';
    if (!formData.irrigationFrequency) newErrors.irrigationFrequency = 'Ingresa la frecuencia de riego.';
    if (!formData.irrigationDuration) newErrors.irrigationDuration = 'Ingresa la duración de riego.';
    if (!formData.irrigationVolume) newErrors.irrigationVolume = 'Ingresa el volumen de riego.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.energyCost) newErrors.energyCost = 'Ingresa el costo de energía o combustible.';
    if (!formData.maintenanceCost) newErrors.maintenanceCost = 'Ingresa el costo de mantenimiento.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total de riego.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `Crops/${crop.id}/activities`), {
        ...formData,
        irrigationDuration: parseInt(formData.irrigationDuration) || 0,
        irrigationVolume: parseInt(formData.irrigationVolume) || 0,
        laborCost: parseInt(formData.laborCost) || 0,
        energyCost: parseInt(formData.energyCost) || 0,
        maintenanceCost: parseInt(formData.maintenanceCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        name: 'Riego',
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
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Riego</Text>

      {/* Método de riego */}
      <Text style={cropStyle.label}>Método de riego</Text>
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {['Goteo', 'Aspersión', 'Gravedad', 'Otro'].map(option => (
            <TouchableOpacity
              key={option}
              style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 4, marginBottom: 8 }}
              onPress={() => handleInputChange('irrigationMethod', option)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: '#2E7D32',
                borderRadius: 4,
                backgroundColor: formData.irrigationMethod === option ? '#2E7D32' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {formData.irrigationMethod === option && (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
                )}
              </View>
              <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.irrigationMethod && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.irrigationMethod}</Text>}
      </View>

      {/* Frecuencia de riego */}
      <Text style={cropStyle.label}>Frecuencia de riego</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.irrigationFrequency}
        onChangeText={text => handleInputChange('irrigationFrequency', text)}
        placeholder="Ej: cada 3 días"
      />
      {errors.irrigationFrequency && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.irrigationFrequency}</Text>}

      {/* Duración de riego */}
      <Text style={cropStyle.label}>Duración de riego</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.irrigationDuration}
          onChangeText={text => handleInputChange('irrigationDuration', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>horas</Text>
      </View>
      {errors.irrigationDuration && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.irrigationDuration}</Text>}

      {/* Volumen de riego */}
      <Text style={cropStyle.label}>Volumen de riego</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.irrigationVolume}
          onChangeText={text => handleInputChange('irrigationVolume', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>Litros</Text>
      </View>
      {errors.irrigationVolume && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.irrigationVolume}</Text>}

      {/* Mano de obra riego */}
      <Text style={cropStyle.label}>Mano de obra riego</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.laborCost}
          onChangeText={text => handleInputChange('laborCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.laborCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.laborCost}</Text>}

      {/* Costo de energía o combustible */}
      <Text style={cropStyle.label}>Costo de energía o combustible</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.energyCost}
          onChangeText={text => handleInputChange('energyCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.energyCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.energyCost}</Text>}

      {/* Mantenimiento de sistema de riego */}
      <Text style={cropStyle.label}>Mantenimiento de sistema de riego</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.maintenanceCost}
          onChangeText={text => handleInputChange('maintenanceCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.maintenanceCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.maintenanceCost}</Text>}

      {/* Costo total de riego */}
      <Text style={cropStyle.label}>Costo total de riego</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.totalCost}
          onChangeText={text => handleInputChange('totalCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.totalCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.totalCost}</Text>}

      {/* Botón Guardar */}
      <TouchableOpacity
        style={[cropStyle.buttonSR, { backgroundColor: loading ? '#A5D6A7' : '#2E7D32', alignSelf: 'center', marginTop: 30 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={[cropStyle.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>{loading ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default CropIrrigation;
