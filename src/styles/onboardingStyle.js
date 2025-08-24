import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const onboardingStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05, // márgenes laterales proporcionales
  },
  slide: {
    width: width * 0.90, // 85% del ancho de la pantalla
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.05, // padding proporcional
  },
  image: {
    width: width * 0.8, // 80% del ancho
    height: height * 0.35, // 35% de la altura
    resizeMode: "contain",
    marginBottom: height * 0.05,
    borderRadius: 30,
  },
  text: {
    fontSize: width * 0.055, // tamaño de letra escalable
    color: "#fff",
    textAlign: "center",
    marginBottom: height * 0.001,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.12,
  },
  indicator: {
    width: width * 0.025, // puntos proporcionales
    height: width * 0.025,
    borderRadius: (width * 0.025) / 2,
    marginHorizontal: width * 0.01,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: height * 0.05,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.07,
    marginHorizontal: width * 0.02,
    borderRadius: 8,
  },
  buttonText: {
    color: "#2E7D32",
    fontSize: width * 0.045, // escalable
  },
});
