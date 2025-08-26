import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/login';
import NavigationDrawer from './src/navigation/navigationDrawer';
import SignUp from './src/screens/signUp';
import SignIn from './src/screens/signIn';
import SignUp2 from './src/screens/signUp2';
import Onboarding from './src/screens/onboardingScreen';
import FormCrop from './src/screens/formCrop';

const Stack = createStackNavigator();

export default function App() {
  // Altura aproximada de la Status Bar para Android
  const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? 30 : 0;

  return (
    <SafeAreaProvider>
      {/* StatusBar con íconos blancos */}
      <StatusBar style="light" translucent />

      {/* View para simular el fondo de la Status Bar en Android edge-to-edge */}
      {Platform.OS === 'android' && (
        <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: '#2E7D32' }} />
      )}

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen 
            name="SignUp" 
            component={SignUp} 
            options={{
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerTintColor: '#2E7D32',
              headerBackTitleVisible: false
            }} 
          />
          <Stack.Screen name="Drawer" component={NavigationDrawer} options={{ headerShown: false }} />
          <Stack.Screen 
            name="SignIn" 
            component={SignIn} 
            options={{
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerTintColor: '#2E7D32',
              headerBackTitleVisible: false
            }}
          />
          <Stack.Screen 
            name="SignUp2" 
            component={SignUp2} 
            options={{
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerTintColor: '#2E7D32',
              headerBackTitleVisible: false
            }} 
          />
             <Stack.Screen 
            name="FormCrop" 
            component={FormCrop} 
            options={{
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerTintColor: '#2E7D32',
              headerBackTitleVisible: false
            }} 
          />
          <Stack.Screen 
            name="Onboarding" 
            component={Onboarding} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
