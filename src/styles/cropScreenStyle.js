import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const cropScreenStyle = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 35,
  },
  backButton: {
    marginLeft: wp('7%'),
    marginTop: hp('-5%'),
  },
  backIcon: {
    width: wp('8%'),
    height: wp('8%'),
    tintColor: '#2E7D32',
    resizeMode: 'contain',
  },
  title: {
    fontSize: wp('7%'),
    marginTop: hp('-1%'),
    marginBottom: hp('0.5%'),
    textAlign: 'center',
    alignSelf: 'center',
},

  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  cropImage: {
    width: wp('90%'),
    height: hp('22%'),
    borderRadius: 10,
  },
buttonFile: {
  flexDirection: 'row',              // para texto + ícono
  alignItems: 'center',
  justifyContent: 'center',
  width: wp('50%'),                  // más corto que antes
  height: hp('4.5%'),
  borderWidth: 1,
  borderColor: '#BC6C25',
  borderRadius: 10,
  backgroundColor: '#fff',
  alignSelf: 'flex-start',           // se alinea a la izquierda como en la imagen
  marginVertical: hp('1%'),
  marginLeft: hp('2.3%'),
  paddingHorizontal: 0,
},
buttonTextFile: {
  color: '#767E86',
  fontSize: wp('4%'),
  textAlign: 'center',
  marginBottom: hp('0.2%'),
},

  label2: {
    fontSize: hp('2.2%'),
    marginLeft: hp('2.5%'),
    marginTop: hp('0.2%'),
    marginBottom: hp('2%'),
    color: '#BC6C25',
  },
  activitiesDone: {
    marginLeft: hp('2.7%'),
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: hp('3%'),
    marginBottom: hp('3%'),
    position: 'relative',
  },
activityIconWrapper: {
  width: hp('3.5%'),
  alignItems: 'center',
},
activityLine: {
  position: 'absolute',
  top: 27,
  left: 14,
  width: 2,
  backgroundColor: '#BC6C25',
  borderRadius: 1,
},

activityContent: {
  marginLeft: hp('3%'),
  flex: 1,
},
activityTitle: {
  fontSize: 16,
  fontFamily: 'QuicksandBold',
  color: '#2E7D32',
    marginBottom: hp('1%'),
    marginTop: hp('-0.4%'),
},
activityDate: {
  fontSize: 13,
  fontFamily: 'QuicksandRegular',
  color: '#555',
},

  progressContainer: {
    width: wp('90%'),
    marginHorizontal: 10,
    marginTop: 20,
    marginLeft: hp('2.3%'),
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'QuicksandBold',
    color: '#BC6C25',
    marginLeft: hp('0.3%'),
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
  titleModal: {
    fontSize: hp('2.3%'),
    textAlign: 'center',
    marginTop: hp('0.2%'),
    marginBottom: hp('2%'),
    color: '#2E7D32',
  },
    buttonSR: {
    width: wp('90%'),
    height: hp('6.5%'),
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: hp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4.7%'),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: hp('0.2%'),
  },
});
