import React, { useCallback} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cropStyle } from '../styles/cropStyle';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Evita que se oculte el SplashScreen automáticamente
SplashScreen.preventAutoHideAsync();

const Crop = () => {
    const route = useRoute();
  const navigation = useNavigation();

const cropTypes = [
  { label: 'Granos Básicos', value: 'Granos Básicos' },
  { label: 'Hortalizas', value: 'Hortalizas' },
  { label: 'Frutas', value: 'Frutas' },
  { label: 'Tubérculos', value: 'Tubérculos' },
];

 // Carga la fuente
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
    <SafeAreaView style={cropStyle.containerCrop} onLayout={onLayoutRootView}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginLeft: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginRight: 330 }}>
          <Icon name="arrow-back" size={22} color="#2E7D32" />
        </TouchableOpacity>
      </View>
      <Text style={[{ fontFamily: 'CarterOne', color: '#2E7D32' }, cropStyle.title]}>Seleccione el tipo de cultivo</Text>
      <View style={{ gap: 18, marginBottom: 24 }}>
        {cropTypes.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[cropStyle.buttonSR2, { backgroundColor: '#2E7D32', alignSelf: 'center', marginTop: 20 }]}
            onPress={() => navigation.navigate('FormCrop', { cropType: option.value })}
            activeOpacity={0.85}
          >
            <Text style={[cropStyle.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
export default Crop;