import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const buttonNewStyle = StyleSheet.create({
	button: {
		backgroundColor: '#2E7D32',
		borderRadius: 10,
		height: hp('6%'),
		paddingHorizontal: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		width: 16,
		height: 16,
		tintColor: '#fff',
		marginRight: 8,
		resizeMode: 'contain',
	},
	text: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '600',
	},
});

