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
    paddingVertical: wp("3%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: hp("0.5%") },
    shadowRadius: wp("1%"),
    elevation: 3,
  },

  // COLORES POR CLIMA
  clear: { backgroundColor: "#4A90E2" },
  clouds: { backgroundColor: "#7F8C8D" },
  rain: { backgroundColor: "#2C3E50" },
  snow: { backgroundColor: "#BDC3C7" },
  thunderstorm: { backgroundColor: "#34495E" },
  drizzle: { backgroundColor: "#3498DB" },
  mist: { backgroundColor: "#95A5A6" },
  fog: { backgroundColor: "#7F8C8D" },

  icon: {
    width: wp("20%"),
    height: wp("19%"),
    resizeMode: "contain",
    marginRight: wp("-1%"),
  },
  status: {
    fontSize: wp("6.5%"),
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
    fontSize: wp("13%"),
    color: "#fff",
    marginRight: wp("3%"),
  },
  range: {
    fontSize: wp("4.5%"),
    color: "#ffffffff",
    marginTop: hp("-2%"),
    marginRight: wp("4%"),
  },
});
