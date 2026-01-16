# Zalo Clone - Web App (ReactJS)

Modern chat messaging web application built with ReactJS, TypeScript, and Material-UI.

## ✨ Features

- 🔐 **Authentication**: Login & Register with JWT
- 💬 **Real-time Chat**: Instant messaging with Socket.io
- 👥 **Conversations**: Manage multiple conversations
- ⌨️ **Typing Indicators**: See when others are typing
- ✅ **Read Receipts**: Message delivery and read status
- 🎨 **Material Design**: Beautiful UI with Material-UI
- 📱 **Responsive**: Works on all screen sizes
- 🔔 **Notifications**: Toast notifications for events

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend services running (User Service on 8080, Message Service on 8083)

### Installation

```bash
# Navigate to web-app folder
cd frontend/web-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
web-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ChatWindow.tsx
│   │   ├── ConversationList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── PrivateRoute.tsx
│   ├── pages/           # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ChatPage.tsx
│   ├── store/           # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── chatSlice.ts
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── vite-env.d.ts    # Type definitions
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8083
```

### API Endpoints

The app connects to these backend services:

- **User Service** (8080): `/api/users/*`
- **Message Service** (8083): `/api/messages/*`
- **WebSocket** (8083): Real-time messaging

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **date-fns** - Date formatting

## 📱 Features Breakdown

### Authentication

- JWT-based authentication
- Auto-redirect on session expire
- Persistent login with localStorage

```typescript
// Login
const result = await dispatch(login({ username, password }));

// Auto-redirect on 401
api.interceptors.response.use(...)
```

### Real-time Messaging

- Instant message delivery
- Typing indicators
- Online/offline status
- Message read receipts

```typescript
// Connect to WebSocket
socketService.connect(token);

// Listen for new messages
socketService.on('message:new', (message) => {
  dispatch(addMessage(message));
});
```

### State Management

Redux Toolkit slices:

- `authSlice`: User authentication and profile
- `chatSlice`: Messages and conversations

```typescript
// Fetch conversations
dispatch(fetchConversations());

// Send message
dispatch(sendMessage({ conversationId, content, type }));
```

## 🎯 Usage Example

### Send a Message

```typescript
import { useAppDispatch } from '../store/hooks';
import { sendMessage } from '../store/slices/chatSlice';

const handleSend = async () => {
  await dispatch(sendMessage({
    conversationId: 'conv-123',
    content: 'Hello!',
    type: 'text'
  }));
};
```

### Listen for New Messages

```typescript
import { socketService } from '@shared/services/socketService';

socketService.on('message:new', (message) => {
  // Handle new message
  console.log('New message:', message);
});
```

## 🔌 API Integration

### Shared Services

All API calls use shared services from `frontend/shared/`:

```typescript
// User service
import { userService } from '@shared/services/userService';
await userService.login({ username, password });

// Message service
import { messageService } from '@shared/services/messageService';
await messageService.getConversations();

// Socket service
import { socketService } from '@shared/services/socketService';
socketService.connect(token);
```

## 🐛 Troubleshooting

### Cannot connect to backend

1. Ensure backend services are running:
   ```bash
   # User Service should be on :8080
   # Message Service should be on :8083
   ```

2. Check CORS settings in backend

3. Verify `.env.local` URLs

### Socket connection fails

1. Check if Message Service WebSocket is running on 8083
2. Verify firewall settings
3. Check browser console for errors

### Build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📝 Scripts

```json
{
  "dev": "vite",              // Development server
  "build": "tsc && vite build", // Production build
  "preview": "vite preview",   // Preview production build
  "lint": "eslint ."           // Run linter
}
```

## 🚧 TODO

- [ ] File upload (images, videos, documents)
- [ ] Emoji picker
- [ ] Voice messages
- [ ] Video calls
- [ ] Group chat creation
- [ ] User search
- [ ] Dark mode
- [ ] Message reactions
- [ ] Message forwarding
- [ ] Chat history export

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

---

**Made with ❤️ using ReactJS and Material-UI**
