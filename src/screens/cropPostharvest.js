import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView,Image } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

const CropPostharvest = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    postharvestSteps: [],
    packingDate: '',
    processedAmount: '',
    productDestination: '',
    salePrice: '',
    buyer: '',
    laborCost: '',
    materialsCost: '',
    transportCost: '',
    totalCost: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStepToggle = (step) => {
    setFormData((prev) => {
      const exists = prev.postharvestSteps.includes(step);
      return {
        ...prev,
        postharvestSteps: exists
          ? prev.postharvestSteps.filter(s => s !== step)
          : [...prev.postharvestSteps, step],
      };
    });
  };

  const initialForm = {
    postharvestSteps: [],
    packingDate: '',
    processedAmount: '',
    productDestination: '',
    salePrice: '',
    buyer: '',
    laborCost: '',
    materialsCost: '',
    transportCost: '',
    totalCost: '',
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.postharvestSteps || formData.postharvestSteps.length === 0) newErrors.postharvestSteps = 'Selecciona al menos un paso de postcosecha.';
    if (!formData.packingDate) newErrors.packingDate = 'Ingresa la fecha de empaque/transporte.';
    if (!formData.processedAmount) newErrors.processedAmount = 'Ingresa la cantidad procesada.';
    if (!formData.productDestination) newErrors.productDestination = 'Ingresa el destino del producto.';
    if (!formData.salePrice) newErrors.salePrice = 'Ingresa el precio de venta.';
    if (!formData.buyer) newErrors.buyer = 'Ingresa el cliente o empresa compradora.';
    if (!formData.laborCost) newErrors.laborCost = 'Ingresa el costo de mano de obra.';
    if (!formData.materialsCost) newErrors.materialsCost = 'Ingresa el costo de materiales.';
    if (!formData.transportCost) newErrors.transportCost = 'Ingresa el costo de transporte.';
    if (!formData.totalCost) newErrors.totalCost = 'Ingresa el costo total postcosecha.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `Crops/${crop.id}/activities`), {
        ...formData,
        processedAmount: parseInt(formData.processedAmount) || 0,
        salePrice: parseInt(formData.salePrice) || 0,
        laborCost: parseInt(formData.laborCost) || 0,
        materialsCost: parseInt(formData.materialsCost) || 0,
        transportCost: parseInt(formData.transportCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        name: 'Postcosecha y comercialización',
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
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Postcosecha y comercialización</Text>

      {/* Pasos de postcosecha */}
      <Text style={cropStyle.label}>Pasos de postcosecha</Text>
      <View style={{ width: '90%', alignSelf: 'center', marginBottom: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
        {['Limpieza', 'Clasificación', 'Secado', 'Otro'].map(option => (
          <TouchableOpacity
            key={option}
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 8 }}
            onPress={() => handleStepToggle(option)}
            activeOpacity={0.7}
          >
            <View style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: '#2E7D32',
              borderRadius: 4,
              backgroundColor: formData.postharvestSteps.includes(option) ? '#2E7D32' : '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}>
              {formData.postharvestSteps.includes(option) && (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
              )}
            </View>
            <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
          </TouchableOpacity>
        ))}
        {errors.postharvestSteps && <Text style={{ color: 'red', fontSize: 13, marginTop: 2, width: '100%' }}>{errors.postharvestSteps}</Text>}
      </View>

      {/* Fecha de empaque/transporte */}
      <Text style={cropStyle.label}>Fecha de empaque/transporte</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
        <View style={cropStyle.dateInputContainer} pointerEvents="none">
          <TextInput
            style={cropStyle.dateInputText}
            value={formData.packingDate}
            placeholder="Seleccione la fecha"
            editable={false}
          />
          <Image
            source={require('../assets/plus.png')} // Add your calendar icon image here
            style={cropStyle.dateIcon}
          />
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={formData.packingDate ? new Date(formData.packingDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const iso = selectedDate.toISOString().split('T')[0];
              handleInputChange('packingDate', iso);
            }
          }}
        />
      )}
      {errors.packingDate && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.packingDate}</Text>}

      {/* Cantidad procesada */}
      <Text style={cropStyle.label}>Cantidad procesada</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.processedAmount}
          onChangeText={text => handleInputChange('processedAmount', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>kg</Text>
      </View>
      {errors.processedAmount && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.processedAmount}</Text>}

      {/* Destino del producto */}
      <Text style={cropStyle.label}>Destino del producto</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.productDestination}
        onChangeText={text => handleInputChange('productDestination', text)}
        placeholder="Ej: Mercado local, exportación, etc."
      />
      {errors.productDestination && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.productDestination}</Text>}

      {/* Precio de venta */}
      <Text style={cropStyle.label}>Precio de venta</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.salePrice}
        onChangeText={text => handleInputChange('salePrice', text.replace(/[^0-9]/g, ''))}
        placeholder="0"
        keyboardType="numeric"
      />
      {errors.salePrice && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.salePrice}</Text>}

      {/* Cliente/empresa compradora */}
      <Text style={cropStyle.label}>Cliente/empresa compradora</Text>
      <TextInput
        style={cropStyle.input}
        value={formData.buyer}
        onChangeText={text => handleInputChange('buyer', text)}
        placeholder="Nombre del cliente o empresa"
      />
      {errors.buyer && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.buyer}</Text>}

      {/* Mano de obra postcosecha */}
      <Text style={cropStyle.label}>Mano de obra postcosecha</Text>
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

      {/* Materiales y empaques */}
      <Text style={cropStyle.label}>Materiales y empaques</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
        <TextInput
          style={[cropStyle.input, { flex: 1, marginRight: 8 }]}
          value={formData.materialsCost}
          onChangeText={text => handleInputChange('materialsCost', text.replace(/[^0-9]/g, ''))}
          placeholder="0"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 16, color: '#222' }}>C$</Text>
      </View>
      {errors.materialsCost && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.materialsCost}</Text>}

      {/* Transporte/logística */}
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

      {/* Costo total postcosecha */}
      <Text style={cropStyle.label}>Costo total postcosecha</Text>
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

export default CropPostharvest;
