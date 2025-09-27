// src/components/HoursInput.js
import React, { forwardRef } from "react";
import { View, Text, TextInput, Animated } from "react-native";
import { hoursInputStyle } from "../styles/hoursInputStyle";

// Adornments disponibles para HoursInput
const HOURS_ADORNMENTS = {
  hours: "Horas",
  liters: "Litros",
};

const HoursInput = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      placeholder = "0",
      error,
      shakeAnim,
      unit = "hours", // "hours" | "liters"
      editable = true,
      ...rest
    },
    ref
  ) => {
    const adornmentText = HOURS_ADORNMENTS[unit] || HOURS_ADORNMENTS.hours;

    return (
      <View style={hoursInputStyle.container}>
        <Text style={hoursInputStyle.label}>
          {label}
        </Text>
        <View style={hoursInputStyle.inputRow}>
          <Animated.View
            style={[
              hoursInputStyle.inputContainer,
              error ? hoursInputStyle.errorInput : null,
              shakeAnim ? { transform: [{ translateX: shakeAnim }] } : null,
            ]}
          >
            <TextInput
              ref={ref}
              style={hoursInputStyle.input}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              editable={editable}
              {...rest}
            />
          </Animated.View>
          <View style={hoursInputStyle.adornmentContainer}>
            <Text style={hoursInputStyle.adornmentText}>
              {adornmentText}
            </Text>
          </View>
        </View>
        {error ? (
          <Text style={hoursInputStyle.errorText}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
);

export default HoursInput;