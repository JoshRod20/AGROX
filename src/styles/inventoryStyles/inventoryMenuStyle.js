import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const inventoryMenuStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: wp("7%"),
    marginTop: hp("-0.5%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
  moduleTitle: {
    marginTop: hp("2%"),
    fontSize: wp("7%"),
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: hp("3%"),
    fontFamily: 'CarterOne',
  },
  modulesContainer: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("5%"),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp("6%"), // ← espacio vertical entre filas
  },
  moduleButton: {
    width: wp("42%"), // ← ajustado para dejar espacio horizontal
    height: hp("20%"),
    backgroundColor: '#2E7D32',
    borderRadius: wp("3%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("3%"),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconContainer: {
    marginBottom: hp("1.5%"),
  },
  icon: {
    fontSize: wp("12%"), // ← ahora responsivo como moduleTitle
    color: '#fff',
  },
  moduleText: {
    fontSize: wp("4.5%"), // ← ahora responsivo
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});