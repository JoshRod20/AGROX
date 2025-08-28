// weatherCardStyles.js
import { StyleSheet, Dimensions, PixelRatio } from "react-native";

const { width } = Dimensions.get("window");
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * (width / 375)));

export default StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: width * 0.001,
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#A84300",
    marginRight: 8,
  },
  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#A84300",
  },
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    padding: 15,
    alignSelf: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: "contain",
  },
  info: {
    flexDirection: "column",
  },
  temperature: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    color: "#fff",
  },
  range: {
    fontSize: scaleFont(14),
    color: "#eee",
  },
  status: {
    fontSize: scaleFont(16),
    color: "#fff",
    fontWeight: "600",
    marginTop: 2,
  },
});
