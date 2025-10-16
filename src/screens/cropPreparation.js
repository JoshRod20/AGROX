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
import FormCheckBox from "../components/formCheckBox";
import FormSelectPicker from "../components/formSelectPicker";
import InputsFormFields from "../components/inputsFormFields";
import InputSearch from "../components/activitiesCrop/inputSearch";
import ModalList from "../components/activitiesCrop/modalList";
import CostInput from "../components/costInputs";
import HoursInput from "../components/hoursInput";
import FormButton from "../components/formButton";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";
const CropPreparation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  // Estado para los datos del formulario
  const [formData, setFormData] = useState(
    activityData
      ? {
        workForce: activityData.workForce || "",
        workForceId: activityData.workForceId || "",
        workForceHourlyCost:
          activityData.workForceHourlyCost !== undefined
            ? String(activityData.workForceHourlyCost)
            : "",
        laborType: activityData.laborType || "",
          quantityEmployees:
          activityData.quantityEmployees !== undefined
            ? String(activityData.quantityEmployees)
            : "",
        tillageType: activityData.tillageType || "",
        soilCondition: activityData.soilCondition || "",
        tools: activityData.tools || "",
        machineHourlyDepreciation:
          activityData.machineHourlyDepreciation !== undefined
            ? String(activityData.machineHourlyDepreciation)
            : "",
         amendments: 
          activityData.amendments !== undefined
            ? String(activityData.amendments)
            : "",
        amendmentsId: activityData.amendmentsId || "",
        amendmentsUnitPrice:
          activityData.amendmentsUnitPrice !== undefined
            ? String(activityData.amendmentsUnitPrice)
            : "",
        weedControl: activityData.weedControl || "",
        workHours:
          activityData.workHours !== undefined
            ? String(activityData.workHours)
            : "",
        inputQuantity:
          activityData.inputQuantity !== undefined
            ? String(activityData.inputQuantity)
            : "",
        laborCost:
          activityData.laborCost !== undefined
            ? String(activityData.laborCost)
            : "",
        machineHours:
          activityData.machineHours !== undefined
            ? String(activityData.machineHours)
            : "",
        machineCost:
          activityData.machineCost !== undefined
            ? String(activityData.machineCost)
            : "",
        inputCost:
          activityData.inputCost !== undefined
            ? String(activityData.inputCost)
            : "",
        totalCost:
          activityData.totalCost !== undefined ? activityData.totalCost : 0,
        observations: activityData.observations || "",
      }
      : {
        workForce: "",
        workForceId: "",
        workForceHourlyCost: "",
        laborType: "",
        tillageType: "",
        soilCondition: "",
        quantityEmployees: 0,
        tools: "",
        machineHourlyDepreciation: "",
        amendments: "",
        amendmentsId: "",
        amendmentsUnitPrice: "",
        weedControl: "",
        workHours: "",
        inputQuantity: "",
        laborCost: "",
        machineHours: "",
        machineCost: "",
        inputCost: "",
        totalCost: 0,
        observations: "",
      }
  );
  // Estado para controlar la apertura de los selectores
  const [openTillageType, setOpenTillageType] = useState(false);
  const [openSoilCondition, setOpenSoilCondition] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const [openAmendments, setOpenAmendments] = useState(false);


  // ScrollView ref para scroll a errores
  const scrollViewRef = useRef(null);

  // 1. Referencias Animated para animación shake de cada campo relevante
  // Solo los campos que quieres que tiemblen (ejemplo: tillageType y soilCondition)
  const shakeAnim = {
    workForce: useRef(new Animated.Value(0)).current,
    tillageType: useRef(new Animated.Value(0)).current,
    soilCondition: useRef(new Animated.Value(0)).current,
    quantityEmployees: useRef(new Animated.Value(0)).current,
    laborType: useRef(new Animated.Value(0)).current,
    tools: useRef(new Animated.Value(0)).current,
    amendments: useRef(new Animated.Value(0)).current,
    weedControl: useRef(new Animated.Value(0)).current,
    workHours: useRef(new Animated.Value(0)).current,
    inputQuantity: useRef(new Animated.Value(0)).current,
    machineHours: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
    machineCost: useRef(new Animated.Value(0)).current,
    inputCost: useRef(new Animated.Value(0)).current,
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

  // Calcula el costo total automáticamente cada vez que cambian los valores relevantes
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Parsear valores numéricos
      const laborCost = parseFloat(updated.laborCost) || 0;
      const machineCost = parseFloat(updated.machineCost) || 0;
      const inputCost = parseFloat(updated.inputCost) || 0;
      const totalCost = laborCost + machineCost + inputCost;
      return { ...updated, totalCost };
    });
  };

  const initialForm = {
    workForce: "",
    laborType: "",
    tillageType: "",
    quantityEmployees: 0,
    soilCondition: "",
    tools: "",
    machineHourlyDepreciation: 0,
    amendments: "",
    inputQuantity: "",
    weedControl: "",
    machineHours: 0,
    laborCost: 0,
    machineCost: 0,
    inputCost: 0,
    totalCost: 0,
    observations: "",
  };
  // Modal para seleccionar personal de trabajo
  const [workForceModalOpen, setWorkForceModalOpen] = useState(false);
  // Modal para seleccionar maquinaria
  const [machineModalOpen, setMachineModalOpen] = useState(false);
  // Modal para seleccionar enmiendas
  const [amendmentsModalOpen, setAmendmentsModalOpen] = useState(false);

  // Meta de empleados: total y costo por hora promedio
  const [employeesMeta, setEmployeesMeta] = useState({ count: 0, avgHourlyCost: 0 });

  // Cargar empleados para obtener count y promedio de hourlyCost
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
        // Si falla, mantener 0s; no interrumpe la UI
        setEmployeesMeta({ count: 0, avgHourlyCost: 0 });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Costo de maquinaria = depreciación_por_hora (maquinaria seleccionada) × horas_uso (machineHours)
  React.useEffect(() => {
    const depH = parseFloat(formData.machineHourlyDepreciation) || 0;
    const hours = parseFloat(formData.machineHours) || 0;
    const mCost = Math.round(depH * hours) || 0;
    setFormData((prev) => {
      const laborCost = parseFloat(prev.laborCost) || 0;
      const inputCost = parseFloat(prev.inputCost) || 0;
      const totalCost = laborCost + mCost + inputCost;
      return { ...prev, machineCost: String(mCost), totalCost };
    });
  }, [formData.machineHourlyDepreciation, formData.machineHours]);

  // Calcular automáticamente Costo de mano de obra = costo_por_hora (empleado seleccionado o promedio) × horas_trabajo × cantidad_empleados
  React.useEffect(() => {
    const hours = parseFloat(formData.workHours) || 0;
    const qty = parseInt(formData.quantityEmployees) || 0;
    const hourly = parseFloat(formData.workForceHourlyCost) || employeesMeta.avgHourlyCost || 0;
    const cost = hourly * hours * qty;
    const laborCost = Math.round(cost) || 0; // entero para mantener consistencia con parseInt al guardar
    setFormData((prev) => {
      // Recalcular total al actualizar laborCost
      const machineCost = parseFloat(prev.machineCost) || 0;
      const inputCost = parseFloat(prev.inputCost) || 0;
      const totalCost = (laborCost || 0) + machineCost + inputCost;
      return { ...prev, laborCost: String(laborCost), totalCost };
    });
  }, [employeesMeta.avgHourlyCost, formData.workForceHourlyCost, formData.workHours, formData.quantityEmployees]);

  // Costo de insumos = precio_unitario (de seedsAndInputs) × cantidad (inputQuantity)
  React.useEffect(() => {
    const unitPrice = parseFloat(formData.amendmentsUnitPrice) || 0;
    const qty = parseFloat(formData.inputQuantity) || 0;
    const iCost = Math.round(unitPrice * qty) || 0;
    setFormData((prev) => {
      const laborCost = parseFloat(prev.laborCost) || 0;
      const machineCost = parseFloat(prev.machineCost) || 0;
      const totalCost = laborCost + machineCost + iCost;
      return { ...prev, inputCost: String(iCost), totalCost };
    });
  }, [formData.amendmentsUnitPrice, formData.inputQuantity]);

  // 3. Validación con animación shake: dispara triggerShake si hay error en el campo
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.workForce) {
      newErrors.workForce = "Selecciona el personal de trabajo.";
      triggerShake(shakeAnim.workForce);
    }
    if (!formData.quantityEmployees) {
      newErrors.quantityEmployees = "Ingresa la cantidad de empleados.";
      triggerShake(shakeAnim.quantityEmployees);
    }
    if (!formData.laborType) {
      newErrors.laborType = "Selecciona el tipo de labor.";
      triggerShake(shakeAnim.laborType);
    }
    if (!formData.tillageType) {
      newErrors.tillageType = "Selecciona el tipo de labranza.";
      triggerShake(shakeAnim.tillageType);
    }
    if (!formData.soilCondition) {
      newErrors.soilCondition = "Selecciona la condición del suelo.";
      triggerShake(shakeAnim.soilCondition);
    }
    if (!formData.tools) {
      newErrors.tools = "Ingresa las herramientas.";
      triggerShake(shakeAnim.tools);
    }
    if (!formData.amendments) {
      newErrors.amendments = "Ingresa las enmiendas.";
      triggerShake(shakeAnim.amendments);
    }
    if (!formData.inputQuantity) {
      newErrors.inputQuantity = "Ingresa la cantidad de insumos.";
      triggerShake(shakeAnim.inputQuantity);
    }
    if (!formData.weedControl) {
      newErrors.weedControl = "Selecciona el control de malezas.";
      triggerShake(shakeAnim.weedControl);
    }
    if (!formData.workHours) {
      newErrors.workHours = "Ingresa las horas trabajadas.";
      triggerShake(shakeAnim.workHours);
    }
    if (!formData.machineHours) {
      newErrors.machineHours = "Ingresa las horas máquina.";
      triggerShake(shakeAnim.machineHours);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = "Ingresa el costo de mano de obra.";
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.machineCost) {
      newErrors.machineCost = "Ingresa el costo de maquinaria.";
      triggerShake(shakeAnim.machineCost);
    }
    if (!formData.inputCost) {
      newErrors.inputCost = "Ingresa el costo de insumos.";
      triggerShake(shakeAnim.inputCost);
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
        // Modo edición: actualizar documento existente
        const docRef = doc(
          db,
          `Crops/${crop.id}/activities/${activityData.id}`
        );
        await updateDoc(docRef, {
          ...formData,
          workHours: parseInt(formData.workHours) || 0,
          machineHours: parseInt(formData.machineHours) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          machineCost: parseInt(formData.machineCost) || 0,
          machineHourlyDepreciation: parseFloat(formData.machineHourlyDepreciation) || 0,
          quantityEmployees: parseInt(formData.quantityEmployees) || 0,
          inputQuantity: parseInt(formData.inputQuantity) || 0,
          amendmentsUnitPrice: parseFloat(formData.amendmentsUnitPrice) || 0,
          inputCost: parseInt(formData.inputCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          observations: formData.observations,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          workHours: parseInt(formData.workHours) || 0,
          machineHours: parseInt(formData.machineHours) || 0,
          laborCost: parseInt(formData.laborCost) || 0,
          quantityEmployees: parseInt(formData.quantityEmployees) || 0,
          machineCost: parseInt(formData.machineCost) || 0,
          machineHourlyDepreciation: parseFloat(formData.machineHourlyDepreciation) || 0,
          inputQuantity: parseInt(formData.inputQuantity) || 0,
          amendmentsUnitPrice: parseFloat(formData.amendmentsUnitPrice) || 0,
          inputCost: parseInt(formData.inputCost) || 0,
          totalCost: parseInt(formData.totalCost) || 0,
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          name: "Preparación del terreno",
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
          Preparación del suelo
        </Text>
        <FormCheckBox
          label="Tipo de laboreo"
          options={["Manual", "Mecanizado", "Otro"]}
          value={formData.laborType}
          onChange={(val) => handleInputChange("laborType", val)}
          error={errors.laborType}
          shakeAnim={shakeAnim.laborType}
        />
        <Text style={cropStyle.label}>Tipo de labranza</Text>
        {/*
          FormSelectPicker es un componente reutilizable para mostrar un selector tipo dropdown.
          - open: controla si el menú está abierto (usa un estado local)
          - setOpen: función para cambiar el estado de apertura
          - value y setValue: valor seleccionado y función para actualizarlo
          - items: opciones del selector
          - error: mensaje de error si existe
        */}
        {/* Selector para Tipo de labranza */}
        {/*
          4. Pasa la prop shakeAnim al FormSelectPicker para que reciba la animación.
          Así, cuando hay error, el campo tiembla visualmente.
        */}
        <FormSelectPicker
          label={null}
          value={formData.tillageType}
          setValue={(callback) =>
            setFormData((prev) => ({
              ...prev,
              tillageType: callback(prev.tillageType),
            }))
          }
          open={openTillageType}
          setOpen={setOpenTillageType}
          items={[
            { label: "Convencional", value: "Convencional" },
            { label: "Mínima", value: "Mínima" },
            {
              label: "Cero (siembra directa)",
              value: "Cero (siembra directa)",
            },
            { label: "Vertical", value: "Vertical" },
          ]}
          placeholder="Seleccione"
          error={errors.tillageType}
          shakeAnim={shakeAnim.tillageType}
        />
        <Text style={cropStyle.label}>Condiciones del suelo previas</Text>
        {/* Selector para Condiciones del suelo previas */}
        <FormSelectPicker
          label={null}
          value={formData.soilCondition}
          setValue={(callback) =>
            setFormData((prev) => ({
              ...prev,
              soilCondition: callback(prev.soilCondition),
            }))
          }
          open={openSoilCondition}
          setOpen={setOpenSoilCondition}
          items={[
            { label: "Seco", value: "Seco" },
            { label: "Húmedo", value: "Húmedo" },
            { label: "Compactado", value: "Compactado" },
            { label: "Con rastrojo", value: "Con rastrojo" },
            { label: "Con malezas", value: "Con malezas" },
          ]}
          placeholder="Seleccione"
          error={errors.soilCondition}
          shakeAnim={shakeAnim.soilCondition}
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
        {/* Personal de trabajo (selección desde empleados) */}
        <InputSearch
          label="Personal de trabajo"
          value={formData.workForce}
          placeholder="Selecciona personal"
          onOpen={() => setWorkForceModalOpen(true)}
          error={errors.workForce}
          shakeAnim={shakeAnim.workForce}
        />
        {/* Input de cantidad de empleados */}
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
        {/* Enmiendas aplicadas (cal, abono, etc) - selección desde insumos */}
        <InputSearch
          label="Enmiendas aplicadas (cal, abono, etc)"
          value={formData.amendments}
          placeholder="Seleccione enmiendas"
          onOpen={() => setAmendmentsModalOpen(true)}
          error={errors.amendments}
          shakeAnim={shakeAnim.amendments}
        />
        {/* Input de cantidad de insumos utilizados */}
        <InputsFormFields
          label="Cantidad de insumos utilizados"
          value={formData.inputQuantity}
          onChangeText={(val) =>
            handleInputChange("inputQuantity", val.replace(/[^0-9]/g, ""))
          }
          placeholder="0"
          keyboardType="numeric"
          error={errors.inputQuantity}
          shakeAnim={shakeAnim.inputQuantity}
        />
        {/* Input de control de malezas */}
        <FormCheckBox
          label="Control de malezas previo"
          options={["Sí", "No"]}
          value={formData.weedControl}
          onChange={(val) => handleInputChange("weedControl", val)}
          error={errors.weedControl}
          shakeAnim={shakeAnim.weedControl}
        />
        {/* Inputs de COSTO */}
        <CostInput
          label="Costo de mano de obra"
          value={String(formData.laborCost)}
          onChangeText={() => { }}
          error={errors.laborCost}
          shakeAnim={shakeAnim.laborCost}
          editable={false}
        />
        {/* Costo de maquinaria */}
        <CostInput
          label="Costo de maquinaria"
          value={String(formData.machineCost)}
          onChangeText={() => { }}
          error={errors.machineCost}
          shakeAnim={shakeAnim.machineCost}
          editable={false}
        />
        {/* Costo de insumos aplicados */}
        <CostInput
          label="Costo de insumos aplicados"
          value={String(formData.inputCost)}
          onChangeText={() => { }}
          error={errors.inputCost}
          shakeAnim={shakeAnim.inputCost}
          editable={false}
        />
        {/* Costo total de preparación */}
        <CostInput
          label="Costo total de preparación"
          value={formData.totalCost.toString()}
          onChangeText={() => { }}
          error={errors.totalCost}
          shakeAnim={shakeAnim.totalCost}
          editable={false}
        />
        {/* Inputs de observaciones */}
        <InputsFormFields
          label="Observaciones (opcional)"
          value={formData.observations}
          onChangeText={(val) =>
            setFormData({ ...formData, observations: val })
          }
          placeholder="El suelo no presentó ninguna dificultad de preparación."
          keyboardType="default"
          error={errors.observations}
          shakeAnim={shakeAnim.observations}
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
        onSelect={(item) =>
          setFormData((prev) => ({
            ...prev,
            workForce: item.fullName,
            workForceId: item.id || prev.workForceId,
            workForceHourlyCost:
              item.hourlyCost != null
                ? String(item.hourlyCost)
                : prev.workForceHourlyCost,
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
            machineHourlyDepreciation:
              item.hourlyDepreciation != null
                ? String(item.hourlyDepreciation)
                : prev.machineHourlyDepreciation,
          }))
        }
      />
      {/* Modal de lista para seleccionar enmiendas */}
      <ModalList
        visible={amendmentsModalOpen}
        onClose={() => setAmendmentsModalOpen(false)}
        collectionPath="seedsAndInputs"
        orderByField="createdAt"
        orderDirection="desc"
        title="Seleccionar enmiendas"
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
            amendments: item.inputName,
            amendmentsId: item.id || prev.amendmentsId,
            amendmentsUnitPrice:
              item.unitPrice != null ? String(item.unitPrice) : prev.amendmentsUnitPrice,
          }))
        }
      />
    </View>
  );
};
export default CropPreparation;
