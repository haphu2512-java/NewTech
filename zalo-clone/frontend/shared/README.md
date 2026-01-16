# Shared Frontend Code

This directory contains shared code between web and mobile applications.

## Structure

```
shared/
├── types/              # TypeScript type definitions
│   ├── user.ts        # User-related types
│   └── message.ts     # Message & conversation types
│
└── services/          # API & Socket services
    ├── api.ts         # Axios HTTP client configuration
    ├── userService.ts # User API endpoints
    ├── messageService.ts # Message API endpoints
    └── socketService.ts  # WebSocket service
```

## Usage

Import shared code using path aliases:

### In Web App
```typescript
import { User } from '@shared/types/user';
import { userService } from '@shared/services/userService';
```

### In Mobile App
```typescript
import { User } from '../../shared/types/user';
import { userService } from '../../shared/services/userService';
```

## Benefits

- **Code Reusability**: Write once, use in both web and mobile
- **Type Safety**: Shared TypeScript types ensure consistency
- **Maintainability**: Update API logic in one place
- **Consistency**: Same business logic across platforms

## Available Services

### `api.ts`
- Axios instance with interceptors
- Auto-add JWT token
- Handle 401 unauthorized
- Centralized error handling

### `userService.ts`
- `register(data)` - Create new user
- `login(credentials)` - Authenticate user
- `getProfile(userId)` - Get user info
- `updateProfile(userId, data)` - Update profile
- `logout()` - End session

### `messageService.ts`
- `getConversations()` - List all conversations
- `getMessages(conversationId)` - Get chat history
- `sendMessage(data)` - Send new message
- `markAsRead(messageId)` - Mark message as read
- `deleteMessage(messageId)` - Delete message
- `searchMessages(query)` - Search in messages

### `socketService.ts`
- `connect(token)` - Establish WebSocket connection
- `disconnect()` - Close connection
- `sendMessage(message)` - Emit message event
- `sendTyping(conversationId, isTyping)` - Typing indicator
- `on(event, callback)` - Subscribe to events
- `off(event, callback)` - Unsubscribe

## Type Definitions

### User Types
```typescript
interface User {
  userId: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: number;
}
```

### Message Types
```typescript
interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'emoji';
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}
```

## Adding New Services

1. Create service file in `services/`
2. Export service functions
3. Use in web/mobile apps via imports

Example:
```typescript
// shared/services/friendService.ts
import api from './api';

export const friendService = {
  getFriends: async () => {
    const response = await api.get('/friends');
    return response.data;
  },
  
  sendRequest: async (userId: string) => {
    const response = await api.post('/friends/request', { userId });
    return response.data;
  },
};
```

## Environment Configuration

Services use environment variables from the consuming app:

- Web: `VITE_API_BASE_URL`, `VITE_SOCKET_URL`
- Mobile: From config file or `.env`

## Testing

Shared services can be tested independently:

```bash
# Run tests
npm test shared/services
```
