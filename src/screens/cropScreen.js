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

// 🔹 Subcomponente para renderizar una actividad con animación

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
      {/* Columna del icono + línea */}
      <View style={cropScreenStyle.activityIconWrapper}>
        <Image source={activity.icon} style={{ width: 22, height: 22 }} />
        {!isLast && (
          <Animated.View
            style={[cropScreenStyle.activityLine, { height: lineHeight }]}
          />
        )}
      </View>

      {/* Texto y fecha */}
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
        {/* Botón de opciones (tres puntos) */}
        <TouchableOpacity
          onPress={() => onOptions(done, activity)}
          style={{ padding: 8 }}
        >
          <Image
            source={require("../assets/three_points.png")}
            style={{ width: 40, height: 30, tintColor: "#767E86" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CropScreen = () => {
  // Interceptar retroceso físico y de header para ir al Drawer/Home
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
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  // Lógica de eliminar actividad con confirmación
  const handleDeleteActivity = async () => {
    try {
      await deleteDoc(
        doc(db, `Crops/${crop.id}/activities/${selectedActivity.id}`)
      );
      // Refrescar actividades
      const acts = await getCropActivities(crop.id);
      setActivitiesDone(acts);
      // Recalcular progreso y actualizar imagen
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
        // Calcular progreso solo con las 9 actividades únicas
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
    <SafeAreaView
      style={cropScreenStyle.container2}
      onLayout={onLayoutRootView}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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

        {/* Crop Image */}
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

        {/* Ver ficha del cultivo Button */}
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

        {/* Actividades Section */}
        <View>
          <Text
            style={[cropScreenStyle.label2, { fontFamily: "QuicksandBold" }]}
          >
            Actividades
          </Text>
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
              // Filtrar todos los registros de la actividad
              const doneList = activitiesDone.filter(
                (a) => a.name === activity.name
              );
              // Si es una actividad repetible, mostrar todas sus repeticiones
              const isRepeatable = [
                "Riego",
                "Fertilización",
                "Manejo Fitosanitario",
              ].includes(activity.name);
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
                // Solo mostrar una vez las actividades no repetibles
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
          {/* Modal de opciones para editar/eliminar actividad */}
          <Modal
            visible={optionsModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setOptionsModalVisible(false)}
          >
            <TouchableWithoutFeedback
              onPress={() => setOptionsModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      padding: 24,
                      width: "75%",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                      }}
                      onPress={() => {
                        setOptionsModalVisible(false);
                        navigation.navigate(selectedActivityType.screen, {
                          crop,
                          activityData: selectedActivity,
                        });
                      }}
                    >
                      <Image
                        source={require("../assets/edit2.png")}
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 10,
                          tintColor: "#f67009ff",
                        }}
                      />
                      <Text
                        style={{
                          color: "#000000ff",
                          fontFamily: "QuicksandBold",
                          fontSize: 15,
                        }}
                      >
                        Actualizar actividad
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                      }}
                      onPress={async () => {
                        setOptionsModalVisible(false);
                        if (selectedActivity && selectedActivity.id) {
                          await handleDeleteActivity();
                        } else {
                          Alert.alert(
                            "Error",
                            "No se pudo identificar la actividad a eliminar."
                          );
                        }
                      }}
                    >
                      <Image
                        source={require("../assets/trash2.png")}
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 10,
                          tintColor: "#4e4e4eff",
                        }}
                      />
                      <Text
                        style={{
                          color: "#000000ff",
                          fontFamily: "QuicksandBold",
                          fontSize: 15,
                        }}
                      >
                        Eliminar actividad
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        {/* Progreso del cultivo */}
        <View style={cropScreenStyle.progressContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                cropScreenStyle.progressText,
                { fontFamily: "QuicksandBold" },
              ]}
            >
              Progreso del cultivo
            </Text>
            <Text style={[cropScreenStyle.progressText, { color: "#BC6C25" }]}>
              {progress}%
            </Text>
          </View>
          <View style={cropScreenStyle.progressBar}>
            <View
              style={[cropScreenStyle.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

        {/* Agregar actividad Button */}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          // El botón nunca se bloquea, la lógica de bloqueo va en el modal
        >
          <LinearGradient
            colors={["rgba(46, 125, 50, 1)", "rgba(76, 175, 80, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={cropScreenStyle.buttonSR}
          >
            <Text
              style={[
                cropScreenStyle.buttonText,
                { color: "#fff", fontFamily: "CarterOne" },
              ]}
            >
              Agregar actividad
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Modal de selección de actividad */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 20,
                    width: "85%",
                  }}
                >
                  <Text
                    style={[
                      cropScreenStyle.titleModal,
                      { fontFamily: "CarterOne" },
                    ]}
                  >
                    Selecciona una actividad
                  </Text>
                  <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      const prepDone = activitiesDone.some(
                        (a) => a.name === "Preparación del terreno"
                      );
                      const isRepeatable = [
                        "Riego",
                        "Fertilización",
                        "Manejo Fitosanitario",
                      ].includes(item.name);
                      // Si es repetible, siempre se puede registrar si ya está preparación
                      // Si no es repetible, solo se puede registrar si no está registrada y el progreso < 100%
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
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 12,
                            borderBottomWidth: 0.5,
                            borderColor: "#ccc",
                            opacity: canSelect ? 1 : 0.4,
                          }}
                          onPress={() => {
                            if (canSelect) {
                              setModalVisible(false);
                              navigation.navigate(item.screen, { crop });
                            }
                          }}
                          disabled={!canSelect}
                        >
                          <Image
                            source={item.icon}
                            style={{ width: 28, height: 28, marginRight: 12 }}
                          />
                          <Text style={{ fontSize: 16 }}>{item.name}</Text>
                          {/* Mostrar (Registrada) solo si no es repetible y ya está */}
                          {!isRepeatable &&
                            activitiesDone.some(
                              (a) => a.name === item.name
                            ) && (
                              <Text
                                style={{
                                  color: "#2E7D32",
                                  marginLeft: 8,
                                  fontSize: 13,
                                }}
                              >
                                (Registrada)
                              </Text>
                            )}
                        </Pressable>
                      );
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: 15, alignSelf: "flex-end" }}
                  >
                    <Text
                      style={{ color: "#BC6C25", fontFamily: "QuicksandBold" }}
                    >
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CropScreen;
