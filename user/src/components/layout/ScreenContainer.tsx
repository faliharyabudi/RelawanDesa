import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../constants';

interface Props { children: React.ReactNode; style?: StyleProp<ViewStyle>; }
export const ScreenContainer: React.FC<Props> = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background.default } });