import React, { useCallback, useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Modal, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cropStyle } from '../styles/cropStyle';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { getCropActivities } from '../services/activitiesService';

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

const CropScreen = () => {
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
    <SafeAreaView style={cropStyle.container2} onLayout={onLayoutRootView}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <Text style={[cropStyle.title, { fontFamily: 'CarterOne', color: '#2E7D32', marginLeft: 10 }]}>
            {crop?.cropName || 'Maíz'}
          </Text>
        </View>

        {/* Crop Image */}
        <View style={cropStyle.imageContainer}>
          {docImageBase64 ? (
            <Image
              source={{ uri: 'data:image/jpeg;base64,' + docImageBase64 }}
              style={cropStyle.cropImage}
              resizeMode="cover"
            />
          ) : (
       <View style={{ width: 220, height: 180, borderRadius: 8, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#bbb' }}>
              <Text style={{ color: '#888', fontSize: 16 }}>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* Ver ficha del cultivo Button */}
        <TouchableOpacity style={[cropStyle.buttonSR, { backgroundColor: '#BC6C25' }]}>
          <Text style={[cropStyle.buttonText, { fontFamily: 'QuicksandBold', fontSize: 16 }]}>Ver ficha del cultivo</Text>
        </TouchableOpacity>

        {/* Actividades Section */}
        <View>
          <Text style={[cropStyle.label2, { fontFamily: 'QuicksandBold' }]}>Actividades</Text>
          {activitiesDone.length === 0 ? (
            <Text style={{ fontFamily: 'QuicksandRegular', color: '#666', marginLeft: 10 }}>Ninguna</Text>
          ) : (
            activities
              .filter(activity => activitiesDone.some(a => a.name === activity.name))
              .map(activity => {
                const done = activitiesDone.find(a => a.name === activity.name);
                return (
                  <View key={activity.id} style={cropStyle.activityItem}>
                    <Image source={activity.icon} style={{ width: 20, height: 20 }} />
                    <Text style={cropStyle.activityText}>
                      {activity.name}
                      {done && done.date ? ` - ${done.date}` : ''}
                    </Text>
                  </View>
                );
              })
          )}
        </View>

        {/* Progreso del cultivo */}
        <View style={cropStyle.progressContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[cropStyle.progressText, { fontFamily: 'QuicksandBold' }]}>Progreso del cultivo</Text>
            <Text style={[cropStyle.progressText, { color: '#BC6C25' }]}>{progress}%</Text>
          </View>
          <View style={cropStyle.progressBar}>
            <View style={[cropStyle.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Agregar actividad Button */}
        <TouchableOpacity
          style={[cropStyle.buttonSR, { backgroundColor: progress === 100 ? '#ccc' : '#2E7D32' }]}
          onPress={() => {
            if (progress < 100) setModalVisible(true);
          }}
          disabled={progress === 100}
        >
          <Text style={[cropStyle.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>Agregar actividad</Text>
        </TouchableOpacity>

        {/* Modal de selección de actividad */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '85%' }}>
              <Text style={{ fontFamily: 'QuicksandBold', fontSize: 18, marginBottom: 10 }}>Selecciona una actividad</Text>
              <FlatList
                data={activities}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  // Si la actividad ya está registrada, deshabilitarla
                  const isDone = activitiesDone.some(a => a.name === item.name);
                  // Si no existe la actividad 1, solo permitir seleccionar la 1
                  const prepDone = activitiesDone.some(a => a.name === 'Preparación del terreno');
                  const canSelect = !isDone && (item.id === '1' || prepDone);
                  return (
                    <Pressable
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#ccc', opacity: canSelect ? 1 : 0.4 }}
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
                      {isDone && <Text style={{ color: '#2E7D32', marginLeft: 8, fontSize: 13 }}>(Registrada)</Text>}
                    </Pressable>
                  );
                }}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 15, alignSelf: 'flex-end' }}>
                <Text style={{ color: '#BC6C25', fontFamily: 'QuicksandBold' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CropScreen;