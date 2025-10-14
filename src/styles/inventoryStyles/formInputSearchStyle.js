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
		left: 1,
		flex: 1,
	},
	input: {
		flex: 1,
		color: '#333',
		fontSize: 16,
		left: 35,
	},
	searchButton: {
		width: hp('6%'),
		height: hp('6%'),
		borderRadius: hp('1.0%'),
		alignItems: 'center',
		justifyContent: 'center',
		//backgroundColor: '#2E7D32',
		right: 300,
	},
	searchIcon: {
		width: 25,
		height: 25,
		tintColor: '#b2b2b2ff',
		resizeMode: 'contain',
		marginLeft: wp('6%'),
	},
});

