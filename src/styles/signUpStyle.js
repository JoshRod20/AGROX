import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const signUpStyle = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
  },
  title: {
    fontSize: wp('7.5%'),
    marginTop: hp('3%'),
    marginBottom: 8,
    textAlign: 'left', // 👈 asegura alineación a la izquierda
    marginLeft: hp('2%'),
    alignSelf: 'flex-start',
  },
    signUpTitle: {
    color: '#000000ff',
    fontSize: wp('3.8%'),
    textAlign: 'left', // 👈 asegura alineación a la izquierda
    marginLeft: hp('2%'),
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  signUpLinkTitle: {
    color: '#000000ff', // Color similar a otros elementos (como textEmail/textPassword)
    fontWeight: 'bold',
    fontSize: wp('3.7%'),
  },
  label: {
    width: '90%',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#BC6C25',
    marginTop: hp('3%'),
    marginBottom: hp('0.5%'),
    alignSelf: 'flex-start',
    marginLeft: hp('2%'),
  },
    label2: {
    width: '90%',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#BC6C25',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
    alignSelf: 'flex-start',
    marginLeft: hp('2%'),
  },
  input: {
    width: '90%',
    height: hp('6%'),
    borderColor: '#2E7D32',
    borderWidth: 3,
    borderRadius: 8,
    marginBottom: hp('1%'),
    paddingHorizontal: 12,
    fontSize: wp('4%'),
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  inputPasswordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#2E7D32',
    borderWidth: 3,
    borderRadius: 8,
    marginBottom: hp('1%'),
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  inputPassword: {
    flex: 1,
    height: hp('6%'),
    fontSize: wp('4%'),
  },
  button: {
    width: wp('80%'), // 80% del ancho de la pantalla
    height: hp('6%'), // Altura relativa
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'), // Border radius relativo.
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
    buttonTextSR: {
    color: '#fff',
    fontSize: wp('4.5%'), // Tamaño de fuente relativo
    textAlign: 'center',
  },
    buttonSR: {
     width: wp('80%'), // 80% del ancho de la pantalla
    height: hp('6%'), // Altura relativa
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'), // Border radius relativo.
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('6%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4.5%'), // Tamaño de fuente relativo
    textAlign: 'center',
  },
   signUpText2: {
    color: '#000000ff',
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
   signUpLink2: {
    color: '#000000ff', // Color similar a otros elementos (como textEmail/textPassword)
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  signUpTextContainer: {
    marginTop: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});