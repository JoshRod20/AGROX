import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { modalEditingProfileStyle } from "../../styles/myPorfileStyle/modalEditingProfileStyle";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import InputsFormFields from '../inputsFormFields';
import signUpStyle from "../../../src/styles/signUpStyle";

SplashScreen.preventAutoHideAsync();

const ModalEditingProfile = ({ visible, onClose }) => {
    const navigation = useNavigation();

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

        /* <Modal
              visible={visible}
              transparent={true}
              animationType="fade"
              onRequestClose={onClose}
          ></Modal>*/
        <SafeAreaView style={modalEditingProfileStyle.overlay}
            animationType="fade"
            transparent onLayout={onLayoutRootView}
        >

            <View style={modalEditingProfileStyle.container} >
                <Text style={modalEditingProfileStyle.title}>Editar perfil</Text>

                <View style={modalEditingProfileStyle.row}>

                    {/*Seccion 1*/}
                    <View style={modalEditingProfileStyle.margConten}>
                        <Text style={modalEditingProfileStyle.text} >Departamento</Text>
                        <View style={modalEditingProfileStyle.containerInput}>
                            <TextInput
                                placeholder="Eje: La Libertad"
                                style={modalEditingProfileStyle.TextInputSty}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={modalEditingProfileStyle.text} >Municipio</Text>
                        <View style={modalEditingProfileStyle.containerInput}>
                            <TextInput
                                placeholder="ej: Chontales"
                                style={modalEditingProfileStyle.TextInputSty}
                            />
                        </View>
                    </View>
                </View>

                {/*Seccion 2*/}
                <View style={modalEditingProfileStyle.row}>
                    <View style={modalEditingProfileStyle.margConten}>
                        <Text style={modalEditingProfileStyle.text} >Sexo</Text>
                        <View style={modalEditingProfileStyle.containerInput}>
                            <TextInput
                                placeholder="Eje: Hombre"
                                style={modalEditingProfileStyle.TextInputSty}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={modalEditingProfileStyle.text} >Tipo de cultivo</Text>
                        <View style={modalEditingProfileStyle.containerInput}>
                            <TextInput
                                placeholder="ej: Maíz, Arroz..."
                                style={modalEditingProfileStyle.TextInputSty}
                            />
                        </View>
                    </View>
                </View>

                {/*Seccion 3*/}
                <View style={modalEditingProfileStyle.row}>
                    <View style={modalEditingProfileStyle.margConten}>
                        <Text style={modalEditingProfileStyle.text} >Departamento</Text>
                        <View style={modalEditingProfileStyle.containerInput}>
                            <TextInput
                                placeholder="Eje: La Libertad"
                                style={modalEditingProfileStyle.TextInputSty}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={modalEditingProfileStyle.text} >Municipio</Text>
                        <View style={modalEditingProfileStyle.containerInput}>
                            <TextInput
                                placeholder="ej: Chontales"
                                style={modalEditingProfileStyle.TextInputSty}
                            />
                        </View>
                    </View>
                </View>

                {/*botones*/}
                <View style={modalEditingProfileStyle.containerB}>
                    <TouchableOpacity onPress={onClose} style={modalEditingProfileStyle.Button1}>
                        <Text style={modalEditingProfileStyle.textB}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={modalEditingProfileStyle.Button}>
                        <LinearGradient
                            colors={["rgba(46, 125, 50, 1)", "rgba(76, 175, 80, 0.7)"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={modalEditingProfileStyle.buttonSignIn}
                        >
                            <Text style={modalEditingProfileStyle.textB1}>Guardar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
export default ModalEditingProfile;

