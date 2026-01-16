import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { messageService } from '@shared/services/messageService';
import { socketService } from '@shared/services/socketService';
import type { Message, Conversation, SendMessageRequest } from '@shared/types/message';

interface ChatState {
    conversations: Conversation[];
    messages: { [conversationId: string]: Message[] };
    activeConversationId: string | null;
    isLoading: boolean;
    error: string | null;
    typingUsers: { [conversationId: string]: string[] };
}

const initialState: ChatState = {
    conversations: [],
    messages: {},
    activeConversationId: null,
    isLoading: false,
    error: null,
    typingUsers: {},
};

// Async thunks
export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            const conversations = await messageService.getConversations();
            return conversations;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (conversationId: string, { rejectWithValue }) => {
        try {
            const messages = await messageService.getMessages(conversationId);
            return { conversationId, messages };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (data: SendMessageRequest, { rejectWithValue }) => {
        try {
            const message = await messageService.sendMessage(data);
            return message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveConversation: (state, action: PayloadAction<string>) => {
            state.activeConversationId = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            if (!state.messages[message.conversationId]) {
                state.messages[message.conversationId] = [];
            }
            state.messages[message.conversationId].push(message);

            // Update conversation last message
            const conversation = state.conversations.find(c => c._id === message.conversationId);
            if (conversation) {
                conversation.lastMessage = message;
                conversation.updatedAt = message.timestamp;
            }
        },
        updateMessageStatus: (state, action: PayloadAction<{ messageId: string; status: 'delivered' | 'read' }>) => {
            const { messageId, status } = action.payload;
            Object.values(state.messages).forEach((messages) => {
                const message = messages.find((m) => m._id === messageId);
                if (message) {
                    message.status = status;
                }
            });
        },
        setTypingUser: (state, action: PayloadAction<{ conversationId: string; userId: string; isTyping: boolean }>) => {
            const { conversationId, userId, isTyping } = action.payload;
            if (!state.typingUsers[conversationId]) {
                state.typingUsers[conversationId] = [];
            }
            const typingList = state.typingUsers[conversationId];
            const index = typingList.indexOf(userId);

            if (isTyping && index === -1) {
                typingList.push(userId);
            } else if (!isTyping && index > -1) {
                typingList.splice(index, 1);
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch conversations
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch messages
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                const { conversationId, messages } = action.payload;
                state.messages[conversationId] = messages;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Send message
        builder
            .addCase(sendMessage.pending, (state) => {
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const message = action.payload;
                if (!state.messages[message.conversationId]) {
                    state.messages[message.conversationId] = [];
                }
                state.messages[message.conversationId].push(message);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { setActiveConversation, addMessage, updateMessageStatus, setTypingUser, clearError } = chatSlice.actions;
export default chatSlice.reducer;
