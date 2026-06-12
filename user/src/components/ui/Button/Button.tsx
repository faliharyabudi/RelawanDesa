import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { ButtonProps } from './types';
import { styles } from './Button.styles';
import { colors } from '../../../constants';

export const Button: React.FC<ButtonProps> = ({ 
  title, variant = 'primary', size = 'medium', loading, disabled, leftIcon, rightIcon, containerStyle, textStyle, ...props 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, styles[variant], styles[size], (disabled || loading) && styles.disabled, containerStyle]} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' ? colors.background.paper : colors.primary.main} /> : (
        <>
          {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
          <Text style={[styles.text, styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`], textStyle]}>{title}</Text>
          {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};