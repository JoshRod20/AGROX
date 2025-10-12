import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const transportFormStyle = StyleSheet.create({
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
    marginLeft: wp("0.5%"),
  },

    label: {
    width: "90%",
    fontSize: wp("4%"),
    color: "#BC6C25",
    marginTop: hp("2.5%"),
    marginBottom: hp("0%"),
    marginLeft: wp("3%"),
    alignSelf: "flex-start",
    fontFamily: "QuicksandBold",
  },

  inputContainer: {
    width: wp("85%"),
    borderBottomWidth: 2,
    borderColor: "#2E7D32",
    marginBottom: hp("2%"),
    marginLeft: wp("0%"),
    alignSelf: "center",
  },
  input: {
    height: hp("6%"),
    fontSize: wp("3.5%"),
    color: "#000", // ✅ TEXTO NEGRO PARA COSTOS
    fontFamily: "QuicksandRegular",
  },
});