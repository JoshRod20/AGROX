import { StyleSheet, Dimensions, PixelRatio } from "react-native";
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
export const myPorfileStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 16,
        backgroundColor: "#ffffffff",
        // width: width * 0.3, // 30% del ancho de la pantalla
    },
    title: {
        fontSize: scaleFont(24),
        fontFamily: "CarterOne",
        marginBottom: "1%",
        color: "#2E7D32",
    },
    userInfo: {
        alignItems: "center",
        marginBottom: wp("3%"),
        //backgroundColor: "#000",
        height: hp("23%"),
    },
    profileImage: {
        marginTop: 10,
        width: 130,
        height: 130,
        borderRadius: 200,
    },
    cameraIconContainer: {
        //position: "absolute",
        width: 50,
        height: 50,
        right: -40,
        backgroundColor: "#2E7D32",
        alignItems: "center",
        borderRadius: wp("10%"),
        bottom: 45,
    },
    cameraIcon: {
        width: 25,
        height: 25,
        position: "absolute",
        bottom: 15,
    },
    profileName: {
        fontSize: scaleFont(23),
        fontFamily: "QuicksandBold",
        marginTop: wp("2%"),
        color: "#2E7D32",
        bottom: 55,

    },
    gmail: {
        fontSize: scaleFont(15),
        fontFamily: "QuicksandRegular",
        color: "#000000",
        bottom: 55,
    },
    section: {
        //marginBottom: 10,
        right: wp("5%"),
        bottom: 55,

    },
    row1: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1%"),
        paddingHorizontal: wp("2%"),
    },
    text: {
        fontSize: scaleFont(18),
        fontFamily: "QuicksandBold",
        color: "#BC6C25",
    },
    editIcon: {
        width: 25,
        height: 25,
        tintColor: "#BC6C25",
        marginLeft: wp("20%"),
    },
    tex: {
        fontSize: scaleFont(15),
        fontFamily: "QuicksandBold",
    },
    texp: {
        left: wp("2%"),
        fontSize: scaleFont(15),
        fontFamily: "QuicksandRegular",
    },
    section: {
        marginBottom: hp("2%"),
        right: wp("1%"),
        height: hp("26%"),
    },
    line: {
        borderBottomColor: '#BC6C25',
        borderBottomWidth: 1,
        width: wp("75%"),
        marginTop: hp("2%"),
        marginBottom: hp("1%"),
    },
    texts: {
        fontSize: scaleFont(18),
        fontFamily: "QuicksandBold",
        color: "#BC6C25",
        left: wp("1%"),
    },
    myCol: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 12,
        padding: 8,
    },
    imgra: {
        width: wp("20%"),
        height: hp("8%"),
        borderRadius: wp("3%"),
    },
    texts1: {
        justifyContent: 'center',
    },
    textS1: {
        fontFamily: "QuicksandBold",
        color: "#2E7D32",
        fontSize: 18,
    },
    textS2: {
        fontFamily: "QuicksandRegular",
        color: "#000",
        fontSize: 14,
    },
    backButton: {
        marginRight: wp("72%"),
        bottom: 15,
        marginBottom: wp("1%"),
    },
    backIcon: {
        width: wp("8%"),
        height: wp("8%"),
        tintColor: "#2E7D32",
        resizeMode: "contain",
        //backgroundColor: "#000",
    },

});