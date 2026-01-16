import React from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';
import MessageBubble from '../../components/chat/MessageBubble';

export default function ChatScreen() {
    const [message, setMessage] = React.useState('');

    // Placeholder messages
    const messages = [
        { id: '1', text: 'Hello!', isMine: false, time: '10:30' },
        { id: '2', text: 'Hi! How are you?', isMine: true, time: '10:31' },
        { id: '3', text: 'I\'m good, thanks!', isMine: false, time: '10:32' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageBubble message={item} />
                )}
                contentContainerStyle={styles.messageList}
            />

            <View style={styles.inputContainer}>
                <IconButton icon="attachment" size={24} />
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Nhập tin nhắn..."
                    style={styles.input}
                    mode="outlined"
                    dense
                />
                <IconButton icon="emoticon-outline" size={24} />
                <IconButton
                    icon="send"
                    size={24}
                    iconColor={colors.primary}
                    disabled={!message.trim()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    messageList: {
        padding: spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        marginHorizontal: spacing.xs,
        backgroundColor: colors.background,
    },
});
