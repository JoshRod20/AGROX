import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';


const CropSowing = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
    if (!formData.sowingMethod) newErrors.sowingMethod = 'Selecciona el método de siembra.';
    if (!formData.sowingMark) newErrors.sowingMark = 'Ingresa la densidad o marca de siembra.';
    if (!formData.seedType) newErrors.seedType = 'Selecciona el tipo de semilla.';
    if (!formData.variety) newErrors.variety = 'Ingresa la variedad.';
    if (!formData.sowingDensity) newErrors.sowingDensity = 'Ingresa la densidad de siembra.';
    if (!formData.supplierName) newErrors.supplierName = 'Ingresa el nombre del proveedor.';
    if (!formData.seedCost) newErrors.seedCost = 'Ingresa el costo de semilla.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.machineCost) newErrors.machineCost = 'Ingresa el costo de maquinaria.';
    if (!formData.transportCost) newErrors.transportCost = 'Ingresa el costo de transporte.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total de siembra.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
     setLoading(true);
    try {
      await addDoc(collection(db, `Crops/${crop.id}/activities`), {
        ...formData,
        seedCost: parseInt(formData.seedCost) || 0,
        laborCost: parseInt(formData.laborCost) || 0,
        machineCost: parseInt(formData.machineCost) || 0,
        transportCost: parseInt(formData.transportCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        name: 'Siembra',
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
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Siembra</Text>

      {/* Método de siembra */}
      <Text style={cropStyle.label}>Método de siembra</Text>
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: 4 }}>
        <View style={{ flexDirection: 'row' }}>
          {['Manual', 'Mecanizado'].map(option => (
            <TouchableOpacity
              key={option}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 }}
              onPress={() => handleInputChange('sowingMethod', option)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: '#2E7D32',
                borderRadius: 4,
                backgroundColor: formData.sowingMethod === option ? '#2E7D32' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {formData.sowingMethod === option && (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
                )}
              </View>
              <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.sowingMethod && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.sowingMethod}</Text>}
      </View>

      {/* Densidad o marca de siembra */}
      <Text style={cropStyle.label}>Densidad o marca de siembra</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.sowingMark}
        onChangeText={text => handleInputChange('sowingMark', text)}
        placeholder="Ej: 80,000 plantas/ha"
      />
      {errors.sowingMark && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.sowingMark}</Text>}

      {/* Tipo de semilla */}
      <Text style={cropStyle.label}>Tipo de semilla</Text>
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: 4 }}>
        <View style={{ flexDirection: 'row' }}>
          {['Criolla', 'Certificada'].map(option => (
            <TouchableOpacity
              key={option}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 }}
              onPress={() => handleInputChange('seedType', option)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: '#2E7D32',
                borderRadius: 4,
                backgroundColor: formData.seedType === option ? '#2E7D32' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {formData.seedType === option && (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
                )}
              </View>
              <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.seedType && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.seedType}</Text>}
      </View>

      {/* Variedad */}
      <Text style={cropStyle.label}>Variedad</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.variety}
        onChangeText={text => handleInputChange('variety', text)}
        placeholder="Ej: INTA-Nutrader"
      />
      {errors.variety && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.variety}</Text>}

      {/* Densidad de siembra */}
      <Text style={cropStyle.label}>Densidad de siembra</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.sowingDensity}
        onChangeText={text => handleInputChange('sowingDensity', text)}
        placeholder="Ej: 80,000 plantas/ha"
      />
      {errors.sowingDensity && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.sowingDensity}</Text>}

      {/* Nombre del proveedor */}
      <Text style={cropStyle.label}>Nombre del proveedor</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.supplierName}
        onChangeText={text => handleInputChange('supplierName', text)}
        placeholder="Nombre del proveedor"
      />
      {errors.supplierName && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.supplierName}</Text>}

      {/* Costo de semilla */}
      <Text style={cropStyle.label}>Costo de semilla</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.seedCost}
          onChangeText={text => handleInputChange('seedCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.seedCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.seedCost}</Text>}

      {/* Costo de mano de obra para siembra */}
      <Text style={cropStyle.label}>Costo de mano de obra para siembra</Text>
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

      {/* Transporte de semillas/insumos */}
      <Text style={cropStyle.label}>Transporte de semillas/insumos</Text>
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

      {/* Costo total de siembra */}
      <Text style={cropStyle.label}>Costo total de siembra</Text>
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

export default CropSowing;
