import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transportStyle } from "../../styles/inventoryStyles/transportStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Componentes
import InputsFormFields from "../../components/inputsFormFields";
import FormPicker from "../../components/formSelectPicker";
import CostInput from "../../components/costInputs";
import FormButton from "../../components/formButton";

// Firebase
import { db } from "../../services/database";
import { collection, addDoc, Timestamp } from "firebase/firestore";

SplashScreen.preventAutoHideAsync();

const Transport = () => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    CarterOne: require("../../utils/fonts/CarterOne-Regular.ttf"),
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
    transportType: "",
    capacity: "",
    costPerTrip: "",
  });

  const [capacityOpen, setCapacityOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const shakeAnim = {
    transportType: useRef(new Animated.Value(0)).current,
    capacity: useRef(new Animated.Value(0)).current,
    costPerTrip: useRef(new Animated.Value(0)).current,
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

  const capacityOptions = [
    { label: "Menor a 1 tonelada", value: "menor_1t" },
    { label: "1 - 3 toneladas", value: "1_3t" },
    { label: "3 - 5 toneladas", value: "3_5t" },
    { label: "Más de 5 toneladas", value: "mas_5t" },
  ];

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.transportType.trim()) {
      newErrors.transportType = "Ingresa el tipo de transporte.";
      triggerShake(shakeAnim.transportType);
    }
    if (!formData.capacity) {
      newErrors.capacity = "Selecciona la capacidad.";
      triggerShake(shakeAnim.capacity);
    }
    if (!formData.costPerTrip) {
      newErrors.costPerTrip = "Ingresa el costo por viaje.";
      triggerShake(shakeAnim.costPerTrip);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "transport"), {
        ...formData,
        costPerTrip: parseFloat(formData.costPerTrip) || 0,
        createdAt: Timestamp.now(),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar transporte:", error);
      Alert.alert("Error", "No se pudo guardar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={transportStyle.container} onLayout={onLayoutRootView}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20, // ✅ corregido: número en lugar de "7%"
          paddingVertical: 15,
        }}
      >
        <Text style={transportStyle.moduleTitle}>Transporte</Text>

        <Text style={transportStyle.label}>Tipo de transporte</Text>
        <Animated.View
          style={[
            transportStyle.inputContainer,
            errors.transportType && transportStyle.errorInput,
            { transform: [{ translateX: shakeAnim.transportType }] },
          ]}
        >
          <TextInput
            style={transportStyle.inputText}
            value={formData.transportType}
            onChangeText={(text) => handleInputChange("transportType", text)}
            placeholder="Ej: Camión, carreta, tractor, etc."
          />
        </Animated.View>
        {errors.transportType && (
          <Text style={transportStyle.errorText}>
            {errors.transportType}
          </Text>
        )}

        <FormPicker
          label="Capacidad"
          value={formData.capacity}
          setValue={(callback) => {
            const newValue = callback(formData.capacity);
            handleInputChange("capacity", newValue);
          }}
          open={capacityOpen}
          setOpen={setCapacityOpen}
          items={capacityOptions}
          placeholder="Seleccione la capacidad"
          error={errors.capacity}
          shakeAnim={shakeAnim.capacity}
        />

        <CostInput
          label="Costo por viaje"
          value={formData.costPerTrip}
          onChangeText={(text) =>
            handleInputChange("costPerTrip", text.replace(/[^0-9.]/g, ""))
          }
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.costPerTrip}
          shakeAnim={shakeAnim.costPerTrip}
          rightAdornment={
            <Text style={{ color: "#888", fontSize: 16 }}>C$</Text>
          }
        />

        <FormButton
          title={loading ? "Guardando..." : "Guardar transporte"}
          onPress={handleSave}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Transport;