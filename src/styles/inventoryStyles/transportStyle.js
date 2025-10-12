import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const transportStyle = StyleSheet.create({
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
});