import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: Dimensions.get("window").width < 375 ? 16 : 18,
    marginTop: Dimensions.get("window").width < 375 ? 12 : 16,
    fontWeight: "bold",
    color: "#333",
  },
  highlight: {
    color: "#3A8D2D", // Verde AGROX
  },
  subtitle: {
    marginTop: Dimensions.get("window").width < 375 ? 1 : 2,
    marginBottom: Dimensions.get("window").width < 375 ? 8 : 12,
    fontSize: Dimensions.get("window").width < 375 ? 12 : 14,
    color: "#555",
  },
});

export default styles;
