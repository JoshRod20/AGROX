
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
    padding: 10,
    position: 'absolute',
    top: hp('2%'),
    left: wp('2%'),
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  //Diseño para pantalla crop

backButton: {
  marginLeft: wp('8%'), 
  marginBottom: hp('1%'),
},

backIcon: {
  width: wp('7.5%'), 
  height: wp('7.5%'),
  tintColor: '#2E7D32',
  resizeMode: 'contain',
},


titleCrop: {
  fontSize: wp('6%'),
  marginTop: hp('1%'),
  marginBottom: hp('1%'),
  textAlign: 'center',
  paddingHorizontal: wp('4%'),
  alignSelf: 'center',
},


buttonSR2: {
  width: wp('85%'),
  height: hp('11%'),   // bajé un poco para pantallas pequeñas
  borderRadius: wp('3%'),
  justifyContent: 'center',
  alignSelf: 'center',
  marginTop: hp('2.5%'),
  overflow: 'hidden',
},

buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  paddingHorizontal: wp('3%'), 
},

cropIcon: {
  width: hp('7.5%'),
  height: hp('7.5%'),
  borderRadius: wp('2%'),
  marginRight: wp('5%'), // ahora es proporcional
  resizeMode: 'cover',
},

buttonTextCropTypes: {
  color: '#fff',
  fontSize: wp('4.8%'),
  textAlign: 'center',
  flex: 1,
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
      alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 20,
  },
     buttonText: {
    color: '#fff',
    fontSize: wp('4.5%'), // Tamaño de fuente relativo
    textAlign: 'center',
  },
  //Diseño para pantalla cropScreen
     container2: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  cropImage: {
    width: 220,
    height: 180,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  label2: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 20,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 8,
  },
  activityText: {
    fontSize: 15,
    color: '#222',
    marginLeft: 8,
  },
  progressContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  progressBar: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#4CAF50',
    height: '100%',
    borderRadius: 4,
  },
  buttonSR3: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 20,
  },
    // Estilos para CropPreparation
  title2: {
    fontSize: wp('7.5%'),
    marginTop: hp('10%'),
    marginBottom: 8,
    textAlign: 'left', // 👈 asegura alineación a la izquierda
    marginLeft: hp('2%'),
    alignSelf: 'flex-start',
  },
  dateInputContainer: {
    width: '90%',
    height: hp('6%'),
    borderColor: '#2E7D32',
    borderWidth: 3,
    borderRadius: 8,
    marginBottom: hp('1%'),
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInputText: {
    fontSize: wp('4%'),
    color: '#BC6C25',
    flex: 1,
    paddingVertical: 0,
  },
  dateIcon: {
    width: 24,
    height: 24,
    tintColor: '#BC6C25',
  },
  
});