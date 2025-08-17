import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { cropStyle } from '../styles/cropStyle';

export default function Crop() {
 const navigation = useNavigation();

  return (
    <SafeAreaView style={cropStyle.container}>
      <TouchableOpacity
        style={cropStyle.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>
      <View style={cropStyle.content}>
        <Text>Esta es la pantalla de cultivos</Text>
      </View>
    </SafeAreaView>
  );
}