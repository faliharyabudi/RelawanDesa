import React from 'react';
import { View, Text } from 'react-native';
import { BadgeProps } from './types';
import { styles } from './Badge.styles';
import { colors } from '../../../constants';

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style, ...props }) => {
  const getBgColor = () => {
    switch(variant) {
      case 'success': return colors.status.success;
      case 'error': return colors.status.error;
      case 'warning': return colors.status.warning;
      case 'info': return colors.status.info;
      default: return colors.primary.main;
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: getBgColor() }, style]} {...props}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};