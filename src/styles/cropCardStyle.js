import { StyleSheet, Dimensions, PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');

// Función para escalar el tamaño de texto
const scaleFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * (width / 375)));

export default StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.001,
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#A84300',
    marginRight: 8,
  },
  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#A84300',
  },
  wrapper: {
    alignSelf: 'center',
    width: width * 0.9, // 90% del ancho
    marginBottom: 25,
  },
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cropNameTag: {
    backgroundColor: '#2E7D32',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 2,
    marginBottom: -8,
    zIndex: 2,
  },
  cropNameText: {
    color: '#fff',
    fontSize: scaleFont(18),
    fontWeight: 'bold',
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#A84300',
    marginVertical: 6,
  },
  value: {
    fontWeight: 'normal',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginLeft: 5,
  },
  dateText: {
    color: '#fff',
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginHorizontal: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#2E7D32',
    borderRadius: 6,
  },
  progressText: {
    fontSize: scaleFont(12),
    color: '#555',
  },
  noData: {
    padding: 15,
    marginHorizontal: width * 0.04,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: scaleFont(14),
    color: '#666',
    textAlign: 'center',
  },
});
