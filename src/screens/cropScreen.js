import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cropScreenStyle } from "../styles/cropScreenStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  useRoute,
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
import { BackHandler } from "react-native";
import { getCropActivities } from "../services/activitiesService";
import { LinearGradient } from "expo-linear-gradient";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/database";

SplashScreen.preventAutoHideAsync();

const activities = [
  {
    id: "1",
    name: "Preparación del terreno",
    icon: require("../assets/land-layers.png"),
    date: "15 de marzo de 2025",
    screen: "CropPreparation",
  },
  {
    id: "2",
    name: "Siembra",
    icon: require("../assets/seedling_2.png"),
    date: "20 de abril de 2025",
    screen: "CropSowing",
  },
  {
    id: "3",
    name: "Fertilización",
    icon: require("../assets/bag-seedling.png"),
    screen: "CropFertilization",
  },
  {
    id: "4",
    name: "Riego",
    icon: require("../assets/humidity.png"),
    screen: "CropIrrigation",
  },
  {
    id: "5",
    name: "Manejo Fitosanitario",
    icon: require("../assets/bugs.png"),
    screen: "CropPhytosanitary",
  },
  {
    id: "6",
    name: "Monitoreo del cultivo",
    icon: require("../assets/overview.png"),
    screen: "CropMonitoring",
  },
  {
    id: "7",
    name: "Cosecha",
    icon: require("../assets/apple-crate.png"),
    screen: "CropHarvest",
  },
  {
    id: "8",
    name: "Postcosecha y comercialización",
    icon: require("../assets/point-of-sale-bill.png"),
    screen: "CropPostharvest",
  },
  {
    id: "9",
    name: "Documentación adicional",
    icon: require("../assets/document-signed.png"),
    screen: "CropDocumentation",
  },
];

