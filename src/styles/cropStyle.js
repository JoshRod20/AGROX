import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const cropStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
  },
  menuButton: {
    marginTop: 30,
    padding: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1, 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  //Diseño para la pantalla formCrop

  title: {
    fontSize: wp('7.5%'),
    marginTop: hp('3%'),
    marginBottom: 8,
    textAlign: 'left', // 👈 asegura alineación a la izquierda
    marginLeft: hp('2%'),
    alignSelf: 'flex-start',
  },
    label: {
    width: '90%',
    fontSize: wp('4%'),
    color: '#BC6C25',
    marginTop: hp('2%'),
    marginBottom: hp('0.5%'),
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

  //Diseño para pantalla crop
      buttonSR2: {
     width: wp('80%'), // 80% del ancho de la pantalla
    height: hp('10%'), // Altura relativa
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2.5%'), // Border radius relativo.
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('6%'),
  },
    container2: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    marginTop: -200,
  },
});