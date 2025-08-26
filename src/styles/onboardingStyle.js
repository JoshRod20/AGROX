import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const onboardingStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05,
  },
  slide: {
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.05,
  },
  image: {
  width: width * 0.8,      // mismo ancho fijo
  height: height * 0.4,    // mismo alto fijo
  resizeMode: "cover",     // mantiene proporción, recorta si es necesario
  marginBottom: height * 0.05,
  borderRadius: 30,
},

  overlay: {
    position: "absolute",
    top: "16%",
    alignSelf: "center",
    width: width * 0.6,
    height: height * 0.25,
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.5,
    height: height * 0.1,
  },
  text: {
    fontSize: width * 0.055,
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
    width: width * 0.025,
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
    fontSize: width * 0.045,
  },
});
