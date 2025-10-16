import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../services/database";
import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import styles from "../styles/cropCardStyle";
import { getCropActivities } from "../services/activitiesService";
import { getUserCrops } from "../services/cropsService";
import CropPDFGenerator from "../components/traceabilityComponent/cropPDFGenerator";
import QRModal from "../components/traceabilityComponent/qrModal";

const { width } = Dimensions.get("window");

const CropCard = ({ mode = "home", cropsOverride = null }) => {
  const navigation = useNavigation();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropImages, setCropImages] = useState({});
    const [qrModalVisible, setQrModalVisible] = useState(false);

  // Función para filtrar cultivos según el modo
  const applyFilter = (cropsList) => {
    if (mode === "home" || mode === "full") {
      return cropsList.filter((crop) => crop.progress < 100);
    } else if (mode === "traceability") {
      return cropsList.filter((crop) => crop.progress === 100);
    }
    return cropsList;
  };

  useEffect(() => {
    if (cropsOverride !== null) {
      // Aplicar filtro incluso cuando se pasa cropsOverride
      const filtered = applyFilter(cropsOverride);
      setCrops(filtered);
      setLoading(false);
      return;
    }

    const fetchCrops = async () => {
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

        const filteredCrops = applyFilter(cropsData);

        const sortedCrops = filteredCrops.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        setCrops(sortedCrops);

        // Cargar imágenes solo en modo "full" y "traceability"
        if (mode === "full" || mode === "traceability") {
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
        }
      } catch (error) {
        console.error("Error fetching crops:", error);
        Alert.alert("Error", "No se pudieron cargar los cultivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [mode, cropsOverride]);

  const handleUpdateCrop = () => {
    setOptionsModalVisible(false);
    navigation.navigate("FormCrop", { crop: selectedCrop });
  };

  const handleDeleteCrop = async () => {
    try {
      await deleteDoc(doc(db, "Crops", selectedCrop.id));
      if (cropsOverride === null) {
        setCrops((prev) => prev.filter((crop) => crop.id !== selectedCrop.id));
      } else {
        // Si usas cropsOverride, el padre debe manejar la actualización.
        // Pero por seguridad, actualizamos localmente también.
        setCrops((prev) => prev.filter((crop) => crop.id !== selectedCrop.id));
      }
      setDeleteAlertVisible(false);
    } catch (error) {
      console.error("Error deleting crop:", error);
      Alert.alert("Error", "No se pudo eliminar el cultivo.");
    }
  };

  if (loading) return null;

  const generatePDF = async (crop) => {
    try {
      // Obtener todas las actividades del cultivo
      const acts = await getCropActivities(crop.id);
      // Filtrar solo las actividades registradas (no vacías)
      const filteredActs = acts.filter((a) => a.name && a.createdAt);
      // Generar PDF
      await CropPDFGenerator(crop, filteredActs);
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  return (
    <>
      {/* Encabezado "Recientes" solo en Home */}
      {mode === "home" && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recientes</Text>
          <View style={styles.sectionLine} />
        </View>
      )}

      {crops.length > 0 ? (
        crops.map((crop) => (
          <TouchableOpacity
            key={crop.id}
            style={[styles.wrapper, { width: width * 0.9 }]}
            onPress={() => navigation.navigate("CropScreen", { crop })}
          >
            {/* Etiqueta de nombre del cultivo (verde) */}
            <View style={styles.cropNameTag}>
              <Text style={styles.cropNameText}>{crop.cropName}</Text>
            </View>

            <View style={styles.cardContainer}>
              {/* Botón de opciones (tres puntos) */}
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => {
                  setSelectedCrop(crop);
                  setOptionsModalVisible(true);
                }}
              >
                <Image
                  source={require("../assets/menu-dots.png")}
                  style={styles.optionsIcon}
                />
              </TouchableOpacity>

              {/* Contenido específico por modo */}
              {mode === "traceability" ? (
                <View style={styles.traceabilityCard}>
                  {crop.imageUri || cropImages[crop.id] ? (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: crop.imageUri || cropImages[crop.id] }}
                        style={styles.traceabilityCropImage}
                      />
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>Completado</Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.traceabilityCropImage,
                        { backgroundColor: "#eee" },
                      ]}
                    >
                      <Text style={styles.placeholderText}>Sin imagen</Text>
                    </View>
                  )}

                  {/* Tipo de cultivo */}
                  <View style={styles.dataRow}>
                    <Text style={styles.label}>Tipo de cultivo:</Text>
                    <Text style={styles.value}>{crop.cropType}</Text>
                  </View>

                  {/* Fecha de registro */}
                  <View style={styles.dataRow}>
                    <Text style={styles.label}>Registrado el:</Text>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>
                        {new Date(crop.createdAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </Text>
                    </View>
                  </View>

                  {/* Botones QR y PDF: esquina inferior derecha */}
                  <View style={styles.traceabilityActionButtons}>
                    <TouchableOpacity
                      style={styles.traceabilityActionButton}
                      onPress={() => {
                        setSelectedCrop(crop);
                        setQrModalVisible(true);
                      }}
                    >
                      <Image
                        source={require("../assets/qr-2.png")}
                        style={styles.traceabilityActionIcon}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.traceabilityActionButton}
                      onPress={() => generatePDF(crop)}
                    >
                      <Image
                        source={require("../assets/document-signed.png")}
                        style={styles.traceabilityActionIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // Modos home y full: mostrar todo
                <View style={styles.card}>
                  {/* Imagen */}
                  {mode === "full" && (crop.imageUri || cropImages[crop.id]) ? (
                    <Image
                      source={{ uri: crop.imageUri || cropImages[crop.id] }}
                      style={styles.cropImage}
                    />
                  ) : null}

                  <Text style={styles.label}>
                    Tipo de cultivo:{" "}
                    <Text style={styles.value}>{crop.cropType}</Text>
                  </Text>

                  {/* Fecha de registro */}
                  <View style={styles.dataRow}>
                    <Text style={styles.label}>Registrado el:</Text>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateText}>
                        {new Date(crop.createdAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </Text>
                    </View>
                  </View>

                  {/* Datos adicionales: solo en modo "full" */}
                  {mode === "full" && (
                    <>
                      <View style={styles.dataRow}>
                        <Text style={styles.label}>Área cultivada:</Text>
                        <Text style={styles.value}>
                          {crop.cultivatedArea != null &&
                          crop.cultivatedArea !== ""
                            ? `${crop.cultivatedArea} mz`
                            : "N/A"}
                        </Text>
                      </View>
                      <View style={styles.dataRow}>
                        <Text style={styles.label}>Responsable técnico:</Text>
                        <Text style={styles.value}>
                          {crop.technicalManager != null &&
                          crop.technicalManager !== ""
                            ? crop.technicalManager
                            : "N/A"}
                        </Text>
                      </View>
                    </>
                  )}

                  <View style={styles.progressContainer}>
                    <Text style={styles.label}>Progreso:</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${crop.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{crop.progress}%</Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No hay cultivos aún.</Text>
        </View>
      )}

      {/* Modal de opciones */}
      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOptionsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.optionsModal}>
                {/* Mostrar "Actualizar" solo si NO es traceability */}
                {mode !== "traceability" && (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={handleUpdateCrop}
                  >
                    <Image
                      source={require("../assets/edit.png")}
                      style={styles.optionIcon}
                    />
                    <Text style={styles.optionText}>Actualizar cultivo</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setOptionsModalVisible(false);
                    if (selectedCrop?.id) {
                      setDeleteAlertVisible(true);
                    } else {
                      Alert.alert(
                        "Error",
                        "No se pudo identificar el cultivo."
                      );
                    }
                  }}
                >
                  <Image
                    source={require("../assets/trash.png")}
                    style={[styles.optionIcon, { tintColor: "#4e4e4e" }]}
                  />
                  <Text style={styles.optionText}>Eliminar cultivo</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        visible={deleteAlertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteAlertVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            <View style={styles.alertIconContainer}>
              <Image
                source={require("../assets/warning.png")}
                style={styles.alertIcon}
              />
            </View>
            <Text style={styles.alertTitle}>¿Eliminar cultivo?</Text>
            <Text style={styles.alertMessage}>
              ¿Estás seguro de que deseas eliminar el cultivo "
              <Text style={{ fontFamily: "QuicksandSemiBold" }}>
                {selectedCrop?.cropName}
              </Text>
              "? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={[styles.alertButton, styles.cancelButtonAlert]}
                onPress={() => setDeleteAlertVisible(false)}
              >
                <Text style={styles.alertButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertButton, styles.deleteButtonAlert]}
                onPress={async () => {
                  setDeleteAlertVisible(false);
                  await handleDeleteCrop();
                }}
              >
                <Text style={styles.alertButtonTextDelete}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <QRModal
  visible={qrModalVisible}
  onClose={() => setQrModalVisible(false)}
  crop={selectedCrop}
  cropName={selectedCrop?.cropName || "Cultivo"}
/>
    </>
  );
};

export default CropCard;
