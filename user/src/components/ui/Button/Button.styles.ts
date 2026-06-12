import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../../constants';
export const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.md },
  primary: { backgroundColor: colors.primary.main },
  secondary: { backgroundColor: colors.secondary.main },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary.main },
  ghost: { backgroundColor: 'transparent' },
  small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  medium: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  large: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  text: { fontFamily: typography.fonts.bold, textAlign: 'center' },
  textPrimary: { color: colors.background.paper },
  textSecondary: { color: colors.text.primary },
  textOutline: { color: colors.primary.main },
  textGhost: { color: colors.primary.main },
  disabled: { opacity: 0.5 }
});