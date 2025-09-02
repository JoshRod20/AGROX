import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

const CropMonitoring = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    growthObservations: '',
    pestObservations: '',
    actionsTaken: '',
    laborCost: '',
    totalCost: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
    if (!formData.growthObservations) newErrors.growthObservations = 'Ingresa las observaciones de crecimiento.';
    if (!formData.pestObservations) newErrors.pestObservations = 'Ingresa las plagas o enfermedades detectadas.';
    if (!formData.actionsTaken) newErrors.actionsTaken = 'Ingresa las acciones tomadas.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total de monitoreo.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `Crops/${crop.id}/activities`), {
        ...formData,
        laborCost: parseInt(formData.laborCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        name: 'Monitoreo del cultivo',
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
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Monitoreo del cultivo</Text>

      {/* Observaciones de crecimiento */}
      <Text style={cropStyle.label}>Observaciones de crecimiento</Text>
      <TextInput
        style={[cropStyle.input, { height: 70 }]}
        value={formData.growthObservations}
        onChangeText={text => handleInputChange('growthObservations', text)}
        placeholder="Ej: Crecimiento vigoroso, buen desarrollo de hojas, etc."
        multiline
      />
      {errors.growthObservations && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.growthObservations}</Text>}

      {/* Plagas o enfermedades */}
      <Text style={cropStyle.label}>Plagas o enfermedades detectadas</Text>
      <TextInput
        style={[cropStyle.input, { height: 70 }]}
        value={formData.pestObservations}
        onChangeText={text => handleInputChange('pestObservations', text)}
        placeholder="Ej: Presencia de pulgón, roya, etc."
        multiline
      />
      {errors.pestObservations && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.pestObservations}</Text>}

      {/* Acciones tomadas */}
      <Text style={cropStyle.label}>Acciones tomadas</Text>
      <TextInput
        style={[cropStyle.input, { height: 70 }]}
        value={formData.actionsTaken}
        onChangeText={text => handleInputChange('actionsTaken', text)}
        placeholder="Ej: Aplicación de insecticida, riego, etc."
        multiline
      />
      {errors.actionsTaken && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.actionsTaken}</Text>}

      {/* Mano de obra de monitoreo */}
      <Text style={cropStyle.label}>Mano de obra de monitoreo</Text>
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

      {/* Costo total de monitoreo */}
      <Text style={cropStyle.label}>Costo total de monitoreo</Text>
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

export default CropMonitoring;
