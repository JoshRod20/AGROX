import React, { useCallback, useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CropCard from "../components/cropCard";
import FormInputSearch from "../components/inventoryComponent/formInputSearch";
import cropCardStyle from "../styles/cropCardStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { getUserCrops } from "../services/cropsService";
import { getCropActivities } from "../services/activitiesService";
import { db } from "../services/database";
import { collection, query, where, getDocs } from "firebase/firestore";

SplashScreen.preventAutoHideAsync();

const MyCrops = () => {

  const navigation = useNavigation();
  
  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../utils/fonts/Quicksand-Regular.ttf"),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [allCrops, setAllCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropImages, setCropImages] = useState({});

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Cargar todos los cultivos una vez
  useEffect(() => {
    const loadCrops = async () => {
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
              cultivatedArea: crop.cultivatedArea,
              technicalManager: crop.technicalManager,
              progress,
            };
          })
        );

        const sortedCrops = cropsData.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        setAllCrops(sortedCrops);

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
              images[crop.id] = `data:image/jpeg;base64,${activity.imageBase64}`;
            }
          }
        }
        setCropImages(images);
      } catch (error) {
        console.error("Error loading crops:", error);
        // Alert.alert("Error", "No se pudieron cargar los cultivos.");
      } finally {
        setLoading(false);
      }
    };

    loadCrops();
  }, []);

  // Función para normalizar texto (minúsculas, sin acentos)
  const normalize = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filtrar cultivos
  const filteredCrops = allCrops.filter((crop) => {
    const term = normalize(searchTerm.trim());
    if (term === "") return true;

    const name = normalize(crop.cropName || "");
    const type = normalize(crop.cropType || "");
    const area = crop.cultivatedArea ? normalize(String(crop.cultivatedArea)) : "";
    const manager = normalize(crop.technicalManager || "");
    const date = new Date(crop.createdAt).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const dateNormalized = normalize(date);

    return (
      name.includes(term) ||
      type.includes(term) ||
      area.includes(term) ||
      manager.includes(term) ||
      dateNormalized.includes(term)
    );
  });

  // Añadir cropImages a los cultivos para CropCard
  const cropsWithImages = filteredCrops.map(crop => ({
    ...crop,
    imageUri: cropImages[crop.id]
  }));

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} onLayout={onLayoutRootView}>
      {/* Botón de retroceso */}
            <View style={cropCardStyle.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={cropCardStyle.backButton}
              >
                <Image
                  source={require("../assets/arrow-left.png")}
                  style={cropCardStyle.backIcon}
                />
              </TouchableOpacity>
            </View>
      <ScrollView>
        <View style={{ padding: 16 }}>
          <Text
            style={[
              { fontFamily: "CarterOne", color: "#2E7D32", fontSize: 24, marginBottom: 16 },
              cropCardStyle.titleMyCrop,
            ]}
          >
            Cultivos
          </Text>

          {/* Barra de búsqueda */}
          <FormInputSearch
            placeholder="Buscar por nombre, tipo, etc..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={{ marginBottom: 20 }}
          />

          {/* Pasamos los cultivos filtrados */}
          <CropCard
            mode="full"
            cropsOverride={cropsWithImages.map(crop => ({
              ...crop,
              // Inyectamos imageUri como cropImages en CropCard si lo necesitas
            }))}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyCrops;