import React from 'react';
import { View, Text, Image } from 'react-native';
import { AvatarProps } from './types';
import { styles } from './Avatar.styles';

export const Avatar: React.FC<AvatarProps> = ({ source, fallbackText, size = 40 }) => {
  const radius = size / 2;
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }]}>
      {source ? (
        <Image source={source} style={styles.image} />
      ) : (
        <Text style={[styles.text, { fontSize: size * 0.4 }]}>{fallbackText.charAt(0).toUpperCase()}</Text>
      )}
    </View>
  );
};