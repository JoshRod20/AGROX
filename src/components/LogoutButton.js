import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../services/database";
import { signOut } from "firebase/auth";

export default function LogoutButton() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert("Error al cerrar sesión");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Image source={require("../assets/exit 1.png")} />
      <Text style={styles.text}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    alignItems: "center",

    //sombra 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,          
    shadowRadius: 6,            
    elevation: 10,              
  },
  text: {
    marginLeft: 8,
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 16,
  },
});
