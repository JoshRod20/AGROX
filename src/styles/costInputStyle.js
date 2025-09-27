// src/styles/costInputStyle.js
import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const costInputStyle = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: hp('2%'),
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    width: wp("77%"),
    borderBottomWidth: 2,
    borderColor: "#2E7D32",
    marginBottom: hp("0%"),
    marginLeft: wp("2%"),
    alignSelf: "center",
  },
  input: {
    height: hp("6%"),
    fontSize: wp("3.5%"),
    color: "#000", // ✅ TEXTO NEGRO PARA COSTOS
    fontFamily: "QuicksandRegular",
  },
  adornmentContainer: {
    marginLeft: wp('3%'),
    paddingBottom: hp('1%'),
  },
  adornmentText: {
    color: '#2E7D32',
    fontSize: wp('5%'),
    fontFamily: 'QuicksandBold',
  },
  errorInput: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: "#ff0000ff",
    fontSize: wp("3.5%"),
    marginBottom: hp("1%"),
    alignSelf: "center",
    fontFamily: "QuicksandRegular",
  },
});