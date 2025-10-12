import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { machineryStyle } from "../../styles/inventoryStyles/machineryStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import FormInputSearch from "../../components/inventoryComponent/formInputSearch";
import ButtonNew from "../../components/inventoryComponent/buttonNew";
import FormTable from "../../components/inventoryComponent/formTable";

SplashScreen.preventAutoHideAsync();

const Machinery = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

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
    <SafeAreaView style={machineryStyle.container} onLayout={onLayoutRootView}>
      <View>
        <Text style={machineryStyle.moduleTitle}>Maquinaria</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 }}>
        <FormInputSearch
          value={search}
          onChangeText={setSearch}
          onPressButton={() => {}}
          style={{ flex: 1 }}
        />
        <ButtonNew title="Nuevo" onPress={() => navigation.navigate('MachineryForm')} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <FormTable
          collectionPath="machinery"
          orderByField="createdAt"
          orderDirection="desc"
          emptyText="No hay maquinaria registrada"
          searchTerm={search}
          indexColumn={{ label: 'N°', start: 1, flex: 0.6 }}
          filterKeys={[ 'name', 'costType' ]}
          columns={[
            { key: 'name', label: 'Nombre', flex: 1.4 },
            { key: 'costType', label: 'Tipo costo', flex: 1 },
            { key: 'initialCost', label: 'Costo inicial', flex: 0.9, render: (i) => `C$ ${Number(i.initialCost || 0).toFixed(2)}` },
            { key: 'residualValue', label: 'Valor residual', flex: 0.9, render: (i) => `C$ ${Number(i.residualValue || 0).toFixed(2)}` },
            { key: 'usefulLifeYears', label: 'Vida útil (años)', flex: 0.9 },
            { key: 'estimatedHours', label: 'Horas est.', flex: 0.8 },
            { key: 'annualDepreciation', label: 'Deprec. anual', flex: 1, render: (i) => `C$ ${Number(i.annualDepreciation || 0).toFixed(2)}` },
            { key: 'hourlyDepreciation', label: 'Deprec./hora', flex: 1, render: (i) => `C$ ${Number(i.hourlyDepreciation || 0).toFixed(2)}` },
          ]}
          actions={{ edit: true, delete: true, flex: 0.9 }}
          onEdit={(item) => navigation.navigate('MachineryForm', { item })}
        />
      </View>
    </SafeAreaView>
  );
};

export default Machinery;
