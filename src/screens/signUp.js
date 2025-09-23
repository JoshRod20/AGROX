import React, { useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { signUp1Style as signUpStyle } from "../styles/signUp1Style";
import { db, auth } from "../services/database";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

SplashScreen.preventAutoHideAsync();

const SignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [gender, setGender] = useState(null);
  const [productionType, setProductionType] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [plotsNumber, setPlotsNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [openGender, setOpenGender] = useState(false);

  // Animation refs for shake effect
  const shakeAnimEmail = useRef(new Animated.Value(0)).current;
  const shakeAnimGender = useRef(new Animated.Value(0)).current;
  const shakeAnimProductionType = useRef(new Animated.Value(0)).current;
  const shakeAnimFarmSize = useRef(new Animated.Value(0)).current;
  const shakeAnimPlotsNumber = useRef(new Animated.Value(0)).current;

  // ScrollView ref for scrolling to errors
  const scrollViewRef = useRef(null);

  // Refs for field positions
  const emailRef = useRef(null);
  const genderRef = useRef(null);
  const productionTypeRef = useRef(null);
  const farmSizeRef = useRef(null);
  const plotsNumberRef = useRef(null);

  const genderOptions = ["Masculino", "Femenino", "Otro"].map((g) => ({
    label: g,
    value: g,
  }));
  const prevData = route.params || {};

  // Shake animation function
  const triggerShake = (anim) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRegister = async () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "El correo electrónico es obligatorio.";
      triggerShake(shakeAnimEmail);
    }
    if (!gender) {
      newErrors.gender = "El sexo es obligatorio.";
      triggerShake(shakeAnimGender);
    }
    if (!productionType) {
      newErrors.productionType =
        "El tipo de cultivos o producción es obligatorio.";
      triggerShake(shakeAnimProductionType);
    }
    if (!farmSize) {
      newErrors.farmSize = "El tamaño de la finca es obligatorio.";
      triggerShake(shakeAnimFarmSize);
    }
    if (!plotsNumber) {
      newErrors.plotsNumber = "El número de parcelas es obligatorio.";
      triggerShake(shakeAnimPlotsNumber);
    }
    if (!prevData.name) newErrors.name = "El nombre es obligatorio.";
    if (!prevData.password)
      newErrors.password = "La contraseña es obligatoria.";
    if (!prevData.department)
      newErrors.department = "El departamento es obligatorio.";
    if (!prevData.municipality)
      newErrors.municipality = "El municipio es obligatorio.";
    if (!prevData.community)
      newErrors.community = "La comunidad es obligatoria.";
    if (!prevData.userId) newErrors.userId = "Error interno de ID de usuario.";

    setErrors(newErrors);

    // Scroll to the first error
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldRefs = {
        email: emailRef,
        gender: genderRef,
        productionType: productionTypeRef,
        farmSize: farmSizeRef,
        plotsNumber: plotsNumberRef,
      };
      const targetRef = fieldRefs[firstErrorField];
      if (targetRef && targetRef.current) {
        targetRef.current.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current.scrollTo({ y, animated: true });
          },
          () => console.log("Error measuring layout")
        );
      }
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, prevData.password);
      const { password, ...restPrevData } = prevData;
      const user = {
        userId: prevData.userId,
        ...restPrevData,
        email,
        gender,
        productionType,
        farmSize,
        plotsNumber,
        registrationDate: new Date().toISOString(),
      };
      await addDoc(collection(db, "Users"), user);

      await AsyncStorage.setItem("isNewUser", "true");

      setEmail("");
      setGender(null);
      setProductionType("");
      setFarmSize("");
      setPlotsNumber("");
      setErrors({});
      navigation.replace("Onboarding");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setErrors((prev) => ({
          ...prev,
          email: "El correo electrónico ya está en uso.",
        }));
        triggerShake(shakeAnimEmail);
      } else {
        Alert.alert("Error", e.message || "Error al registrar usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  const [fontsLoaded] = useFonts({
    CarterOne: require("../utils/fonts/CarterOne-Regular.ttf"),
    QuicksandBold: require("../utils/fonts/Quicksand-Bold.ttf"),
    QuicksandRegular: require("../utils/fonts/Quicksand-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={signUpStyle.container} onLayout={onLayoutRootView}>
      <ScrollView
        ref={scrollViewRef}
        style={signUpStyle.scrollContainer}
        contentContainerStyle={signUpStyle.scrollContent}
        scrollEnabled={Object.keys(errors).length > 0}
        showsVerticalScrollIndicator={false}
      >
        {/* Correo electrónico */}
        <Text style={[{ fontFamily: "QuicksandBold" }, signUpStyle.textInput]}>
          Correo electrónico
        </Text>
        <Animated.View
          ref={emailRef}
          style={[
            signUpStyle.inputContainer,
            errors.email && signUpStyle.errorInput,
            { transform: [{ translateX: shakeAnimEmail }] },
          ]}
        >
          <TextInput
            style={signUpStyle.input}
            placeholder="Ingrese su correo electrónico"
            placeholderTextColor="#888"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            secureTextEntry={!showEmail}
          />
        </Animated.View>
        {errors.email && (
          <Text style={signUpStyle.errorText}>{errors.email}</Text>
        )}

        {/* Sexo */}
        <Text style={[{ fontFamily: "QuicksandBold" }, signUpStyle.textInput]}>
          Sexo
        </Text>
        <Animated.View
          ref={genderRef}
          style={[
            signUpStyle.inputContainer,
            errors.gender && signUpStyle.errorInput,
            {
              transform: [{ translateX: shakeAnimGender }],
              zIndex: openGender ? 3000 : 1000,
            },
          ]}
        >
          <DropDownPicker
            open={openGender}
            value={gender}
            items={genderOptions}
            setOpen={setOpenGender}
            setValue={setGender}
            placeholder="Seleccione su sexo"
            placeholderStyle={[
              { fontFamily: "QuicksandRegular" },
              signUpStyle.placeholder,
            ]}
            style={[
              signUpStyle.input,
              { borderWidth: 0, backgroundColor: "#fff" },
            ]}
            textStyle={{ fontFamily: "QuicksandRegular", fontSize: wp("3.5%") }}
            dropDownContainerStyle={[
              signUpStyle.dropDownContainer,
              errors.gender && signUpStyle.errorInput,
            ]}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
              maxHeight: hp("30%"),
            }}
            zIndex={openGender ? 4000 : 1000}
            zIndexInverse={openGender ? 1000 : 4000}
          />
        </Animated.View>
        {errors.gender && (
          <Text style={signUpStyle.errorText}>{errors.gender}</Text>
        )}

        {/* Tipo de cultivos o producción */}
        <Text style={[{ fontFamily: "QuicksandBold" }, signUpStyle.textInput]}>
          Tipo de cultivos o producción
        </Text>
        <Animated.View
          ref={productionTypeRef}
          style={[
            signUpStyle.inputContainer,
            errors.productionType && signUpStyle.errorInput,
            { transform: [{ translateX: shakeAnimProductionType }] },
          ]}
        >
          <TextInput
            style={signUpStyle.input}
            placeholder="Ej: maíz, café, ganado, etc."
            placeholderTextColor="#888"
            placeholderStyle={[
              { fontFamily: "QuicksandRegular" },
              signUpStyle.placeholder,
            ]}
            value={productionType}
            onChangeText={(text) => {
              setProductionType(text);
              setErrors((prev) => ({ ...prev, productionType: undefined }));
            }}
          />
        </Animated.View>
        {errors.productionType && (
          <Text style={signUpStyle.errorText}>{errors.productionType}</Text>
        )}

        {/* Tamaño de la finca */}
        <Text style={[{ fontFamily: "QuicksandBold" }, signUpStyle.textInput]}>
          Tamaño de la finca (mz/ha)
        </Text>
        <Animated.View
          ref={farmSizeRef}
          style={[
            signUpStyle.inputContainer,
            errors.farmSize && signUpStyle.errorInput,
            { transform: [{ translateX: shakeAnimFarmSize }] },
          ]}
        >
          <TextInput
            style={signUpStyle.input}
            placeholder="Ej: 5 mz o 3 ha"
            placeholderTextColor="#888"
            value={farmSize}
            onChangeText={(text) => {
              setFarmSize(text);
              setErrors((prev) => ({ ...prev, farmSize: undefined }));
            }}
            keyboardType="numeric"
          />
        </Animated.View>
        {errors.farmSize && (
          <Text style={signUpStyle.errorText}>{errors.farmSize}</Text>
        )}

        {/* Número de parcelas */}
        <Text style={[{ fontFamily: "QuicksandBold" }, signUpStyle.textInput]}>
          Número de parcelas
        </Text>
        <Animated.View
          ref={plotsNumberRef}
          style={[
            signUpStyle.inputContainer,
            errors.plotsNumber && signUpStyle.errorInput,
            { transform: [{ translateX: shakeAnimPlotsNumber }] },
          ]}
        >
          <TextInput
            style={signUpStyle.input}
            placeholder="Ingrese el número de parcelas"
            placeholderTextColor="#888"
            value={plotsNumber}
            onChangeText={(text) => {
              setPlotsNumber(text);
              setErrors((prev) => ({ ...prev, plotsNumber: undefined }));
            }}
            keyboardType="numeric"
          />
        </Animated.View>
        {errors.plotsNumber && (
          <Text style={signUpStyle.errorText}>{errors.plotsNumber}</Text>
        )}

        {/* Botón */}
        <TouchableOpacity
          style={signUpStyle.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <LinearGradient
            colors={["rgba(46, 125, 50, 1)", "rgba(76, 175, 80, 0.7)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={signUpStyle.button}
          >
            <Text style={[{ fontFamily: "CarterOne" }, signUpStyle.buttonText]}>
              {loading ? "Registrando..." : "Registrarse"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={signUpStyle.signUpTextContainer}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text
            style={[{ fontFamily: "QuicksandRegular" }, signUpStyle.signUpText]}
          >
            ¿Ya tienes cuenta?{" "}
            <Text
              style={[{ fontFamily: "QuicksandBold" }, signUpStyle.signUpLink]}
            >
              Inicia sesión
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
