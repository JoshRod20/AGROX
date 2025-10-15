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
  getDocs,
} from "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";
import InputsFormFields from "../components/inputsFormFields";
import CostInput from "../components/costInputs";
import HoursInput from "../components/hoursInput";
import InputSearch from "../components/activitiesCrop/inputSearch";
import ModalList from "../components/activitiesCrop/modalList";
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
        workForce: activityData.workForce || "",
        workForceId: activityData.workForceId || "",
        workForceHourlyCost:
          activityData.workForceHourlyCost !== undefined
            ? String(activityData.workForceHourlyCost)
            : "",
        quantityEmployees:
          activityData.quantityEmployees !== undefined
            ? String(activityData.quantityEmployees)
            : "",
        workHours:
          activityData.workHours !== undefined
            ? String(activityData.workHours)
            : "",
        systemIrrigation: activityData.systemIrrigation || "",
        machineId: activityData.machineId || "",
        machineHourlyDepreciation:
          activityData.machineHourlyDepreciation !== undefined
            ? String(activityData.machineHourlyDepreciation)
            : "",
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
        irrigationFrequency: "",
        workForce: "",
        workForceId: "",
        workForceHourlyCost: "",
        quantityEmployees: "",
        workHours: "",
        systemIrrigation: "",
        machineId: "",
        machineHourlyDepreciation: "",
        irrigationDuration: "",
        irrigationVolume: "",
        laborCost: "",
        maintenanceCost: "",
        totalCost: "",
      }
  );

  const shakeAnim = {
    irrigationFrequency: useRef(new Animated.Value(0)).current,
    irrigationDuration: useRef(new Animated.Value(0)).current,
    irrigationVolume: useRef(new Animated.Value(0)).current,
    systemIrrigation: useRef(new Animated.Value(0)).current,
    workForce: useRef(new Animated.Value(0)).current,
    quantityEmployees: useRef(new Animated.Value(0)).current,
    workHours: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
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
      const maintenanceCost = parseInt(updated.maintenanceCost) || 0;
      const totalCost = laborCost + maintenanceCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

  const initialForm = {
    irrigationFrequency: "",
    workForce: "",
    quantityEmployees: "",
    workHours: "",
    systemIrrigation: "",
    irrigationDuration: "",
    irrigationVolume: "",
    laborCost: "",
    maintenanceCost: "",
    totalCost: "",
  };
  // Modal para seleccionar maquinaria
  const [machineModalOpen, setMachineModalOpen] = useState(false);
  // Modal para seleccionar personal de trabajo
  const [workForceModalOpen, setWorkForceModalOpen] = useState(false);

  // Fallback de costo por hora promedio (empleados)
  const [employeesMeta, setEmployeesMeta] = useState({ count: 0, avgHourlyCost: 0 });
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'employees'));
        if (cancelled) return;
        const count = snap.size;
        let sum = 0;
        snap.forEach((d) => {
          const data = d.data() || {};
          let hc = Number(data.hourlyCost);
          if (!hc && data.dailyCost && data.standardHours) {
            const daily = Number(data.dailyCost) || 0;
            const hours = Number(data.standardHours) || 0;
            hc = hours > 0 ? daily / hours : 0;
          }
          if (Number.isFinite(hc)) sum += hc;
        });
        const avg = count > 0 ? sum / count : 0;
        setEmployeesMeta({ count, avgHourlyCost: avg });
      } catch (e) {
        setEmployeesMeta({ count: 0, avgHourlyCost: 0 });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Cálculo: mano de obra = costo_por_hora × horas_trabajo × cantidad_empleados
  React.useEffect(() => {
    const hours = parseFloat(formData.workHours) || 0;
    const qty = parseInt(formData.quantityEmployees) || 0;
    const hourly = parseFloat(formData.workForceHourlyCost) || employeesMeta.avgHourlyCost || 0;
    const lc = Math.round(hourly * hours * qty) || 0;
    setFormData((prev) => {
      const maintenanceCost = parseInt(prev.maintenanceCost) || 0;
      const totalCost = lc + maintenanceCost; // energyCost no está definido aquí
      return { ...prev, laborCost: String(lc), totalCost: String(totalCost) };
    });
  }, [employeesMeta.avgHourlyCost, formData.workForceHourlyCost, formData.workHours, formData.quantityEmployees]);

  // Cálculo: mantenimiento sistema riego = depreciación_por_hora × horas_uso
  React.useEffect(() => {
    const depH = parseFloat(formData.machineHourlyDepreciation) || 0;
    const hours = parseFloat(formData.irrigationDuration) || 0;
    const mc = Math.round(depH * hours) || 0;
    setFormData((prev) => {
      const laborCost = parseInt(prev.laborCost) || 0;
      const totalCost = laborCost + mc; // energyCost no está definido aquí
      return { ...prev, maintenanceCost: String(mc), totalCost: String(totalCost) };
    });
  }, [formData.machineHourlyDepreciation, formData.irrigationDuration]);

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.systemIrrigation) {
      newErrors.systemIrrigation = "Selecciona el sistema de riego.";
      triggerShake(shakeAnim.systemIrrigation);
    }
    if (!formData.workForce) {
      newErrors.workForce = "Selecciona el personal de trabajo.";
      triggerShake(shakeAnim.workForce);
    }
    if (!formData.quantityEmployees) {
      newErrors.quantityEmployees = "Ingresa la cantidad de empleados.";
      triggerShake(shakeAnim.quantityEmployees);
    }
    if (!formData.workHours) {
      newErrors.workHours = "Ingresa las horas de trabajo.";
      triggerShake(shakeAnim.workHours);
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
        const docRef = doc(db, `Crops/${crop.id}/activities/${activityData.id}`);
        await updateDoc(docRef, {
          ...formData,
          irrigationDuration: parseInt(formData.irrigationDuration) || 0,
          irrigationVolume: parseInt(formData.irrigationVolume) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          workForceId: formData.workForceId || "",
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          quantityEmployees: parseInt(formData.quantityEmployees) || 0,
          workHours: parseInt(formData.workHours) || 0,
          maintenanceCost: parseInt(formData.maintenanceCost) || 0,
          machineId: formData.machineId || "",
          machineHourlyDepreciation: parseFloat(formData.machineHourlyDepreciation) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          irrigationDuration: parseInt(formData.irrigationDuration) || 0,
          irrigationVolume: parseInt(formData.irrigationVolume) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          workForceId: formData.workForceId || "",
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          quantityEmployees: parseInt(formData.quantityEmployees) || 0,
          workHours: parseInt(formData.workHours) || 0,
          maintenanceCost: parseInt(formData.maintenanceCost) || 0,
          machineId: formData.machineId || "",
          machineHourlyDepreciation: parseFloat(formData.machineHourlyDepreciation) || 0,
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
    <View style={{ flex: 1 }}>
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
        {/* Sistema de riego */}
        <InputSearch
          label="Sistema de riego"
          value={formData.systemIrrigation}
          placeholder="Selecciona maquinaria o herramienta"
          onOpen={() => setMachineModalOpen(true)}
          error={errors.systemIrrigation}
          shakeAnim={shakeAnim.systemIrrigation}
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
        {/* Volumen de agua aplicado */}
        <HoursInput
          label="Volumen de agua aplicado"
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
        {/* Personal de trabajo (selección desde empleados) */}
        <InputSearch
          label="Personal de trabajo"
          value={formData.workForce}
          placeholder="Selecciona personal"
          onOpen={() => setWorkForceModalOpen(true)}
          error={errors.workForce}
          shakeAnim={shakeAnim.workForce}
        />
        {/* Cantidad de empleados */}
        <InputsFormFields
          label="Cantidad de empleados"
          value={formData.quantityEmployees}
          onChangeText={(val) =>
            handleInputChange("quantityEmployees", val.replace(/[^0-9]/g, ""))
          }
          placeholder="0"
          keyboardType="numeric"
          error={errors.quantityEmployees}
          shakeAnim={shakeAnim.quantityEmployees}
        />
        {/* Inputs de HORAS */}
        <HoursInput
          label="Horas trabajadas"
          value={formData.workHours}
          onChangeText={(val) =>
            handleInputChange("workHours", val.replace(/[^0-9]/g, ""))
          }
          error={errors.workHours}
          shakeAnim={shakeAnim.workHours}
        />
        {/* Mano de obra*/}
        <CostInput
          label="Costo de mano de obra"
          value={String(formData.laborCost)}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.laborCost}
          shakeAnim={shakeAnim.laborCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Mantenimiento de sistema de riego */}
        <CostInput
          label="Costo del sistema de riego"
          value={String(formData.maintenanceCost)}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.maintenanceCost}
          shakeAnim={shakeAnim.maintenanceCost}
          unit="currency"
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo total de riego */}
        <CostInput
          label="Costo total de riego"
          value={formData.totalCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.totalCost}
          shakeAnim={shakeAnim.totalCost}
          unit="currency"
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
         {/* Botón Guardar */}
        <FormButton onPress={handleSave} loading={loading} disabled={loading} />
      </ScrollView>
      {/* Modal de lista para seleccionar maquinaria */}
      <ModalList
        visible={machineModalOpen}
        onClose={() => setMachineModalOpen(false)}
        collectionPath="machinery"
        orderByField="createdAt"
        orderDirection="desc"
        title="Seleccionar maquinaria"
        searchPlaceholder="Buscar por nombre o tipo"
        searchKeys={["name", "costType"]}
        renderItem={(item) => (
          <Text style={{ color: "#333", fontSize: 14 }}>
            {item.name} — {item.costType}
          </Text>
        )}
        onSelect={(item) =>
          setFormData((prev) => ({
            ...prev,
            systemIrrigation: item.name,
            machineId: item.id || prev.machineId,
            machineHourlyDepreciation: item.hourlyDepreciation != null ? String(item.hourlyDepreciation) : prev.machineHourlyDepreciation,
          }))
        }
      />
      {/* Modal de lista para seleccionar empleado */}
      <ModalList
        visible={workForceModalOpen}
        onClose={() => setWorkForceModalOpen(false)}
        collectionPath="employees"
        orderByField="createdAt"
        orderDirection="desc"
        title="Seleccionar personal de trabajo"
        searchPlaceholder="Buscar por nombre o rol"
        searchKeys={["fullName", "role"]}
        renderItem={(item) => (
          <Text style={{ color: "#333", fontSize: 14 }}>
            {item.fullName} — {item.role}
          </Text>
        )}
        onSelect={(item) => setFormData((prev) => ({
          ...prev,
          workForce: item.fullName,
          workForceId: item.id || prev.workForceId,
          workForceHourlyCost: item.hourlyCost != null ? String(item.hourlyCost) : prev.workForceHourlyCost,
        }))}
      />
    </View>
  );
};

export default CropIrrigation;
