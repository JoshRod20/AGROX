import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const formCheckBoxStyle = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 5,
  },
  label: {
    width: '90%',
    fontSize: wp('4%'),
    color: '#BC6C25',
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
    alignSelf: 'flex-start',
    fontFamily: 'QuicksandBold',
    marginLeft: wp('-1.5%'),
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',          // ✅ permite múltiples filas
    justifyContent: 'space-between',
  },
  optionContainer: {
    width: wp('37%'),              // ✅ cada opción ocupa la mitad de la fila
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1%'),  // ✅ espacio vertical uniforme
  },
  checkBox: {
    width: wp('6.7%'),
    height: wp('6.7%'),
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  optionText: {
    color: '#222',
    fontSize: wp('4%'),
    fontFamily: 'QuicksandRegular',
  },
  checkStyle: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: wp('0.1%'),
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.5%'),
    marginTop: hp('0.5%'),
  },
});
