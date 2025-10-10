import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Image, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import menuBurger2 from "../assets/menu-burger-2.png";
import Home from "../screens/home";
import Crop from "../screens/crop";
import LogoutButton from "../components/LogoutButton";
import { drawerStyle } from "../styles/drawerStyle";
import InventoryMenu from "../screens/inventory/inventoryMenu";

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
          {/* Botón menú para cerrar el drawer */}
          <TouchableOpacity
            style={drawerStyle.menuButton}
            onPress={() => props.navigation.closeDrawer()}
          >
            <Image
              source={menuBurger2}
              style={{ width: 30, height: 30, resizeMode: "contain" }}
            />
          </TouchableOpacity>

          {/* Logo arriba del drawer */}
          <View style={drawerStyle.logoContainer}>
            <Image
              source={require("../assets/AGROX-Blanco.png")}
              style={drawerStyle.logo}
            />
          </View>

          {/* Items del Drawer */}
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={drawerStyle.drawerScroll}
          >
            <DrawerItemList {...props} />
          </DrawerContentScrollView>

          {/* Botón cerrar sesión */}
          <View style={drawerStyle.logoutContainer}>
            <LogoutButton />
          </View>
        </View>
      )}
    >
      <Drawer.Screen
        name="Inicio"
        component={Home}
        options={{
          drawerIcon: () => (
            <Image
              source={require("../assets/home.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Inventario"
        component={InventoryMenu}
        options={{
          drawerIcon: () => (
            <Image
              source={require("../assets/plus.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Nuevo cultivo"
        component={Crop}
        options={{
          drawerIcon: () => (
            <Image
              source={require("../assets/plus.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
