# Frontend - ReactJS & React Native

### 1. **Project Structure** 📁

```
frontend/
├── shared/                  # Code sharing giữa web & mobile
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Utility functions
│   ├── services/           # API services
│   └── store/              # Redux store
│
├── web-app/                # ReactJS Web App
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── mobile-app/             # React Native Mobile App
    ├── src/
    │   ├── components/     # React Native components
    │   ├── screens/        # Screen components
    │   ├── navigation/     # Navigation setup
    │   └── App.tsx
    └── package.json
```

### 2. **Tech Stack Chi Tiết** 🛠️

#### Web App (ReactJS)
```json
{
  "core": "React 18+",
  "language": "TypeScript",
  "routing": "React Router 6",
  "state": "Redux Toolkit",
  "http": "Axios",
  "realtime": "Socket.io-client",
  "ui": "Material-UI / Ant Design",
  "build": "Vite"
}
```

#### Mobile App (React Native)
```json
{
  "core": "React Native",
  "language": "TypeScript",
  "navigation": "React Navigation 6",
  "state": "Redux Toolkit",
  "http": "Axios",
  "realtime": "Socket.io-client",
  "ui": "React Native Paper",
  "platform": "iOS + Android"
}
```

### 3. **Code Sharing Example** 💡

#### Shared Types
```typescript
// frontend/shared/types/user.ts
export interface User {
  userId: string;
  username: string;
  email: string;
  status: 'online' | 'offline' | 'away';
}
```

#### Sử dụng trong Web
```typescript
// frontend/web-app/src/components/UserProfile.tsx
import { User } from '../../shared/types/user';

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  return <div>{user.username}</div>;
};
```

#### Sử dụng trong Mobile
```typescript
// frontend/mobile-app/src/screens/ProfileScreen.tsx
import { User } from '../../shared/types/user';

const ProfileScreen: React.FC<{ user: User }> = ({ user }) => {
  return <Text>{user.username}</Text>;
};
```

### 4. **Quick Start** 🚀

#### Web App
```bash
cd frontend/web-app
npm install
npm run dev
# Open http://localhost:5173
```

#### Mobile App (với Expo)
```bash
cd frontend/mobile-app
npm install
npx expo start
# Scan QR code với Expo Go app
```

#### Mobile App (React Native CLI)
```bash
cd frontend/mobile-app
npm install

# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

### 5. **Documentation Links** 📚

- **[Frontend Guide](docs/FRONTEND_GUIDE.md)** - Complete guide cho ReactJS & React Native
- **[Architecture](../README.md)** - System architecture details
- **[AWS Integration](docs/QUICKSTART_AWS.md)** - AWS services setup

### 6. **Next Steps** ⏭️

1. ✅ Cập nhật README files với ReactJS và React Native
2. ✅ Tạo Frontend Development Guide
3. 🔜 Implement web app với ReactJS
4. 🔜 Implement mobile app với React Native
5. 🔜 Setup shared code structure
6. 🔜 Integrate với backend APIs
7. 🔜 Setup WebSocket cho real-time features