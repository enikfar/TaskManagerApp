import { MD3DarkTheme as DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Primary colors
    primary: '#8B5CF6', // Purple accent
    primaryContainer: '#4C1D95',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#E9D5FF',
    
    // Secondary colors
    secondary: '#A78BFA',
    secondaryContainer: '#5B21B6',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#E9D5FF',
    
    // Background colors
    background: '#0F172A', // Dark blue background
    surface: '#1E293B', // Slightly lighter background for cards
    surfaceVariant: '#334155', // Even lighter for surface variants
    onBackground: '#F8FAFC', // White text
    onSurface: '#F8FAFC',
    onSurfaceVariant: '#CBD5E1', // Light gray text
    
    // Error colors
    error: '#EF4444',
    onError: '#FFFFFF',
    errorContainer: '#7F1D1D',
    onErrorContainer: '#FECACA',
    
    // Success colors
    success: '#10B981',
    onSuccess: '#FFFFFF',
    successContainer: '#065F46',
    onSuccessContainer: '#A7F3D0',
    
    // Warning colors
    warning: '#F59E0B',
    onWarning: '#FFFFFF',
    warningContainer: '#92400E',
    onWarningContainer: '#FDE68A',
    
    // Info colors
    info: '#3B82F6',
    onInfo: '#FFFFFF',
    infoContainer: '#1E40AF',
    onInfoContainer: '#BFDBFE',
    
    // Outline colors
    outline: '#475569',
    outlineVariant: '#334155',
    
    // Elevation colors
    elevation: {
      level0: 'transparent',
      level1: '#1E293B',
      level2: '#1E293B',
      level3: '#1E293B',
      level4: '#1E293B',
      level5: '#1E293B',
    },
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
};

export type AppTheme = typeof theme;
