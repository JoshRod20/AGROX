    import React, { useCallback } from "react";
    import { View, Text, TouchableOpacity, Image } from "react-native";
    import { useNavigation } from "@react-navigation/native";
    import { SafeAreaView } from "react-native-safe-area-context";
    import { inventoryMenuStyle } from "../../styles/inventoryStyles/inventoryMenuStyle";
    import { useFonts } from "expo-font";
    import * as SplashScreen from "expo-splash-screen";

    // Evita que se oculte el SplashScreen automáticamente
    SplashScreen.preventAutoHideAsync();

    const InventoryMenu = () => {
    const navigation = useNavigation();

    // Carga la fuente CarterOne (usada en moduleTitle)
    const [fontsLoaded] = useFonts({
        CarterOne: require("../../utils/fonts/CarterOne-Regular.ttf"),
        // Agrega otras fuentes si las usas en el futuro
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
        await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={inventoryMenuStyle.container} onLayout={onLayoutRootView}>
        {/* Encabezado con botón de retroceso */}
        <View>
            <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={inventoryMenuStyle.backButton}
            >
            <Image
                source={require("../../assets/arrow-left.png")}
                style={inventoryMenuStyle.backIcon}
            />
            </TouchableOpacity>
            <Text style={inventoryMenuStyle.moduleTitle}>Seleccione el módulo</Text>
        </View>

        {/* Contenedor de módulos */}
        <View style={inventoryMenuStyle.modulesContainer}>
            {/* Fila 1 */}
            <View style={inventoryMenuStyle.row}>
            <TouchableOpacity
                style={inventoryMenuStyle.moduleButton}
                onPress={() => navigation.navigate("Employees")}
                activeOpacity={0.85}
            >
                <View style={inventoryMenuStyle.iconContainer}>
                <Text style={inventoryMenuStyle.icon}>👥</Text>
                </View>
                <Text
                style={inventoryMenuStyle.moduleText}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                Empleados
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={inventoryMenuStyle.moduleButton}
                onPress={() => navigation.navigate("SeedsAndInputs")}
                activeOpacity={0.85}
            >
                <View style={inventoryMenuStyle.iconContainer}>
                <Text style={inventoryMenuStyle.icon}>🌾</Text>
                </View>
                <Text
                style={inventoryMenuStyle.moduleText}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                Semillas e insumos
                </Text>
            </TouchableOpacity>
            </View>

            {/* Fila 2 */}
            <View style={inventoryMenuStyle.row}>
            <TouchableOpacity
                style={inventoryMenuStyle.moduleButton}
                onPress={() => navigation.navigate("Machinery")}
                activeOpacity={0.85}
            >
                <View style={inventoryMenuStyle.iconContainer}>
                <Text style={inventoryMenuStyle.icon}>🚜</Text>
                </View>
                <Text
                style={inventoryMenuStyle.moduleText}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                Maquinaria
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={inventoryMenuStyle.moduleButton}
                onPress={() => navigation.navigate("Transport")}
                activeOpacity={0.85}
            >
                <View style={inventoryMenuStyle.iconContainer}>
                <Text style={inventoryMenuStyle.icon}>🚚</Text>
                </View>
                <Text
                style={inventoryMenuStyle.moduleText}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                Transporte
                </Text>
            </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    );
    };

    export default InventoryMenu;