import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendMessage } from '../store/slices/chatSlice';
import { socketService } from '@shared/services/socketService';
import MessageBubble from './MessageBubble';
import type { SendMessageRequest } from '@shared/types/message';

interface ChatWindowProps {
    conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
    const dispatch = useAppDispatch();
    const { messages, conversations, typingUsers } = useAppSelector((state) => state.chat);
    const { user } = useAppSelector((state) => state.auth);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const currentConversation = conversations.find((c) => c._id === conversationId);
    const currentMessages = messages[conversationId] || [];
    const typingUsersList = typingUsers[conversationId] || [];

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !user) return;

        const messageData: SendMessageRequest = {
            conversationId,
            content: messageText,
            type: 'text',
        };

        await dispatch(sendMessage(messageData));
        setMessageText('');

        // Stop typing indicator
        if (isTyping) {
            socketService.sendTyping(conversationId, false);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);

        // Send typing indicator
        if (!isTyping) {
            socketService.sendTyping(conversationId, true);
            setIsTyping(true);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            socketService.sendTyping(conversationId, false);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    borderRadius: 0,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Avatar src={currentConversation?.avatarUrl}>
                    {currentConversation?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                        {currentConversation?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {typingUsersList.length > 0 ? 'Đang nhập...' : 'Đang hoạt động'}
                    </Typography>
                </Box>
            </Paper>

            {/* Messages Area */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {currentMessages.map((message) => (
                    <MessageBubble
                        key={message._id}
                        message={message}
                        isOwnMessage={message.senderId === user?.userId}
                    />
                ))}

                {/* Typing indicator */}
                {typingUsersList.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }} />
                        <Paper
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'white',
                                maxWidth: '60px',
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'grey.400',
                                        animation: 'typing 1.4s infinite ease-in-out',
                                        animationDelay: '0s',
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'grey.400',
                                        animation: 'typing 1.4s infinite ease-in-out',
                                        animationDelay: '0.2s',
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'grey.400',
                                        animation: 'typing 1.4s infinite ease-in-out',
                                        animationDelay: '0.4s',
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Box>
                )}

                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <IconButton color="primary" size="small">
                        <AttachFileIcon />
                    </IconButton>

                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Nhập tin nhắn..."
                        value={messageText}
                        onChange={handleTyping}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small">
                                        <EmojiEmotionsIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                            },
                        }}
                    />

                    <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                            '&:disabled': {
                                bgcolor: 'action.disabledBackground',
                            },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* CSS for typing animation */}
            <style>
                {`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.7;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
        `}
            </style>
        </Box>
    );
};

export default ChatWindow;
