import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: wp("90%"), // ← 90 % del ancho
    alignSelf: "center", // ← centrado
    marginTop: hp("1.2%"),
    marginBottom: hp("2%"),
  },
  sectionTitle: {
    fontSize: wp("4.3%"),
    fontWeight: "bold",
    color: "#A84300",
    marginRight: wp("2%"),
  },
  sectionLine: {
    flex: 1,
    height: hp("0.25%"),
    backgroundColor: "#A84300",
  },
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: wp("90%"), // ← 90 % del ancho
    alignSelf: "center", // ← centrado
    borderRadius: wp("8%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: wp("1%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: hp("0.5%") },
    shadowRadius: wp("1%"),
    elevation: 3,
  },

  icon: {
    width: wp("20%"),
    height: wp("19%"),
    resizeMode: "contain",
    marginRight: wp("-1%"),
  },
  status: {
    fontSize: wp("5"),
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  tempBlock: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  temperature: {
    width: wp("20%"),
    height: wp("19%"),
    fontSize: wp("12%"),
    color: "#fff",
    marginBottom: hp("0%"),
    marginRight: wp("3%"),
  },
  range: {
    fontSize: wp("4.5%"),
    color: "#ffffffff",
    marginTop: hp("-2%"),
    marginRight: wp("4%"),
    marginBottom: hp("1%"),
  },
  // ✨ Estilos para usuario nuevo: ícono que sobresale
  newUserIconContainer: {
    position: "absolute",
    top: -hp("3%"), // ← ícono sobresale hacia arriba
    left: wp("2%"), // ← margen desde la izquierda
    alignItems: "center",
    zIndex: 10,
  },
  newUserIcon: {
    width: wp("40%"),
    height: wp("38%"),
    resizeMode: "contain",
  },
  newUserStatus: {
    fontSize: wp("5%"),
    color: "#fff",
    textAlign: "center",
    marginTop: hp("1%"), // espacio debajo del ícono
    width: wp("40%"), // para centrar mejor el texto
  },
  newUserTempContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flex: 1,
    marginTop: hp("2%"), // compensar el espacio del ícono
  },
  newUserTemperature: {
    width: wp("40%"),
    height: wp("29%"),
    fontSize: wp("24%"),
    top: -hp("4%"),
    color: "#fff",
    marginRight: wp("1%"),
    marginBottom: hp("0.5%"),
  },
  newUserRange: {
    fontSize: wp("6%"),
    color: "#ffffff",
    textAlign: "right",
    top: -hp("4%"),
    marginRight: wp("8%"),
  },
});
