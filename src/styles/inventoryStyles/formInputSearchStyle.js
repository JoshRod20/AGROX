import { StyleSheet, Dimensions} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width } = Dimensions.get("window");

// Función para escalar el tamaño de texto
const scaleFont = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * (width / 375)));

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
		left: wp('13%'),
	},
	searchButton: {
		width: hp('6%'),
		height: hp('6%'),
		borderRadius: hp('1.0%'),
		alignItems: 'center',
		justifyContent: 'center',
		//backgroundColor: '#2E7D32',
		right: wp('72%'),
	},
	searchIcon: {
		width: 25,
		height: 25,
		tintColor: '#b2b2b2ff',
		resizeMode: 'contain',
		position: 'absolute',
		right: wp('%'),
		//marginRight: wp('3%'),
	},
});

