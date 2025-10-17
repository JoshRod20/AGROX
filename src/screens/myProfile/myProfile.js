import React, { useCallback, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { myPorfileStyle } from "../../styles/myPorfileStyle/myPorfileStyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import styles from "../../styles/homeStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import ModalEditingProfileStyle from "../../components/modalEditingProfile/modalEditingProfile";

SplashScreen.preventAutoHideAsync();


const MyProfile = () => {
    const navigation = useNavigation();
    const [imagenPerfil, setImagenPerfil] = useState(require("../../assets/sen.png"));
    const [modal, setModal] = useState(null);

    const seleccionarImagen = async () => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!resultado.canceled) {
            setImagenPerfil({ uri: resultado.assets[0].uri });
        }
    };


    const [fontsLoaded] = useFonts({
        CarterOne: require("../../utils/fonts/CarterOne-Regular.ttf"),
        QuicksandBold: require("../../utils/fonts/Quicksand-Bold.ttf"),
        QuicksandRegular: require("../../utils/fonts/Quicksand-Regular.ttf"),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded && !hasSplashScreenHidden.current) {
            hasSplashScreenHidden.current = true;
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (




        <SafeAreaView style={myPorfileStyle.container} onLayout={onLayoutRootView}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Inicio')}
                style={myPorfileStyle.backButton}
            >
                <Image
                    source={require('../../assets/arrow-left.png')}
                    style={myPorfileStyle.backIcon}
                />
            </TouchableOpacity>

            <Text style={myPorfileStyle.title}>Mi cuenta</Text>
            <View style={myPorfileStyle.userInfo}>
                <Image
                    //source={require("../../assets/sen.png")}
                    style={myPorfileStyle.profileImage}
                    source={imagenPerfil}
                />
                <TouchableOpacity style={myPorfileStyle.cameraIconContainer} onPress={seleccionarImagen}>
                    <Image
                        source={require("../../assets/camera.png")}
                        style={myPorfileStyle.cameraIcon}
                    />
                </TouchableOpacity>

                <Text style={myPorfileStyle.profileName}>Alejandro González{ }</Text>
                <Text style={myPorfileStyle.gmail} >alegonzalez203@gmail.com{ }</Text>
            </View>

            <View style={styles.section}>

                <View style={myPorfileStyle.row1}>
                    <Text style={myPorfileStyle.text}>Información personal</Text>
                    <TouchableOpacity
                        onPress={() => setModal('Modal')}
                    //onPress={() => setModalVisible(false)}
                    >
                        <Image source={require("../../assets/pencil.png")} style={myPorfileStyle.editIcon} />
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={myPorfileStyle.row1}>
                        <Text style={myPorfileStyle.tex}>Departamento: </Text>
                        <Text style={myPorfileStyle.texp}>Chontales</Text>
                    </View>

                    <View style={myPorfileStyle.row1}>
                        <Text style={myPorfileStyle.tex}>Municipio:</Text>
                        <Text style={myPorfileStyle.texp}>La Libertad</Text>
                    </View>

                    <View style={myPorfileStyle.row1}>
                        <Text style={myPorfileStyle.tex}>Sexo:</Text>
                        <Text style={myPorfileStyle.texp} >Masculino</Text>
                    </View>

                    <View style={myPorfileStyle.row1}>
                        <Text style={myPorfileStyle.tex}>Tipos de cultivo:</Text>
                        <Text style={myPorfileStyle.texp}>Maíz, Arroz, Frijoles...</Text>
                    </View>

                    <View style={myPorfileStyle.row1}>
                        <Text style={myPorfileStyle.tex}>Tamaño de la finca: </Text>
                        <Text style={myPorfileStyle.texp}>3 ha</Text>
                    </View>

                    <View style={myPorfileStyle.row1}>
                        <Text style={myPorfileStyle.tex}>Número de parcelas:</Text>
                        <Text style={myPorfileStyle.texp}>23</Text>
                    </View>

                </View>

            </View>

            {/*Seccion de mis cultivos*/}
            <View style={myPorfileStyle.section}>
                <View style={myPorfileStyle.line}></View>
                <Text style={myPorfileStyle.texts}>Mis cultivos</Text>

                <ScrollView contentContainerStyle={{ paddingBottom: 10 }} style={{ bottom: 0, height: 50 }}>
                    <TouchableOpacity style={myPorfileStyle.myCol}>
                        <Image
                            source={require("../../assets/granos basicos.webp")}
                            style={myPorfileStyle.imgra}
                        />
                        <View style={myPorfileStyle.texts1}>
                            <Text style={myPorfileStyle.textS1}>Frijoles rojos</Text>
                            <Text style={myPorfileStyle.textS2}>Granos Básicos</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/*Modal */}
            {modal === 'Modal' && (
                <ModalEditingProfileStyle
                    visible={true}
                    onClose={() => setModal(null)}
                //style={myPorfileStyle.modal}
                />
            )}
        </SafeAreaView>

    );
};
export default MyProfile;