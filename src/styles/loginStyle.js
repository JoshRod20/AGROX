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
    marginTop: hp('10%'), 
    marginBottom: hp('12%'), // Margen inferior relativo
  },
  buttonLogin: {
    width: wp('80%'), // 80% del ancho de la pantalla
    height: hp('5.6%'), // Altura relativa
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'), // Border radius relativo.
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
  },
  buttonSignUp: {
    width: wp('80%'),
    height: hp('6%'),
    marginTop: hp('0%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4.5%'), // Tamaño de fuente relativo
    textAlign: 'center',
  },
  buttonTextSignUp: {
    color: '#000000ff', // Cambiado a negro para mejor contraste con el fondo blanco
    fontSize: wp('4.3%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },




//Estilos para la pantalla SignIn

  logoSignIn: {
  width: wp('70%'), // 80% del ancho de la pantalla para el logo
  height: hp('20%'), // 30% de la altura de la pantalla
  alignSelf: 'center',
  marginBottom: hp('5%'), // Margen inferior relativo
  },
  logtext: {
  fontSize: wp('7.7%'),
  color: '#2E7D32',
  marginBottom: hp('1%'),
  textAlign: 'left',
  marginLeft: hp('2%'),
  alignSelf: 'flex-start',
},
sesionText: {
  fontSize: wp('4%'),
  color: '#000000ff',
  marginBottom: hp('3%'),
  textAlign: 'left', // 👈 asegura alineación a la izquierda
  marginLeft: hp('2%'),
  alignSelf: 'flex-start',
},
agroxText: {
  color: '#000000ff',
  fontWeight: 'bold',
  fontSize: wp('4.2%'),
},
  textEmail: {
  width: '90%',
  fontSize: wp('4%'),
  fontWeight: 'bold',
  color: '#BC6C25',
  marginTop: hp('5%'),
  marginBottom: hp('0.5%'),
},
textPassword: {
  width: '90%',
  fontSize: wp('4%'),
  fontWeight: 'bold',
  color: '#BC6C25',
  marginBottom: hp('0.5%'),
},
inputEmail: {
  width: '90%',
  height: hp('6%'),
  borderColor: '#2E7D32',
  borderWidth: 3,
  borderRadius: 8,
  marginBottom: hp('4%'),
  paddingHorizontal: 12,
  fontSize: wp('4%'),
},
inputPassword: {
  width: '90%',
  height: hp('6%'),
  borderColor: '#2E7D32',
  borderWidth: 3,
  borderRadius: 8,
  marginBottom: hp('2%'),
  paddingHorizontal: 12,
  fontSize: wp('4%'),
},
  inputPasswordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: hp('2%'),
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
    inputPassword: {
    flex: 1,
    height: hp('6%'),
    fontSize: wp('4%'),
  },
  buttonSignIn: {
    width: wp('80%'), // 80% del ancho de la pantalla
    height: hp('5.6%'), // Altura relativa
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'), // Border radius relativo.
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
  },
signUpTextContainer: {
    marginTop: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#000000ff',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  signUpLink: {
    color: '#000000ff', // Color similar a otros elementos (como textEmail/textPassword)
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
});