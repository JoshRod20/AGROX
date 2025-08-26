import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

import Home from "../screens/home";
import Crop from "../screens/crop";
import LogoutButton from "../components/LogoutButton";
import { drawerStyle } from "../styles/drawerStyle";

const Drawer = createDrawerNavigator();

export default function NavigationDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "transparent",
          width: 250,
        },
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#fff",
        drawerLabelStyle: drawerStyle.drawerLabel,
      }}
      drawerContent={(props) => (
        <View style={drawerStyle.drawerContainer}>
          <DrawerContentScrollView {...props} contentContainerStyle={drawerStyle.drawerScroll}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>

          {/* Botón cerrar sesión con tu componente */}
          <View style={drawerStyle.logoutContainer}>
            <LogoutButton />
          </View>
        </View>
      )}
    >
      <Drawer.Screen name="Inicio" component={Home} />
      <Drawer.Screen name="Nuevo cultivo" component={Crop} />
    </Drawer.Navigator>
  );
}
