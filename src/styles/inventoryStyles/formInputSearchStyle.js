import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const formInputSearchStyle = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F5F5F5',
		borderRadius: 10,
		paddingHorizontal: 12,
		height: hp('6%'),
		borderWidth: 1,
		borderColor: '#E0E0E0',
		flex: 1,
	},
	input: {
		flex: 1,
		color: '#333',
		fontSize: 16,
	},
	searchButton: {
		width: hp('5%'),
		height: hp('5%'),
		borderRadius: hp('2.5%'),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E8F5E9',
		marginLeft: 8,
	},
	searchIcon: {
		width: 18,
		height: 18,
		tintColor: '#2E7D32',
		resizeMode: 'contain',
	},
});

