import React from 'react';
import { TouchableOpacity, Text, TextStyle, ViewStyle } from 'react-native';

interface Props {
	text: string;
	action: () => void;
	textStyle: TextStyle;
	wrapperStyle: ViewStyle;
	disabled?: boolean;
}

function Button(props: Props) {
	return (
		<TouchableOpacity
			onPress={props.action}
			style={[props.wrapperStyle, { opacity: props.disabled ? 0.6 : 1 }]}
			disabled={props.disabled}>
			<Text style={props.textStyle}>{props.text}</Text>
		</TouchableOpacity>
	);
}

export default Button;
