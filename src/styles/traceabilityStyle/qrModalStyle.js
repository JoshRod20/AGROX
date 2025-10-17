// src/styles/traceabilityStyle/qrModalStyle.js

import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 25,
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "CarterOne",
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "QuicksandMedium",
    color: "#000000ff",
  },
  qrContainer: {
    width: width * 0.75,
    maxWidth: 300,
    aspectRatio: 1,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  qrCode: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 8,
  },
});