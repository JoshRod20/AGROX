import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '../screens/home';
import Crop from '../screens/crop';
import LogoutButton from '../components/LogoutButton';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();


export default function NavigationDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => (
        <View style={{ flex: 1, paddingBottom: 16 }}>
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
          <LogoutButton />
        </View>
      )}
    >
      <Drawer.Screen name="Inicio" component={Home} options={{ headerShown: false }} />
      <Drawer.Screen name="Nuevo cultivo" component={Crop} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}