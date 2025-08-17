import { StyleSheet } from 'react-native';

export const cropStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});