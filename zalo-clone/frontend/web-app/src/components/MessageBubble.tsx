import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import { format } from 'date-fns';
import type { Message } from '@shared/types/message';

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
    const getStatusIcon = () => {
        if (!isOwnMessage) return null;

        switch (message.status) {
            case 'read':
                return <DoneAllIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
            case 'delivered':
                return <DoneAllIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            case 'sent':
                return <DoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                mb: 1,
                gap: 1,
            }}
        >
            {!isOwnMessage && (
                <Avatar sx={{ width: 32, height: 32, alignSelf: 'flex-end' }} />
            )}

            <Box sx={{ maxWidth: '70%' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: isOwnMessage ? 'primary.main' : 'white',
                        color: isOwnMessage ? 'white' : 'text.primary',
                        borderTopRightRadius: isOwnMessage ? 4 : 16,
                        borderTopLeftRadius: isOwnMessage ? 16 : 4,
                    }}
                >
                    {message.type === 'text' && (
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {message.content}
                        </Typography>
                    )}

                    {message.type === 'image' && message.mediaUrl && (
                        <Box>
                            <img
                                src={message.mediaUrl}
                                alt="Message attachment"
                                style={{
                                    maxWidth: '100%',
                                    borderRadius: '8px',
                                    display: 'block',
                                }}
                            />
                            {message.content && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {message.content}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Paper>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                        alignItems: 'center',
                        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                        mt: 0.5,
                        px: 1,
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        {format(message.timestamp, 'HH:mm')}
                    </Typography>
                    {getStatusIcon()}
                </Box>
            </Box>

            {isOwnMessage && (
                <Avatar sx={{ width: 32, height: 32, alignSelf: 'flex-end' }} />
            )}
        </Box>
    );
};

export default MessageBubble;
