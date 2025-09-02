import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

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

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
    if (!formData.totalYield) newErrors.totalYield = 'Ingresa el rendimiento total.';
    if (!formData.laborPeople) newErrors.laborPeople = 'Ingresa la cantidad de personas.';
    if (!formData.harvestMethod) newErrors.harvestMethod = 'Selecciona el método de cosecha.';
    if (!formData.investedTime) newErrors.investedTime = 'Ingresa el tiempo invertido.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.machineCost) newErrors.machineCost = 'Ingresa el costo de maquinaria.';
    if (!formData.transportCost) newErrors.transportCost = 'Ingresa el costo de transporte.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total de cosecha.';
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
      <Text style={cropStyle.label}>Rendimiento total</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.totalYield}
          onChangeText={text => handleInputChange('totalYield', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>kg</Text>
      </View>
      {errors.totalYield && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.totalYield}</Text>}

      {/* Mano de obra (personas) */}
      <Text style={cropStyle.label}>Mano de obra (personas)</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.laborPeople}
        onChangeText={text => handleInputChange('laborPeople', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
      />
      {errors.laborPeople && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.laborPeople}</Text>}

      {/* Método de cosecha */}
      <Text style={cropStyle.label}>Método de cosecha</Text>
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: 4 }}>
        <View style={{ flexDirection: 'row' }}>
          {['Manual', 'Mecánico'].map(option => (
            <TouchableOpacity
              key={option}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 }}
              onPress={() => handleInputChange('harvestMethod', option)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: '#2E7D32',
                borderRadius: 4,
                backgroundColor: formData.harvestMethod === option ? '#2E7D32' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {formData.harvestMethod === option && (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
                )}
              </View>
              <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.harvestMethod && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.harvestMethod}</Text>}
      </View>

      {/* Tiempo invertido */}
      <Text style={cropStyle.label}>Tiempo invertido</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.investedTime}
          onChangeText={text => handleInputChange('investedTime', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>horas</Text>
      </View>
      {errors.investedTime && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.investedTime}</Text>}

      {/* Observaciones */}
      <Text style={cropStyle.label}>Observaciones</Text>
      <TextInput
        style={[cropStyle.input, { height: 80 }]}
        value={formData.observations}
        onChangeText={text => handleInputChange('observations', text)}
        placeholder="Escriba aquí"
        multiline
      />

      {/* Mano de obra cosecha */}
      <Text style={cropStyle.label}>Mano de obra cosecha</Text>
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

      {/* Costo de maquinaria */}
      <Text style={cropStyle.label}>Costo de maquinaria</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.machineCost}
          onChangeText={text => handleInputChange('machineCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.machineCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.machineCost}</Text>}

      {/* Transporte/almacenamiento */}
      <Text style={cropStyle.label}>Transporte / almacenamiento</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.transportCost}
          onChangeText={text => handleInputChange('transportCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.transportCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.transportCost}</Text>}

      {/* Costo total de cosecha */}
      <Text style={cropStyle.label}>Costo total de cosecha</Text>
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

export default CropHarvest;
