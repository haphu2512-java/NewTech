import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { List, Avatar, Badge, Text } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';

interface ConversationItemProps {
    conversation: {
        id: string;
        name: string;
        lastMessage: string;
        time: string;
        unread: number;
    };
}

export default function ConversationItem({ conversation }: ConversationItemProps) {
    return (
        <TouchableOpacity>
            <List.Item
                title={conversation.name}
                description={conversation.lastMessage}
                left={props => (
                    <Avatar.Text
                        {...props}
                        size={50}
                        label={conversation.name.charAt(0)}
                    />
                )}
                right={() => (
                    <View style={styles.rightContainer}>
                        <Text variant="caption" style={styles.time}>
                            {conversation.time}
                        </Text>
                        {conversation.unread > 0 && (
                            <Badge style={styles.badge}>{conversation.unread}</Badge>
                        )}
                    </View>
                )}
                titleStyle={styles.title}
                descriptionStyle={styles.description}
                descriptionNumberOfLines={1}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '600',
    },
    description: {
        color: colors.textSecondary,
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    time: {
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    badge: {
        backgroundColor: colors.primary,
    },
});
