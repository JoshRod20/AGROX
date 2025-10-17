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

const isTablet = width >= 768;

const drawerWidth = isTablet ? wp("100%") : wp("100%");
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
        fontSize:  isTablet ? height * 0.03 : height * 0.03,
        fontFamily: "QuicksandBold",
        marginTop: wp("2%"),
        color: "#2E7D32",
        bottom: 55,

    },
    gmail: {
        fontSize:  isTablet ? height * 0.02 : height * 0.02,
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
        fontSize:  isTablet ? height * 0.02 : height * 0.02,
        fontFamily: "QuicksandBold",
    },
    texp: {
        left: wp("2%"),
        fontSize:  isTablet ? height * 0.02 : height * 0.02,
        fontFamily: "QuicksandRegular",
    },
    section: {
        marginBottom: hp("2%"),
        right: wp("1%"),
        height: isTablet ? height * 0.21 : height * 0.25,
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
        width: isTablet ? height * 0.1 : height * 0.1,
        height: isTablet ? height * 0.05 : height * 0.08,
        borderRadius:  isTablet ? height * 0.01 : height * 0.01,
    },
    texts1: {
        justifyContent: 'center',
    },
    textS1: {
        fontFamily: "QuicksandBold",
        color: "#2E7D32",
        fontSize:  isTablet ? height * 0.02 : height * 0.02,
    },
    textS2: {
        fontFamily: "QuicksandRegular",
        color: "#000",
        fontSize:  isTablet ? height * 0.012 : height * 0.015,
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