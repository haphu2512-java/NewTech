import React from 'react';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/styles/theme';

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <StatusBar style="auto" />
                        <AppNavigator />
                    </NavigationContainer>
                </SafeAreaProvider>
            </PaperProvider>
        </Provider>
    );
}
