import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import InputsFormFields from '../../components/inputsFormFields';
import { inputSearchStyle } from '../../styles/activitiesCrop/inputSearchStyle';

/**
 * InputSearch - Input de solo lectura con botón a la derecha que abre un modal de selección (ModalList)
 * Props:
 * - label, value, placeholder, error, shakeAnim (como InputsFormFields)
 * - editable?: boolean (default false) // normalmente NO editable; muestra el valor seleccionado
 * - onOpen: () => void  // abre un modal externo
 * - rightIcon?: ReactNode // icono opcional (por defecto lupa/lista)
 * - buttonText?: string // texto opcional en el botón (default 'Seleccionar')
 */
const InputSearch = ({
  label,
  value,
  placeholder,
  error,
  shakeAnim,
  editable = false,
  onOpen,
  rightIcon,
}) => {
  const icon = useMemo(
    () => (
      rightIcon || (
        <Image
          source={require('../../assets/search.png')}
          style={inputSearchStyle.icon}
        />
      )
    ),
    [rightIcon]
  );

  const rightAdornment = (
    <TouchableOpacity
      style={inputSearchStyle.adornmentButton}
      activeOpacity={0.85}
      onPress={onOpen}
      hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
    >
      {icon}
    </TouchableOpacity>
  );

  return (
    <View>
      <InputsFormFields
        label={label}
        value={value}
        placeholder={placeholder}
        error={error}
        shakeAnim={shakeAnim}
        editable={editable}
        rightAdornment={rightAdornment}
      />
    </View>
  );
};

export default InputSearch;
