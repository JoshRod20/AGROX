import React, { useState, useCallback} from 'react';
import { View, Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import FormInputSearch from '../../components/inventoryComponent/formInputSearch';
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import ButtonNew from '../../components/inventoryComponent/buttonNew';
import FormTable from '../../components/inventoryComponent/formTable';
import {transportStyle} from '../../styles/inventoryStyles/transportStyle';
import { seedsAndInputsStyle } from '../../styles/inventoryStyles/seedsAndInputsStyle';

SplashScreen.preventAutoHideAsync();

const Transport = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  
  const [fontsLoaded] = useFonts({
    CarterOne: require("../../utils/fonts/CarterOne-Regular.ttf"),
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
    <SafeAreaView style={transportStyle.container} onLayout={onLayoutRootView}>
      <View>
        <Text style={transportStyle.moduleTitle}>Transporte</Text>
      </View>

       <View style={{ position: 'relative' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 }}>
          <FormInputSearch
            value={search}
            onChangeText={setSearch}
            onPressButton={() => { }}
            style={{ flex: 1 }}
          />
        </View>
        <ButtonNew title="Nuevo" onPress={() => navigation.navigate('TransportForm')} style={seedsAndInputsStyle.button} />
      </View>

<View style={{ paddingHorizontal: 16 }}>
      <FormTable
        collectionPath="transport"
        orderByField="createdAt"
        orderDirection="desc"
        emptyText="No hay transportes registrados"
        searchTerm={search}
        indexColumn={{ label: 'N°', start: 1, flex: 0.6 }}
        filterKeys={[ 'transportType', 'capacity' ]}
        columns={[
          { key: 'transportType', label: 'Tipo', flex: 1.2 },
          { key: 'capacity', label: 'Capacidad', flex: 1 },
          { key: 'costPerTrip', label: 'Costo/Viaje', flex: 1, render: (i) => `C$ ${Number(i.costPerTrip || 0).toFixed(2)}` },
          { key: 'createdAt', label: 'Fecha', flex: 1, render: (i) => {
              try {
                if (!i.createdAt) return '';
                const date = i.createdAt?.toDate ? i.createdAt.toDate() : new Date(i.createdAt);
                return date.toLocaleDateString('es-NI');
              } catch { return ''; }
            }
          },
        ]}
        actions={{ edit: true, delete: true, flex: 0.9 }}
        onEdit={(item) => navigation.navigate('TransportForm', { item })}
      />
      </View>
    </SafeAreaView>
  );
};

export default Transport;