const ActivityItem = ({ activity, done, isLast, onOptions }) => {
  const lineHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isLast) {
      Animated.timing(lineHeight, {
        toValue: 40,
        duration: 600,
        useNativeDriver: false,
      }).start();
    }
  }, [isLast]);

  return (
    <View style={cropScreenStyle.activityContainer}>
      <View style={cropScreenStyle.activityIconWrapper}>
        <Image source={activity.icon} style={{ width: 22, height: 22 }} />
        {!isLast && (
          <Animated.View
            style={[cropScreenStyle.activityLine, { height: lineHeight }]}
          />
        )}
      </View>

      <View
        style={[
          cropScreenStyle.activityContent,
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        <View>
          <Text style={cropScreenStyle.activityTitle}>{activity.name}</Text>
          <Text style={cropScreenStyle.activityDate}>
            {done && done.createdAt
              ? (typeof done.createdAt === "string"
                  ? new Date(done.createdAt)
                  : done.createdAt.toDate
                  ? done.createdAt.toDate()
                  : new Date()
                ).toLocaleString("es-NI", { dateStyle: "long" })
              : "Sin fecha"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onOptions(done, activity)}
          style={{ padding: 8 }}
        >
          <Image
            source={require("../assets/menu-dots.png")}
            style={{ width: 25, height: 25, marginRight: 20, tintColor: "#767E86" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CropScreen = () => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Drawer" }],
        });
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={cropScreenStyle.backButton}
            onPress={onBackPress}
          >
            <Image
              source={require("../assets/arrow-left.png")}
              style={cropScreenStyle.backIcon}
            />
          </TouchableOpacity>
        ),
      });
      return () => {
        subscription.remove();
      };
    }, [navigation])
  );

  const route = useRoute();
  const navigation = useNavigation();
  const crop = route.params?.crop;
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false); // ✅ Nuevo estado
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedActivityType, setSelectedActivityType] = useState(null);

  const handleDeleteActivity = async () => {
    try {
      await deleteDoc(
        doc(db, `Crops/${crop.id}/activities/${selectedActivity.id}`)
      );
      const acts = await getCropActivities(crop.id);
      setActivitiesDone(acts);
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
      setProgress(Math.round((doneUnique.length / 9) * 100));
      const docAct = acts.find(
        (a) => a.name === "Documentación adicional" && a.imageBase64
      );
      setDocImageBase64(docAct?.imageBase64 || null);
    } catch (e) {
      Alert.alert("Error", "No se pudo eliminar la actividad.");
    }
  };

  const [activitiesDone, setActivitiesDone] = useState([]);
  const [progress, setProgress] = useState(0);
  const [docImageBase64, setDocImageBase64] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchActivities = async () => {
      if (crop?.id) {
        const acts = await getCropActivities(crop.id);
        setActivitiesDone(acts);
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
        setProgress(Math.round((doneUnique.length / 9) * 100));
        const docAct = acts.find(
          (a) => a.name === "Documentación adicional" && a.imageBase64
        );
        setDocImageBase64(docAct?.imageBase64 || null);
      }
    };
    fetchActivities();
  }, [isFocused, crop]);

  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../utils/fonts/Quicksand-Regular.ttf"),
    QuicksandSemiBold: require("../utils/fonts/Quicksand-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={cropScreenStyle.container2} onLayout={onLayoutRootView}>
      {/* Contenedor principal con layout vertical */}
      <View style={{ flex: 1, justifyContent: 'space-between' }}>

        {/* Parte superior fija */}
        <View>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                cropScreenStyle.title,
                { fontFamily: "CarterOne", color: "#2E7D32" },
              ]}
            >
              {crop?.cropName || "Maíz"}
            </Text>
          </View>

          <View style={cropScreenStyle.imageContainer}>
            {docImageBase64 ? (
              <Image
                source={{ uri: "data:image/jpeg;base64," + docImageBase64 }}
                style={cropScreenStyle.cropImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 220,
                  height: 180,
                  borderRadius: 8,
                  backgroundColor: "#eee",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#bbb",
                }}
              >
                <Text style={{ color: "#888", fontSize: 16 }}>Sin imagen</Text>
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={cropScreenStyle.buttonFile}>
              <Image
                source={require("../assets/document-signed.png")}
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 8,
                  tintColor: "#767E86",
                }}
              />
              <Text
                style={[
                  cropScreenStyle.buttonTextFile,
                  { fontFamily: "QuicksandRegular" },
                ]}
              >
                Ver ficha del cultivo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={cropScreenStyle.buttonGraph}
              onPress={() => navigation.navigate("FinanDashboard", { crop, hideDrawerBack: true })}
            >
              <Image
                source={require("../assets/stats.png")}
                style={cropScreenStyle.graphIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenedor scrollable de actividades */}
        <View style={cropScreenStyle.activitiesContainer}>
          <Text style={[cropScreenStyle.label2, { fontFamily: "QuicksandBold" }]}>
            Actividades
          </Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {activitiesDone.length === 0 ? (
              <Text
                style={[
                  cropScreenStyle.activitiesDone,
                  { fontFamily: "QuicksandRegular" },
                ]}
              >
                Ninguna
              </Text>
            ) : (
              activities.map((activity, index) => {
                const doneList = activitiesDone.filter((a) => a.name === activity.name);
                const isRepeatable = ["Riego", "Fertilización", "Manejo Fitosanitario"].includes(activity.name);
                if (isRepeatable && doneList.length > 0) {
                  return doneList.map((done, repIdx) => (
                    <ActivityItem
                      key={activity.id + "-" + repIdx}
                      activity={activity}
                      done={done}
                      isLast={false}
                      onOptions={(act, actType) => {
                        setSelectedActivity(act);
                        setSelectedActivityType(actType);
                        setOptionsModalVisible(true);
                      }}
                    />
                  ));
                } else if (!isRepeatable && doneList.length > 0) {
                  return (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      done={doneList[0]}
                      isLast={false}
                      onOptions={(act, actType) => {
                        setSelectedActivity(act);
                        setSelectedActivityType(actType);
                        setOptionsModalVisible(true);
                      }}
                    />
                  );
                }
                return null;
              })
            )}
          </ScrollView>
        </View>

        {/* Parte inferior fija: progreso + botón */}
        <View style={cropScreenStyle.footerContainer}>
          <View style={cropScreenStyle.progressContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[cropScreenStyle.progressText, { fontFamily: "QuicksandBold" }]}>
                Progreso del cultivo
              </Text>
              <Text style={[cropScreenStyle.progressText, { color: "#2E7D32" }]}>
                {progress}%
              </Text>
            </View>
            <View style={cropScreenStyle.progressBar}>
              <View style={[cropScreenStyle.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <LinearGradient
              colors={["rgba(46, 125, 50, 1)", "rgba(76, 175, 80, 0.7)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={cropScreenStyle.buttonSR}
            >
              <Text style={[cropScreenStyle.buttonText, { color: "#fff", fontFamily: "CarterOne" }]}>
                Agregar actividad
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>

      {/* Modal de opciones */}
      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOptionsModalVisible(false)}>
          <View style={cropScreenStyle.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={cropScreenStyle.optionsModal}>
                <TouchableOpacity
                  style={cropScreenStyle.optionItem}
                  onPress={() => {
                    setOptionsModalVisible(false);
                    navigation.navigate(selectedActivityType.screen, {
                      crop,
                      activityData: selectedActivity,
                    });
                  }}
                >
                  <Image
                    source={require("../assets/edit.png")}
                    style={cropScreenStyle.optionIcon}
                  />
                  <Text style={cropScreenStyle.optionText}>Actualizar actividad</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={cropScreenStyle.optionItem}
                  onPress={() => {
                    setOptionsModalVisible(false);
                    if (selectedActivity && selectedActivity.id) {
                      setDeleteAlertVisible(true); // ✅ Abre alerta personalizada
                    } else {
                      Alert.alert("Error", "No se pudo identificar la actividad.");
                    }
                  }}
                >
                  <Image
                    source={require("../assets/trash.png")}
                    style={[cropScreenStyle.optionIcon, { tintColor: "#4e4e4e" }]}
                  />
                  <Text style={cropScreenStyle.optionText}>Eliminar actividad</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de selección de actividad */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={cropScreenStyle.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={cropScreenStyle.activitySelectionModal}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                  <Text style={[cropScreenStyle.titleModal, { fontFamily: "CarterOne" }]}>
                    Selecciona una actividad
                  </Text>
                  <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      const prepDone = activitiesDone.some((a) => a.name === "Preparación del terreno");
                      const isRepeatable = ["Riego", "Fertilización", "Manejo Fitosanitario"].includes(item.name);
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
                        activitiesDone.some((a) => a.name === name)
                      );
                      const allUniqueDone = doneUnique.length === 9;
                      const canSelect = isRepeatable
                        ? prepDone
                        : !activitiesDone.some((a) => a.name === item.name) &&
                          (item.id === "1" || prepDone) &&
                          !allUniqueDone;

                      return (
                        <Pressable
                          style={[
                            cropScreenStyle.activityModalItem,
                            { opacity: canSelect ? 1 : 0.5 },
                          ]}
                          onPress={() => {
                            if (canSelect) {
                              setModalVisible(false);
                              navigation.navigate(item.screen, { crop });
                            }
                          }}
                          disabled={!canSelect}
                        >
                          <Image source={item.icon} style={cropScreenStyle.activityModalIcon} />
                          <Text style={cropScreenStyle.activityModalText}>{item.name}</Text>
                          {!isRepeatable && activitiesDone.some((a) => a.name === item.name) && (
                            <Text style={cropScreenStyle.activityModalRegistered}>(Registrada)</Text>
                          )}
                        </Pressable>
                      );
                    }}
                    scrollEnabled={false} // Ya está dentro de ScrollView
                  />
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={cropScreenStyle.cancelButton}>
                    <Text style={cropScreenStyle.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ✅ Modal de alerta personalizada de eliminación */}
      <Modal
        visible={deleteAlertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteAlertVisible(false)}
      >
        <View style={cropScreenStyle.overlay}>
          <View style={cropScreenStyle.alertContainer}>
            <View style={cropScreenStyle.alertIconContainer}>
              <Image
                source={require("../assets/warning.png")}
                style={cropScreenStyle.alertIcon}
              />
            </View>
            <Text style={cropScreenStyle.alertTitle}>¿Eliminar actividad?</Text>
            <Text style={cropScreenStyle.alertMessage}>
              ¿Estás seguro de que deseas eliminar la actividad "
              <Text style={{ fontFamily: "QuicksandSemiBold" }}>
                {selectedActivityType?.name}
              </Text>
              "? Esta acción no se puede deshacer.
            </Text>
            <View style={cropScreenStyle.alertButtons}>
              <TouchableOpacity
                style={[cropScreenStyle.alertButton, cropScreenStyle.cancelButtonAlert]}
                onPress={() => setDeleteAlertVisible(false)}
              >
                <Text style={cropScreenStyle.alertButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[cropScreenStyle.alertButton, cropScreenStyle.deleteButtonAlert]}
                onPress={async () => {
                  setDeleteAlertVisible(false);
                  await handleDeleteActivity();
                }}
              >
                <Text style={cropScreenStyle.alertButtonTextDelete}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CropScreen;