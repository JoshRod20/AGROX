import { StyleSheet } from 'react-native';

export const finanDashboardStyle = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 16,
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
    color: '#333',
    marginBottom: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currencySymbol: {
    fontSize: 18,
    color: '#444',
    marginRight: 6,
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },
  helper: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
});

export default finanDashboardStyle;

