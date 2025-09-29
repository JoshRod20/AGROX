import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const signUp1Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: hp("2%"),
  },
  backButton: {
    marginLeft: wp("8%"),
    marginTop: hp("-5%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    marginTop: hp("3%"),
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: hp("5%"),
  },
  textInput: {
    width: "90%",
    fontSize: wp("4%"),
    color: "#BC6C25",
    marginTop: hp("2.5%"),
    marginBottom: hp("0%"),
    marginLeft: hp("3.9%"),
    alignSelf: "flex-start",
  },
  inputContainer: {
    width: wp("85%"),
    borderBottomWidth: 2,
    borderColor: "#2E7D32",
    marginBottom: hp("1%"),
    alignSelf: "center",
  },
  input: {
    height: hp("6%"),
    fontSize: wp("3.5%"),
    color: "#000",
    fontFamily: "QuicksandRegular",
  },
  button: {
    width: wp("80%"),
    height: hp("6%"),
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
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
    fontSize: wp("4%"),
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
  placeholder: {
    color: "#888",
    fontSize: wp("3.5%"),
  },
  dropDownContainer: {
    borderColor: "#2E7D32",
    borderWidth: 2,
    width: wp("85%"),
    backgroundColor: "#fff",
  },
});
