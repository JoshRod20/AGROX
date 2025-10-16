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
  getDocs,
} from "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";
import InputsFormFields from "../components/inputsFormFields";
import CostInput from "../components/costInputs";
import FormButton from "../components/formButton";
import InputSearch from "../components/activitiesCrop/inputSearch";
import ModalList from "../components/activitiesCrop/modalList";
import FormCheckBox from "../components/formCheckBox";
import HoursInput from "../components/hoursInput";
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
    // Transporte
    transport: activityData ? activityData.transport || "" : "",
    transportId: activityData ? activityData.transportId || "" : "",
    costPerTrip: activityData 
    && activityData.costPerTrip !== undefined 
    ? String(activityData.costPerTrip) : "",
    numTrips: activityData
      ? activityData.numTrips !== undefined
        ? String(activityData.numTrips)
        : ""
      : "",
    materialQuantity: activityData ? activityData.materialQuantity || "" : "",
    // Mano de obra
    workForce: activityData ? activityData.workForce || "" : "",
    workForceId: activityData ? activityData.workForceId || "" : "",
    workForceHourlyCost: activityData 
    && activityData.workForceHourlyCost !== undefined 
    ? String(activityData.workForceHourlyCost) : "",
    // Materiales
    materialsUsed: activityData ? activityData.materialsUsed || "" : "",
    materialId: activityData ? activityData.materialId || "" : "",
    materialUnitPrice: activityData 
    && activityData.materialUnitPrice !== undefined 
    ? String(activityData.materialUnitPrice) : "",
    quantityEmployees: activityData
      ? activityData.quantityEmployees !== undefined
        ? String(activityData.quantityEmployees)
        : ""
      : "",
    workHours: activityData
      ? activityData.workHours !== undefined
        ? String(activityData.workHours)
        : ""
      : "",
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
    transport: useRef(new Animated.Value(0)).current,
    numTrips: useRef(new Animated.Value(0)).current,
    materialQuantity: useRef(new Animated.Value(0)).current,
    workForce: useRef(new Animated.Value(0)).current,
    materialsUsed: useRef(new Animated.Value(0)).current,
    quantityEmployees: useRef(new Animated.Value(0)).current,
    workHours: useRef(new Animated.Value(0)).current,
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
      const materialsCost = parseInt(prev.materialsCost) || 0;
      const transportCost = parseInt(prev.transportCost) || 0;
      const totalCost = lc + materialsCost + transportCost;
      return { ...prev, laborCost: String(lc), totalCost: String(totalCost) };
    });
  }, [employeesMeta.avgHourlyCost, formData.workForceHourlyCost, formData.workHours, formData.quantityEmployees]);
  // Cálculo: materiales = precio_unitario × cantidad
  React.useEffect(() => {
    const unit = parseFloat(formData.materialUnitPrice) || 0;
    const qty = parseFloat(formData.materialQuantity) || 0;
    const mCost = Math.round(unit * qty) || 0;
    setFormData((prev) => {
      const laborCost = parseInt(prev.laborCost) || 0;
      const transportCost = parseInt(prev.transportCost) || 0;
      const totalCost = laborCost + mCost + transportCost;
      return { ...prev, materialsCost: String(mCost), totalCost: String(totalCost) };
    });
  }, [formData.materialUnitPrice, formData.materialQuantity]);
  // Cálculo: transporte = costo_por_viaje × cantidad_viajes
  React.useEffect(() => {
    const perTrip = parseFloat(formData.costPerTrip) || 0;
    const trips = parseInt(formData.numTrips) || 0;
    const tCost = Math.round(perTrip * trips) || 0;
    setFormData((prev) => {
      const laborCost = parseInt(prev.laborCost) || 0;
      const materialsCost = parseInt(prev.materialsCost) || 0;
      const totalCost = laborCost + materialsCost + tCost;
      return { ...prev, transportCost: String(tCost), totalCost: String(totalCost) };
    });
  }, [formData.costPerTrip, formData.numTrips]);
  const initialForm = {
    postharvestSteps: [],
    packingDate: "",
    processedAmount: "",
    materialQuantity: "",
    // Transporte
    transport: "",
    transportId: "",
    costPerTrip: "",
    numTrips: "",
    // Materiales
    materialsUsed: "",
    materialId: "",
    materialUnitPrice: "",
    productDestination: "",
    // Mano de obra
    workForce: "",
    workForceId: "",
    workForceHourlyCost: "",
    quantityEmployees: "",
    workHours: "",
    salePrice: "",
    buyer: "",
    laborCost: "",
    materialsCost: "",
    transportCost: "",
    totalCost: "",
  };
  // Modal para seleccionar empleados
  const [workForceModalOpen, setWorkForceModalOpen] = useState(false);
  // Modal para seleccionar tipo de fertilizante
  const [materialsUsedModalOpen, setMaterialsUsedModalOpen] = useState(false);
  // Modal para seleccionar transporte
  const [transportModalOpen, setTransportModalOpen] = useState(false);
  // Función para guardar en Firestore
  // Incluye validaciones y animaciones de error
  // Si hay errores, no guarda y muestra alertas
  const handleSave = async () => {
    let newErrors = {};
    if (!formData.postharvestSteps) {
      newErrors.postharvestSteps = "Selecciona al menos un paso de postcosecha.";
      triggerShake(shakeAnim.postharvestSteps);
    };
    if (!formData.packingDate) {
      newErrors.packingDate = "Ingresa la fecha de empaque/transporte.";
      triggerShake(shakeAnim.packingDate);
    }
    if (!formData.transport) {
      newErrors.transport = "Selecciona el transporte.";
      triggerShake(shakeAnim.transport);
    }
    if (!formData.numTrips) {
      newErrors.numTrips = "Ingresa el numero de viajes.";
      triggerShake(shakeAnim.numTrips);
    }
    if (!formData.materialQuantity) {
      newErrors.materialQuantity = "Ingresa la cantidad de material.";
      triggerShake(shakeAnim.materialQuantity);
    }
    if (!formData.workForce) {
      newErrors.workForce = "Selecciona el personal de trabajo.";
      triggerShake(shakeAnim.workForce);
    }
    if (!formData.materialsUsed) {
      newErrors.materialsUsed = "Selecciona el tipo de material.";
      triggerShake(shakeAnim.materialsUsed);
    }
    if (!formData.quantityEmployees) {
      newErrors.quantityEmployees = "Ingresa la cantidad de empleados.";
      triggerShake(shakeAnim.quantityEmployees);
    }
    if (!formData.workHours) {
      newErrors.workHours = "Ingresa las horas trabajadas.";
      triggerShake(shakeAnim.workHours);
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
      const payload = {
        ...formData,
        // Conversión de bases y costos
        processedAmount: parseInt(formData.processedAmount) || 0,
        salePrice: parseInt(formData.salePrice) || 0,
        workHours: parseInt(formData.workHours) || 0,
        numTrips: parseInt(formData.numTrips) || 0,
        materialQuantity: parseInt(formData.materialQuantity) || 0,
        quantityEmployees: parseInt(formData.quantityEmployees) || 0,
        // Tarifas y IDs
        workForceHourlyCost: parseFloat(formData.workForceHourlyCost) || 0,
        workForceId: formData.workForceId || "",
        materialUnitPrice: parseFloat(formData.materialUnitPrice) || 0,
        materialId: formData.materialId || "",
        costPerTrip: parseFloat(formData.costPerTrip) || 0,
        transportId: formData.transportId || "",
        // Costos calculados
        laborCost: parseInt(formData.laborCost) || 0,
        materialsCost: parseInt(formData.materialsCost) || 0,
        transportCost: parseInt(formData.transportCost) || 0,
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
            cropStyle.poostHarvestTitle,
            { fontFamily: "CarterOne", color: "#2E7D32" },
          ]}
        >
          Postcosecha y comercialización
        </Text>
        {/* Pasos de postcosecha */}
        <FormCheckBox
          label="Tipo de tratamiento postcosecha"
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
        <CostInput
          label="Cantidad procesada"
          value={formData.processedAmount}
          onChangeText={(text) =>
            handleInputChange("processedAmount", text.replace(/[^0-9]/g, ""))
          }
          placeholder="0"
          keyboardType="numeric"
          error={errors.processedAmount}
          shakeAnim={shakeAnim.processedAmount}
          unit="kilograms"
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
        <CostInput
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
        {/* materiales utilizados */}
        <InputSearch
          label="Materiales utilizados"
          value={formData.materialsUsed}
          placeholder="Seleccione tipo de material"
          onOpen={() => setMaterialsUsedModalOpen(true)}
          error={errors.materialsUsed}
          shakeAnim={shakeAnim.materialsUsed}
        />
        {/* Cantidad de material */}
        <InputsFormFields
          label="Cantidad de material"
          value={formData.materialQuantity}
          onChangeText={(text) => handleInputChange("materialQuantity", text)}
          placeholder="0"
          keyboardType="numeric"
          error={errors.materialQuantity}
          shakeAnim={shakeAnim.materialQuantity}
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
        {/* Costo de materiales */}
        <CostInput
          label="Costo de materiales"
          value={formData.materialsCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.materialsCost}
          shakeAnim={shakeAnim.materialsCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo de transporte */}
        <CostInput
          label="Costo de transporte"
          value={formData.transportCost}
          onChangeText={() => { }}
          placeholder="0"
          keyboardType="numeric"
          error={errors.transportCost}
          shakeAnim={shakeAnim.transportCost}
          rightAdornment={<Text style={{ color: "#888", fontSize: 16 }}>C$</Text>}
          editable={false}
        />
        {/* Costo total postcosecha */}
        <CostInput
          label="Costo total postcosecha"
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
        <FormButton
          title={loading ? "Guardando..." : "Guardar"}
          onPress={handleSave}
          loading={loading}
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
        {/* Modal de lista para seleccionar enmiendas */}
        <ModalList
          visible={materialsUsedModalOpen}
          onClose={() => setMaterialsUsedModalOpen(false)}
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
              materialsUsed: item.inputName,
              materialId: item.id || prev.materialId,
              materialUnitPrice: item.unitPrice != null ? String(item.unitPrice) : prev.materialUnitPrice,
            }))
          }
        />
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
      </ScrollView>
    </View>
  );
};

export default CropPostharvest;
