import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../../constants';
export const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm, color: colors.text.primary, marginBottom: spacing.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border.main, borderRadius: borderRadius.md, backgroundColor: colors.background.paper, paddingHorizontal: spacing.sm },
  inputContainerError: { borderColor: colors.status.error },
  input: { flex: 1, fontFamily: typography.fonts.medium, fontSize: typography.sizes.md, color: colors.text.primary, paddingVertical: spacing.md },
  errorText: { fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, color: colors.status.error, marginTop: spacing.xs }
});