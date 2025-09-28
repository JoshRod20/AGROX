import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const cropScreenStyle = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingTop: hp("5.5%"),
  },
  backButton: {
    marginLeft: wp("7%"),
    marginTop: hp("-5%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
  title: {
    fontSize: wp("7%"),
    marginTop: hp("-1%"),
    marginBottom: hp("0.5%"),
    textAlign: "center",
    alignSelf: "center",
  },

  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  cropImage: {
    width: wp("90%"),
    height: hp("22%"),
    borderRadius: 10,
  },
  buttonFile: {
    flexDirection: "row", // para texto + ícono
    alignItems: "center",
    justifyContent: "center",
    width: wp("50%"), // más corto que antes
    height: hp("4.5%"),
    borderWidth: 1,
    borderColor: "#BC6C25",
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "flex-start", // se alinea a la izquierda como en la imagen
    marginVertical: hp("1%"),
    marginLeft: hp("2.3%"),
    paddingHorizontal: 0,
  },
  buttonTextFile: {
    color: "#767E86",
    fontSize: wp("4%"),
    textAlign: "center",
    marginBottom: hp("0.2%"),
  },
  // En cropScreenStyle.js, dentro de StyleSheet.create({ ... })
  buttonGraph: {
    width: hp("4.5%"), // cuadrado
    height: hp("4.5%"),
    borderRadius: 8,
    backgroundColor: "#2E7D32", // verde oscuro como en la imagen
    justifyContent: "center",
    alignItems: "center",
    marginLeft: hp("14%"), // espacio entre botones
  },
  graphIcon: {
    width: wp("6%"),
    height: wp("6%"),
    tintColor: "#fff",
  },

  label2: {
    fontSize: hp("2.2%"),
    marginLeft: hp("2.5%"),
    marginTop: hp("0.2%"),
    marginBottom: hp("2%"),
    color: "#BC6C25",
  },
  activitiesDone: {
    marginLeft: hp("2.7%"),
  },
  activityContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: hp("3%"),
    marginBottom: hp("3%"),
    position: "relative",
  },
  activityIconWrapper: {
    width: hp("3.5%"),
    alignItems: "center",
  },
  activityLine: {
    position: "absolute",
    top: 27,
    left: 14,
    width: 2,
    backgroundColor: "#BC6C25",
    borderRadius: 1,
  },

  activityContent: {
    marginLeft: hp("3%"),
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "QuicksandBold",
    color: "#2E7D32",
    marginBottom: hp("1%"),
    marginTop: hp("-0.4%"),
  },
  activityDate: {
    fontSize: 13,
    fontFamily: "QuicksandRegular",
    color: "#555",
  },

  progressContainer: {
    width: wp("90%"),
    marginHorizontal: 10,
    marginTop: 20,
    marginLeft: hp("2.3%"),
  },
  progressText: {
    fontSize: 16,
    fontFamily: "QuicksandBold",
    color: "#BC6C25",
    marginLeft: hp("0.3%"),
    marginBottom: 4,
  },
  progressBar: {
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    height: 12,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#4CAF50",
    height: "100%",
    borderRadius: 4,
  },
  titleModal: {
    fontSize: hp("2.3%"),
    textAlign: "center",
    marginTop: hp("0.2%"),
    marginBottom: hp("2%"),
    color: "#2E7D32",
  },
  // Estilos para los ítems del FlatList en el modal de selección
  activityModalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.3%"),
    paddingHorizontal: wp("1%"),
    marginVertical: hp("0.5%"),
    backgroundColor: "#FFFFFF",
  },
  activityModalIcon: {
    width: wp("6%"),
    height: wp("6%"),
    marginRight: wp("3.5%"),
    tintColor: "#2E7D32",
  },
  activityModalText: {
    flex: 1,
    color: "#2E7D32",
    fontFamily: "QuicksandSemiBold",
    fontSize: wp("4.2%"),
  },
  activityModalRegistered: {
    color: "#2E7D32",
    fontFamily: "QuicksandBold",
    fontSize: wp("3.2%"),
    marginLeft: wp("2%"),
  },
  buttonSR: {
    width: wp("90%"),
    height: hp("6.5%"),
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: hp("2%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.7%"),
    alignSelf: "center",
    textAlign: "center",
    marginTop: hp("0.2%"),
  },
  cancelButton: {
    backgroundColor: "#9F9898",
    width: wp("35%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.1%"),
    borderRadius: wp("3.5%"),
    marginTop: hp("4%"),
    alignSelf: "flex-end",
    // Sombras
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelText: {
    color: "#FFFFFF",
    fontFamily: "QuicksandBold",
    fontSize: wp("4.7%"),
    textAlign: "center",
    marginBottom: hp("0.2%"),
  },


  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.3)",
  justifyContent: "center",
  alignItems: "center",
},
optionsModal: {
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 24,
  width: "75%",
},
optionItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
},
optionIcon: {
  width: 20,
  height: 20,
  marginRight: 24,
  tintColor: "#f67009",
},
optionText: {
  color: "#000",
  fontFamily: "QuicksandBold",
  fontSize: 15,
},

// ✅ Alerta personalizada de eliminación
overlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  justifyContent: "center",
  alignItems: "center",
  padding: wp("5%"),
},
alertContainer: {
  width: "100%",
  maxWidth: wp("85%"),
  backgroundColor: "#FFFFFF",
  borderRadius: wp("6%"),
  padding: wp("6%"),
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 8,
},
alertIconContainer: {
  width: wp("16%"),
  height: wp("16%"),
  borderRadius: wp("8%"),
  backgroundColor: "#FFF2E8",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: hp("2%"),
},
alertIcon: {
  width: wp("15%"),
  height: wp("15%"),
  marginBottom: hp("1%"),
},
alertTitle: {
  fontSize: wp("5.5%"),
  fontFamily: "QuicksandBold",
  color: "#333333",
  textAlign: "center",
  marginBottom: hp("1.5%"),
},
alertMessage: {
  fontSize: wp("4.2%"),
  fontFamily: "QuicksandRegular",
  color: "#666666",
  textAlign: "center",
  lineHeight: wp("6%"),
  marginBottom: hp("3%"),
},
alertButtons: {
  flexDirection: "row",
  width: "100%",
  justifyContent: "space-between",
},
alertButton: {
  flex: 1,
  paddingVertical: hp("1.6%"),
  borderRadius: wp("4%"),
  alignItems: "center",
},
cancelButtonAlert: {
  backgroundColor: "#EEEEEE",
  marginRight: wp("2%"),
},
deleteButtonAlert: {
  backgroundColor: "#ff4848ff",
  marginLeft: wp("2%"),
},
alertButtonTextCancel: {
  fontSize: wp("4.3%"),
  fontFamily: "QuicksandSemiBold",
  color: "#555555",
},
alertButtonTextDelete: {
  fontSize: wp("4.3%"),
  fontFamily: "QuicksandSemiBold",
  color: "#FFFFFF",
},
});
