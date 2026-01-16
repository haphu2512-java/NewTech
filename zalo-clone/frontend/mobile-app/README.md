# Zalo Clone - Mobile App (React Native)

React Native mobile application for Zalo Clone chat messaging.

## 📱 Features

- 🔐 Authentication (Login/Register)
- 💬 Chat List
- 💬 Chat Screen
- 👥 Contacts
- 👤 Profile Management
- 📱 Tab Navigation
- 🎨 Material Design UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Navigate to mobile-app folder
cd frontend/mobile-app

# Install dependencies
npm install

# Start Expo
npm start
```

### Running on Devices

```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

### Using Expo Go

1. Install Expo Go app on your phone
2. Run `npm start`
3. Scan QR code with Expo Go app

## 📁 Project Structure

```
mobile-app/
├── src/
│   ├── components/         # Reusable components
│   │   └── chat/
│   │       ├── ConversationItem.tsx
│   │       └── MessageBubble.tsx
│   ├── screens/            # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── chat/
│   │   │   ├── ChatListScreen.tsx
│   │   │   └── ChatScreen.tsx
│   │   ├── contacts/
│   │   │   └── ContactsScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── navigation/         # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── store/              # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── chatSlice.ts
│   │   ├── store.ts
│   │   └── hooks.ts
│   └── styles/             # Themes & styles
│       └── theme.ts
├── App.tsx                 # Root component
├── app.json               # Expo configuration
├── package.json
├── tsconfig.json
└── babel.config.js
```

## 🎨 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.73.2 | Mobile Framework |
| Expo | ~50.0.0 | Development Platform |
| TypeScript | 5.3.3 | Type Safety |
| React Navigation | 6.1.9 | Navigation |
| React Native Paper | 5.11.3 | UI Components |
| Redux Toolkit | 2.0.1 | State Management |
| Socket.io Client | 4.6.1 | Real-time |
| Axios | 1.6.5 | HTTP Client |

## 📱 Screens

### Auth Screens
- **LoginScreen**: Login form
- **RegisterScreen**: Registration form

### Main Screens
- **ChatListScreen**: List of conversations with search
- **ChatScreen**: Chat interface with messages
- **ContactsScreen**: Contact list with search
- **ProfileScreen**: User profile and settings

## 🎯 Navigation Structure

```
RootStack
├── Auth (when not logged in)
│   ├── Login
│   └── Register
└── Main (when logged in)
    ├── MainTab
    │   ├── ChatList
    │   ├── Contacts
    │   └── Profile
    └── Chat (Modal)
```

## 🔌 Shared Code

Uses shared types and services from `../shared/`:

```typescript
import { User } from '@shared/types/user';
import { userService } from '@shared/services/userService';
```

## 🎨 Customization

### Theme

Edit `src/styles/theme.ts`:

```typescript
export const colors = {
  primary: '#0084ff',      // Main brand color
  secondary: '#44bec7',    // Secondary color
  // ... more colors
};
```

## 📦 Build for Production

### Android APK

```bash
# Build APK
expo build:android

# Or with EAS
eas build --platform android
```

### iOS App

```bash
# Build for iOS (Mac only)
expo build:ios

# Or with EAS
eas build --platform ios
```

## 🔧 Development

### Adding New Screen

1. Create screen file in `src/screens/`
2. Add to navigation in `src/navigation/AppNavigator.tsx`
3. Import and use

### Adding Components

1. Create component in `src/components/`
2. Import in screens
3. Use with proper props

## 🐛 Troubleshooting

### Metro bundler issues

```bash
npm start -- --clear
```

### iOS build errors

```bash
cd ios
pod install
cd ..
npm run ios
```

### Android build errors

```bash
cd android
./gradlew clean
cd ..
npm run android
```

## 📝 TODO

- [ ] Implement API integration
- [ ] Add Socket.io real-time
- [ ] Image picker for avatars
- [ ] File attachments
- [ ] Voice messages
- [ ] Push notifications
- [ ] Dark mode
- [ ] Localization

## 📄 License

MIT

---

**Built with ❤️ using React Native and Expo**
