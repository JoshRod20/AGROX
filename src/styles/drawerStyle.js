import { StyleSheet, Dimensions, Platform, PixelRatio  } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");

//const { width } = useWindowDimensions();
const isTablet = width >= 768;

const drawerWidth = isTablet ? wp("30%") : wp("62%");
const logoSize = isTablet ? PixelRatio.getPixelSizeForLayoutSize(30) : PixelRatio.getPixelSizeForLayoutSize(40);

export const drawerStyle = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#2E7D32", // verde principal
    marginTop: Platform.OS === "android" ? 0 : 0,
    borderTopRightRadius: width * 0.05, // proporcional al ancho
    borderBottomRightRadius: width * 0.05,
    overflow: "hidden",
    paddingTop: height * 0.02, // espacio superior proporcional
    //width: Math.min(wp("80%"), 500), // máximo 500px
    width: drawerWidth,
    //width: 420,
    //right: 170,
  },
  menuButton: {
    marginTop: height * 0.01,
    padding: width * 0.03,
    position: "absolute",
    top: height * 0.01,
    left: width * 0.02,
    zIndex: 1,
  },
  drawerScroll: {
    flex: 1,
    paddingTop: height * 0.03,
  },
  drawerItem: {
    marginVertical: height * 0.007,
    borderRadius: width * 0.03,
    paddingLeft: width * 0.03,
  },
  drawerLabel: {
    color: "#fff",
    //fontSize: width * 0.045, // tamaño relativo al ancho
    fontSize: isTablet ? width * 0.018 : width * 0.045,
    fontWeight: "600",
  },
  drawerIcon: {
    color: "#fff",
    fontSize: width * 0.06,
    marginRight: -width * 0.01,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  logo: {
    //width: width * 0.35, // proporcional al ancho de la pantalla
    //width: width * 0.25, // proporcional al ancho de la pantalla =
    width: isTablet ? width * 0.15 : width * 0.30,
    height: isTablet ? height * 0.03 : height * 0.04,
    resizeMode: "contain",
    marginTop: height * 0.005,
    marginLeft: width * 0.04,
    top: isTablet ? height * 0.01 : height * 0.00,
    left: isTablet ? height * 0.00 : height * 0.00,
  },
  logoutContainer: {
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.04,
  },
  logoutButton: {
    backgroundColor: "#ffffff",
  }
});
