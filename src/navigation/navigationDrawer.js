import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/home';
import Crop from '../screens/crop';

const Drawer = createDrawerNavigator();

export default function NavigationDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Inicio">
      <Drawer.Screen name="Inicio" component={Home} options={{ headerShown: false }} />
      <Drawer.Screen name="Nuevo cultivo" component={Crop} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}