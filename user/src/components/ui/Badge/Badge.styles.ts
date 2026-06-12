import { StyleSheet } from 'react-native';
import { borderRadius, typography, spacing } from '../../../constants';
export const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.round, alignSelf: 'flex-start' },
  text: { fontFamily: typography.fonts.bold, fontSize: typography.sizes.xs, color: '#fff' }
});