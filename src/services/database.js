import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Configuración de Firebase (reemplaza los valores por los de tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyD3wwqG59t1rs61EFnurUCckK7pFRXLYCs",
  authDomain: "agrox-8ec59.firebaseapp.com",
  projectId: "agrox-8ec59",
  storageBucket: "agrox-8ec59.firebasestorage.app",
  messagingSenderId: "158124756696",
  appId: "1:158124756696:web:15c7829366bd9e786291ad",
  measurementId: "G-LXVLGZ27E1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


// Inicializar Auth SIEMPRE con persistencia recomendada para React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export { auth };