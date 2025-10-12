import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { employeesStyle } from "../../styles/inventoryStyles/employeesStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import FormInputSearch from "../../components/inventoryComponent/formInputSearch";
import ButtonNew from "../../components/inventoryComponent/buttonNew";
import FormTable from "../../components/inventoryComponent/formTable";

SplashScreen.preventAutoHideAsync();

const Employees = () => {
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
    <SafeAreaView style={employeesStyle.container} onLayout={onLayoutRootView}>
      <View>
        <Text style={employeesStyle.moduleTitle}>Empleados</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 }}>
        <FormInputSearch
          value={search}
          onChangeText={setSearch}
          onPressButton={() => {}}
          style={{ flex: 1 }}
        />
        <ButtonNew title="Nuevo" onPress={() => navigation.navigate('EmployeesForm')} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <FormTable
          collectionPath="employees"
          orderByField="createdAt"
          orderDirection="desc"
          emptyText="No hay empleados registrados"
          searchTerm={search}
          indexColumn={{ label: 'N°', start: 1, flex: 0.6 }}
          filterKeys={[ 'fullName', 'role' ]}
          columns={[
            { key: 'fullName', label: 'Nombre', flex: 1.4 },
            { key: 'role', label: 'Rol', flex: 1 },
            { key: 'dailyCost', label: 'Jornada', flex: 0.8, render: (i) => `C$ ${Number(i.dailyCost || 0).toFixed(2)}` },
            { key: 'standardHours', label: 'Horas', flex: 0.8 },
            { key: 'hourlyCost', label: 'Costo/Hora', flex: 0.9, render: (i) => `C$ ${Number(i.hourlyCost || 0).toFixed(2)}` },
          ]}
          actions={{ edit: true, delete: true, flex: 0.9 }}
          onEdit={(item) => navigation.navigate('EmployeesForm', { item })}
        />
      </View>
    </SafeAreaView>
  );
};

export default Employees;