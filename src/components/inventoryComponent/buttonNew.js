import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';
import { buttonNewStyle } from '../../styles/inventoryStyles/buttonNewStyle';

const ButtonNew = ({ title = 'Nuevo', onPress, style }) => {
	return (
		<TouchableOpacity
			activeOpacity={0.85}
			style={[buttonNewStyle.button, style]}
			onPress={onPress}
		>
			<View style={buttonNewStyle.content}>
				<Image
					source={require('../../assets/plus.png')}
					style={buttonNewStyle.icon}
				/>
				<Text style={buttonNewStyle.text}>{title}</Text>
			</View>
		</TouchableOpacity>
	);
};

export default ButtonNew;

