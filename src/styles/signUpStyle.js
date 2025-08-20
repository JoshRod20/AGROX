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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    width: '90%',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#BC6C25',
    marginTop: hp('2%'),
    marginBottom: hp('0.5%'),
    alignSelf: 'flex-start',
  },
  input: {
    width: '90%',
    height: hp('6%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: hp('2%'),
    paddingHorizontal: 12,
    fontSize: wp('4%'),
    backgroundColor: '#fff',
    justifyContent: 'center',
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
  button: {
     width: wp('80%'), // 80% del ancho de la pantalla
    height: hp('5.6%'), // Altura relativa
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'), // Border radius relativo.
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    textAlign: 'center',
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
  signUpTextContainer: {
    marginTop: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});