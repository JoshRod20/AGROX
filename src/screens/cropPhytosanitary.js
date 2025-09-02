import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

const CropPhytosanitary = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pestOrDisease: '',
    product: '',
    dose: '',
    applicationMethod: '',
    efficacyObservations: '',
    productCost: '',
    laborCost: '',
    machineCost: '',
    totalCost: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const initialForm = {
    pestOrDisease: '',
    product: '',
    dose: '',
    applicationMethod: '',
    efficacyObservations: '',
    productCost: '',
    laborCost: '',
    machineCost: '',
    totalCost: '',
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.pestOrDisease) newErrors.pestOrDisease = 'Ingresa la plaga o enfermedad controlada.';
    if (!formData.product) newErrors.product = 'Ingresa el producto aplicado.';
    if (!formData.dose) newErrors.dose = 'Ingresa la dosis aplicada.';
    if (!formData.applicationMethod) newErrors.applicationMethod = 'Ingresa el método de aplicación.';
    if (!formData.productCost) newErrors.productCost = 'Ingresa el costo del producto fitosanitario.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.machineCost) newErrors.machineCost = 'Ingresa el costo de maquinaria.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total del manejo fitosanitario.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `Crops/${crop.id}/activities`), {
        ...formData,
        dose: parseInt(formData.dose) || 0,
        productCost: parseInt(formData.productCost) || 0,
        laborCost: parseInt(formData.laborCost) || 0,
        machineCost: parseInt(formData.machineCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        name: 'Manejo Fitosanitario',
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
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Manejo Fitosanitario</Text>

      {/* Plaga o enfermedad controlada */}
      <Text style={cropStyle.label}>Plaga o enfermedad controlada</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.pestOrDisease}
        onChangeText={text => handleInputChange('pestOrDisease', text)}
        placeholder="Ej: Gusano cogollero, Roya, etc."
      />
      {errors.pestOrDisease && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.pestOrDisease}</Text>}

      {/* Producto aplicado */}
      <Text style={cropStyle.label}>Producto aplicado</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.product}
        onChangeText={text => handleInputChange('product', text)}
        placeholder="Nombre comercial"
      />
      {errors.product && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.product}</Text>}

      {/* Dosis aplicada */}
      <Text style={cropStyle.label}>Dosis aplicada</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.dose}
        onChangeText={text => handleInputChange('dose', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
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

      {/* Observaciones sobre eficacia */}
      <Text style={cropStyle.label}>Observaciones sobre eficacia</Text>
      <TextInput
        style={[cropStyle.input, { height: 80 }]}
        value={formData.efficacyObservations}
        onChangeText={text => handleInputChange('efficacyObservations', text)}
        placeholder="Escriba aquí"
        multiline
      />

      {/* Costo de producto fitosanitario */}
      <Text style={cropStyle.label}>Costo de producto fitosanitario</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.productCost}
          onChangeText={text => handleInputChange('productCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.productCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.productCost}</Text>}

      {/* Mano de obra */}
      <Text style={cropStyle.label}>Mano de obra</Text>
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

      {/* Costo total manejo fitosanitario */}
      <Text style={cropStyle.label}>Costo total manejo fitosanitario</Text>
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

export default CropPhytosanitary;
