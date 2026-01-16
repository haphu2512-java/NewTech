import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchConversations, fetchMessages, setActiveConversation, addMessage, updateMessageStatus, setTypingUser } from '../store/slices/chatSlice';
import { socketService } from '@shared/services/socketService';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import type { Message, TypingEvent } from '@shared/types/message';

const ChatPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { activeConversationId } = useAppSelector((state) => state.chat);
    const { token } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Fetch conversations
        dispatch(fetchConversations());

        // Setup socket listeners
        if (token) {
            socketService.connect(token);

            socketService.on('message:new', (message: Message) => {
                dispatch(addMessage(message));
            });

            socketService.on('message:delivered', (messageId: string) => {
                dispatch(updateMessageStatus({ messageId, status: 'delivered' }));
            });

            socketService.on('message:read', (messageId: string) => {
                dispatch(updateMessageStatus({ messageId, status: 'read' }));
            });

            socketService.on('typing', (event: TypingEvent) => {
                dispatch(setTypingUser(event));
            });
        }

        return () => {
            socketService.disconnect();
        };
    }, [dispatch, token]);

    useEffect(() => {
        // Fetch messages when active conversation changes
        if (activeConversationId) {
            dispatch(fetchMessages(activeConversationId));
        }
    }, [activeConversationId, dispatch]);

    const handleSelectConversation = (conversationId: string) => {
        dispatch(setActiveConversation(conversationId));
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Paper
                elevation={0}
                sx={{
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: 0,
                }}
            >
                <Grid container sx={{ height: '100%' }}>
                    {/* Conversation List - Sidebar */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                        lg={3}
                        sx={{
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            height: '100%',
                            overflow: 'auto',
                        }}
                    >
                        <ConversationList
                            onSelectConversation={handleSelectConversation}
                            activeConversationId={activeConversationId}
                        />
                    </Grid>

                    {/* Chat Window - Main area */}
                    <Grid
                        item
                        xs={12}
                        md={8}
                        lg={9}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {activeConversationId ? (
                            <ChatWindow conversationId={activeConversationId} />
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    color: 'text.secondary',
                                }}
                            >
                                Chọn một cuộc trò chuyện để bắt đầu
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ChatPage;
