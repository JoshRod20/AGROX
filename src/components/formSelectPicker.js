import React, { forwardRef } from "react";
import { View, Text, Animated } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Puedes importar tu estilo global aquí o pasarlo por props
import signUpStyle from "../styles/signUpStyle";
import { cropStyle } from "../styles/cropStyle";

const FormSelectPicker = forwardRef(
  (
    {
      label,
      value,
      setValue,
      open,
      setOpen,
      items,
      placeholder,
      error,
      shakeAnim,
      dropDownProps = {},
      containerStyle = {},
      pickerStyle = {},
      dropDownContainerStyle = {},
      placeholderStyle = {},
      textStyle = {},
    },
    ref
  ) => {
    return (
      <View style={{ marginBottom: hp("2%") }}>
        {label && (
          <Text
            style={[
              { fontFamily: "QuicksandBold", marginRight: 40 },
              cropStyle.label,
            ]}
          >
            {label}
          </Text>
        )}
        <Animated.View
          ref={ref}
          style={[
            signUpStyle.inputEmailContainer,
            error && signUpStyle.errorInput,
            {
              transform: [{ translateX: shakeAnim || 0 }],
              zIndex: open ? 5000 : 1000,
            },
            containerStyle,
          ]}
        >
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            placeholder={placeholder}
            placeholderStyle={[
              { fontFamily: "QuicksandRegular" },
              signUpStyle.placeholder,
              placeholderStyle,
            ]}
            style={[
              signUpStyle.inputEmail,
              { borderWidth: 0, backgroundColor: "#fff" },
              pickerStyle,
            ]}
            textStyle={{
              fontFamily: "QuicksandRegular",
              fontSize: wp("3.5%"),
              ...textStyle,
            }}
            dropDownContainerStyle={[
              signUpStyle.dropDownContainer,
              error && signUpStyle.errorInput,
              dropDownContainerStyle,
            ]}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
              maxHeight: hp("30%"),
            }}
            zIndex={open ? 6000 : 1000}
            zIndexInverse={open ? 1000 : 6000}
            {...dropDownProps}
          />
        </Animated.View>
        {error && <Text style={signUpStyle.errorText}>{error}</Text>}
      </View>
    );
  }
);

export default FormSelectPicker;
