import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';
import ConversationItem from '../../components/chat/ConversationItem';

export default function ChatListScreen() {
    const [searchQuery, setSearchQuery] = React.useState('');

    // Placeholder data
    const conversations = [
        { id: '1', name: 'User 1', lastMessage: 'Hello!', time: '10:30', unread: 2 },
        { id: '2', name: 'User 2', lastMessage: 'How are you?', time: '09:15', unread: 0 },
        { id: '3', name: 'Group Chat', lastMessage: 'See you tomorrow', time: 'Yesterday', unread: 5 },
    ];

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Tìm kiếm..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ConversationItem conversation={item} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchBar: {
        margin: spacing.md,
        elevation: 0,
        backgroundColor: colors.surface,
    },
});
