import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const finanDashboardStyle = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  // Fila de tarjetas mitad/mitad
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  halfCardLeft: {
    marginRight: 6,
  },
  title: {
       marginTop: hp("4%"),
       fontSize: wp("7%"),
       color: '#2E7D32',
       textAlign: 'center',
       marginBottom: hp("3%"),
       fontFamily: 'CarterOne',
       marginLeft: wp("4%"),
  },
  card: {
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E6EB',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currencySymbol: {
    fontSize: 27,
    bottom: 1,
    color: '#111',
    fontWeight: '800',
    marginRight: 6,
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },
  rentability: {
    fontSize: 60,
    left: 150,
    fontWeight: '600',
  },
  // Donut chart styles
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    top: 95,
  },
  donutCenterTotal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  donutLegend: {
    marginTop: 12,
    width: '100%',
  },
  donutLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 8,
  },
  donutLegendLabel: {
    flex: 1,
    color: '#333',
  },
  donutLegendValue: {
    color: '#111',
    fontWeight: '600',
  },
  // Bar chart styles
  barChartContainer: {
    alignItems: 'center',
  },
  barLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  barLabelItem: {
    alignItems: 'center',
  },
  barLabelText: {
    fontSize: 12,
    color: '#333',
  },
  barValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
  },
  // flecha de retroceso
  backButton: {
    marginRight: wp("72%"),
    bottom: 15,
    top: 2,
    left: 10,
    marginBottom: wp("-6%"),
  },
  backIcon: {
    width: wp("8%"),
    height: wp("8%"),
    tintColor: "#2E7D32",
    resizeMode: "contain",
  },
});

export default finanDashboardStyle;

