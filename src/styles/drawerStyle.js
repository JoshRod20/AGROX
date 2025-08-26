// src/styles/drawerStyle.js
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const drawerStyle = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#2E7D32", // verde principal
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  drawerScroll: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    marginVertical: 5,
    borderRadius: 12,
    paddingLeft: 10,
  },
  drawerLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  drawerIcon: {
    color: "#fff",
    fontSize: 22,
    marginRight: -10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  logoutContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
});
