import { StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../../../constants';
export const styles = StyleSheet.create({
  container: { backgroundColor: colors.background.paper, borderRadius: borderRadius.lg, overflow: 'hidden' },
  elevated: { ...shadows.medium }
});