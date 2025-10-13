import { StyleSheet, Dimensions, PixelRatio } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

// Función para escalar el tamaño de texto
const scaleFont = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * (width / 375)));

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
  wrapper: {
    alignSelf: "center",
    width: width * 0.9, // 90% del ancho
    marginBottom: 25,
  },
  cardContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cropNameTag: {
    backgroundColor: "#2E7D32",
    paddingVertical: 4,
    paddingHorizontal: 28,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignSelf: "flex-start",
    marginLeft: 2,
    marginBottom: -5,
    zIndex: 2,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Sombra para Android
    elevation: 3,
  },
  cropNameText: {
    color: "#fff",
    fontSize: scaleFont(18),
    fontFamily: "CarterOne",
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#A84300",
    marginVertical: 6,
  },
  value: {
    fontWeight: "normal",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateBox: {
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginLeft: 5,
  },
  dateText: {
    color: "#fff",
    fontSize: scaleFont(13),
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    marginHorizontal: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#2E7D32",
    borderRadius: 6,
  },
  progressText: {
    fontSize: scaleFont(12),
    color: "#555",
  },
  noData: {
    padding: 15,
    marginHorizontal: width * 0.04,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    alignItems: "center",
  },
  noDataText: {
    fontSize: scaleFont(14),
    color: "#666",
    textAlign: "center",
  },
   // --- ESTILOS DEL BOTÓN DE OPCIONES EN ESQUINA SUPERIOR DERECHA ---
  optionsButton: {
    position: "absolute",
    top: wp("0%"),
    right: 10,
    zIndex: 2, // Asegura que esté por encima de otros elementos
    padding: 5, // Espacio para tocar más fácil
  },
  optionsIcon: {
    width: 25,
    height: 25,
    tintColor: "#666", // Color del icono
  },


  // Nuevo estilo para la imagen del cultivo (modo full)
cropImage: {
  width: '100%',
  height: 140,
  marginTop: wp("5%"),
  marginBottom: wp("4%"),
  borderRadius: 8,
  resizeMode: 'cover',
},

// Opcional: Estilo para las filas con label y value en modo full
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8, // Espaciado entre filas
},

  // --- ESTILOS DEL MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsModal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
  optionIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    tintColor: "#f67009",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  // --- MODAL DE ALERTA ---
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
    backButton: {
    marginLeft: wp("7%"),
    marginTop: hp("5%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
});