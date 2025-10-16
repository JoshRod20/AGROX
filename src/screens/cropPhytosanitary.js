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
        // Workforce (empleados)
        workForce: activityData.workForce || "",
        workForceId: activityData.workForceId || "",
        workForceHourlyCost:
          activityData.workForceHourlyCost !== undefined
            ? String(activityData.workForceHourlyCost)
            : "",
        workHours: 
          activityData.workHours !== undefined
            ? String(activityData.workHours)
            : "",
        // Maquinaria/herramientas
        tools: activityData.tools || "",
        machineId: activityData.machineId || "",
        machineHourlyDepreciation:
          activityData.machineHourlyDepreciation !== undefined
            ? String(activityData.machineHourlyDepreciation)
            : "",
        machineHours: 
          activityData.machineHours !== undefined
            ? String(activityData.machineHours)
            : "",
        quantityEmployees:
          activityData.quantityEmployees !== undefined
            ? String(activityData.quantityEmployees)
            : "",
        // Producto aplicado
        productApplied: activityData.productApplied || "",
        productId: activityData.productId || "",
        productUnitPrice:
          activityData.productUnitPrice !== undefined
            ? String(activityData.productUnitPrice)
            : "",
        productCost:
          activityData.productCost !== undefined
            ? String(activityData.productCost)
            : "",
        dose:
          activityData.dose !== undefined ? String(activityData.dose) : "",
        applicationMethod: activityData.applicationMethod || "",
        efficacyObservations: activityData.efficacyObservations || "",
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
        // Workforce
        workForce: "",
        workForceId: "",
        workForceHourlyCost: "",
        // Maquinaria
        tools: "",
        machineId: "",
        machineHourlyDepreciation: "",
        machineHours: "",
        // Producto aplicado
        productApplied: "",
        productId: "",
        productUnitPrice: "",
        workHours: "",
        quantityEmployees: "",
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
    productApplied: useRef(new Animated.Value(0)).current,
    tools: useRef(new Animated.Value(0)).current,
    machineHours: useRef(new Animated.Value(0)).current,
    workForce: useRef(new Animated.Value(0)).current,
    workHours: useRef(new Animated.Value(0)).current,
    quantityEmployees: useRef(new Animated.Value(0)).current,
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
    // Workforce
    workForce: "",
    workForceId: "",
    workForceHourlyCost: "",
    workHours: "",
    // Maquinaria
    tools: "",
    machineId: "",
    machineHourlyDepreciation: "",
    machineHours: "",
    quantityEmployees: "",
    dose: "",
    // Producto
    productApplied: "",
    productId: "",
    productUnitPrice: "",
    applicationMethod: "",
    efficacyObservations: "",
    productCost: "",
    laborCost: "",
    machineCost: "",
    totalCost: "",
  };
  //Modal de producto aplicado
  const [productAppliedModalOpen, setProductAppliedModalOpen] = useState(false);
  //Modal de producto aplicado}
  const [workForceModalOpen, setWorkForceModalOpen] = useState(false);
  //Modal de maquinaria
  const [machineModalOpen, setMachineModalOpen] = useState(false);

  // Validación y guardado en Firestore

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.pestOrDisease) {
      newErrors.pestOrDisease = "Ingresa la plaga o enfermedad controlada.";
      triggerShake(shakeAnim.pestOrDisease);
    }
    if (!formData.productApplied) {
      newErrors.productApplied = "Ingresa el producto aplicado.";
      triggerShake(shakeAnim.productApplied);
    }
    if (!formData.tools) {
      newErrors.tools = "Ingrese las herramientas o maquinaria utilizada.";
      triggerShake(shakeAnim.tools);
    }
    if (!formData.machineHours) {
      newErrors.machineHours = "Ingrese las horas de maquinaria utilizadas.";
      triggerShake(shakeAnim.machineHours);
    }
    if (!formData.quantityEmployees) {
      newErrors.quantityEmployees = "Ingrese la cantidad de empleados.";
      triggerShake(shakeAnim.quantityEmployees);
    }
    if (!formData.workForce) {
      newErrors.workForce = "Ingrese el nombre del empleado";
      triggerShake(shakeAnim.workForce);
    }
    if (!formData.workHours) {
      newErrors.workHours = "Ingrese el numero de horas de trabajo.";
      triggerShake(shakeAnim.workHours);
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
      // Preparar payload con conversiones numéricas e IDs/tarifas
      const payload = {
        ...formData,
        dose: parseInt(formData.dose) || 0,
        // Producto aplicado
        productCost: parseInt(formData.productCost) || 0,
        productId: formData.productId || "",
        productUnitPrice: parseFloat(formData.productUnitPrice) || 0,
        // Maquinaria
        machineHours: parseInt(formData.machineHours) || 0,
        machineCost: parseInt(formData.machineCost) || 0,
        machineId: formData.machineId || "",
        machineHourlyDepreciation:
          parseFloat(formData.machineHourlyDepreciation) || 0,
        // Mano de obra
        workHours: parseInt(formData.workHours) || 0,
        quantityEmployees: parseInt(formData.quantityEmployees) || 0,
        laborCost: parseInt(formData.laborCost) || 0,
        workForceId: formData.workForceId || "",
        workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
        // Total
        totalCost: parseInt(formData.totalCost) || 0,
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

  // Cálculo: producto = precio_unitario × dosis
  React.useEffect(() => {
    const unit = parseFloat(formData.productUnitPrice) || 0;
    const qty = parseFloat(formData.dose) || 0;
    const pCost = Math.round(unit * qty) || 0;
    setFormData((prev) => {
      const laborCost = parseInt(prev.laborCost) || 0;
      const machineCost = parseInt(prev.machineCost) || 0;
      const totalCost = pCost + laborCost + machineCost;
      return { ...prev, productCost: String(pCost), totalCost: String(totalCost) };
    });
  }, [formData.productUnitPrice, formData.dose]);

  // Cálculo: mano de obra = costo_por_hora × horas × cantidad_empleados (con fallback promedio)
  React.useEffect(() => {
    const hours = parseInt(formData.workHours) || 0;
    const qty = parseInt(formData.quantityEmployees) || 0;
    const hourly = parseFloat(formData.workForceHourlyCost) || employeesMeta.avgHourlyCost || 0;
    const lc = Math.round(hourly * hours * qty) || 0;
    setFormData((prev) => {
      const productCost = parseInt(prev.productCost) || 0;
      const machineCost = parseInt(prev.machineCost) || 0;
      const totalCost = productCost + lc + machineCost;
      return { ...prev, laborCost: String(lc), totalCost: String(totalCost) };
    });
  }, [employeesMeta.avgHourlyCost, formData.workForceHourlyCost, formData.workHours, formData.quantityEmployees]);

  // Cálculo: maquinaria = depreciación_por_hora × horas_uso
  React.useEffect(() => {
    const depH = parseFloat(formData.machineHourlyDepreciation) || 0;
    const hours = parseInt(formData.machineHours) || 0;
    const mCost = Math.round(depH * hours) || 0;
    setFormData((prev) => {
      const productCost = parseInt(prev.productCost) || 0;
      const laborCost = parseInt(prev.laborCost) || 0;
      const totalCost = productCost + laborCost + mCost;
      return { ...prev, machineCost: String(mCost), totalCost: String(totalCost) };
    });
  }, [formData.machineHourlyDepreciation, formData.machineHours]);

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
        <InputSearch
          label="Producto aplicado"
          value={formData.productApplied}
          placeholder="Seleccione producto aplicado"
          onOpen={() => setProductAppliedModalOpen(true)}
          error={errors.productApplied}
          shakeAnim={shakeAnim.productApplied}
        />
        {/* Dósis aplicada */}
        <InputsFormFields
          label="Dósis aplicada"
          value={formData.dose}
          onChangeText={(text) => handleInputChange("dose", text)}
          placeholder="0"
          keyboardType="numeric"
          error={errors.dose}
          shakeAnim={shakeAnim.dose}
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
        {/* Costo de producto */}
        <CostInput
          label="Costo del producto"
          value={formData.productCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.productCost}
          shakeAnim={shakeAnim.productCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo de mano de obra */}
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
        {/* Costo total manejo fitosanitario */}
        <CostInput
          label="Costo total manejo fitosanitario"
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
        {/* Modal de lista para producto aplicado */}
        <ModalList
          visible={productAppliedModalOpen}
          onClose={() => setProductAppliedModalOpen(false)}
          collectionPath="seedsAndInputs"
          orderByField="createdAt"
          orderDirection="desc"
          title="Seleccionar producto aplicado"
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
              productApplied: item.inputName,
              productId: item.id || prev.productId,
              productUnitPrice:
                item.unitPrice != null ? String(item.unitPrice) : prev.productUnitPrice,
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
            workForceHourlyCost:
              item.hourlyCost != null ? String(item.hourlyCost) : prev.workForceHourlyCost,
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
              machineHourlyDepreciation:
                item.hourlyDepreciation != null
                  ? String(item.hourlyDepreciation)
                  : prev.machineHourlyDepreciation,
            }))
          }
        />
      </ScrollView>
    </View>
  );
};

export default CropPhytosanitary;
