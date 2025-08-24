import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/login';
import NavigationDrawer from './src/navigation/navigationDrawer';
import SignUp from './src/screens/signUp';
import SignIn from './src/screens/signIn';
import SignUp2 from './src/screens/signUp2';
import Onboarding from './src/screens/onboardingScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen 
            name="SignUp" 
            component={SignUp} 
            options={{
              headerShown: true,           // Necesario para que aparezca la flecha
              headerTitle: '',             // Oculta el título
              headerTransparent: true,     // Fondo transparente
              headerTintColor: '#2E7D32', // Color de la flecha
              headerBackTitleVisible: false }} />
          <Stack.Screen name="Drawer" component={NavigationDrawer} options={{ headerShown: false }} />
          <Stack.Screen 
            name="SignIn" 
            component={SignIn} 
            options={{
              headerShown: true,           // Necesario para que aparezca la flecha
              headerTitle: '',             // Oculta el título
              headerTransparent: true,     // Fondo transparente
              headerTintColor: '#2E7D32', // Color de la flecha
              headerBackTitleVisible: false // Oculta texto al lado de la flecha
            }}
          />
          <Stack.Screen 
            name="SignUp2" 
            component={SignUp2} 
            options={{ headerShown: true,
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
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}