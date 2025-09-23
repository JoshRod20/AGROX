import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("5%"), // Margen lateral del 5% del ancho de la pantalla
  },
  logo: {
    width: wp("90%"), // 80% del ancho de la pantalla para el logo
    height: hp("35%"), // 30% de la altura de la pantalla
    alignSelf: "center",
    marginTop: hp("15%"),
    marginBottom: hp("8%"), // Margen inferior relativo
  },
  buttonLogin: {
    width: wp("80%"), // 80% del ancho de la pantalla
    height: hp("6%"), // Altura relativa
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("2.5%"), // Border radius relativo.
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("5%"),
  },
  buttonSignUp: {
    width: wp("80%"),
    height: hp("6%"),
    marginTop: hp("0%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.7%"), // Tamaño de fuente relativo
    textAlign: "center",
  },
  buttonTextSignUp: {
    color: "#000000ff", // Cambiado a negro para mejor contraste con el fondo blanco
    fontSize: wp("4.3%"),
    textAlign: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: hp("2%"),
  },
  backButton: {
    marginLeft: wp("5%"),
    marginTop: hp("-5%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
  logoSignIn: {
    width: wp("70%"),
    height: hp("20%"),
    alignSelf: "center",
    marginBottom: hp("5%"),
  },
  logtext: {
    fontSize: wp("7.7%"),
    color: "#2E7D32",
    marginBottom: hp("1%"),
    textAlign: "left",
    marginLeft: hp("3.3%"),
    alignSelf: "flex-start",
  },
  sesionText: {
    fontSize: wp("4%"),
    color: "#000000ff",
    marginBottom: hp("0%"),
    textAlign: "left",
    marginLeft: hp("3.5%"),
    alignSelf: "flex-start",
  },
  agroxText: {
    color: "#000000ff",
    fontWeight: "bold",
    fontSize: wp("4.2%"),
  },
  textEmail: {
    width: "90%",
    fontSize: wp("4%"),
    color: "#BC6C25",
    marginTop: hp("5%"),
    marginBottom: hp("0.5%"),
    marginLeft: hp("3%"),
  },
  textPassword: {
    width: "90%",
    fontSize: wp("4%"),
    color: "#BC6C25",
    marginTop: hp("2%"),
    marginBottom: hp("0.5%"),
    marginLeft: hp("3%"),
  },
  inputEmailContainer: {
    width: wp("85%"),
    borderBottomWidth: 2,
    borderColor: "#2E7D32",
    marginBottom: hp("1.5%"),
  },
  inputEmail: {
    height: hp("6%"),
    fontSize: wp("3.5%"),
    color: "#000",
    fontFamily: "QuicksandRegular",
  },
  inputPasswordContainer: {
    width: wp("85%"),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#2E7D32",
    marginBottom: hp("1.5%"),
  },
  inputPassword: {
    flex: 1,
    height: hp("6%"),
    fontSize: wp("3.5%"),
    color: "#000",
    fontFamily: "QuicksandRegular",
  },
  buttonSignIn: {
    width: wp("80%"),
    height: hp("5.6%"),
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("5%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    textAlign: "center",
  },
  signUpTextContainer: {
    marginTop: hp("1%"),
    alignItems: "center",
    justifyContent: "center",
  },
  signUpText: {
    color: "#00000095",
    fontSize: wp("4%"),
    textAlign: "center",
  },
  signUpLink: {
    color: "#000000ff",
    fontWeight: "bold",
    fontSize: wp("4%"),
    marginBottom: hp("2%"),
  },
  errorInput: {
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: wp("3.5%"),
    marginBottom: hp("1%"),
    alignSelf: "center",
  },
});
