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
  pdfModalContent: {
    width: width * 0.95,
    height: height * 0.85,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  pdfModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2E7D32",
  },
  pdfModalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "CarterOne",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2E7D32",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  pdfContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  pdf: {
    flex: 1,
    width: "100%",
  },
  qrSection: {
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  qrLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
});