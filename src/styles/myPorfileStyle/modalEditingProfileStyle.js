import { StyleSheet, Dimensions, PixelRatio } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const { width, height } = Dimensions.get("window");
const scaleFont = (size) =>
    Math.round(PixelRatio.roundToNearestPixel(size * (width / 375)));
const isSmallDevice = width < 360; // Adjust threshold as needed for small devices
const isLargeDevice = width > 400; // Adjust threshold as needed for large devices
//const { width } = useWindowDimensions();
const isTablet = width >= 768;

const drawerWidth = isTablet ? wp("100%") : wp("100%");
//const logoSize = isTablet ? PixelRatio.getPixelSizeForLayoutSize(30) : PixelRatio.getPixelSizeForLayoutSize(40);

/*
QuicksandSemiBold
QuicksandRegular
QuicksandBold
CarterOne
*/
export const modalEditingProfileStyle = StyleSheet.create({
    overlay: {
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 16,
        bottom: "135%",
        width: drawerWidth,
        height: hp("140%"),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 16,
        backgroundColor: "#ffffffff",
        borderRadius: hp("2"),
        position: "absolute",
        top: isTablet ? height * 0.4 : height * 0.4,
        width: wp("90%"),
        height: isTablet ? height * 0.6 : height * 0.5,
        // width: width * 0.3, // 30% del ancho de la pantalla
    },
    title: {
        textAlign: "center",
        fontFamily: "CarterOne",
        fontSize: isTablet ? height * 0.04 : height * 0.03,
        color: "#2E7D32",
    },
    row: {
        flexDirection: "row",
        padding: wp("1%"),
        left: 5,
    },
    margConten: {
        marginRight: wp("1%"),
    },
    text: {
        color: "#BC6C25",
        left: hp("0.1%"),
        fontFamily: "QuicksandBold",
        fontSize: isTablet ? height * 0.02 : height * 0.02,
        marginBottom: wp("2%"),
        marginTop: wp("2%"),
    },
    containerInput: {
        borderColor: "#2E7D32",
        borderBottomWidth: 2,
        width: wp("40%"),
        height: hp("6%"),
        marginRight: 10,
    },
    TextInputSty: {
        left: wp("3%"),
        bottom: isTablet ? height * -0.03 : height * -0.02,
        fontFamily: "QuicksandRegular",
    },
    containerB: {
        flexDirection: "row",
        padding: 15,
        right: wp("1%"),
    },
    Button: {
        marginLeft: wp("2%"),
        width: wp("25%"),
        height: hp("5%"),
        alignItems: "center",
        borderRadius: hp("0.9%"),
    },
    Button1: {
        backgroundColor: "#9F9898",
        marginLeft: wp("2%"),
        width: wp("25%"),
        height: hp("5%"),
        alignItems: "center",
        borderRadius: hp("0.9%"),
    },
    textB: {
        fontFamily: "QuicksandBold",
        fontSize: 18,
        position: "absolute",
        top: hp("1%"),
        color: "#ffffff",
    },
      textB1: {
        fontFamily: "QuicksandBold",
        fontSize: 18,
        position: "absolute",
        top: hp("1%"),
        color: "#ffffff",
    },
    buttonSignIn: {
        width: wp("25%"),
        height: hp("5%"),
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("5%"),
        borderRadius: hp("0.9%"),
        alignItems: "center",
        justifyContent: "center",
        top: hp("0.1%"),
        bottom: 3,
    },
});