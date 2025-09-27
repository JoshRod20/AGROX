import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  menuButton: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "3%", // Porcentaje para responsividad
    marginTop: "0.01%", // Porcentaje relativo al alto
    zIndex: 1,
  },
  logoContainer: {
    flex: 1, // Ocupa el espacio disponible
    alignItems: "center", // Centra el logo horizontalmente
  },
  logo: {
    width: width * 0.3, // 30% del ancho de la pantalla
    height: 40, // Altura fija, ajustable si es necesario
    resizeMode: "contain",
    //marginRight: width * 0.12,
  },
  notificationButton: {
    padding: 10,
    // Opcional: si quieres un badge (círculo rojo con número), lo puedes agregar después
  },
  notificationIcon: {
    width: 26,
    height: 28,
    //tintColor: "#96826bff",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: "5%", // Porcentaje para responsividad
  },
  welcomeContainer: {
    marginVertical: "2%", // Porcentaje relativo al alto
    width: "90%", // Ancho relativo
  },
  welcomeTitle: {
    fontSize: width * 0.05, // Escala el tamaño de fuente (5% del ancho, ajustable)
    fontWeight: "bold",
    color: "#333",
  },
  welcomeHighlight: {
    color: "#3A8D2D",
  },
  welcomeSubtitle: {
    marginTop: "1%", // Porcentaje relativo
    fontSize: width * 0.04, // Escala el tamaño de fuente (4% del ancho, ajustable)
    color: "#555",
  },
});

export default styles;
