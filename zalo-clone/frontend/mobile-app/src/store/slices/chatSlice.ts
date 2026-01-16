import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Message, Conversation } from '@shared/types/message';

interface ChatState {
    conversations: Conversation[];
    messages: { [conversationId: string]: Message[] };
    activeConversationId: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    conversations: [],
    messages: {},
    activeConversationId: null,
    isLoading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setActiveConversation: (state, action: PayloadAction<string>) => {
            state.activeConversationId = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            if (!state.messages[message.conversationId]) {
                state.messages[message.conversationId] = [];
            }
            state.messages[message.conversationId].push(message);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setConversations, setActiveConversation, addMessage, setLoading, setError } = chatSlice.actions;
export default chatSlice.reducer;
