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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { seedsAndInputsStyle } from "../../styles/inventoryStyles/seedsAndInputsStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Componentes
import InputsFormFields from "../../components/inputsFormFields";
import FormPicker from "../../components/formSelectPicker";
import CostInput from "../../components/costInputs";
import FormButton from "../../components/formButton";

// Ícono
import Icon from "react-native-vector-icons/MaterialIcons";

// Firebase
import { db } from "../../services/database";
import { collection, addDoc, Timestamp } from "firebase/firestore";

SplashScreen.preventAutoHideAsync();

const SeedsAndInputs = () => {
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
    inputName: "",
    category: "",
    unit: "",
    unitPrice: "",
    purchaseDate: "", // se guardará como "YYYY-MM-DD"
    supplier: "",
    stock: "",
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const shakeAnim = {
    inputName: useRef(new Animated.Value(0)).current,
    category: useRef(new Animated.Value(0)).current,
    unit: useRef(new Animated.Value(0)).current,
    unitPrice: useRef(new Animated.Value(0)).current,
    purchaseDate: useRef(new Animated.Value(0)).current,
    stock: useRef(new Animated.Value(0)).current,
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

  const categoryOptions = [
    { label: "Semilla", value: "semilla" },
    { label: "Fertilizante", value: "fertilizante" },
    { label: "Pesticida", value: "pesticida" },
    { label: "Otros", value: "otros" },
  ];

  const unitOptions = [
    { label: "Kilogramo (kg)", value: "kg" },
    { label: "Litro (L)", value: "l" },
    { label: "Unidad", value: "unidad" },
    { label: "Saco (50 kg)", value: "saco" },
  ];

  const handleSave = async () => {
    let newErrors = {};

    if (!formData.inputName.trim()) {
      newErrors.inputName = "Ingresa el nombre del insumo.";
      triggerShake(shakeAnim.inputName);
    }
    if (!formData.category) {
      newErrors.category = "Selecciona una categoría.";
      triggerShake(shakeAnim.category);
    }
    if (!formData.unit) {
      newErrors.unit = "Selecciona una unidad de medida.";
      triggerShake(shakeAnim.unit);
    }
    if (!formData.unitPrice) {
      newErrors.unitPrice = "Ingresa el precio unitario.";
      triggerShake(shakeAnim.unitPrice);
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = "Selecciona la fecha de compra.";
      triggerShake(shakeAnim.purchaseDate);
    }
    if (!formData.stock) {
      newErrors.stock = "Ingresa el stock disponible.";
      triggerShake(shakeAnim.stock);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "seedsAndInputs"), {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice) || 0,
        stock: parseInt(formData.stock) || 0,
        createdAt: Timestamp.now(),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo guardar el insumo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={seedsAndInputsStyle.container}
      onLayout={onLayoutRootView}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <Text
          style={[seedsAndInputsStyle.moduleTitle, { fontFamily: "CarterOne" }]}
        >
          Semillas e insumos
        </Text>

        {/* Nombre del insumo */}
        <InputsFormFields
          label="Nombre del insumo"
          value={formData.inputName}
          onChangeText={(text) => handleInputChange("inputName", text)}
          placeholder="Ej: Semilla de maíz híbrido"
          error={errors.inputName}
          shakeAnim={shakeAnim.inputName}
        />

        {/* Categoría */}
        <FormPicker
          label="Categoría"
          value={formData.category}
          setValue={(callback) => {
            const newValue = callback(formData.category);
            handleInputChange("category", newValue);
          }}
          open={categoryOpen}
          setOpen={setCategoryOpen}
          items={categoryOptions}
          placeholder="Seleccione una categoría"
          error={errors.category}
          shakeAnim={shakeAnim.category}
        />

        {/* Unidad de medida */}
        <FormPicker
          label="Unidad de medida"
          value={formData.unit}
          setValue={(callback) => {
            const newValue = callback(formData.unit);
            handleInputChange("unit", newValue);
          }}
          open={unitOpen}
          setOpen={setUnitOpen}
          items={unitOptions}
          placeholder="Seleccione una unidad"
          error={errors.unit}
          shakeAnim={shakeAnim.unit}
        />

        {/* Precio unitario */}
        <CostInput
          label="Precio unitario"
          value={formData.unitPrice}
          onChangeText={(text) =>
            handleInputChange("unitPrice", text.replace(/[^0-9.]/g, ""))
          }
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.unitPrice}
          shakeAnim={shakeAnim.unitPrice}
          rightAdornment={
            <Text style={{ color: "#888", fontSize: 16 }}>C$</Text>
          }
        />

        {/* Fecha de compra */}
<Text style={seedsAndInputsStyle.labelDate}>Fecha de compra</Text>

{/* ✅ Función auxiliar dentro del componente */}
{(() => {
  const parseISODateToLocal = (isoString) => {
    if (!isoString) return new Date();
    const [year, month, day] = isoString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <>
      <Animated.View
        style={[
          seedsAndInputsStyle.dateInputContainer,
          errors.purchaseDate && seedsAndInputsStyle.errorInput,
          { transform: [{ translateX: shakeAnim.purchaseDate }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
          style={{ flex: 1 }}
        >
          <TextInput
            style={seedsAndInputsStyle.dateInputText}
            value={
              formData.purchaseDate
                ? parseISODateToLocal(formData.purchaseDate).toLocaleDateString("es-NI")
                : ""
            }
            placeholder="Seleccione la fecha"
            editable={false}
          />
        </TouchableOpacity>
        <Icon name="calendar-today" style={seedsAndInputsStyle.dateIcon} />
      </Animated.View>

      {showDatePicker && (
        <DateTimePicker
          value={parseISODateToLocal(formData.purchaseDate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const day = String(selectedDate.getDate()).padStart(2, '0');
              const isoDate = `${year}-${month}-${day}`;
              handleInputChange("purchaseDate", isoDate);
            }
          }}
        />
      )}

      {errors.purchaseDate && (
        <Text style={{ color: "#f44336", fontSize: 13, marginTop: 2 }}>
          {errors.purchaseDate}
        </Text>
      )}
    </>
  );
})()}

        {errors.purchaseDate && (
          <Text style={{ color: "#f44336", fontSize: 13, marginTop: 2 }}>
            {errors.purchaseDate}
          </Text>
        )}

        {/* Proveedor (opcional) */}
        <InputsFormFields
          label="Proveedor (opcional)"
          value={formData.supplier}
          onChangeText={(text) => handleInputChange("supplier", text)}
          placeholder="Nombre del proveedor"
        />

        {/* Stock disponible */}
        <CostInput
          label="Stock disponible"
          value={formData.stock}
          onChangeText={(text) =>
            handleInputChange("stock", text.replace(/[^0-9]/g, ""))
          }
          placeholder="0"
          keyboardType="numeric"
          error={errors.stock}
          shakeAnim={shakeAnim.stock}
          rightAdornment={
            <Text style={{ color: "#888", fontSize: 16 }}>Unid.</Text>
          }
        />

        {/* Botón Guardar */}
        <FormButton
          title={loading ? "Guardando..." : "Guardar insumo"}
          onPress={handleSave}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeedsAndInputs;