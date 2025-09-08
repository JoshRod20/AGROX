import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cropStyle } from '../styles/cropStyle';


// Componente reutilizable para selección tipo radio compacta (tipo de laboreo, etc.)
// Si hay más de dos opciones, la tercera y siguientes se muestran debajo, en una fila separada
const FormCheckBox = ({
  label = '',
  options = [],
  value = '',
  onChange,
  error = '',
  style,
  labelStyle,
  optionStyle
}) => {
  // Primeras dos opciones en la primera fila, el resto en la segunda
  const firstRow = options.slice(0, 2);
  const secondRow = options.slice(2);
  return (
    <View style={[{ width: '90%', alignSelf: 'center', marginBottom: 4 }, style]}>
      {label ? (
        <Text style={[cropStyle.label, { fontFamily: 'QuicksandBold', color: '#BC6C25' }, labelStyle]}>{label}</Text>
      ) : null}
      {/* Primera fila: dos primeras opciones */}
      <View style={{ flexDirection: 'row' }}>
        {firstRow.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              { flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 },
              optionStyle
            ]}
            onPress={() => onChange(option)}
            activeOpacity={0.7}
          >
            <View style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: '#2E7D32',
              borderRadius: 4,
              backgroundColor: value === option ? '#2E7D32' : '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}>
              {value === option && (
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
              )}
            </View>
            <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Segunda fila: tercera opción (y siguientes) debajo */}
      {secondRow.length > 0 && (
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {secondRow.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                { flexDirection: 'row', alignItems: 'center', marginHorizontal: 4 },
                optionStyle
              ]}
              onPress={() => onChange(option)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: '#2E7D32',
                borderRadius: 4,
                backgroundColor: value === option ? '#2E7D32' : '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
                {value === option && (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{ color: '#222', fontSize: 16 }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {error ? <Text style={{ color: 'red', fontSize: 13, marginTop: 2 }}>{error}</Text> : null}
    </View>
  );
};

export default FormCheckBox;