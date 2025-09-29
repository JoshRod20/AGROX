import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Text,
  Alert,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { db } from "../services/database";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"; // ← Importamos updateDoc y doc
import { cropStyle } from "../styles/cropStyle";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputsFormFields from "../components/inputsFormFields";
import FormButton from "../components/formButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

SplashScreen.preventAutoHideAsync();

const FormCrop = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Verificar si estamos editando un cultivo
  const cropToEdit = route.params?.crop;
  const isEditing = !!cropToEdit;

  // Estado inicial: si es edición, cargar datos; si no, vacío
  const [formData, setFormData] = useState({
    cropName: cropToEdit?.cropName || "",
    cropType: cropToEdit?.cropType || route.params?.cropType || "",
    lotLocation: cropToEdit?.lotLocation || "",
    cultivatedArea: cropToEdit?.cultivatedArea != null ? String(cropToEdit.cultivatedArea) : "",
    technicalManager: cropToEdit?.technicalManager || "",
  });

  const [cropId] = useState(cropToEdit?.id || null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const shakeAnim = {
    cropName: useRef(new Animated.Value(0)).current,
    cropType: useRef(new Animated.Value(0)).current,
    lotLocation: useRef(new Animated.Value(0)).current,
    cultivatedArea: useRef(new Animated.Value(0)).current,
    technicalManager: useRef(new Animated.Value(0)).current,
  };

  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../utils/fonts/Quicksand-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.cropName.trim()) {
      newErrors.cropName = "El nombre del cultivo es obligatorio.";
      triggerShake(shakeAnim.cropName);
    }
    if (!formData.cropType.trim()) {
      newErrors.cropType = "El tipo de cultivo es obligatorio.";
      triggerShake(shakeAnim.cropType);
    }
    if (!formData.lotLocation.trim()) {
      newErrors.lotLocation = "La ubicación del lote es obligatoria.";
      triggerShake(shakeAnim.lotLocation);
    }
    if (!formData.cultivatedArea) {
      newErrors.cultivatedArea = "El área cultivada es obligatoria.";
      triggerShake(shakeAnim.cultivatedArea);
    } else {
      const areaValue = parseFloat(formData.cultivatedArea);
      if (isNaN(areaValue) || areaValue <= 0) {
        newErrors.cultivatedArea = "El área cultivada debe ser un número mayor a 0.";
        triggerShake(shakeAnim.cultivatedArea);
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const { auth } = require("../services/database");
      const areaValue = parseFloat(formData.cultivatedArea);

      if (isEditing && cropId) {
        // ✏️ ACTUALIZAR documento existente
        await updateDoc(doc(db, "Crops", cropId), {
          cropName: formData.cropName.trim(),
          cropType: formData.cropType.trim(),
          lotLocation: formData.lotLocation.trim(),
          technicalManager: formData.technicalManager.trim() || null,
          cultivatedArea: areaValue,
          // createdAt y userId se mantienen
        });
      } else {
        // ➕ CREAR nuevo documento
        await addDoc(collection(db, "Crops"), {
          cropName: formData.cropName.trim(),
          cropType: formData.cropType.trim(),
          lotLocation: formData.lotLocation.trim(),
          technicalManager: formData.technicalManager.trim() || null,
          cultivatedArea: areaValue,
          createdAt: new Date().toISOString(),
          userId: auth.currentUser?.uid,
        });
        // Solo en creación se guardan estos flags
        await AsyncStorage.setItem("hasSeenWelcome", "true");
        await AsyncStorage.setItem("hasSeenAboutUs", "true");
      }

      // Reset y navegación
      navigation.replace("Drawer");
    } catch (e) {
      console.error("Error al guardar cultivo:", e);
      Alert.alert(
        "Error",
        e.message || "Error al guardar el cultivo. Verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={cropStyle.container} onLayout={onLayoutRootView}>
      <ScrollView
        ref={scrollViewRef}
        style={cropStyle.scrollContainer}
        contentContainerStyle={cropStyle.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            { fontFamily: "CarterOne", color: "#2E7D32" },
            cropStyle.title,
          ]}
        >
          {isEditing ? "Actualizar cultivo" : "Datos generales del cultivo"}
        </Text>

        <InputsFormFields
          label="Nombre del cultivo"
          value={formData.cropName}
          onChangeText={(val) => setFormData({ ...formData, cropName: val })}
          placeholder="Ingrese el nombre del cultivo"
          error={errors.cropName}
          shakeAnim={shakeAnim.cropName}
        />
        <InputsFormFields
          label="Tipo de cultivo"
          value={formData.cropType}
          onChangeText={(val) => setFormData({ ...formData, cropType: val })}
          placeholder="Tipo de cultivo"
          error={errors.cropType}
          shakeAnim={shakeAnim.cropType}
          editable={false}
          inputStyle={[cropStyle.input, { backgroundColor: "#f0f0f0" }]}
        />
        <InputsFormFields
          label="Ubicación del lote"
          value={formData.lotLocation}
          onChangeText={(val) => setFormData({ ...formData, lotLocation: val })}
          placeholder="Ingrese la ubicación del lote"
          error={errors.lotLocation}
          shakeAnim={shakeAnim.lotLocation}
        />
        <InputsFormFields
          label="Área cultivada (mz/ha)"
          value={formData.cultivatedArea}
          onChangeText={(val) => setFormData({ ...formData, cultivatedArea: val })}
          placeholder="0"
          keyboardType="numeric"
          error={errors.cultivatedArea}
          shakeAnim={shakeAnim.cultivatedArea}
        />
        <InputsFormFields
          label="Responsable técnico (opcional)"
          value={formData.technicalManager}
          onChangeText={(val) => setFormData({ ...formData, technicalManager: val })}
          placeholder="Ingrese el responsable técnico"
          error={errors.technicalManager}
          shakeAnim={shakeAnim.technicalManager}
        />
        <FormButton onPress={handleSave} loading={loading} disabled={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormCrop;