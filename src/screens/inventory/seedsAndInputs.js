import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import FormInputSearch from '../../components/inventoryComponent/formInputSearch';
import ButtonNew from '../../components/inventoryComponent/buttonNew';
import FormTable from '../../components/inventoryComponent/formTable';
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {seedsAndInputsStyle} from '../../styles/inventoryStyles/seedsAndInputsStyle';

SplashScreen.preventAutoHideAsync();

const SeedsAndInputs = () => {
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
     <SafeAreaView style={seedsAndInputsStyle.container} onLayout={onLayoutRootView}>
      <View>
        <Text style={seedsAndInputsStyle.moduleTitle}>Insumos y Entradas</Text>
      </View>
     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 }}>
        <FormInputSearch
          value={search}
          onChangeText={setSearch}
          onPressButton={() => { /* más adelante podremos disparar búsqueda server-side */ }}
          style={{ flex: 1 }}
        />
        <ButtonNew title="Nuevo" onPress={() => navigation.navigate('SeedsAndInputsForm')} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
      <FormTable
        collectionPath="seedsAndInputs"
        orderByField="createdAt"
        orderDirection="desc"
        emptyText="No hay insumos registrados"
        searchTerm={search}
        filterKeys={[ 'inputName', 'category', 'unit', 'supplier' ]}
        indexColumn={{ label: 'N°', start: 1, flex: 0.6 }}
        columns={[
          { key: 'inputName', label: 'Insumo', flex: 1.4 },
          { key: 'category', label: 'Categoría', flex: 1 },
          { key: 'unit', label: 'Unidad', flex: 0.8 },
          { key: 'unitPrice', label: 'Precio', flex: 0.8, render: (i) => `C$ ${Number(i.unitPrice || 0).toFixed(2)}` },
          { key: 'stock', label: 'Stock', flex: 0.7 },
          { key: 'purchaseDate', label: 'Fecha', flex: 1, render: (i) => {
              try {
                if (!i.purchaseDate) return '';
                const [y,m,d] = String(i.purchaseDate).split('-').map(Number);
                const date = new Date(y, (m||1)-1, d||1);
                return date.toLocaleDateString('es-NI');
              } catch { return String(i.purchaseDate); }
            } 
          },
        ]}
        actions={{ edit: true, delete: true, flex: 0.9 }}
        onEdit={(item) => navigation.navigate('SeedsAndInputsForm', { item })}
      />
      </View>
    </SafeAreaView>
  );
};

export default SeedsAndInputs;