import { DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0084ff',
        accent: '#44bec7',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#000000',
        error: '#f44336',
        notification: '#ff6b6b',
    },
    roundness: 8,
};

export const colors = {
    primary: '#0084ff',
    secondary: '#44bec7',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#e0e0e0',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
    messageSent: '#0084ff',
    messageReceived: '#e4e6eb',
    online: '#4caf50',
    offline: '#9e9e9e',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold' as const,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
    },
    body: {
        fontSize: 16,
    },
    caption: {
        fontSize: 12,
        color: colors.textSecondary,
    },
};
