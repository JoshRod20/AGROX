import { StyleSheet } from 'react-native';

export const inputSearchStyle = StyleSheet.create({
  // Botón que vive dentro del contenedor del input como adornment derecho
  adornmentButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4, // compensa línea inferior del input para centrar visualmente
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
});
