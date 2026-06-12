import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { InputProps } from './types';
import { styles } from './Input.styles';
import { colors } from '../../../constants';

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, rightIcon, containerStyle, style, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput style={[styles.input, style]} placeholderTextColor={colors.text.hint} {...props} />
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};