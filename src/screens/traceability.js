// /src/screens/traceability.js
import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CropCard from "../components/cropCard";
import traceabilityStyle from "../styles/traceabilityStyle";
import FormInputSearch from "../components/inventoryComponent/formInputSearch";
import { getUserCrops } from "../services/cropsService";
import { getCropActivities } from "../services/activitiesService";
import { db } from "../services/database";
import { collection, query, where, getDocs } from "firebase/firestore";

const Traceability = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [allCompletedCrops, setAllCompletedCrops] = useState([]);
  const [cropImages, setCropImages] = useState({});
  const [loading, setLoading] = useState(true);

  // Normalizar texto para búsqueda (minúsculas, sin acentos)
  const normalize = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    const loadCompletedCrops = async () => {
      try {
        const userCrops = await getUserCrops();

        const cropsData = await Promise.all(
          userCrops.map(async (crop) => {
            const acts = await getCropActivities(crop.id);
            const uniqueActivities = [
              "Preparación del terreno",
              "Siembra",
              "Fertilización",
              "Riego",
              "Manejo Fitosanitario",
              "Monitoreo del cultivo",
              "Cosecha",
              "Postcosecha y comercialización",
              "Documentación adicional",
            ];
            const doneUnique = uniqueActivities.filter((name) =>
              acts.some((a) => a.name === name)
            );
            const progress = Math.round((doneUnique.length / 9) * 100);
            return {
              id: crop.id || "",
              cropName: crop.cropName || "Sin nombre",
              cropType: crop.cropType || "No especificado",
              createdAt: crop.createdAt || new Date(),
              progress,
            };
          })
        );

        // Filtrar SOLO completos
        const completedCrops = cropsData.filter(
          (crop) => crop.progress === 100
        );

        // Ordenar por fecha (más reciente primero)
        const sortedCrops = completedCrops.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setAllCompletedCrops(sortedCrops);

        // Cargar imágenes
        const images = {};
        for (const crop of sortedCrops) {
          const q = query(
            collection(db, `Crops/${crop.id}/activities`),
            where("name", "==", "Documentación adicional")
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const activity = querySnapshot.docs[0].data();
            if (activity.imageBase64) {
              images[
                crop.id
              ] = `data:image/jpeg;base64,${activity.imageBase64}`;
            }
          }
        }
        setCropImages(images);
      } catch (error) {
        console.error("Error loading completed crops:", error);
        Alert.alert("Error", "No se pudieron cargar los cultivos.");
      } finally {
        setLoading(false);
      }
    };

    loadCompletedCrops();
  }, []);

  // Aplicar búsqueda
  const filteredCrops = allCompletedCrops.filter((crop) => {
    const term = normalize(searchTerm.trim());
    if (term === "") return true;

    const name = normalize(crop.cropName || "");
    const type = normalize(crop.cropType || "");
    const dateStr = new Date(crop.createdAt).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // Ej: "15/10/2025"
    const dateNormalized = normalize(dateStr);

    return (
      name.includes(term) ||
      type.includes(term) ||
      dateNormalized.includes(term)
    );
  });

  // Añadir imageUri a los cultivos para CropCard
  const cropsWithImages = filteredCrops.map((crop) => ({
    ...crop,
    imageUri: cropImages[crop.id],
  }));

  return (
    <SafeAreaView style={traceabilityStyle.container}>
      <View style={traceabilityStyle.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={traceabilityStyle.backButton}
        >
          <Image
            source={require("../assets/arrow-left.png")}
            style={traceabilityStyle.backIcon}
          />
        </TouchableOpacity>
        <View />
      </View>

      <ScrollView contentContainerStyle={traceabilityStyle.content}>
        <Text style={traceabilityStyle.title}>Trazabilidad</Text>
        {/* Cuadro de búsqueda */}
        <FormInputSearch
          placeholder="Buscar..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={traceabilityStyle.search}
        />

        {/* Tarjetas */}
        {loading ? (
          <Text style={traceabilityStyle.loadingText}>Cargando...</Text>
        ) : filteredCrops.length === 0 ? (
          <Text style={traceabilityStyle.noDataText}>
            No se encontraron cultivos completos.
          </Text>
        ) : (
          <CropCard mode="traceability" cropsOverride={cropsWithImages} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Traceability;
