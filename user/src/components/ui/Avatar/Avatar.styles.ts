import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../constants';
export const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary.light, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  text: { fontFamily: typography.fonts.extraBold, color: colors.background.paper }
});