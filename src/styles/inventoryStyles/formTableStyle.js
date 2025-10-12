import { StyleSheet } from 'react-native';

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
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	alertContainer: {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		elevation: 6,
		shadowColor: '#000',
		shadowOpacity: 0.15,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
	},
	alertIconContainer: {
		alignSelf: 'center',
		marginBottom: 10,
		backgroundColor: '#FFF3CD',
		padding: 10,
		borderRadius: 40,
	},
	alertIcon: {
		width: 28,
		height: 28,
		tintColor: '#E65100',
	},
	alertTitle: {
		fontSize: 18,
		fontWeight: '700',
		textAlign: 'center',
		marginBottom: 8,
		color: '#333',
	},
	alertMessage: {
		fontSize: 14,
		textAlign: 'center',
		color: '#555',
		marginBottom: 12,
	},
	alertButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
	},
	alertButton: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 8,
		alignItems: 'center',
	},
	cancelButtonAlert: {
		backgroundColor: '#F5F5F5',
	},
	deleteButtonAlert: {
		backgroundColor: '#D32F2F',
	},
	alertButtonTextCancel: {
		color: '#333',
		fontWeight: '600',
	},
	alertButtonTextDelete: {
		color: '#fff',
		fontWeight: '700',
	},
});

