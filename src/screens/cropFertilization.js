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
import CostInput from "../components/costInputs";
import FormButton from "../components/formButton";
import HoursInput from "../components/hoursInput";
import InputSearch from "../components/activitiesCrop/inputSearch";
import ModalList from "../components/activitiesCrop/modalList";

const CropFertilization = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const activityData = route.params?.activityData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    activityData
      ? {
        fertilizerType: activityData.fertilizerType || "",
        fertilizerId: activityData.fertilizerId || "",
        fertilizerUnitPrice:
          activityData.fertilizerUnitPrice !== undefined
            ? String(activityData.fertilizerUnitPrice)
            : "",
        workForce: activityData.workForce || "",
        workForceId: activityData.workForceId || "",
        workForceHourlyCost:
          activityData.workForceHourlyCost !== undefined
            ? String(activityData.workForceHourlyCost)
            : "",
        transport: activityData.transport || "",
        transportId: activityData.transportId || "",
        costPerTrip:
          activityData.costPerTrip !== undefined
            ? String(activityData.costPerTrip)
            : "",
        numTrips: 
          activityData.numTrips !== undefined
            ? String(activityData.numTrips)
            : "",
        quantityEmployees:
          activityData.quantityEmployees !== undefined
            ? String(activityData.quantityEmployees)
            : "",
        workHours:
          activityData.workHours !== undefined
            ? String(activityData.workHours)
            : "",
        dose:
          activityData.dose !== undefined
            ? String(activityData.dose)
            : "",
        applicationMethod: activityData.applicationMethod || "",
        soilCondition: activityData.soilCondition || "",
        cropObservations: activityData.cropObservations || "",
        fertilizerCost:
          activityData.fertilizerCost !== undefined
            ? String(activityData.fertilizerCost)
            : "",
        laborCost:
          activityData.laborCost !== undefined
            ? String(activityData.laborCost)
            : "",
        transportCost:
          activityData.transportCost !== undefined
            ? String(activityData.transportCost)
            : "",
        totalCost:
          activityData.totalCost !== undefined
            ? String(activityData.totalCost)
            : "",
      }
      : {
        fertilizerType: "",
        fertilizerId: "",
        fertilizerUnitPrice: "",
        dose: "",
        workForce: "",
        workForceId: "",
        workForceHourlyCost: "",
        transport: "",
        transportId: "",
        costPerTrip: "",
        numTrips: "",
        quantityEmployees: "",
        workHours: "",
        applicationMethod: "",
        soilCondition: "",
        cropObservations: "",
        fertilizerCost: "",
        laborCost: "",
        transportCost: "",
        totalCost: "",
      }
  );

  const [errors, setErrors] = useState({});

  const shakeAnim = {
    fertilizerType: useRef(new Animated.Value(0)).current,
    dose: useRef(new Animated.Value(0)).current,
    workHours: useRef(new Animated.Value(0)).current,
    transport: useRef(new Animated.Value(0)).current,
    numTrips: useRef(new Animated.Value(0)).current,
    workForce: useRef(new Animated.Value(0)).current,
    quantityEmployees: useRef(new Animated.Value(0)).current,
    applicationMethod: useRef(new Animated.Value(0)).current,
    soilCondition: useRef(new Animated.Value(0)).current,
    fertilizerCost: useRef(new Animated.Value(0)).current,
    laborCost: useRef(new Animated.Value(0)).current,
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

  // Lógica de cálculo automático del total adaptada de cropPreparation
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Parsear valores numéricos
      const fertilizerCost = parseInt(updated.fertilizerCost) || 0;
      const laborCost = parseInt(updated.laborCost) || 0;
      const transportCost = parseInt(updated.transportCost) || 0;
      const totalCost = fertilizerCost + laborCost + transportCost;
      return { ...updated, totalCost: String(totalCost) };
    });
  };

  const initialForm = {
    fertilizerType: "",
    fertilizerId: "",
    fertilizerUnitPrice: "",
    dose: "",
    quantityEmployees: "",
    transport: "",
    transportId: "",
    costPerTrip: "",
    numTrips: "",
    applicationMethod: "",
    workForce: "",
    workForceId: "",
    workForceHourlyCost: "",
    workHours: "",
    soilCondition: "",
    cropObservations: "",
    fertilizerCost: "",
    laborCost: "",
    transportCost: "",
    totalCost: "",
  };
  //Modal para seleccionar tipo de fertilizante
  const [fertilizerTypeModalOpen, setFertilizerTypeModalOpen] = useState(false);
  //Modal para seleccionar personal de trabajo
  const [workForceModalOpen, setWorkForceModalOpen] = useState(false);
  //Modal para seleccionar transporte
  const [transportModalOpen, setTransportModalOpen] = useState(false);

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

  // Cálculo: fertilizante = precio_unitario × dosis
  React.useEffect(() => {
    const unit = parseFloat(formData.fertilizerUnitPrice) || 0;
    const qty = parseFloat(formData.dose) || 0;
    const fCost = Math.round(unit * qty) || 0;
    setFormData((prev) => {
      const laborCost = parseInt(prev.laborCost) || 0;
      const transportCost = parseInt(prev.transportCost) || 0;
      const totalCost = fCost + laborCost + transportCost;
      return { ...prev, fertilizerCost: String(fCost), totalCost: String(totalCost) };
    });
  }, [formData.fertilizerUnitPrice, formData.dose]);

  // Cálculo: mano de obra = costo_por_hora × horas × cantidad_empleados
  React.useEffect(() => {
    const hours = parseInt(formData.workHours) || 0;
    const qty = parseInt(formData.quantityEmployees) || 0;
    const hourly = parseFloat(formData.workForceHourlyCost) || employeesMeta.avgHourlyCost || 0;
    const lc = Math.round(hourly * hours * qty) || 0;
    setFormData((prev) => {
      const fertilizerCost = parseInt(prev.fertilizerCost) || 0;
      const transportCost = parseInt(prev.transportCost) || 0;
      const totalCost = fertilizerCost + lc + transportCost;
      return { ...prev, laborCost: String(lc), totalCost: String(totalCost) };
    });
  }, [employeesMeta.avgHourlyCost, formData.workForceHourlyCost, formData.workHours, formData.quantityEmployees]);

  // Cálculo: transporte = costo_por_viaje × viajes
  React.useEffect(() => {
    const perTrip = parseFloat(formData.costPerTrip) || 0;
    const trips = parseInt(formData.numTrips) || 0;
    const tCost = Math.round(perTrip * trips) || 0;
    setFormData((prev) => {
      const fertilizerCost = parseInt(prev.fertilizerCost) || 0;
      const laborCost = parseInt(prev.laborCost) || 0;
      const totalCost = fertilizerCost + laborCost + tCost;
      return { ...prev, transportCost: String(tCost), totalCost: String(totalCost) };
    });
  }, [formData.costPerTrip, formData.numTrips]);

  const handleSave = async () => {
    let newErrors = {};
    if (!formData.fertilizerType) {
      newErrors.fertilizerType = "Selecciona el tipo de fertilizante.";
      triggerShake(shakeAnim.fertilizerType);
    }
    if (!formData.quantityEmployees) {
      newErrors.quantityEmployees = "Ingresa la cantidad de empleados.";
      triggerShake(shakeAnim.quantityEmployees);
    }
    if (!formData.transport) {
      newErrors.transport = "Selecciona el transporte.";
      triggerShake(shakeAnim.transport);
    }
    if (!formData.numTrips) {
      newErrors.numTrips = "Ingresa el número de viajes.";
      triggerShake(shakeAnim.numTrips);
    }
    if (!formData.workForce) {
      newErrors.workForce = "Selecciona el personal de trabajo.";
      triggerShake(shakeAnim.workForce);
    }
    if (!formData.workHours) {
      newErrors.workHours = "Ingresa las horas trabajadas.";
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
    if (!formData.soilCondition) {
      newErrors.soilCondition = "Ingresa la condición del suelo.";
      triggerShake(shakeAnim.soilCondition);
    }
    if (!formData.fertilizerCost) {
      newErrors.fertilizerCost = "Ingresa el costo de fertilizante.";
      triggerShake(shakeAnim.fertilizerCost);
    }
    if (!formData.laborCost) {
      newErrors.laborCost = "Ingresa el costo de mano de obra.";
      triggerShake(shakeAnim.laborCost);
    }
    if (!formData.transportCost) {
      newErrors.transportCost = "Ingresa el costo de transporte.";
      triggerShake(shakeAnim.transportCost);
    }
    if (!formData.totalCost) {
      newErrors.totalCost = "Ingresa el costo total de fertilización.";
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
          fertilizerCost: parseInt(formData.fertilizerCost) || 0,
          fertilizerUnitPrice: parseFloat(formData.fertilizerUnitPrice) || 0,
          fertilizerId: formData.fertilizerId || "",
          laborCost: parseInt(formData.laborCost) || 0,
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          workForceId: formData.workForceId || "",
          quantityEmployees: parseInt(formData.quantityEmployees) || 0,
          workHours: parseInt(formData.workHours) || 0,
          numTrips: parseInt(formData.numTrips) || 0,
          transportCost: parseInt(formData.transportCost) || 0,
          costPerTrip: parseFloat(formData.costPerTrip) || 0,
          transportId: formData.transportId || "",
          totalCost: parseInt(formData.totalCost) || 0,
        });
      } else {
        await addDoc(collection(db, `Crops/${crop.id}/activities`), {
          ...formData,
          fertilizerCost: parseInt(formData.fertilizerCost) || 0,
          fertilizerUnitPrice: parseFloat(formData.fertilizerUnitPrice) || 0,
          fertilizerId: formData.fertilizerId || "",
          laborCost: parseInt(formData.laborCost) || 0,
          workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
          workForceId: formData.workForceId || "",
          numTrips: parseInt(formData.numTrips) || 0,
          quantityEmployees: parseInt(formData.quantityEmployees) || 0,
          workHours: parseInt(formData.workHours) || 0,
          transportCost: parseInt(formData.transportCost) || 0,
          costPerTrip: parseFloat(formData.costPerTrip) || 0,
          transportId: formData.transportId || "",
          totalCost: parseInt(formData.totalCost) || 0,
          name: "Fertilización",
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
          Fertilización
        </Text>
        {/* tipo de fertilizante */}
        <InputSearch
          label="Tipo de fertilizante"
          value={formData.fertilizerType}
          placeholder="Seleccione tipo de fertilizante"
          onOpen={() => setFertilizerTypeModalOpen(true)}
          error={errors.fertilizerType}
          shakeAnim={shakeAnim.fertilizerType}
        />
        {/* Dosis aplicada */}
        <InputsFormFields
          label="Dósis aplicada"
          value={formData.dose}
          onChangeText={(val) => handleInputChange("dose", val.replace(/[^0-9]/g, ""))}
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
        {/* Condición del suelo */}
        <InputsFormFields
          label="Condición del suelo"
          value={formData.soilCondition}
          onChangeText={(text) => handleInputChange("soilCondition", text)}
          placeholder="Ej: húmedo, seco"
          error={errors.soilCondition}
          shakeAnim={shakeAnim.soilCondition}
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
        {/* Transporte utilizado */}
        <InputSearch
          label="Transporte utilizado"
          value={formData.transport}
          placeholder="Selecciona transporte"
          onOpen={() => setTransportModalOpen(true)}
          error={errors.transport}
          shakeAnim={shakeAnim.transport}
        />
        {/* Costo por viaje */}
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
        {/* Observaciones del cultivo */}
        <InputsFormFields
          label="Observaciones del cultivo"
          value={formData.cropObservations}
          onChangeText={(text) => handleInputChange("cropObservations", text)}
          placeholder="Escriba aquí"
          error={errors.cropObservations}
          shakeAnim={shakeAnim.cropObservations}
          multiline
          numberOfLines={4}
          style={{ textAlignVertical: "top" }}
        />
        {/* Costo de fertilizante */}
        <CostInput
          label="Costo de fertilizante"
          value={String(formData.fertilizerCost)}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.fertilizerCost}
          shakeAnim={shakeAnim.fertilizerCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo de mano de obra */}
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
        {/* Costo de transporte*/}
        <CostInput
          label="Costo de transporte"
          value={String(formData.transportCost)}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.transportCost}
          shakeAnim={shakeAnim.transportCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo total de fertilización */}
        <CostInput
          label="Costo total de fertilización"
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
      {/* Modal de lista para seleccionar enmiendas */}
      <ModalList
        visible={fertilizerTypeModalOpen}
        onClose={() => setFertilizerTypeModalOpen(false)}
        collectionPath="seedsAndInputs"
        orderByField="createdAt"
        orderDirection="desc"
        title="Seleccionar tipo de fertilizante"
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
            fertilizerType: item.inputName,
            fertilizerId: item.id || prev.fertilizerId,
            fertilizerUnitPrice: item.unitPrice != null ? String(item.unitPrice) : prev.fertilizerUnitPrice,
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

export default CropFertilization;
