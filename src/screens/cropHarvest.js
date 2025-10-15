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
import FormButton from "../components/formButton";
import FormCheckBox from "../components/formCheckBox";
import CostInput from "../components/costInputs";
import HoursInput from "../components/hoursInput";
import InputSearch from "../components/activitiesCrop/inputSearch";
import ModalList from "../components/activitiesCrop/modalList";

const CropHarvest = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    totalYield: activityData
      ? activityData.totalYield !== undefined
        ? String(activityData.totalYield)
        : ""
      : "",
    harvestMethod: activityData ? activityData.harvestMethod || "" : "",
    // Mano de obra
    workForce: activityData ? activityData.workForce || "" : "",
    workForceId: activityData ? activityData.workForceId || "" : "",
    workForceHourlyCost: activityData && activityData.workForceHourlyCost !== undefined ? String(activityData.workForceHourlyCost) : "",
    // Transporte
    transport: activityData ? activityData.transport || "" : "",
    transportId: activityData ? activityData.transportId || "" : "",
    costPerTrip: activityData && activityData.costPerTrip !== undefined ? String(activityData.costPerTrip) : "",
    numTrips: activityData
      ? activityData.numTrips !== undefined
        ? String(activityData.numTrips)
        : ""
      : "",
    // Maquinaria
    machineHours: activityData
      ? activityData.machineHours !== undefined
        ? String(activityData.machineHours)
        : ""
      : "",
    tools: activityData ? activityData.tools || "" : "",
    machineId: activityData ? activityData.machineId || "" : "",
    machineHourlyDepreciation: activityData && activityData.machineHourlyDepreciation !== undefined ? String(activityData.machineHourlyDepreciation) : "",
    // Jornales
    workHours: activityData
      ? activityData.workHours !== undefined
        ? String(activityData.workHours)
        : ""
      : "",
    quantityEmployees:
      activityData && activityData.quantityEmployees !== undefined
        ? String(activityData.quantityEmployees)
        : "",
    observations: activityData ? activityData.observations || "" : "",
    // Costos
    laborCost: activityData
      ? activityData.laborCost !== undefined
        ? String(activityData.laborCost)
        : ""
      : "",
    machineCost: activityData
      ? activityData.machineCost !== undefined
        ? String(activityData.machineCost)
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
    totalYield: useRef(new Animated.Value(0)).current,
    machineHours: useRef(new Animated.Value(0)).current,
    numTrips: useRef(new Animated.Value(0)).current,
    transport: useRef(new Animated.Value(0)).current,
    tools: useRef(new Animated.Value(0)).current,
    workForce: useRef(new Animated.Value(0)).current,
    quantityEmployees: useRef(new Animated.Value(0)).current,
    workHours: useRef(new Animated.Value(0)).current,
    harvestMethod: useRef(new Animated.Value(0)).current,
    observations: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    machineCost: useRef(new Animated.Value(0)).current,
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
  const [errors, setErrors] = useState({});

  // Lógica de cálculo automático del total adaptada
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const laborCost = parseInt(updated.laborCost) || 0;
      const machineCost = parseInt(updated.machineCost) || 0;
      const transportCost = parseInt(updated.transportCost) || 0;
      const totalCost = laborCost + machineCost + transportCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

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
    const hours = parseInt(formData.workHours) || 0;
    const qty = parseInt(formData.quantityEmployees) || 0;
    const hourly = parseFloat(formData.workForceHourlyCost) || employeesMeta.avgHourlyCost || 0;
    const lc = Math.round(hourly * hours * qty) || 0;
    setFormData((prev) => {
      const machineCost = parseInt(prev.machineCost) || 0;
      const transportCost = parseInt(prev.transportCost) || 0;
      const totalCost = lc + machineCost + transportCost;
      return { ...prev, laborCost: String(lc), totalCost: String(totalCost) };
    });
  }, [employeesMeta.avgHourlyCost, formData.workForceHourlyCost, formData.workHours, formData.quantityEmployees]);

  // Cálculo: maquinaria = depreciación_por_hora × horas_maquinaria
  React.useEffect(() => {
    const depH = parseFloat(formData.machineHourlyDepreciation) || 0;
    const hours = parseInt(formData.machineHours) || 0;
    const mCost = Math.round(depH * hours) || 0;
    setFormData((prev) => {
      const laborCost = parseInt(prev.laborCost) || 0;
      const transportCost = parseInt(prev.transportCost) || 0;
      const totalCost = laborCost + mCost + transportCost;
      return { ...prev, machineCost: String(mCost), totalCost: String(totalCost) };
    });
  }, [formData.machineHourlyDepreciation, formData.machineHours]);

  // Cálculo: transporte = costo_por_viaje × viajes
  React.useEffect(() => {
    const perTrip = parseFloat(formData.costPerTrip) || 0;
    const trips = parseInt(formData.numTrips) || 0;
    const tCost = Math.round(perTrip * trips) || 0;
    setFormData((prev) => {
      const laborCost = parseInt(prev.laborCost) || 0;
      const machineCost = parseInt(prev.machineCost) || 0;
      const totalCost = laborCost + machineCost + tCost;
      return { ...prev, transportCost: String(tCost), totalCost: String(totalCost) };
    });
  }, [formData.costPerTrip, formData.numTrips]);

  const initialForm = {
    totalYield: "",
    harvestMethod: "",
    // Mano de obra
    workForce: "",
    workForceId: "",
    workForceHourlyCost: "",
    // Transporte
    transport: "",
    transportId: "",
    costPerTrip: "",
    numTrips: "",
    // Maquinaria
    tools: "",
    machineId: "",
    machineHourlyDepreciation: "",
    quantityEmployees: "",
    workHours: "",
    observations: "",
    laborCost: "",
    machineCost: "",
    machineHours: "",
    transportCost: "",
    totalCost: "",
  };
  // Modals para seleccionar personal de trabajo, transporte y maquinaria
  const [workForceModalOpen, setWorkForceModalOpen] = useState(false);
  const [transportModalOpen, setTransportModalOpen] = useState(false);
  const [machineModalOpen, setMachineModalOpen] = useState(false);

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.totalYield) {
      newErrors.totalYield = "Ingresa el rendimiento total.";
      triggerShake(shakeAnim.totalYield);
    }
    if (!formData.transport) {
      newErrors.transport = "Selecciona el transporte.";
      triggerShake(shakeAnim.transport);
    }
    if (!formData.numTrips) {
      newErrors.numTrips = "Ingresa el número de viajes.";
      triggerShake(shakeAnim.numTrips);
    }
    if (!formData.harvestMethod) {
      newErrors.harvestMethod = "Selecciona el método de cosecha.";
      triggerShake(shakeAnim.harvestMethod);
    }
    if (!formData.tools) {
      newErrors.tools = "Selecciona las herramientas o maquinaria usada.";
      triggerShake(shakeAnim.tools);
    }
    if (!formData.machineHours) {
      newErrors.machineHours = "Ingresa las horas de maquinaria utilizadas.";
      triggerShake(shakeAnim.machineHours);
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
      newErrors.workHours = "Ingresa las horas trabajadas.";
      triggerShake(shakeAnim.workHours);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = "Ingresa el costo de mano de obra.";
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.machineCost) {
      newErrors.machineCost = "Ingresa el costo de maquinaria.";
      triggerShake(shakeAnim.machineCost);
    }
    if (!formData.transportCost) {
      newErrors.transportCost = "Ingresa el costo de transporte.";
      triggerShake(shakeAnim.transportCost);
    }
    if (!formData.totalCost) {
      newErrors.totalCost = "Ingresa el costo total de cosecha.";
      triggerShake(shakeAnim.totalCost);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        // Totales/cantidades
        totalYield: parseInt(formData.totalYield) || 0,
        workHours: parseInt(formData.workHours) || 0,
        machineHours: parseInt(formData.machineHours) || 0,
        quantityEmployees: parseInt(formData.quantityEmployees) || 0,
        numTrips: parseInt(formData.numTrips) || 0,
        // Costos unitarios/tarifas
        workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
        machineHourlyDepreciation: parseFloat(formData.machineHourlyDepreciation) || 0,
        costPerTrip: parseFloat(formData.costPerTrip) || 0,
        // Costos calculados
        laborCost: parseInt(formData.laborCost) || 0,
        machineCost: parseInt(formData.machineCost) || 0,
        transportCost: parseInt(formData.transportCost) || 0,
        totalCost: parseInt(formData.totalCost) || 0,
        // IDs
        workForceId: formData.workForceId || "",
        machineId: formData.machineId || "",
        transportId: formData.transportId || "",
      };
      if (activityData && activityData.id) {
        // Modo edición
        const docRef = doc(
          db,
          `Crops/${crop.id}/activities/${activityData.id}`
        );
        await updateDoc(docRef, payload);
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...payload,
          name: "Cosecha",
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
          Cosecha
        </Text>
        {/* Rendimiento total */}
        <CostInput
          label="Rendimiento total"
          value={formData.totalYield}
          onChangeText={(text) =>
            handleInputChange("totalYield", text.replace(/[^0-9]/g, ""))
          }
          placeholder="0"
          keyboardType="numeric"
          error={errors.totalYield}
          shakeAnim={shakeAnim.totalYield}
          unit="kilograms"
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>Kg</Text>}
        />
        {/* Método de cosecha */}
        <FormCheckBox
          label="Método de cosecha"
          options={["Manual", "Mecánico"]}
          value={formData.harvestMethod}
          onChange={(val) => handleInputChange("harvestMethod", val)}
          error={errors.harvestMethod}
          shakeAnim={shakeAnim.harvestMethod}
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
      {/* Herramientas o maquinaria usada (selección desde maquinaria) */}
        <InputSearch
          label="Herramientas o maquinaria usada"
          value={formData.tools}
          placeholder="Selecciona maquinaria o herramienta"
          onOpen={() => setMachineModalOpen(true)}
          error={errors.tools}
          shakeAnim={shakeAnim.tools}
        />
        {/* Horas de maquinaria utilizadas */}
        <HoursInput
          label="Horas de maquinaria utilizadas"
          value={formData.machineHours}
          onChangeText={(val) =>
            handleInputChange("machineHours", val.replace(/[^0-9]/g, ""))
          }
          error={errors.machineHours}
          shakeAnim={shakeAnim.machineHours}
        />
      {/* Transporte utilizado */}
        <InputSearch
          label="Transporte utilizado"
          value={formData.transport}
          placeholder="Selecciona transporte"
          onOpen={() => setTransportModalOpen(true)}
          error={errors.transport}
          shakeAnim={shakeAnim.transport}
        />
        {/* Número de viajes */}
        <InputsFormFields
          label="Número de viajes"
          value={formData.numTrips}
          onChangeText={(val) =>
            handleInputChange("numTrips", val.replace(/[^0-9]/g, ""))
          }
          placeholder="0"
          keyboardType="numeric"
          error={errors.numTrips}
          shakeAnim={shakeAnim.numTrips}
        />
        {/* Observaciones */}
        <InputsFormFields
          label="Observaciones"
          value={formData.observations}
          onChangeText={(text) => handleInputChange("observations", text)}
          placeholder="Escriba aquí"
          multiline
          numberOfLines={4}
          style={{ textAlignVertical: "top" }}
        />
        {/* Mano de obra cosecha */}
        <CostInput
          label="Costo de mano de obra"
          value={formData.laborCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.laborCost}
          shakeAnim={shakeAnim.laborCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo de maquinaria */}
        <CostInput
          label="Costo de maquinaria"
          value={formData.machineCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.machineCost}
          shakeAnim={shakeAnim.machineCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Transporte*/}
        <CostInput
          label="Transporte"
          value={formData.transportCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.transportCost}
          shakeAnim={shakeAnim.transportCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo total de cosecha */}
        <CostInput
          label="Costo total de cosecha"
          value={formData.totalCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.totalCost}
          shakeAnim={shakeAnim.totalCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Botón Guardar */}
        <FormButton onPress={handleSave} loading={loading} disabled={loading} />
      </ScrollView>
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
      {/* Modal de lista para seleccionar transporte */}
      <ModalList
        visible={transportModalOpen}
        onClose={() => setTransportModalOpen(false)}
        collectionPath="transport"
        orderByField="createdAt"
        orderDirection="desc"
        title="Seleccionar transporte"
        searchPlaceholder="Buscar por nombre o tipo"
        searchKeys={["transportType", "capacity"]}
        renderItem={(item) => (
          <Text style={{ color: "#333", fontSize: 14 }}>
            {item.transportType} — {item.capacity}
          </Text>
        )}
        onSelect={(item) =>
          setFormData((prev) => ({
            ...prev,
            transport: item.transportType,
            transportId: item.id || prev.transportId,
            costPerTrip: item.costPerTrip != null ? String(item.costPerTrip) : prev.costPerTrip,
          }))
        }
      />
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
            tools: item.name,
            machineId: item.id || prev.machineId,
            machineHourlyDepreciation: item.hourlyDepreciation != null ? String(item.hourlyDepreciation) : prev.machineHourlyDepreciation,
          }))
        }
      />
    </View>
  );
};

export default CropHarvest;
