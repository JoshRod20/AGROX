import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

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

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
    if (!formData.fertilizerType) newErrors.fertilizerType = 'Selecciona el tipo de fertilizante.';
    if (!formData.productName) newErrors.productName = 'Ingresa el nombre del producto.';
    if (!formData.dose) newErrors.dose = 'Ingresa la dosis aplicada.';
    if (!formData.applicationMethod) newErrors.applicationMethod = 'Ingresa el método de aplicación.';
    if (!formData.soilCondition) newErrors.soilCondition = 'Ingresa la condición del suelo.';
    if (!formData.fertilizerCost) newErrors.fertilizerCost = 'Ingresa el costo de fertilizante.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.transportCost) newErrors.transportCost = 'Ingresa el costo de transporte.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total de fertilización.';
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
      <Text style={cropStyle.label}>Tipo de fertilizante</Text>
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: 4 }}>
        <View style={{ flexDirection: 'row' }}>
          {['Orgánico', 'Químico'].map(option => (
            <TouchableOpacity
              key={option}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 }}
              onPress={() => handleInputChange('fertilizerType', option)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: '#2E7D32',
                borderRadius: 4,
                backgroundColor: formData.fertilizerType === option ? '#2E7D32' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {formData.fertilizerType === option && (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
                )}
              </View>
              <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.fertilizerType && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.fertilizerType}</Text>}
      </View>

      {/* Nombre del producto */}
      <Text style={cropStyle.label}>Nombre del producto</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.productName}
        onChangeText={text => handleInputChange('productName', text)}
        placeholder="Nombre comercial"
      />
      {errors.productName && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.productName}</Text>}

      {/* Dosis aplicada */}
      <Text style={cropStyle.label}>Dosis aplicada</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.dose}
        onChangeText={text => handleInputChange('dose', text)}
        placeholder="Ej: 100 kg/ha"
        keyboardType="numeric"
      />
      {errors.dose && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.dose}</Text>}

      {/* Método de aplicación */}
      <Text style={cropStyle.label}>Método de aplicación</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.applicationMethod}
        onChangeText={text => handleInputChange('applicationMethod', text)}
        placeholder="Manual, mecánico, etc."
      />
      {errors.applicationMethod && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.applicationMethod}</Text>}

      {/* Condición del suelo */}
      <Text style={cropStyle.label}>Condición del suelo</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.soilCondition}
        onChangeText={text => handleInputChange('soilCondition', text)}
        placeholder="Ej: húmedo, seco"
      />
      {errors.soilCondition && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.soilCondition}</Text>}

      {/* Observaciones del cultivo */}
      <Text style={cropStyle.label}>Observaciones del cultivo</Text>
      <TextInput
        style={[cropStyle.input, { height: 80 }]}
        value={formData.cropObservations}
        onChangeText={text => handleInputChange('cropObservations', text)}
        placeholder="Escriba aquí"
        multiline
      />

      {/* Costo de fertilizante */}
      <Text style={cropStyle.label}>Costo de fertilizante</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.fertilizerCost}
          onChangeText={text => handleInputChange('fertilizerCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.fertilizerCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.fertilizerCost}</Text>}

      {/* Costo de mano de obra */}
      <Text style={cropStyle.label}>Costo de mano de obra</Text>
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

      {/* Costo de transporte/logística */}
      <Text style={cropStyle.label}>Transporte / logística</Text>
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

      {/* Costo total de fertilización */}
      <Text style={cropStyle.label}>Costo total de fertilización</Text>
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

export default CropFertilization;
