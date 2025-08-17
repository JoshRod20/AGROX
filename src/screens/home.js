import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { homeStyle } from '../styles/homeStyle'; 

export default function Home() {
 const navigation = useNavigation();

  return (
    <SafeAreaView style={homeStyle.container}>
      <TouchableOpacity
        style={homeStyle.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>
      <View style={homeStyle.content}>
        <Text>Esta es la pantalla Home</Text>
      </View>
    </SafeAreaView>
  );
}