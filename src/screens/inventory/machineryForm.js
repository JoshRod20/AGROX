import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { View, Text, ScrollView, Animated, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { machineryFormStyle } from "../../styles/inventoryStyles/machineryFormStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Componentes reutilizables
import InputsFormFields from "../../components/inputsFormFields";
import FormPicker from "../../components/formSelectPicker";
import CostInput from "../../components/costInputs";
import HoursInput from "../../components/hoursInput";
import FormButton from "../../components/formButton";

// Firebase
import { db, auth } from "../../services/database";
import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";

SplashScreen.preventAutoHideAsync();

const MachineryForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingItem = route.params?.item || null;

  const [fontsLoaded] = useFonts({
    CarterOne: require("../../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../../utils/fonts/Quicksand-Regular.ttf"),
  });

  const hasSplashScreenHidden = useRef(false);
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !hasSplashScreenHidden.current) {
      hasSplashScreenHidden.current = true;
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const [formData, setFormData] = useState({
    name: "",
    costType: "",
    initialCost: "",
    residualValue: "",
    usefulLifeYears: "",
    estimatedHours: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        costType: editingItem.costType || "",
        initialCost: editingItem.initialCost !== undefined ? String(editingItem.initialCost) : "",
        residualValue: editingItem.residualValue !== undefined ? String(editingItem.residualValue) : "",
        usefulLifeYears: editingItem.usefulLifeYears !== undefined ? String(editingItem.usefulLifeYears) : "",
        estimatedHours: editingItem.estimatedHours !== undefined ? String(editingItem.estimatedHours) : "",
      });
    }
  }, [editingItem]);

  const [costTypeOpen, setCostTypeOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shakeAnim = {
    name: useRef(new Animated.Value(0)).current,
    costType: useRef(new Animated.Value(0)).current,
    initialCost: useRef(new Animated.Value(0)).current,
    residualValue: useRef(new Animated.Value(0)).current,
    usefulLifeYears: useRef(new Animated.Value(0)).current,
    estimatedHours: useRef(new Animated.Value(0)).current,
  };

  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Opciones para tipo de costo (ajústalas si tienes una lista específica)
  const costTypeOptions = [
    { label: "Fijo", value: "fijo" },
    { label: "Variable", value: "variable" },
    { label: "Depreciación", value: "depreciacion" },
  ];

  // Cálculos automáticos
  const annualDepreciation = useMemo(() => {
    const initial = parseFloat(String(formData.initialCost).replace(/,/g, "."));
    const residual = parseFloat(String(formData.residualValue).replace(/,/g, "."));
    const years = parseFloat(String(formData.usefulLifeYears).replace(/,/g, "."));
    if (!initial && initial !== 0) return "";
    if (!years || years <= 0) return "";
    const base = (initial || 0) - (residual || 0);
    const value = base / years;
    if (!isFinite(value) || value < 0) return "";
    return value.toFixed(2);
  }, [formData.initialCost, formData.residualValue, formData.usefulLifeYears]);

  const hourlyDepreciation = useMemo(() => {
    const annual = parseFloat(String(annualDepreciation).replace(/,/g, "."));
    const hours = parseFloat(String(formData.estimatedHours).replace(/,/g, "."));
    if (!annual || !hours || hours <= 0) return "";
    const value = annual / hours;
    return value.toFixed(2);
  }, [annualDepreciation, formData.estimatedHours]);

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ingresa el nombre.";
      triggerShake(shakeAnim.name);
    }
    if (!formData.costType) {
      newErrors.costType = "Selecciona el tipo de costo.";
      triggerShake(shakeAnim.costType);
    }
    if (!formData.initialCost) {
      newErrors.initialCost = "Ingresa el costo inicial de adquisición.";
      triggerShake(shakeAnim.initialCost);
    }
    if (!formData.residualValue) {
      newErrors.residualValue = "Ingresa el valor residual.";
      triggerShake(shakeAnim.residualValue);
    }
    if (!formData.usefulLifeYears) {
      newErrors.usefulLifeYears = "Ingresa la vida útil (años).";
      triggerShake(shakeAnim.usefulLifeYears);
    }
    if (!formData.estimatedHours) {
      newErrors.estimatedHours = "Ingresa las horas de uso estimadas.";
      triggerShake(shakeAnim.estimatedHours);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        costType: formData.costType,
        initialCost: parseFloat(formData.initialCost) || 0,
        residualValue: parseFloat(formData.residualValue) || 0,
        usefulLifeYears: parseFloat(formData.usefulLifeYears) || 0,
        estimatedHours: parseFloat(formData.estimatedHours) || 0,
        annualDepreciation: parseFloat(annualDepreciation) || 0,
        hourlyDepreciation: parseFloat(hourlyDepreciation) || 0,
      };
      if (editingItem?.id) {
        await updateDoc(doc(db, 'machinery', editingItem.id), { ...payload, userId: auth?.currentUser?.uid || editingItem?.userId || null });
      } else {
        await addDoc(collection(db, "machinery"), { ...payload, createdAt: Timestamp.now(), userId: auth?.currentUser?.uid || null });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar maquinaria:", error);
      Alert.alert("Error", "No se pudo guardar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={machineryFormStyle.container} onLayout={onLayoutRootView}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
        <Text style={machineryFormStyle.moduleTitle}>Maquinaria</Text>

        <InputsFormFields
          label="Nombre"
          value={formData.name}
          onChangeText={(text) => handleInputChange("name", text)}
          placeholder="Ej: Tractor John Deere"
          error={errors.name}
          shakeAnim={shakeAnim.name}
        />

        <FormPicker
          label="Tipo de costo"
          value={formData.costType}
          setValue={(callback) => {
            const newValue = callback(formData.costType);
            handleInputChange("costType", newValue);
          }}
          open={costTypeOpen}
          setOpen={setCostTypeOpen}
          items={costTypeOptions}
          placeholder="Seleccione tipo de costo"
          error={errors.costType}
          shakeAnim={shakeAnim.costType}
        />

        <CostInput
          label="Costo inicial de adquisición"
          value={formData.initialCost}
          onChangeText={(text) => handleInputChange("initialCost", text.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.initialCost}
          shakeAnim={shakeAnim.initialCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
        />

        <CostInput
          label="Valor residual"
          value={formData.residualValue}
          onChangeText={(text) => handleInputChange("residualValue", text.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.residualValue}
          shakeAnim={shakeAnim.residualValue}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
        />

        <InputsFormFields
          label="Vida útil (años)"
          value={formData.usefulLifeYears}
          onChangeText={(text) => handleInputChange("usefulLifeYears", text.replace(/[^0-9.]/g, ""))}
          placeholder="0"
          error={errors.usefulLifeYears}
          shakeAnim={shakeAnim.usefulLifeYears}
          keyboardType="numeric"
        />

        {/* Depreciación anual (calculado, no editable) */}
        <CostInput
          label="Depreciación anual"
          value={annualDepreciation}
          onChangeText={() => {}}
          placeholder="0.00"
          keyboardType="numeric"
          editable={false}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
        />

        <HoursInput
          label="Horas de uso estimadas"
          value={formData.estimatedHours}
          onChangeText={(text) => handleInputChange("estimatedHours", text.replace(/[^0-9.]/g, ""))}
          placeholder="0"
          error={errors.estimatedHours}
          shakeAnim={shakeAnim.estimatedHours}
          unit="hours"
        />

        {/* Depreciación por hora (calculado, no editable) */}
        <CostInput
          label="Depreciación por hora"
          value={hourlyDepreciation}
          onChangeText={() => {}}
          placeholder="0.00"
          keyboardType="numeric"
          editable={false}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
        />

        <FormButton
          title={loading ? (editingItem ? "Actualizando..." : "Guardando...") : (editingItem ? "Actualizar maquinaria" : "Guardar maquinaria")}
          onPress={handleSave}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MachineryForm;
