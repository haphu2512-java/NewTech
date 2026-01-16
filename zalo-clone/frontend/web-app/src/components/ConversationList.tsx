import React from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Box,
    Badge,
    TextField,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAppSelector } from '../store/hooks';

interface ConversationListProps {
    onSelectConversation: (conversationId: string) => void;
    activeConversationId: string | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
    onSelectConversation,
    activeConversationId,
}) => {
    const { conversations } = useAppSelector((state) => state.chat);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredConversations = conversations.filter((conv) =>
        conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Search bar */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Conversation list */}
            <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                {filteredConversations.map((conversation) => (
                    <ListItem key={conversation._id} disablePadding>
                        <ListItemButton
                            selected={conversation._id === activeConversationId}
                            onClick={() => onSelectConversation(conversation._id)}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'action.selected',
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    color="success"
                                >
                                    <Avatar src={conversation.avatarUrl} alt={conversation.name}>
                                        {conversation.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Badge>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle2" noWrap>
                                            {conversation.name || 'Unknown'}
                                        </Typography>
                                        {conversation.lastMessage && (
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDistanceToNow(conversation.lastMessage.timestamp, {
                                                    addSuffix: true,
                                                    locale: vi,
                                                })}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            noWrap
                                            sx={{ maxWidth: '70%' }}
                                        >
                                            {conversation.lastMessage?.content || 'Chưa có tin nhắn'}
                                        </Typography>
                                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                                            <Badge
                                                badgeContent={conversation.unreadCount}
                                                color="primary"
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                    </Box>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ConversationList;
