import React, { useState, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
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
import FormCheckBox from "../components/formCheckBox";
import Icon from "react-native-vector-icons/MaterialIcons";

const CropPostharvest = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    postharvestSteps: activityData ? activityData.postharvestSteps || [] : [],
    packingDate: activityData ? activityData.packingDate || "" : "",
    processedAmount: activityData
      ? activityData.processedAmount !== undefined
        ? String(activityData.processedAmount)
        : ""
      : "",
    productDestination: activityData
      ? activityData.productDestination || ""
      : "",
    salePrice: activityData
      ? activityData.salePrice !== undefined
        ? String(activityData.salePrice)
        : ""
      : "",
    buyer: activityData ? activityData.buyer || "" : "",
    laborCost: activityData
      ? activityData.laborCost !== undefined
        ? String(activityData.laborCost)
        : ""
      : "",
    materialsCost: activityData
      ? activityData.materialsCost !== undefined
        ? String(activityData.materialsCost)
        : ""
      : "",
    transportCost: activityData
      ? activityData.transportCost !== undefined
        ? String(activityData.transportCost)
        : ""
      : "",
    totalCost: activityData
      ? activityData.totalCost !== undefined
        ? String(activityData.totalCost)
        : ""
      : "",
  });
  const shakeAnim = {
    postharvestSteps: useRef(new Animated.Value(0)).current,
    packingDate: useRef(new Animated.Value(0)).current,
    processedAmount: useRef(new Animated.Value(0)).current,
    productDestination: useRef(new Animated.Value(0)).current,
    salePrice: useRef(new Animated.Value(0)).current,
    buyer: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    materialsCost: useRef(new Animated.Value(0)).current,
    transportCost: useRef(new Animated.Value(0)).current,
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

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errors, setErrors] = useState({});

  // Lógica de cálculo automático del total adaptada
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const laborCost = parseInt(updated.laborCost) || 0;
      const materialsCost = parseInt(updated.materialsCost) || 0;
      const transportCost = parseInt(updated.transportCost) || 0;
      const totalCost = laborCost + materialsCost + transportCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

  const handleStepToggle = (step) => {
    setFormData((prev) => {
      const exists = prev.postharvestSteps.includes(step);
      return {
        ...prev,
        postharvestSteps: exists
          ? prev.postharvestSteps.filter((s) => s !== step)
          : [...prev.postharvestSteps, step],
      };
    });
  };

  const initialForm = {
    postharvestSteps: [],
    packingDate: "",
    processedAmount: "",
    productDestination: "",
    salePrice: "",
    buyer: "",
    laborCost: "",
    materialsCost: "",
    transportCost: "",
    totalCost: "",
  };
  const handleSave = async () => {
    let newErrors = {};
    const handleSave = async () => {
      newErrors.postharvestSteps =
        "Selecciona al menos un paso de postcosecha.";
      triggerShake(shakeAnim.postharvestSteps);
    };
    if (!formData.packingDate) {
      newErrors.packingDate = "Ingresa la fecha de empaque/transporte.";
      triggerShake(shakeAnim.packingDate);
    }
    if (!formData.processedAmount) {
      newErrors.processedAmount = "Ingresa la cantidad procesada.";
      triggerShake(shakeAnim.processedAmount);
    }
    if (!formData.productDestination) {
      newErrors.productDestination = "Ingresa el destino del producto.";
      triggerShake(shakeAnim.productDestination);
    }
    if (!formData.salePrice) {
      newErrors.salePrice = "Ingresa el precio de venta.";
      triggerShake(shakeAnim.salePrice);
    }
    if (!formData.buyer) {
      newErrors.buyer = "Ingresa el cliente o empresa compradora.";
      triggerShake(shakeAnim.buyer);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = "Ingresa el costo de mano de obra.";
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.materialsCost) {
      newErrors.materialsCost = "Ingresa el costo de materiales.";
      triggerShake(shakeAnim.materialsCost);
    }
    if (!formData.transportCost) {
      newErrors.transportCost = "Ingresa el costo de transporte.";
      triggerShake(shakeAnim.transportCost);
    }
    if (!formData.totalCost) {
      newErrors.totalCost = "Ingresa el costo total postcosecha.";
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
          laborCost: parseInt(formData.laborCost) || 0,
          materialsCost: parseInt(formData.materialsCost) || 0,
          transportCost: parseInt(formData.transportCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          processedAmount: parseInt(formData.processedAmount) || 0,
          salePrice: parseInt(formData.salePrice) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          materialsCost: parseInt(formData.materialsCost) || 0,
          transportCost: parseInt(formData.transportCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          name: "Postcosecha y comercialización",
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
          cropStyle.poostHarvestTitle,
          { fontFamily: "CarterOne", color: "#2E7D32" },
        ]}
      >
        Postcosecha y comercialización
      </Text>
      {/* Pasos de postcosecha */}
      <FormCheckBox
        label="Pasos de postcosecha"
        options={["Limpieza", "Clasificación", "Secado", "Otro"]}
        value={formData.postharvestSteps}
        onChange={(val) => handleInputChange("postharvestSteps", val)}
        error={errors.postharvestSteps}
        shakeAnim={shakeAnim.postharvestSteps}
      />
      {/* Fecha de empaque/transporte */}
      <Text style={cropStyle.labelDate}>Fecha de empaque/transporte</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.8}
      >
        <View style={cropStyle.dateInputContainer}>
          <TextInput
            style={cropStyle.dateInputText}
            value={formData.packingDate}
            placeholder="Seleccione la fecha"
            editable={false}
          />
          {/* ✅ Icono de calendario */}
          <Icon name="calendar-today" style={cropStyle.dateIcon} />
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={
            formData.packingDate ? new Date(formData.packingDate) : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const iso = selectedDate.toISOString().split("T")[0];
              handleInputChange("packingDate", iso);
            }
          }}
        />
      )}
      {errors.packingDate && (
        <Text style={{ color: "red", fontSize: 13, marginTop: 2 }}>
          {errors.packingDate}
        </Text>
      )}
      {/* Cantidad procesada */}
      <InputsFormFields
        label="Cantidad procesada"
        value={formData.processedAmount}
        onChangeText={(text) =>
          handleInputChange("processedAmount", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.processedAmount}
        shakeAnim={shakeAnim.processedAmount}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>Kg</Text>}
      />
      {/* Destino del producto */}
      <InputsFormFields
        label="Destino del producto"
        value={formData.productDestination}
        onChangeText={(text) => handleInputChange("productDestination", text)}
        placeholder="Ej: Mercado local, exportación, etc."
        error={errors.productDestination}
        shakeAnim={shakeAnim.productDestination}
      />
      {/* Precio de venta */}
      <InputsFormFields
        label="Precio de venta"
        value={formData.salePrice}
        onChangeText={(text) =>
          handleInputChange("salePrice", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.salePrice}
        shakeAnim={shakeAnim.salePrice}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />
      {/* Cliente/empresa compradora */}
      <InputsFormFields
        label="Cliente/empresa compradora"
        value={formData.buyer}
        onChangeText={(text) => handleInputChange("buyer", text)}
        placeholder="Nombre del cliente o empresa"
        error={errors.buyer}
        shakeAnim={shakeAnim.buyer}
      />
      {/* Mano de obra postcosecha */}
      <InputsFormFields
        label="Mano de obra postcosecha"
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
      {/* Materiales y empaques */}
      <InputsFormFields
        label="Materiales y empaques"
        value={formData.materialsCost}
        onChangeText={(text) =>
          handleInputChange("materialsCost", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.materialsCost}
        shakeAnim={shakeAnim.materialsCost}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />
      {/* Transporte/logística */}
      <InputsFormFields
        label="Transporte / logística"
        value={formData.transportCost}
        onChangeText={(text) =>
          handleInputChange("transportCost", text.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        keyboardType="numeric"
        error={errors.transportCost}
        shakeAnim={shakeAnim.transportCost}
        rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
      />
      {/* Cliente/empresa compradora */}
      <InputsFormFields
        label="Cliente/empresa compradora"
        value={formData.buyer}
        onChangeText={(text) => handleInputChange("buyer", text)}
        placeholder="Nombre del cliente o empresa"
        error={errors.buyer}
        shakeAnim={shakeAnim.buyer}
      />
      {/* Costo total postcosecha */}
      <InputsFormFields
        label="Costo total postcosecha"
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
        loading={loading}
      />
    </ScrollView>
  );
};

export default CropPostharvest;
