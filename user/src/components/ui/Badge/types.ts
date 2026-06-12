import { ViewProps } from 'react-native';
export interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
}