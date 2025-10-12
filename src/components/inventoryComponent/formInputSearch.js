import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { formInputSearchStyle } from '../../styles/inventoryStyles/formInputSearchStyle';
import { Ionicons } from '@expo/vector-icons';

const FormInputSearch = ({
	placeholder = 'Buscar...',
	value,
	onChangeText,
	onPressButton,
	style,
}) => {
	return (
		<View style={[formInputSearchStyle.container, style]}>
			<TextInput
				style={formInputSearchStyle.input}
				placeholder={placeholder}
				placeholderTextColor="#C8C2C2"
				value={value}
				onChangeText={onChangeText}
			/>
			<TouchableOpacity
				style={formInputSearchStyle.searchButton}
				onPress={onPressButton}
				activeOpacity={0.8}
			>
				<Image
					source={require('../../assets/search.png')}
					style={formInputSearchStyle.searchIcon}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default FormInputSearch;

