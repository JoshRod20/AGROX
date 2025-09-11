import React, { useState,useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Image,Animated } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { db } from '../services/database';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import FormButton from '../components/formButton';
import InputsFormFields from '../components/inputsFormFields';
import FormCheckBox from '../components/formCheckBox';

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
  const shakeAnim = {
      hasCertification: useRef(new Animated.Value(0)).current,
      certificationName: useRef(new Animated.Value(0)).current,
      imageUri: useRef(new Animated.Value(0)).current,
      imageBase64: useRef(new Animated.Value(0)).current,
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
    if (formData.hasCertification === null) {
      newErrors.hasCertification = 'Indica si tiene certificación.';
      triggerShake(shakeAnim.hasCertification);
    }
    if (formData.hasCertification && !formData.certificationName) {
      newErrors.certificationName = 'Especifica el nombre de la certificación.';
      triggerShake(shakeAnim.certificationName);
    }
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
        navigation.reset({
          index: 0,
          routes: [
            { name: 'CropScreen', params: { crop } }
          ],
        });
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

      <FormCheckBox
        label="¿Tiene certificación?"
        options={['Sí', 'No']}
        value={formData.hasCertification}
        onChange={value => handleInputChange('hasCertification', value)}
        error={errors.hasCertification}
        shakeAnim={shakeAnim.hasCertification}
      />

      {/* Mostrar el input solo si selecciona 'Sí' */}
      {formData.hasCertification === 'Sí' && (
        <InputsFormFields
          label="Nombre de la certificación"
          placeholder="Especifica el nombre"
          value={formData.certificationName}
          onChangeText={text => handleInputChange('certificationName', text)}
          error={errors.certificationName}
          shakeAnim={shakeAnim.certificationName}
        />
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
      <FormButton
        title={loading ? 'Guardando...' : 'Guardar'}
        onPress={handleSave}
        loading={loading}
      />
    </ScrollView>
  );
}

export default CropDocumentation;
