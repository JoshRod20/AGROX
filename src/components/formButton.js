
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
import { LinearGradient } from 'expo-linear-gradient';

// Componente reutilizable de botón para formularios
// El diseño y color provienen de cropStyle.buttonSR y cropStyle.buttonText
// El texto y el estado de carga/clic se controlan por props
// Se importa y usa igual que InputsFormFields, pero es para acciones (guardar, etc.)

// El botón usa LinearGradient como fondo, igual que el diseño original
const FormButton = ({ onPress, label = 'Guardar', loading = false, disabled = false, style, textStyle }) => (
  <TouchableOpacity
    style={{ alignSelf: 'center', marginTop: 20 }}
    onPress={onPress}
    disabled={loading || disabled}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={disabled ? ['#ccc', '#ccc'] : ['rgba(46, 125, 50, 1)', 'rgba(76, 175, 80, 0.7)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[cropStyle.buttonSR, style, { opacity: (loading || disabled) ? 0.7 : 1 }]}
    >
      <Text style={[cropStyle.buttonText, { fontFamily: 'CarterOne' }, textStyle]}>
        {loading ? 'Guardando...' : label}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default FormButton;
