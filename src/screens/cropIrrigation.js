import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import { cropStyle } from "../styles/cropStyle";
import { db } from "../services/database";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";
import InputsFormFields from "../components/inputsFormFields";
import CostInput from "../components/costInputs";
import HoursInput from "../components/hoursInput";
import FormButton from "../components/formButton";
import FormCheckBox from "../components/formCheckBox";
import FormSelectPicker from "../components/formSelectPicker";

const CropIrrigation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    activityData
      ? {
          irrigationMethod: activityData.irrigationMethod || "",
          irrigationFrequency: activityData.irrigationFrequency || "",
          irrigationDuration:
            activityData.irrigationDuration !== undefined
              ? String(activityData.irrigationDuration)
              : "",
          irrigationVolume:
            activityData.irrigationVolume !== undefined
              ? String(activityData.irrigationVolume)
              : "",
          laborCost:
            activityData.laborCost !== undefined
              ? String(activityData.laborCost)
              : "",
          energyCost:
            activityData.energyCost !== undefined
              ? String(activityData.energyCost)
              : "",
          maintenanceCost:
            activityData.maintenanceCost !== undefined
              ? String(activityData.maintenanceCost)
              : "",
          totalCost:
            activityData.totalCost !== undefined
              ? String(activityData.totalCost)
              : "",
        }
      : {
          irrigationMethod: "",
          irrigationFrequency: "",
          irrigationDuration: "",
          irrigationVolume: "",
          laborCost: "",
          energyCost: "",
          maintenanceCost: "",
          totalCost: "",
        }
  );

  const shakeAnim = {
    irrigationMethod: useRef(new Animated.Value(0)).current,
    irrigationFrequency: useRef(new Animated.Value(0)).current,
    irrigationDuration: useRef(new Animated.Value(0)).current,
    irrigationVolume: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    energyCost: useRef(new Animated.Value(0)).current,
    maintenanceCost: useRef(new Animated.Value(0)).current,
    totalCost: useRef(new Animated.Value(0)).current,
  };
  // 2. Función para activar la animación shake
  // Llama a triggerShake(shakeAnim.tillageType) cuando haya error en ese campo
  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const [errors, setErrors] = useState({});
  const [openIrrigationFrequency, setOpenIrrigationFrequency] = useState(false);

  // Lógica de cálculo automático del total adaptada
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const laborCost = parseInt(updated.laborCost) || 0;
      const energyCost = parseInt(updated.energyCost) || 0;
      const maintenanceCost = parseInt(updated.maintenanceCost) || 0;
      const totalCost = laborCost + energyCost + maintenanceCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

  const initialForm = {
    irrigationMethod: "",
    irrigationFrequency: "",
    irrigationDuration: "",
    irrigationVolume: "",
    laborCost: "",
    energyCost: "",
    maintenanceCost: "",
    totalCost: "",
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.irrigationMethod) {
      newErrors.irrigationMethod = "Selecciona el método de riego.";
      triggerShake(shakeAnim.irrigationMethod);
    }
    if (!formData.irrigationFrequency) {
      newErrors.irrigationFrequency = "Ingresa la frecuencia de riego.";
      triggerShake(shakeAnim.irrigationFrequency);
    }
    if (!formData.irrigationDuration) {
      newErrors.irrigationDuration = "Ingresa la duración de riego.";
      triggerShake(shakeAnim.irrigationDuration);
    }
    if (!formData.irrigationVolume) {
      newErrors.irrigationVolume = "Ingresa el volumen de riego.";
      triggerShake(shakeAnim.irrigationVolume);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = "Ingresa el costo de mano de obra.";
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.energyCost) {
      newErrors.energyCost = "Ingresa el costo de energía o combustible.";
      triggerShake(shakeAnim.energyCost);
    }
    if (!formData.maintenanceCost) {
      newErrors.maintenanceCost = "Ingresa el costo de mantenimiento.";
      triggerShake(shakeAnim.maintenanceCost);
    }
    if (!formData.totalCost) {
      newErrors.totalCost = "Ingresa el costo total de riego.";
      triggerShake(shakeAnim.totalCost);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      if (activityData && activityData.id) {
        // Modo edición
        const docRef = doc(
          db,
          `Crops/${crop.id}/activities/${activityData.id}`
        );
        await updateDoc(docRef, {
          ...formData,
          irrigationDuration: parseInt(formData.irrigationDuration) || 0,
          irrigationVolume: parseInt(formData.irrigationVolume) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          energyCost: parseInt(formData.energyCost) || 0,
          maintenanceCost: parseInt(formData.maintenanceCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          irrigationDuration: parseInt(formData.irrigationDuration) || 0,
          irrigationVolume: parseInt(formData.irrigationVolume) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          energyCost: parseInt(formData.energyCost) || 0,
          maintenanceCost: parseInt(formData.maintenanceCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          name: "Riego",
          createdAt: Timestamp.now(),
        });
      }
      setFormData(initialForm);
      navigation.navigate("CropScreen", { crop });
    } catch (e) {
      console.log("Error al guardar:", e);
      Alert.alert("Error", "No se pudo guardar la actividad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        { flexGrow: 1, paddingBottom: 40 },
        {
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "#fff",
        },
      ]}
    >
      <Text
        style={[
          cropStyle.title2,
          { fontFamily: "CarterOne", color: "#2E7D32" },
        ]}
      >
        Riego
      </Text>

      {/* Método de riego */}
      <FormCheckBox
        label="Método de riego"
        options={["Goteo", "Aspersión", "Superficial", "Subterráneo"]}
        value={formData.irrigationMethod}
        onChange={(val) => handleInputChange("irrigationMethod", val)}
        error={errors.irrigationMethod}
        shakeAnim={shakeAnim.irrigationMethod}
      />

      {/* Frecuencia de riego */}
      <FormSelectPicker
        label="Frecuencia de riego"
        value={formData.irrigationFrequency}
        setValue={(callback) =>
          setFormData((prev) => ({
            ...prev,
            irrigationFrequency: callback(prev.irrigationFrequency),
          }))
        }
        open={openIrrigationFrequency}
        setOpen={setOpenIrrigationFrequency}
        placeholder="Selecciona la frecuencia"
        error={errors.irrigationFrequency}
        shakeAnim={shakeAnim.irrigationFrequency}
        items={[
          { label: "Diario", value: "Diario" },
          { label: "Cada 2–3 días", value: "Cada 2–3 días" },
          { label: "Semanal", value: "Semanal" },
          { label: "Quincenal", value: "Quincenal" },
          { label: "Mensual", value: "Mensual" },
          { label: "Según lluvia", value: "Según lluvia" },
        ]}
      />

      {/* Duración de riego */}
      <HoursInput
        label="Duración de riego"
        value={formData.irrigationDuration}
        onChangeText={(text) =>
          handleInputChange("irrigationDuration", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.irrigationDuration}
        shakeAnim={shakeAnim.irrigationDuration}
        rightAdornment={
          <Text style={{ color: "#888", fontSize: 16 }}>Horas</Text>
        }
      />
      {/* Volumen de riego */}
      <HoursInput
        label="Volumen de riego (litros)"
        value={formData.irrigationVolume}
        onChangeText={(text) =>
          handleInputChange("irrigationVolume", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.irrigationVolume}
        shakeAnim={shakeAnim.irrigationVolume}
        unit="liters"
        rightAdornment={
          <Text style={{ color: "#888", fontSize: 16 }}>Litros</Text>
        }
      />

      {/* Mano de obra riego */}
      <CostInput
        label="Costo de mano de obra riego"
        value={formData.laborCost}
        onChangeText={(text) =>
          handleInputChange("laborCost", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.laborCost}
        shakeAnim={shakeAnim.laborCost}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />

      {/* Costo de energía o combustible */}
      <CostInput
        label="Costo de energía o combustible"
        value={formData.energyCost}
        onChangeText={(text) =>
          handleInputChange("energyCost", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.energyCost}
        shakeAnim={shakeAnim.energyCost}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />
      {/* Mantenimiento de sistema de riego */}
      <CostInput
        label="Costo de mantenimiento de sistema de riego"
        value={formData.maintenanceCost}
        onChangeText={(text) =>
          handleInputChange("maintenanceCost", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.maintenanceCost}
        shakeAnim={shakeAnim.maintenanceCost}
        unit="currency"
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />
      {/* Costo total de riego */}
      <CostInput
        label="Costo total de riego"
        value={formData.totalCost}
        onChangeText={() => {}}
        placeholder="0"
        keyboardType="numeric"
        error={errors.totalCost}
        shakeAnim={shakeAnim.totalCost}
        unit="currency" 
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
        editable={false}
      />

      {/* Botón Guardar */}
      <FormButton
        title={loading ? "Guardando..." : "Guardar"}
        onPress={handleSave}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default CropIrrigation;
