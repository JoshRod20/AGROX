import React, { forwardRef } from 'react';
import { View, Text, TextInput, Animated } from 'react-native';
import { cropStyle } from '../styles/cropStyle';
// Componente reutilizable de input con animación shake y validación visual
// El borderBottom (línea) y su color provienen de cropStyle.inputContainer y cropStyle.errorInput
// El mensaje de error siempre aparece debajo de la línea, nunca la desplaza
// Cuando hay error, la línea se pone roja gracias a cropStyle.errorInput
// El shake anima tanto el input como la línea porque ambos están en el mismo Animated.View
const InputsFormFields = forwardRef(({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    onBlur,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    style,
    inputStyle,
    errorStyle,
    shakeAnim,
    editable = true,
    rightAdornment, // NUEVA PROP
    ...rest
}, ref) => {
    return (
        <View style={style}>
            {/* Label del campo, siempre arriba */}
            {label ? (
                <Text style={[cropStyle.label, { fontFamily: 'QuicksandBold', color: '#BC6C25' }]}>{label}</Text>
            ) : null}

            {/* Animated.View ahora soporta adornment derecho */}
            <Animated.View
                style={[
                    cropStyle.inputContainer,
                    error ? cropStyle.errorInput : null,
                    shakeAnim ? { transform: [{ translateX: shakeAnim }] } : null,
                    { flexDirection: 'row', alignItems: 'center' }
                ]}
            >
                <TextInput
                    ref={ref}
                    style={[
                        cropStyle.input,
                        { fontFamily: 'QuicksandRegular', color: '#000', flex: 1 },
                        inputStyle
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    onBlur={onBlur}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    editable={editable}
                    {...rest}
                />
                {rightAdornment ? (
                    <View style={{ marginLeft: 4 }}>{rightAdornment}</View>
                ) : null}
            </Animated.View>

            {/* Mensaje de error debajo de la línea */}
            {error ? (
                <Text style={[cropStyle.errorText, { fontFamily: 'QuicksandRegular', color: '#ff0000ff' }, errorStyle]}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
});

export default InputsFormFields;