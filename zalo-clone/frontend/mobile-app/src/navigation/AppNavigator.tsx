import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ContactsScreen from '../screens/contacts/ContactsScreen';

// Navigation Types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Chat: { conversationId: string; userName: string };
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type MainTabParamList = {
    ChatList: undefined;
    Contacts: undefined;
    Profile: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack Navigator
function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

// Main Tab Navigator
function MainNavigator() {
    return (
        <MainTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = 'home';

                    if (route.name === 'ChatList') {
                        iconName = focused ? 'message' : 'message-outline';
                    } else if (route.name === 'Contacts') {
                        iconName = focused ? 'account-group' : 'account-group-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0084ff',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <MainTab.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{ title: 'Tin nhắn' }}
            />
            <MainTab.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{ title: 'Danh bạ' }}
            />
            <MainTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Cá nhân' }}
            />
        </MainTab.Navigator>
    );
}

// App Navigator
export default function AppNavigator() {
    // TODO: Check authentication status from Redux
    const isAuthenticated = false;

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <>
                    <RootStack.Screen name="Main" component={MainNavigator} />
                    <RootStack.Screen
                        name="Chat"
                        component={ChatScreen}
                        options={{ headerShown: true, title: 'Chat' }}
                    />
                </>
            ) : (
                <RootStack.Screen name="Auth" component={AuthNavigator} />
            )}
        </RootStack.Navigator>
    );
}
