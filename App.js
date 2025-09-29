import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Platform, Image, TouchableOpacity} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/login';
import { loginStyle as loginStyles } from './src/styles/loginStyle';
import signUpStyle from './src/styles/signUpStyle';
import { cropStyle } from './src/styles/cropStyle';
import { cropScreenStyle } from './src/styles/cropScreenStyle';
import NavigationDrawer from './src/navigation/navigationDrawer';
import SignUp from './src/screens/signUp';
import SignIn from './src/screens/signIn';
import SignUp2 from './src/screens/signUp2';
import Onboarding from './src/screens/onboardingScreen';
import FormCrop from './src/screens/formCrop';
import CropScreen from './src/screens/cropScreen';
import CropPreparation from './src/screens/cropPreparation';
import CropSowing from './src/screens/cropSowing'
import CropFertilization from './src/screens/cropFertilization';
import CropIrrigation from './src/screens/cropIrrigation';
import CropPhytosanitary from './src/screens/cropPhytosanitary'
import CropMonitoring from './src/screens/cropMonitoring';
import CropHarvest from './src/screens/cropHarvest';
import CropPostharvest from './src/screens/cropPostharvest'
import CropDocumentation from './src/screens/cropDocumentation'

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
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={signUpStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={signUpStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="Drawer" component={NavigationDrawer} options={{ headerShown: false }} />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={loginStyles.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={loginStyles.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />


          <Stack.Screen 
            name="SignUp2" 
            component={SignUp2} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={signUpStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={signUpStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />

            <Stack.Screen 
            name="FormCrop" 
            component={FormCrop} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />

            <Stack.Screen 
            name="CropScreen" 
            component={CropScreen} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />

           <Stack.Screen 
            name="CropPreparation" 
            component={CropPreparation} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="CropSowing" 
            component={CropSowing} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="CropFertilization" 
            component={CropFertilization} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="CropIrrigation" 
            component={CropIrrigation} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="CropPhytosanitary" 
            component={CropPhytosanitary} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
             <Stack.Screen 
            name="CropMonitoring" 
            component={CropMonitoring} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          
          <Stack.Screen 
            name="CropHarvest" 
            component={CropHarvest} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="CropPostharvest" 
            component={CropPostharvest} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="CropDocumentation" 
            component={CropDocumentation} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={cropScreenStyle.backButton}
                >
                  <Image
                    source={require('./src/assets/arrow-left.png')}
                    style={cropScreenStyle.backIcon}
                  />
                </TouchableOpacity>
              ),
            })}
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
