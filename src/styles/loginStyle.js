import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'), // Margen lateral del 5% del ancho de la pantalla
  },
  logo: {
    width: wp('80%'), // 80% del ancho de la pantalla para el logo
    height: hp('30%'), // 30% de la altura de la pantalla
    alignSelf: 'center',
    marginBottom: hp('10%'), // Margen inferior relativo
  },
  buttonsesion: {
    width: wp('80%'), // 80% del ancho de la pantalla
    height: hp('7%'), // Altura relativa
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'), // Border radius relativo.
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonregister: {
    width: wp('80%'),
    height: hp('7%'),
    marginTop: hp('2%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('5%'), // Tamaño de fuente relativo
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextRegister: {
    color: '#000000ff', // Cambiado a negro para mejor contraste con el fondo blanco
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});