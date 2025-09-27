// src/components/CostInput.js
import React, { forwardRef } from "react";
import { View, Text, TextInput, Animated } from "react-native";
import { costInputStyle } from "../styles/costInputStyle";

// Adornments disponibles para CostInput
const COST_ADORNMENTS = {
  currency: "C$",
  kilograms: "kg"
};

const CostInput = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      placeholder = "0",
      error,
      shakeAnim,
      unit = "currency", // "currency" | "kilograms"
      editable = true,
      ...rest
    },
    ref
  ) => {
    const adornmentText = COST_ADORNMENTS[unit] || COST_ADORNMENTS.currency;

    return (
      <View style={costInputStyle.container}>
        <Text style={costInputStyle.label}>
          {label}
        </Text>
        <View style={costInputStyle.inputRow}>
          <Animated.View
            style={[
              costInputStyle.inputContainer,
              error ? costInputStyle.errorInput : null,
              shakeAnim ? { transform: [{ translateX: shakeAnim }] } : null,
            ]}
          >
            <TextInput
              ref={ref}
              style={costInputStyle.input}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              editable={editable}
              {...rest}
            />
          </Animated.View>
          <View style={costInputStyle.adornmentContainer}>
            <Text style={costInputStyle.adornmentText}>
              {adornmentText}
            </Text>
          </View>
        </View>
        {error ? (
          <Text style={costInputStyle.errorText}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
);

export default CostInput;