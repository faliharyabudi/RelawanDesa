import { ViewProps, StyleProp, ViewStyle } from 'react-native';
export interface CardProps extends ViewProps {
  elevated?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}