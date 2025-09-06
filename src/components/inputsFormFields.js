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
    ...rest
}, ref) => {
    return (
        <View style={style}>
            {/* Label del campo, siempre arriba */}
            {label ? (
                <Text style={[cropStyle.label, { fontFamily: 'QuicksandBold', color: '#BC6C25' }]}>{label}</Text>
            ) : null}

            {/*
                Animated.View aplica la animación shake tanto al input como a la línea (borderBottom)
                cropStyle.inputContainer define el borderBottomWidth y borderColor (verde por defecto)
                Si hay error, cropStyle.errorInput cambia el borderColor a rojo
            */}
            <Animated.View
                style={[
                    cropStyle.inputContainer, // Aquí se define la línea inferior (borderBottom)
                    error ? cropStyle.errorInput : null, // Si hay error, la línea se pone roja
                    shakeAnim ? { transform: [{ translateX: shakeAnim }] } : null
                ]}
            >
                {/* TextInput: el campo editable */}
                <TextInput
                    ref={ref}
                    style={[
                        cropStyle.input, // Estilo base del input
                        { fontFamily: 'QuicksandRegular', color: '#000' },
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
            </Animated.View>

            {/*
                Mensaje de error:
                Siempre aparece debajo de la línea, nunca la desplaza ni la superpone.
                cropStyle.errorText define el color y fuente del mensaje.
            */}
            {error ? (
                <Text style={[cropStyle.errorText, { fontFamily: 'QuicksandRegular', color: '#ff0000ff' }, errorStyle]}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
});

export default InputsFormFields;