# Frontend Development Guide - ReactJS & React Native

## Overview

Dự án Zalo Clone sử dụng **ReactJS** cho web application và **React Native** cho mobile application, cho phép chia sẻ code và logic giữa các nền tảng.

---

## 📱 Web App - ReactJS

### Tech Stack

- **ReactJS 18+**
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication
- **Material-UI / Ant Design** - UI components
- **Vite** - Build tool (fast & modern)

### Project Structure

```
frontend/web-app/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/          # Common UI components
│   │   ├── chat/            # Chat components
│   │   ├── user/            # User components
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Chat.tsx
│   │   └── Profile.tsx
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   │   ├── userSlice.ts
│   │   │   ├── chatSlice.ts
│   │   │   └── messageSlice.ts
│   │   └── store.ts
│   ├── services/            # API services
│   │   ├── api.ts           # Axios config
│   │   ├── userService.ts
│   │   ├── messageService.ts
│   │   └── socket.ts        # Socket.io config
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   └── useChat.ts
│   ├── types/               # TypeScript types
│   │   ├── user.ts
│   │   ├── message.ts
│   │   └── chat.ts
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Setup & Installation

```bash
cd frontend/web-app

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "@mui/material": "^5.15.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### API Integration Example

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// src/services/userService.ts
import { api } from './api';

export const userService = {
  register: (data: RegisterRequest) => 
    api.post('/api/users/register', data),
  
  login: (credentials: LoginRequest) => 
    api.post('/api/users/login', credentials),
  
  getProfile: (userId: string) => 
    api.get(`/api/users/${userId}`),
  
  updateProfile: (userId: string, data: UpdateProfileRequest) => 
    api.put(`/api/users/${userId}`, data),
};
```

### WebSocket Integration

```typescript
// src/services/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8083';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
```

---

## 📱 Mobile App - React Native

### Tech Stack

- **React Native** - Latest stable
- **TypeScript**
- **React Navigation** - Navigation
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Socket.io-client** - Real-time
- **React Native Paper** - UI library
- **Expo** (Optional) - Development tools

### Project Structure

```
frontend/mobile-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── chat/
│   │   └── user/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── AuthNavigator.tsx
│   ├── store/
│   │   ├── slices/
│   │   └── store.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── userService.ts
│   │   └── socket.ts
│   ├── hooks/
│   ├── types/
│   └── utils/
├── App.tsx
├── package.json
└── tsconfig.json
```

### Setup & Installation

#### Option 1: Using Expo (Recommended for beginners)

```bash
cd frontend/mobile-app

# Install Expo CLI globally
npm install -g expo-cli

# Create new Expo project
npx create-expo-app@latest . --template

# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

#### Option 2: React Native CLI (More control)

```bash
cd frontend/mobile-app

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "react-native-paper": "^5.11.0",
    "react-native-vector-icons": "^10.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-image-picker": "^7.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.3.0"
  }
}
```

### Navigation Example

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

---

## 🔄 Code Sharing Between Web & Mobile

### Shared Code Structure

```
frontend/
├── shared/                  # Shared code
│   ├── types/              # TypeScript types
│   │   ├── user.ts
│   │   ├── message.ts
│   │   └── chat.ts
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── services/           # API services
│   │   ├── api.config.ts
│   │   ├── userService.ts
│   │   └── messageService.ts
│   └── store/              # Redux store
│       ├── slices/
│       └── store.ts
├── web-app/                # ReactJS web
└── mobile-app/             # React Native mobile
```

### Shared Types Example

```typescript
// frontend/shared/types/user.ts
export interface User {
  userId: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
```

### Using Shared Code

```typescript
// In web-app
import { User, LoginRequest } from '../../shared/types/user';
import { userService } from '../../shared/services/userService';

// In mobile-app
import { User, LoginRequest } from '../../shared/types/user';
import { userService } from '../../shared/services/userService';
```

---

## 🎨 UI/UX Best Practices

### Web (ReactJS)

1. **Responsive Design**
   - Mobile-first approach
   - Use CSS Grid/Flexbox
   - Media queries

2. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

3. **Performance**
   - Code splitting
   - Lazy loading
   - Memoization (React.memo, useMemo)

### Mobile (React Native)

1. **Platform-Specific Design**
   - iOS vs Android differences
   - Platform-specific components
   - Native look and feel

2. **Performance**
   - FlatList for long lists
   - Image optimization
   - Avoid unnecessary re-renders

3. **User Experience**
   - Loading states
   - Error handling
   - Offline support

---

## 🔐 Authentication Flow

### Login Process

```typescript
// Web & Mobile (shared logic)
export const login = async (credentials: LoginRequest) => {
  try {
    const response = await api.post('/api/users/login', credentials);
    const { token, user } = response.data;
    
    // Store token
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    // Connect socket
    socketService.connect(token);
    
    return { token, user };
  } catch (error) {
    throw error;
  }
};
```

---

## 🚀 Deployment

### Web App

```bash
# Build
npm run build

# Deploy to various platforms:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
# - Nginx server
```

### Mobile App

#### iOS (Apple App Store)

```bash
# Build for production
cd ios
fastlane build

# Submit to App Store
fastlane release
```

#### Android (Google Play Store)

```bash
# Build APK/AAB
cd android
./gradlew assembleRelease

# Or use Expo
expo build:android
```

---

## 📚 Resources

### ReactJS
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)

### React Native
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

### Learning
- [React Native School](https://www.reactnativeschool.com/)
- [Full Stack Open](https://fullstackopen.com/)
- [React Native Express](https://www.reactnative.express/)
