import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const CropDocumentation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  
  const [formData, setFormData] = useState({
    hasCertification: null,
    certificationName: '',
    imageUri: '', // solo para vista previa
    imageBase64: '', // para guardar en Firestore
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      let base64 = asset.base64;
      // Si no viene base64, leer el archivo
      if (!base64 && asset.uri) {
        base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
      }
      setFormData({ ...formData, imageUri: asset.uri, imageBase64: base64 });
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      let base64 = asset.base64;
      if (!base64 && asset.uri) {
        base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
      }
      setFormData({ ...formData, imageUri: asset.uri, imageBase64: base64 });
    }
  };

  const initialForm = {
    hasCertification: null,
    certificationName: '',
    imageUri: '',
    imageBase64: '',
  };
  const handleSave = async () => {
    let newErrors = {};
    if (formData.hasCertification === null) newErrors.hasCertification = 'Indica si tiene certificación.';
    if (formData.hasCertification && !formData.certificationName) newErrors.certificationName = 'Especifica el nombre de la certificación.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const dataToSave = {
        hasCertification: formData.hasCertification,
        certificationName: formData.certificationName,
        imageBase64: formData.imageBase64 || '',
        name: 'Documentación adicional',
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, `Crops/${crop.id}/activities`), dataToSave);
      setFormData(initialForm);
      navigation.navigate('CropScreen', { crop });
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la actividad.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={[
      { flexGrow: 1, paddingBottom: 40 },
      { alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#fff' }
    ]}>
      <Text style={[cropStyle.title2, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>Documentación adicional</Text>

      {/* ¿Tiene certificación? */}
      <Text style={cropStyle.label}>¿Tiene certificación?</Text>
      <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center', marginBottom: 12 }}>
        {['Sí', 'No'].map((option, idx) => (
          <TouchableOpacity
            key={option}
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
            onPress={() => handleInputChange('hasCertification', idx === 0)}
            activeOpacity={0.7}
          >
            <View style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: '#2E7D32',
              borderRadius: 4,
              backgroundColor: formData.hasCertification === (idx === 0) ? '#2E7D32' : '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}>
              {formData.hasCertification === (idx === 0) && (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}></Text>
              )}
            </View>
            <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.hasCertification && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.hasCertification}</Text>}

      {/* Si tiene certificación, especificar */}
      {formData.hasCertification && (
        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 12 }}>
          <Text style={cropStyle.label}>Si tiene, especifique cuál:</Text>
          <TextInput
            style={cropStyle.input}
            value={formData.certificationName}
            onChangeText={text => handleInputChange('certificationName', text)}
            placeholder="Nombre de la certificación"
          />
          {errors.certificationName && <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{errors.certificationName}</Text>}
        </View>
      )}

      {/* Botones de cámara y galería */}
      <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <TouchableOpacity
          onPress={takePhoto}
          style={{ flex: 1, alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#2E7D32', borderRadius: 8, marginRight: 8 }}
        >
          {/* ICONO DE CÁMARA AQUÍ */}
          <Text>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
          style={{ flex: 1, alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#2E7D32', borderRadius: 8, marginLeft: 8 }}
        >
          {/* ICONO DE GALERÍA AQUÍ */}
          <Text>🖼️</Text>
        </TouchableOpacity>
      </View>

      {/* Imagen seleccionada */}
      {formData.imageUri ? (
        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 16 }}>
          <Text style={cropStyle.label}>Imagen seleccionada</Text>
          <Image source={{ uri: formData.imageUri }} style={{ width: '100%', height: 200, borderRadius: 8 }} resizeMode="cover" />
        </View>
      ) : null}
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

export default CropDocumentation;
