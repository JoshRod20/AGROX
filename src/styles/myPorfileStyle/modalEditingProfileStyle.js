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
        width: wp("100%"),
        height: hp("140%"),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 16,
        backgroundColor: "#ffffffff",
        borderRadius: hp("5"),
        position: "absolute",
        top: "25%",
        width: wp("90%"),
        height: 150,
        // width: width * 0.3, // 30% del ancho de la pantalla
    },
    title: {
        textAlign: "center",
        fontFamily: "CarterOne",
        fontSize: wp("10%"),
        color: "#2E7D32",
    },
    row: {
        flexDirection: "row",
        padding: wp("1%"),
    },
    margConten: {
        marginRight: wp("1%"),
    },
    text: {
        color: "#2E7D32",
        left: hp("0.1%"),
        fontFamily: "QuicksandBold",
        fontSize: wp("5%"),
        marginBottom: wp("2%"),
        marginTop: wp("2%"),
    },
    containerInput: {
        borderColor: "#2E7D32",
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: hp("2%"),
        width: wp("40%"),
        height: hp("6%"),
    },
    TextInputSty: {
        left: wp("3%"),
        top: hp("0.5%"),
        fontFamily: "QuicksandRegular",
    },
    containerB: {
        flexDirection: "row",
        padding: 15,
        right: wp("1%"),
    },
    Button: {
        backgroundColor: "#2E7D32",
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
});