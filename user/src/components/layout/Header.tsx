import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../constants';

interface Props { title: string; subtitle?: string; }
export const Header: React.FC<Props> = ({ title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);
const styles = StyleSheet.create({
  container: { padding: spacing.lg, backgroundColor: colors.primary.main },
  title: { fontFamily: typography.fonts.bold, fontSize: typography.sizes.xl, color: colors.background.paper },
  subtitle: { fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, color: colors.background.paper, opacity: 0.8 }
});