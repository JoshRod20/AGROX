import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const seedsAndInputsStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: wp("7%"),
    marginTop: hp("-5%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
  moduleTitle: {
    marginTop: hp("4%"),
    fontSize: wp("7%"),
    color: '#2E7D32',
    marginBottom: hp("3%"),
    fontFamily: 'CarterOne',
    marginLeft: wp("7%"),
  },
  // Etiqueta de campo (como "Nombre del insumo")
  formLabel: {
    width: "90%",
    fontSize: wp("4%"),
    color: "#BC6C25",
    marginTop: hp("2.5%"),
    marginBottom: hp("0.5%"),
    marginLeft: wp("2%"),
    alignSelf: "flex-start",
    fontFamily: "QuicksandBold",
  },

  // Contenedor del input de fecha (con ícono)
  dateInputContainer: {
    width: wp("85%"),
    borderBottomWidth: 2,
    borderColor: "#2E7D32",
    marginTop: hp("1%"),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  // Texto dentro del input de fecha
  dateInputText: {
    fontSize: wp("4%"),
    color: "#BC6C25",
    flex: 1,
    paddingVertical: 0,
    marginBottom: hp("1.5%"),
  },

  labelDate: {
    width: "90%",
    fontSize: wp("4%"),
    color: "#BC6C25",
    marginTop: hp("2.5%"),
    marginBottom: hp("0%"),
    marginLeft: wp("3%"),
    alignSelf: "flex-start",
    fontFamily: "QuicksandBold",
  },

  // Ícono de calendario
  dateIcon: {
    fontSize: wp("6%"),
    color: "#BC6C25",
    marginBottom: hp("1.5%"),
  },

  // Mensaje de error
  errorText: {
    color: "#ff0000",
    fontSize: wp("3.5%"),
    marginTop: hp("0.5%"),
    marginLeft: wp("7%"),
    fontFamily: "QuicksandRegular",
  },
  errorInput: {
    borderColor: "#ff0000",
  },
});