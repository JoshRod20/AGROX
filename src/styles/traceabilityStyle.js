// /src/styles/traceabilityStyle.js
import { StyleSheet, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? hp("2%") : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("0%"),
  },
  backButton: {
    marginLeft: wp("7%"),
    marginTop: hp("2%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
  title: {
    fontSize: wp("5.5%"),
    fontFamily: "CarterOne",
    color: "#2E7D32",
    textAlign: "center",
    flex: 1,
    marginTop: hp("-2%"),
    marginBottom: hp("3%"),
  },
  content: {
    padding: wp("4%"),
  },
  search: {
    marginBottom: hp("3%"),
  },
  loadingText: {
    textAlign: "center",
    fontSize: wp("4%"),
    color: "#666",
    marginTop: hp("5%"),
  },
  noDataText: {
    textAlign: "center",
    fontSize: wp("4%"),
    color: "#666",
    marginTop: hp("5%"),
  },
});