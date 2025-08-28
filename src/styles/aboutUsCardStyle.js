import { StyleSheet } from "react-native";

export default StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C0392B", // Rojo tierra
    marginLeft: 15,
    marginTop: 10, // 👈 cambiamos el 200 por un margen pequeño normal
  },
  separator: {
    height: 1,
    backgroundColor: "#C0392B",
    marginHorizontal: 15,
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20, // 👈 agregamos espacio entre AboutUs y lo siguiente
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  highlight: {
    fontWeight: "bold",
    color: "#2E7D32", // Verde AGROX
  },
});
