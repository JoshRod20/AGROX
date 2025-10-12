import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const formTableStyle = StyleSheet.create({
	container: {
		marginTop: 16,
		borderWidth: 1,
		borderColor: '#E0E0E0',
		borderRadius: 8,
		// No forzar overflow hidden para permitir scroll horizontal
	},
	headerRow: {
		flexDirection: 'row',
		backgroundColor: '#E8F5E9',
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
	},
	headerCell: {
		paddingVertical: 10,
		paddingHorizontal: 8,
	},
	headerText: {
		color: '#2E7D32',
		fontWeight: '700',
		fontSize: 13,
	},
	row: {
		flexDirection: 'row',
		backgroundColor: '#fff',
	},
	rowAlt: {
		backgroundColor: '#FAFAFA',
	},
	cell: {
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	cellText: {
		color: '#333',
		fontSize: 13,
	},
	actionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	actionBtn: {
		paddingHorizontal: 6,
		paddingVertical: 4,
		borderRadius: 6,
		backgroundColor: 'transparent',
	},
	actionIcon: {
		width: 18,
		height: 18,
		resizeMode: 'contain',
	},
	loadingContainer: {
		paddingVertical: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyContainer: {
		paddingVertical: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyText: {
		color: '#757575',
		fontSize: 14,
	},
	// Estilos del modal de confirmación (consistentes con cropCard/cropScreen)
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
		backgroundColor: '#D32F2F',
	},
	alertButtonTextCancel: {
		fontSize: wp("4.3%"),
		color: '#000000ff',
		fontFamily: "QuicksandSemiBold",
	},
	  alertButtonTextDelete: {
    fontSize: wp("4.3%"),
    fontFamily: "QuicksandSemiBold",
    color: "#FFFFFF",
  },
});

