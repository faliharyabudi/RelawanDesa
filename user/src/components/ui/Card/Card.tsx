import React from 'react';
import { View } from 'react-native';
import { CardProps } from './types';
import { styles } from './Card.styles';

export const Card: React.FC<CardProps> = ({ elevated = true, containerStyle, children, ...props }) => {
  return <View style={[styles.container, elevated && styles.elevated, containerStyle]} {...props}>{children}</View>;
};