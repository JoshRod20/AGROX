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
import MyCrops from "../screens/myCrops";

import { DrawerItem } from '@react-navigation/drawer';



const Drawer = createDrawerNavigator();

export default function NavigationDrawer() {
  const PlaceholderScreen = () => null; //eliminarlo una vez las pantallas esten listas

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
              source={require("../assets/agrop11.png")}
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

          {/* view de cerrar sesion, mi cuenta y acerca de */}
          <View style={drawerStyle.logoutContainer}>
            {/* Linea separadora */}
            <Image source={require("../assets/Line 6.png")} style={{ left: 8, position: "absolute", width: 230 }} />


            {/* Botones personalizados */}
            <DrawerItem
              label="Mi cuenta"
              labelStyle={drawerStyle.drawerLabel}
              icon={() => (
                <Image
                  source={require("../assets/circle-user.png")}
                  style={{ width: 24, height: 24, tintColor: "#fff" }}
                />
              )}
              onPress={() => props.navigation.navigate("Mi cuenta")}
            />
            <DrawerItem
              label="Acerca de"
              labelStyle={drawerStyle.drawerLabel}
              icon={() => (
                <Image
                  source={require("../assets/info.png")}
                  style={{ width: 24, height: 24, tintColor: "#fff" }}
                />
              )}
              onPress={() => props.navigation.navigate("Acerca de")}
            />

            {/* Botón cerrar sesión */}
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
              source={require("../assets/inventory-alt.png")}
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
      <Drawer.Screen
        name="Mis cultivos"
        component={MyCrops} // Reemplazar con la pantalla correspondiente
        options={{
          drawerIcon: () => (
            <Image
              source={require("../assets/seedling.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Trazabilidad"
        component={PlaceholderScreen} // Reemplazar con la pantalla correspondiente
        options={{
          drawerIcon: () => (
            <Image
              source={require("../assets/qr.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Panel económico"
        component={PlaceholderScreen} // Reemplazar con la pantalla correspondiente
        options={{
          drawerIcon: () => (
            <Image
              source={require("../assets/stats 1.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Mi cuenta"
        component={PlaceholderScreen} // Reemplazar con la pantalla correspondiente
        options={{
          drawerItemStyle: { height: 0 }, // Oculta el item del drawer
          drawerIcon: () => (
            <Image
              source={require("../assets/circle-user.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Acerca de "
        component={PlaceholderScreen} // Reemplazar con la pantalla correspondiente
        options={{
          drawerItemStyle: { height: 0 }, // Oculta el item del drawer
          drawerIcon: () => (
            <Image
              source={require("../assets/info.png")}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
