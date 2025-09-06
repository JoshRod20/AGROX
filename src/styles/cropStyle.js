import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const cropStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  backButtonCrop: {
    marginLeft: wp('9%'),
    marginTop: hp('-0.5%'),
  },
  backIconCrop: {
    width: wp('8%'),
    height: wp('8%'),
    tintColor: '#2E7D32',
    resizeMode: 'contain',
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
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: hp('5%'),
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
    height: hp('11%'),
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
    marginRight: wp('5%'),
    resizeMode: 'cover',
  },
  buttonTextCropTypes: {
    color: '#fff',
    fontSize: wp('4.8%'),
    textAlign: 'center',
    flex: 1,
  },
  title: {
    fontSize: wp('6.5%'),
    marginTop: hp('5%'),
    marginBottom: hp('1%'),
    textAlign: 'center',
    marginLeft: hp('1%'),
    alignSelf: 'flex-start',
  },
  label: {
    width: '90%',
    fontSize: wp('4%'),
    color: '#BC6C25',
    marginTop: hp('2.5%'),
    marginBottom: hp('0%'),
    marginLeft: wp('3%'),
    alignSelf: 'flex-start',
    fontFamily: 'QuicksandBold',
  },
  inputContainer: {
    width: wp('85%'),
    borderBottomWidth: 2,
    borderColor: '#2E7D32',
    marginBottom: hp('1%'),
    alignSelf: 'center',
  },
  input: {
    height: hp('6%'),
    fontSize: wp('3.5%'),
    color: '#000',
    fontFamily: 'QuicksandRegular',
  },
  errorInput: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000ff',
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
    alignSelf: 'center',
    fontFamily: 'QuicksandRegular',
  },
  buttonSR: {
    width: wp('80%'),
    height: hp('6%'),
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: hp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    textAlign: 'center',
  },
  container2: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 50,
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
  title2: {
    fontSize: wp('7.5%'),
    marginTop: hp('10%'),
    marginBottom: 8,
    textAlign: 'left',
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










