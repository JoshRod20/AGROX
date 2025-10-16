import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { View, Text, ScrollView, Animated, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { employeesFormStyle } from "../../styles/inventoryStyles/employeesFormStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Componentes reusables
import InputsFormFields from "../../components/inputsFormFields";
import FormPicker from "../../components/formSelectPicker";
import CostInput from "../../components/costInputs";
import HoursInput from "../../components/hoursInput";
import FormButton from "../../components/formButton";

// Firebase
import { db, auth } from "../../services/database";
import { collection, addDoc, Timestamp, doc, updateDoc } from "firebase/firestore";

SplashScreen.preventAutoHideAsync();

const EmployeesForm = () => {
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
    fullName: "",
    role: "",
    dailyCost: "",
    standardHours: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        fullName: editingItem.fullName || "",
        role: editingItem.role || "",
        dailyCost: editingItem.dailyCost !== undefined ? String(editingItem.dailyCost) : "",
        standardHours: editingItem.standardHours !== undefined ? String(editingItem.standardHours) : "",
      });
    }
  }, [editingItem]);

  const [roleOpen, setRoleOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shakeAnim = {
    fullName: useRef(new Animated.Value(0)).current,
    role: useRef(new Animated.Value(0)).current,
    dailyCost: useRef(new Animated.Value(0)).current,
    standardHours: useRef(new Animated.Value(0)).current,
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

  const roleOptions = [
    { label: "Jornalero", value: "jornalero" },
    { label: "Maquinista", value: "maquinista" },
    { label: "Supervisor", value: "supervisor" },
    { label: "Otro", value: "otro" },
  ];

  // Cálculo automático del costo por hora: dailyCost ÷ standardHours
  const hourlyCost = useMemo(() => {
    const daily = parseFloat(String(formData.dailyCost).replace(/,/g, "."));
    const hours = parseFloat(String(formData.standardHours).replace(/,/g, "."));
    if (!daily || !hours || hours <= 0) return "";
    const value = daily / hours;
    return value.toFixed(2);
  }, [formData.dailyCost, formData.standardHours]);

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ingresa el nombre completo.";
      triggerShake(shakeAnim.fullName);
    }
    if (!formData.role) {
      newErrors.role = "Selecciona el rol.";
      triggerShake(shakeAnim.role);
    }
    if (!formData.dailyCost) {
      newErrors.dailyCost = "Ingresa el costo por jornada.";
      triggerShake(shakeAnim.dailyCost);
    }
    if (!formData.standardHours) {
      newErrors.standardHours = "Ingresa la duración estándar de la jornada.";
      triggerShake(shakeAnim.standardHours);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      if (editingItem?.id) {
        await updateDoc(doc(db, 'employees', editingItem.id), {
          fullName: formData.fullName,
          role: formData.role,
          dailyCost: parseFloat(formData.dailyCost) || 0,
          standardHours: parseFloat(formData.standardHours) || 0,
          hourlyCost: parseFloat(hourlyCost) || 0,
          userId: auth?.currentUser?.uid || editingItem?.userId || null,
        });
      } else {
        await addDoc(collection(db, "employees"), {
          fullName: formData.fullName,
          role: formData.role,
          dailyCost: parseFloat(formData.dailyCost) || 0,
          standardHours: parseFloat(formData.standardHours) || 0,
          hourlyCost: parseFloat(hourlyCost) || 0,
          createdAt: Timestamp.now(),
          userId: auth?.currentUser?.uid || null,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      Alert.alert("Error", "No se pudo guardar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={employeesFormStyle.container} onLayout={onLayoutRootView}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 15 }}
      >
        <Text style={employeesFormStyle.moduleTitle}>Empleados</Text>

        <InputsFormFields
          label="Nombre completo"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange("fullName", text)}
          placeholder="Ej: Juan Pérez"
          error={errors.fullName}
          shakeAnim={shakeAnim.fullName}
        />

        <FormPicker
          label="Rol"
          value={formData.role}
          setValue={(callback) => {
            const newValue = callback(formData.role);
            handleInputChange("role", newValue);
          }}
          open={roleOpen}
          setOpen={setRoleOpen}
          items={roleOptions}
          placeholder="Seleccione el rol"
          error={errors.role}
          shakeAnim={shakeAnim.role}
        />

        <CostInput
          label="Costo por jornada/día"
          value={formData.dailyCost}
          onChangeText={(text) => handleInputChange("dailyCost", text.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.dailyCost}
          shakeAnim={shakeAnim.dailyCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
        />

        <HoursInput
          label="Duración de jornada estándar"
          value={formData.standardHours}
          onChangeText={(text) => handleInputChange("standardHours", text.replace(/[^0-9.]/g, ""))}
          placeholder="0"
          error={errors.standardHours}
          shakeAnim={shakeAnim.standardHours}
          unit="hours"
        />

        {/* Costo por hora (calculado, no editable) */}
        <CostInput
          label="Costo por hora"
          value={hourlyCost}
          onChangeText={() => {}}
          placeholder="0.00"
          keyboardType="numeric"
          editable={false}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
        />

        <FormButton
          title={loading ? (editingItem ? "Actualizando..." : "Guardando...") : (editingItem ? "Actualizar empleado" : "Guardar empleado")}
          onPress={handleSave}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeesForm;
