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
import FormCheckBox from "../components/formCheckBox";
import InputsFormFields from "../components/inputsFormFields";
import FormButton from "../components/formButton";
import CostInput from "../components/costInputs";
import InputSearch from "../components/activitiesCrop/inputSearch";
import ModalList from "../components/activitiesCrop/modalList";
import HoursInput from "../components/hoursInput";

const CropSowing = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    activityData
      ? {
        sowingMethod: activityData.sowingMethod || "",
        sowingMark: activityData.sowingMark || "",
            quantityEmployees:
          activityData.quantityEmployees !== undefined
            ? String(activityData.quantityEmployees)
            : "",
        numTrips:
          activityData.numTrips !== undefined
            ? String(activityData.numTrips)
            : "",
        tools: activityData.tools || "",
        transport: activityData.transport || "",
        transportId: activityData.transportId || "",
        costPerTrip:
          activityData.costPerTrip !== undefined
            ? String(activityData.costPerTrip)
            : "",
        machineHours:
          activityData.machineHours !== undefined
            ? String(activityData.machineHours)
            : "",
        workHours:
          activityData.workHours !== undefined
            ? String(activityData.workHours)
            : "",
        seedType: activityData.seedType || "",
        seedId: activityData.seedId || "",
        seedUnitPrice:
          activityData.seedUnitPrice !== undefined
            ? String(activityData.seedUnitPrice)
            : "",
        workForce: activityData.workForce || "",
        workForceId: activityData.workForceId || "",
        workForceHourlyCost:
          activityData.workForceHourlyCost !== undefined
            ? String(activityData.workForceHourlyCost)
            : "",
          inputQuantity:
          activityData.inputQuantity !== undefined
            ? String(activityData.inputQuantity)
            : "",
        // ✅ ELIMINADO: sowingDensity
        seedCost:
          activityData.seedCost !== undefined
            ? String(activityData.seedCost)
            : "",
        laborCost:
          activityData.laborCost !== undefined
            ? String(activityData.laborCost)
            : "",
        machineCost:
          activityData.machineCost !== undefined
            ? String(activityData.machineCost)
            : "",
        transportCost:
          activityData.transportCost !== undefined
            ? String(activityData.transportCost)
            : "",
        machineId: activityData.machineId || "",
        machineHourlyDepreciation:
          activityData.machineHourlyDepreciation !== undefined
            ? String(activityData.machineHourlyDepreciation)
            : "",
        totalCost:
          activityData.totalCost !== undefined ? activityData.totalCost : "",
      }
      : {
        sowingMethod: "",
        sowingMark: "",
        quantityEmployees: "",
        machineHours: "",
        numTrips: "",
        seedType: "",
        seedId: "",
        seedUnitPrice: "",
        transport: "",
        transportId: "",
        costPerTrip: "",
        workHours: "",
        tools: "",
        workForce: "",
        workForceId: "",
        workForceHourlyCost: "",
        inputQuantity: "",
        // ✅ ELIMINADO: sowingDensity
        seedCost: "",
        laborCost: "",
        machineCost: "",
        machineId: "",
        machineHourlyDepreciation: "",
        transportCost: "",
        totalCost: "",
      }
  );

  // ScrollView ref para scroll a errores
  const scrollViewRef = useRef(null);

  // Referencias Animated (sin sowingDensity)
  const shakeAnim = {
    sowingMethod: useRef(new Animated.Value(0)).current,
    sowingMark: useRef(new Animated.Value(0)).current,
    seedType: useRef(new Animated.Value(0)).current,
    quantityEmployees: useRef(new Animated.Value(0)).current,
    tools: useRef(new Animated.Value(0)).current,
    transport: useRef(new Animated.Value(0)).current,
    numTrips: useRef(new Animated.Value(0)).current,
    workHours: useRef(new Animated.Value(0)).current,
    workForce: useRef(new Animated.Value(0)).current,
    machineHours: useRef(new Animated.Value(0)).current,
    inputQuantity: useRef(new Animated.Value(0)).current,
    // ✅ ELIMINADO: sowingDensity
    seedCost: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    machineCost: useRef(new Animated.Value(0)).current,
    transportCost: useRef(new Animated.Value(0)).current,
    totalCost: useRef(new Animated.Value(0)).current,
  };

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const seedCost = parseFloat(updated.seedCost) || 0;
      const laborCost = parseFloat(updated.laborCost) || 0;
      const machineCost = parseFloat(updated.machineCost) || 0;
      const transportCost = parseFloat(updated.transportCost) || 0;
      const totalCost = seedCost + laborCost + machineCost + transportCost;
      return { ...updated, totalCost };
    });
  };

  const initialForm = {
    sowingMethod: "",
    sowingMark: "",
    seedType: "",
    seedId: "",
    seedUnitPrice: "",
    numTrips: "",
    transport: "",
    quantityEmployees: "",
    workHours: "",
    machineHours: "",
    tools: "",
    inputQuantity: "",
    workForce: "",
    workForceId: "",
    workForceHourlyCost: "",
    // ✅ ELIMINADO: sowingDensity
    seedCost: "",
    laborCost: "",
    machineCost: "",
    machineId: "",
    machineHourlyDepreciation: "",
    transportCost: "",
    totalCost: "",
  };

  //Modal para seleccionar tipo de semilla
  const [amendmentsModalOpen, setAmendmentsModalOpen] = useState(false);
  //Modal para seleccionar empleado
  const [workForceModalOpen, setWorkForceModalOpen] = useState(false);
  //Modal para seleccionar maquinaria
  const [machineModalOpen, setMachineModalOpen] = useState(false);
  //Modal para seleccionar transporte
  const [transportModalOpen, setTransportModalOpen] = useState(false);

  // Cálculo automático: Transporte = costo_por_viaje × cantidad_viajes
  React.useEffect(() => {
    const perTrip = parseFloat(formData.costPerTrip) || 0;
    const trips = parseInt(formData.numTrips) || 0;
    const tCost = Math.round(perTrip * trips) || 0;
    setFormData((prev) => {
      const seedCost = parseFloat(prev.seedCost) || 0;
      const laborCost = parseFloat(prev.laborCost) || 0;
      const machineCost = parseFloat(prev.machineCost) || 0;
      const totalCost = seedCost + laborCost + machineCost + tCost;
      return { ...prev, transportCost: String(tCost), totalCost };
    });
  }, [formData.costPerTrip, formData.numTrips]);

  // Cálculo automático: Maquinaria = depreciación_por_hora × horas_uso
  React.useEffect(() => {
    const depH = parseFloat(formData.machineHourlyDepreciation) || 0;
    const hours = parseFloat(formData.machineHours) || 0;
    const mCost = Math.round(depH * hours) || 0;
    setFormData((prev) => {
      const seedCost = parseFloat(prev.seedCost) || 0;
      const laborCost = parseFloat(prev.laborCost) || 0;
      const transportCost = parseFloat(prev.transportCost) || 0;
      const totalCost = seedCost + laborCost + mCost + transportCost;
      return { ...prev, machineCost: String(mCost), totalCost };
    });
  }, [formData.machineHourlyDepreciation, formData.machineHours]);

  // Meta de empleados para fallback del costo por hora promedio (si se requiere)
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

  // Cálculo automático: Mano de obra = costo_por_hora × horas_trabajo × cantidad_empleados
  React.useEffect(() => {
    const hours = parseFloat(formData.workHours) || 0;
    const qty = parseInt(formData.quantityEmployees) || 0;
    const hourly = parseFloat(formData.workForceHourlyCost) || employeesMeta.avgHourlyCost || 0;
    const cost = hourly * hours * qty;
    const laborCost = Math.round(cost) || 0;
    setFormData((prev) => {
      const seedCost = parseFloat(prev.seedCost) || 0;
      const machineCost = parseFloat(prev.machineCost) || 0;
      const transportCost = parseFloat(prev.transportCost) || 0;
      const totalCost = seedCost + machineCost + transportCost + (laborCost || 0);
      return { ...prev, laborCost: String(laborCost), totalCost };
    });
  }, [employeesMeta.avgHourlyCost, formData.workForceHourlyCost, formData.workHours, formData.quantityEmployees]);

  // Cálculo automático: Costo de semilla = precio_unitario × cantidad
  React.useEffect(() => {
    const unit = parseFloat(formData.seedUnitPrice) || 0;
    const qty = parseFloat(formData.inputQuantity) || 0;
    const sCost = Math.round(unit * qty) || 0;
    setFormData((prev) => {
      const laborCost = parseFloat(prev.laborCost) || 0;
      const machineCost = parseFloat(prev.machineCost) || 0;
      const transportCost = parseFloat(prev.transportCost) || 0;
      const totalCost = sCost + laborCost + machineCost + transportCost;
      return { ...prev, seedCost: String(sCost), totalCost };
    });
  }, [formData.seedUnitPrice, formData.inputQuantity]);

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.sowingMethod) {
      newErrors.sowingMethod = "Selecciona el método de siembra.";
      triggerShake(shakeAnim.sowingMethod);
    }
    if (!formData.sowingMark) {
      newErrors.sowingMark = "Ingresa la densidad o marca de siembra.";
      triggerShake(shakeAnim.sowingMark);
    }
    if (!formData.machineHours) {
      newErrors.machineHours = "Ingresa las horas de maquinaria.";
      triggerShake(shakeAnim.machineHours);
    }
    if (!formData.numTrips) {
      newErrors.numTrips = "Ingresa el número de viajes.";
      triggerShake(shakeAnim.numTrips);
    }
    if (!formData.transport) {
      newErrors.transport = "Selecciona el transporte utilizado.";
      triggerShake(shakeAnim.transport);
    }
    if (!formData.sowingMark) {
      newErrors.sowingMark = "Ingresa la densidad o marca de siembra.";
      triggerShake(shakeAnim.sowingMark);
    }
    if (!formData.tools) {
      newErrors.tools = "Ingresa las herramientas o maquinaria utilizada.";
      triggerShake(shakeAnim.tools);
    }
    if (!formData.workHours) {
      newErrors.workHours = "Ingresa las horas trabajadas.";
      triggerShake(shakeAnim.workHours);
    }
    if (!formData.seedType) {
      newErrors.seedType = "Selecciona el tipo de semilla.";
      triggerShake(shakeAnim.seedType);
    }
    if (!formData.inputQuantity) {
      newErrors.inputQuantity = "Ingresa la cantidad de semillas usadas.";
      triggerShake(shakeAnim.inputQuantity);
    }
    if (!formData.workForce) {
      newErrors.workForce = "Selecciona el personal de trabajo.";
      triggerShake(shakeAnim.workForce);
    }
    if (!formData.seedCost) {
      newErrors.seedCost = "Ingresa el costo de semilla.";
      triggerShake(shakeAnim.seedCost);
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
      newErrors.totalCost = "Ingresa el costo total.";
      triggerShake(shakeAnim.totalCost);
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      if (activityData && activityData.id) {
        const docRef = doc(
          db,
          `Crops/${crop.id}/activities/${activityData.id}`
        );
        await updateDoc(docRef, {
          ...formData,
          seedCost: parseFloat(formData.seedCost) || 0,
          seedUnitPrice: parseFloat(formData.seedUnitPrice) || 0,
          seedId: formData.seedId || "",
          quantityEmployees: parseFloat(formData.quantityEmployees) || 0,
          numTrips: parseFloat(formData.numTrips) || 0,
          machineHours: parseFloat(formData.machineHours) || 0,
          machineHourlyDepreciation: parseFloat(formData.machineHourlyDepreciation) || 0,
          machineId: formData.machineId || "",
          workHours: parseFloat(formData.workHours) || 0,
          inputQuantity: parseFloat(formData.inputQuantity) || 0,
          laborCost: parseFloat(formData.laborCost) || 0,
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          workForceId: formData.workForceId || "",
          machineCost: parseFloat(formData.machineCost) || 0,
          transportCost: parseFloat(formData.transportCost) || 0,
          costPerTrip: parseFloat(formData.costPerTrip) || 0,
          transportId: formData.transportId || "",
          totalCost: parseFloat(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          seedCost: parseFloat(formData.seedCost) || 0,
          seedUnitPrice: parseFloat(formData.seedUnitPrice) || 0,
          seedId: formData.seedId || "",
          numTrips: parseFloat(formData.numTrips) || 0,
          quantityEmployees: parseFloat(formData.quantityEmployees) || 0,
          machineHours: parseFloat(formData.machineHours) || 0,
          machineHourlyDepreciation: parseFloat(formData.machineHourlyDepreciation) || 0,
          machineId: formData.machineId || "",
          workHours: parseFloat(formData.workHours) || 0,
          laborCost: parseFloat(formData.laborCost) || 0,
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          workForceId: formData.workForceId || "",
          inputQuantity: parseFloat(formData.inputQuantity) || 0,
          machineCost: parseFloat(formData.machineCost) || 0,
          transportCost: parseFloat(formData.transportCost) || 0,
          costPerTrip: parseFloat(formData.costPerTrip) || 0,
          transportId: formData.transportId || "",
          totalCost: parseFloat(formData.totalCost) || 0,
          name: "Siembra",
          createdAt: Timestamp.now(),
        });
      }
      setFormData(initialForm);
      navigation.navigate("CropScreen", { crop });
    } catch (e) {
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
          Siembra
        </Text>
        {/* Método de siembra */}
        <FormCheckBox
          label="Método de siembra"
          options={["Manual", "Mecanizado"]}
          value={formData.sowingMethod}
          onChange={(val) => handleInputChange("sowingMethod", val)}
          error={errors.sowingMethod}
          shakeAnim={shakeAnim.sowingMethod}
        />
        {/* Densidad o marca de siembra */}
        <InputsFormFields
          label="Densidad o marca de siembra"
          value={formData.sowingMark}
          placeholder="Ingrese la densidad o marca de siembra"
          onChangeText={(text) => handleInputChange("sowingMark", text)}
          error={errors.sowingMark}
          shakeAnim={shakeAnim.sowingMark}
        />
        {/* Selección de tipo de semilla */}
        <InputSearch
          label="Tipo de semilla"
          value={formData.seedType}
          placeholder="Selecciona el tipo de semilla"
          onOpen={() => setAmendmentsModalOpen(true)}
          error={errors.seedType}
          shakeAnim={shakeAnim.seedType}
        />
        {/* Cantidad de semillas usadas */}
        <InputsFormFields
          label="Cantidad de semillas usadas"
          value={formData.inputQuantity}
          onChangeText={(val) =>
            handleInputChange("inputQuantity", val.replace(/[^0-9]/g, ""))
          }
          placeholder="0"
          keyboardType="numeric"
          error={errors.inputQuantity}
          shakeAnim={shakeAnim.inputQuantity}
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
        {/* Numero de horas de maquinaria utilizadas */}
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
        {/* Costo de semilla */}
        <CostInput
          label="Costo de semilla"
          placeholder="0"
          value={String(formData.seedCost)}
          onChangeText={() => { }}
          error={errors.seedCost}
          keyboardType="numeric"
          shakeAnim={shakeAnim.seedCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo de mano de obra*/}
        <CostInput
          label="Costo de mano de obra"
          placeholder="0"
          value={String(formData.laborCost)}
          onChangeText={() => { }}
          error={errors.laborCost}
          keyboardType="numeric"
          shakeAnim={shakeAnim.laborCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo de maquinaria */}
        <CostInput
          label="Costo de maquinaria"
          placeholder="0"
          value={String(formData.machineCost)}
          onChangeText={() => { }}
          error={errors.machineCost}
          keyboardType="numeric"
          shakeAnim={shakeAnim.machineCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Transporte de semillas/insumos */}
        <CostInput
          label="Costo de transporte"
          placeholder="0"
          value={String(formData.transportCost)}
          onChangeText={() => { }}
          error={errors.transportCost}
          keyboardType="numeric"
          shakeAnim={shakeAnim.transportCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo total de siembra */}
        <CostInput
          label="Costo total de siembra"
          placeholder="Costo total calculado"
          value={formData.totalCost.toString()}
          onChangeText={() => { }}
          error={errors.totalCost}
          keyboardType="numeric"
          shakeAnim={shakeAnim.totalCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Botón Guardar */}
        <FormButton onPress={handleSave} loading={loading} disabled={loading} />
      </ScrollView>
      {/* Modal de lista para seleccionar tipo de semilla */}
      <ModalList
        visible={amendmentsModalOpen}
        onClose={() => setAmendmentsModalOpen(false)}
        collectionPath="seedsAndInputs"
        orderByField="createdAt"
        orderDirection="desc"
        title="Seleccionar tipos de semilla"
        searchPlaceholder="Buscar por nombre"
        searchKeys={["inputName"]}
        renderItem={(item) => (
          <Text style={{ color: "#333", fontSize: 14 }}>
            {item.inputName}
          </Text>
        )}
        onSelect={(item) =>
          setFormData((prev) => ({
            ...prev,
            seedType: item.inputName,
            seedId: item.id || prev.seedId,
            seedUnitPrice: item.unitPrice != null ? String(item.unitPrice) : prev.seedUnitPrice,
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

    </View>
  );
};

export default CropSowing;