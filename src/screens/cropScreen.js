import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Modal, FlatList, Pressable, Animated, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cropScreenStyle } from '../styles/cropScreenStyle';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRoute, useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { getCropActivities } from '../services/activitiesService';
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

const activities = [
  { id: '1', name: 'Preparación del terreno', icon: require('../assets/land-layers.png'), date: '15 de marzo de 2025', screen: 'CropPreparation' },
  { id: '2', name: 'Siembra', icon: require('../assets/seedling_2.png'), date: '20 de abril de 2025', screen: 'CropSowing' },
  { id: '3', name: 'Fertilización', icon: require('../assets/bag-seedling.png'), screen: 'CropFertilization' },
  { id: '4', name: 'Riego', icon: require('../assets/humidity.png'), screen: 'CropIrrigation' },
  { id: '5', name: 'Manejo Fitosanitario', icon: require('../assets/bugs.png'), screen: 'CropPhytosanitary' },
  { id: '6', name: 'Monitoreo del cultivo', icon: require('../assets/overview.png'), screen: 'CropMonitoring' },
  { id: '7', name: 'Cosecha', icon: require('../assets/apple-crate.png'), screen: 'CropHarvest' },
  { id: '8', name: 'Postcosecha y comercialización', icon: require('../assets/point-of-sale-bill.png'), screen: 'CropPostharvest' },
  { id: '9', name: 'Documentación adicional', icon: require('../assets/document-signed.png'), screen: 'CropDocumentation' },
];

// 🔹 Subcomponente para renderizar una actividad con animación
const ActivityItem = ({ activity, done, isLast }) => {
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
      <View style={cropScreenStyle.activityContent}>
        <Text style={cropScreenStyle.activityTitle}>{activity.name}</Text>
        <Text style={cropScreenStyle.activityDate}>
          {done && done.createdAt
            ? (typeof done.createdAt === 'string'
                ? new Date(done.createdAt)
                : done.createdAt.toDate ? done.createdAt.toDate() : new Date())
                .toLocaleString('es-NI', { dateStyle: 'long'})
            : 'Sin fecha'}
        </Text>
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
          routes: [{ name: 'Drawer' }],
        });
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity style={cropScreenStyle.backButton} onPress={onBackPress}>
          <Image source={require('../assets/arrow-left.png')} style={cropScreenStyle.backIcon} />
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
  const [activitiesDone, setActivitiesDone] = useState([]);
  const [progress, setProgress] = useState(0);
  const [docImageBase64, setDocImageBase64] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchActivities = async () => {
      if (crop?.id) {
        const acts = await getCropActivities(crop.id);
        setActivitiesDone(acts);
        setProgress(Math.round((acts.length / 9) * 100));
        const docAct = acts.find(a => a.name === 'Documentación adicional' && a.imageBase64);
        setDocImageBase64(docAct?.imageBase64 || null);
      }
    };
    fetchActivities();
  }, [isFocused, crop]);

  const [fontsLoaded] = useFonts({
    CarterOne: require('../utils/fonts/CarterOne-Regular.ttf'),
    QuicksandBold: require('../utils/fonts/Quicksand-Bold.ttf'),
    QuicksandRegular: require('../utils/fonts/Quicksand-Regular.ttf'),
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[cropScreenStyle.title, { fontFamily: 'CarterOne', color: '#2E7D32' }]}>
            {crop?.cropName || 'Maíz'}
          </Text>
        </View>

        {/* Crop Image */}
        <View style={cropScreenStyle.imageContainer}>
          {docImageBase64 ? (
            <Image
              source={{ uri: 'data:image/jpeg;base64,' + docImageBase64 }}
              style={cropScreenStyle.cropImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 220,
                height: 180,
                borderRadius: 8,
                backgroundColor: '#eee',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#bbb',
              }}
            >
              <Text style={{ color: '#888', fontSize: 16 }}>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* Ver ficha del cultivo Button */}
        <TouchableOpacity style={cropScreenStyle.buttonFile}>
          <Image
            source={require('../assets/document-signed.png')}
            style={{ width: 18, height: 18, marginRight: 8, tintColor: '#767E86' }}
          />
          <Text style={[cropScreenStyle.buttonTextFile, { fontFamily: 'QuicksandRegular' }]}>
            Ver ficha del cultivo
          </Text>
        </TouchableOpacity>

        {/* Actividades Section */}
        <View>
          <Text style={[cropScreenStyle.label2, { fontFamily: 'QuicksandBold' }]}>Actividades</Text>
          {activitiesDone.length === 0 ? (
            <Text style={[cropScreenStyle.activitiesDone, { fontFamily: 'QuicksandRegular' }]}>Ninguna</Text>
          ) : (
            activities
              .filter(activity => activitiesDone.some(a => a.name === activity.name))
              .map((activity, index, arr) => {
                const done = activitiesDone.find(a => a.name === activity.name);
                return (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    done={done}
                    isLast={index === arr.length - 1}
                  />
                );
              })
          )}
        </View>

        {/* Progreso del cultivo */}
        <View style={cropScreenStyle.progressContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[cropScreenStyle.progressText, { fontFamily: 'QuicksandBold' }]}>Progreso del cultivo</Text>
            <Text style={[cropScreenStyle.progressText, { color: '#BC6C25' }]}>{progress}%</Text>
          </View>
          <View style={cropScreenStyle.progressBar}>
            <View style={[cropScreenStyle.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Agregar actividad Button */}
        <TouchableOpacity
          onPress={() => {
            if (progress < 100) setModalVisible(true);
          }}
          disabled={progress === 100}
        >
          <LinearGradient
            colors={progress === 100 
              ? ['#ccc', '#ccc'] 
              : ['rgba(46, 125, 50, 1)', 'rgba(76, 175, 80, 0.7)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={cropScreenStyle.buttonSR}
          >
            <Text style={[cropScreenStyle.buttonText, { color: '#fff', fontFamily: 'CarterOne'}]}>
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
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '85%' }}>
                  <Text style={[cropScreenStyle.titleModal, { fontFamily: 'CarterOne' }]}> 
                    Selecciona una actividad
                  </Text>
                  <FlatList
                    data={activities}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                      const isDone = activitiesDone.some(a => a.name === item.name);
                      const prepDone = activitiesDone.some(a => a.name === 'Preparación del terreno');
                      const canSelect = !isDone && (item.id === '1' || prepDone);

                      return (
                        <Pressable
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 12,
                            borderBottomWidth: 0.5,
                            borderColor: '#ccc',
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
                          <Image source={item.icon} style={{ width: 28, height: 28, marginRight: 12 }} />
                          <Text style={{ fontSize: 16 }}>{item.name}</Text>
                          {isDone && (
                            <Text style={{ color: '#2E7D32', marginLeft: 8, fontSize: 13 }}>(Registrada)</Text>
                          )}
                        </Pressable>
                      );
                    }}
                  />
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 15, alignSelf: 'flex-end' }}>
                    <Text style={{ color: '#BC6C25', fontFamily: 'QuicksandBold' }}>Cancelar</Text>
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