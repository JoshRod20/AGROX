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
import FormButton from "../components/formButton";
import FormSelectPicker from "../components/formSelectPicker";

const CropPhytosanitary = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    activityData
      ? {
          pestOrDisease: activityData.pestOrDisease || "",
          product: activityData.product || "",
          dose:
            activityData.dose !== undefined ? String(activityData.dose) : "",
          applicationMethod: activityData.applicationMethod || "",
          efficacyObservations: activityData.efficacyObservations || "",
          productCost:
            activityData.productCost !== undefined
              ? String(activityData.productCost)
              : "",
          laborCost:
            activityData.laborCost !== undefined
              ? String(activityData.laborCost)
              : "",
          machineCost:
            activityData.machineCost !== undefined
              ? String(activityData.machineCost)
              : "",
          totalCost:
            activityData.totalCost !== undefined
              ? String(activityData.totalCost)
              : "",
        }
      : {
          pestOrDisease: "",
          product: "",
          dose: "",
          applicationMethod: "",
          efficacyObservations: "",
          productCost: "",
          laborCost: "",
          machineCost: "",
          totalCost: "",
        }
  );

  const shakeAnim = {
    pestOrDisease: useRef(new Animated.Value(0)).current,
    product: useRef(new Animated.Value(0)).current,
    dose: useRef(new Animated.Value(0)).current,
    applicationMethod: useRef(new Animated.Value(0)).current,
    productCost: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    machineCost: useRef(new Animated.Value(0)).current,
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

  const [openPest, setOpenPest] = useState(false);

  const [errors, setErrors] = useState({});

  // Lógica de cálculo automático del total adaptada
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const productCost = parseInt(updated.productCost) || 0;
      const laborCost = parseInt(updated.laborCost) || 0;
      const machineCost = parseInt(updated.machineCost) || 0;
      const totalCost = productCost + laborCost + machineCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

  const initialForm = {
    pestOrDisease: "",
    product: "",
    dose: "",
    applicationMethod: "",
    efficacyObservations: "",
    productCost: "",
    laborCost: "",
    machineCost: "",
    totalCost: "",
  };
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.pestOrDisease) {
      newErrors.pestOrDisease = "Ingresa la plaga o enfermedad controlada.";
      triggerShake(shakeAnim.pestOrDisease);
    }
    if (!formData.product) {
      newErrors.product = "Ingresa el producto aplicado.";
      triggerShake(shakeAnim.product);
    }
    if (!formData.dose) {
      newErrors.dose = "Ingresa la dosis aplicada.";
      triggerShake(shakeAnim.dose);
    }
    if (!formData.applicationMethod) {
      newErrors.applicationMethod = "Ingresa el método de aplicación.";
      triggerShake(shakeAnim.applicationMethod);
    }
    if (!formData.productCost) {
      newErrors.productCost = "Ingresa el costo del producto fitosanitario.";
      triggerShake(shakeAnim.productCost);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = "Ingresa el costo de mano de obra.";
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.machineCost) {
      newErrors.machineCost = "Ingresa el costo de maquinaria.";
      triggerShake(shakeAnim.machineCost);
    }
    if (!formData.totalCost) {
      newErrors.totalCost = "Ingresa el costo total del manejo fitosanitario.";
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
          dose: parseInt(formData.dose) || 0,
          productCost: parseInt(formData.productCost) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          machineCost: parseInt(formData.machineCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          dose: parseInt(formData.dose) || 0,
          productCost: parseInt(formData.productCost) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          machineCost: parseInt(formData.machineCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          name: "Manejo Fitosanitario",
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
        Manejo Fitosanitario
      </Text>
      {/* Plaga o enfermedad controlada */}
      <FormSelectPicker
        label="Plaga o enfermedad controlada"
        value={formData.pestOrDisease}
        setValue={(callback) =>
          setFormData((prev) => ({
            ...prev,
            pestOrDisease: callback(prev.pestOrDisease),
          }))
        }
        open={openPest}
        setOpen={setOpenPest}
        items={[
          {
            label: "Insectos (plagas en general)",
            value: "Insectos (plagas en general)",
          },
          { label: "Hongos", value: "Hongos" },
          { label: "Bacterias", value: "Bacterias" },
          { label: "Virus", value: "Virus" },
          { label: "Nematodos", value: "Nematodos" },
          { label: "Malezas", value: "Malezas" },
        ]}
        placeholder="Seleccione"
        error={errors.pestOrDisease}
        shakeAnim={shakeAnim.pestOrDisease}
      />
      {/* Producto aplicado */}
      <InputsFormFields
        label="Producto aplicado"
        value={formData.product}
        onChangeText={(text) => handleInputChange("product", text)}
        placeholder="Escriba aquí"
        error={errors.product}
        shakeAnim={shakeAnim.product}
      />
      {/* Dosis aplicada */}
      <InputsFormFields
        label="Dosis aplicada"
        value={formData.dose}
        onChangeText={(text) => handleInputChange("dose", text)}
        placeholder="0"
        keyboardType="numeric"
        error={errors.dose}
        shakeAnim={shakeAnim.dose}
        rightAdornment={
          <Text style={{ color: "#888", fontSize: 16 }}>Unidad</Text>
        }
      />
      {/* Método de aplicación */}
      <InputsFormFields
        label="Método de aplicación"
        value={formData.applicationMethod}
        onChangeText={(text) => handleInputChange("applicationMethod", text)}
        placeholder="Manual, mecánico, etc."
        error={errors.applicationMethod}
        shakeAnim={shakeAnim.applicationMethod}
      />
      {/* Observaciones sobre eficacia */}
      <InputsFormFields
        label="Observaciones sobre eficacia"
        value={formData.efficacyObservations}
        onChangeText={(text) => handleInputChange("efficacyObservations", text)}
        placeholder="Escriba aquí"
        multiline
        numberOfLines={4}
        style={{ textAlignVertical: "top" }}
      />
      {/* Costo de producto fitosanitario */}
      <InputsFormFields
        label="Costo de producto fitosanitario"
        value={formData.productCost}
        onChangeText={(text) =>
          handleInputChange("productCost", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.productCost}
        shakeAnim={shakeAnim.productCost}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />
      {/* Mano de obra */}
      <InputsFormFields
        label="Mano de obra"
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
      {/* Costo de maquinaria */}
      <InputsFormFields
        label="Costo de maquinaria"
        value={formData.machineCost}
        onChangeText={(text) =>
          handleInputChange("machineCost", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.machineCost}
        shakeAnim={shakeAnim.machineCost}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />
      {/* Costo total manejo fitosanitario */}
      <InputsFormFields
        label="Costo total manejo fitosanitario"
        value={formData.totalCost}
        onChangeText={() => {}}
        placeholder="0"
        keyboardType="numeric"
        error={errors.totalCost}
        shakeAnim={shakeAnim.totalCost}
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

export default CropPhytosanitary;
