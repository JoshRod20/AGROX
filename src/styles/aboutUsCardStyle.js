import { StyleSheet, Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");
const scaleFont = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * (width / 375)));
const isSmallDevice = width < 360; // Adjust threshold as needed for small devices
const isLargeDevice = width > 400; // Adjust threshold as needed for large devices

export default StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: width * 0.01,
    marginTop: isSmallDevice ? 8 : 10,
    marginBottom: isSmallDevice ? 6 : 8,
  },
  sectionTitle: {
    fontSize: scaleFont(isSmallDevice ? 14 : 16),
    fontWeight: "bold",
    color: "#C0392B",
    marginRight: isSmallDevice ? 6 : 8,
  },
  sectionLine: {
    flex: 1,
    height: isSmallDevice ? 1.5 : 2,
    backgroundColor: "#C0392B",
  },
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 12 : 17,
    alignSelf: "center",
    marginBottom: isSmallDevice ? 20 : 25,
    width: width * (isSmallDevice ? 0.92 : 0.9),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: isSmallDevice ? 3 : 4,
    elevation: isSmallDevice ? 2 : 3,
  },
  imageContainer: {
    position: "relative",
    marginRight: isSmallDevice ? 8 : 12,
  },
  image: {
    width: isSmallDevice ? 100 : isLargeDevice ? 150 : 130,
    height: isSmallDevice ? 180 : isLargeDevice ? 250 : 220,
    borderRadius: isSmallDevice ? 6 : 8,
  },
  overlay: {
    position: "absolute",
    top: "22%",
    left: isSmallDevice ? "10%" : "13%",
    width: width * (isSmallDevice ? 0.22 : 0.25),
    height: height * (isSmallDevice ? 0.12 : 0.15),
    backgroundColor: "rgba(0, 0, 0, 0.48)",
    borderRadius: isSmallDevice ? 8 : 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * (isSmallDevice ? 0.18 : 0.2),
    height: height * (isSmallDevice ? 0.06 : 0.08),
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    maxWidth: isSmallDevice ? "65%" : "70%", // Adjusted for smaller screens
  },
  cardText: {
    fontSize: scaleFont(isSmallDevice ? 12 : 14),
    color: "#fff",
    lineHeight: scaleFont(isSmallDevice ? 16 : 18),
  },
  highlight: {
    fontWeight: "bold",
    color: "#fff",
  },
});
