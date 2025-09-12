import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formCheckBoxStyle } from '../styles/formCheckBoxStyle';

// Componente reutilizable para selección tipo radio (método de riego, etc.)
const FormCheckBox = ({
  label = '',
  options = [],
  value = '',
  onChange,
  error = '',
  style,
  labelStyle,
  optionStyle,
}) => {
  return (
    <View style={[formCheckBoxStyle.container, style]}>
      {label ? (
        <Text style={[formCheckBoxStyle.label, labelStyle]}>
          {label}
        </Text>
      ) : null}

      {/* Grid de opciones en 2 columnas */}
      <View style={formCheckBoxStyle.row}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[formCheckBoxStyle.optionContainer, optionStyle]}
            onPress={() => onChange(option)}
            activeOpacity={0.7}
          >
            <View
              style={[
                formCheckBoxStyle.checkBox,
                { backgroundColor: value === option ? '#2E7D32' : '#fff' },
              ]}
            >
              {value === option && (
                <Text style={formCheckBoxStyle.checkStyle}>✓</Text>
              )}
            </View>
            <Text style={formCheckBoxStyle.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={formCheckBoxStyle.errorText}>{error}</Text> : null}
    </View>
  );
};

export default FormCheckBox;