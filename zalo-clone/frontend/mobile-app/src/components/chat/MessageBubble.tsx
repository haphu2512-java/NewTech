import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';

interface MessageBubbleProps {
    message: {
        id: string;
        text: string;
        isMine: boolean;
        time: string;
    };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    return (
        <View style={[
            styles.container,
            message.isMine ? styles.myMessage : styles.theirMessage
        ]}>
            <Surface style={[
                styles.bubble,
                message.isMine ? styles.myBubble : styles.theirBubble
            ]}>
                <Text style={[
                    styles.text,
                    message.isMine ? styles.myText : styles.theirText
                ]}>
                    {message.text}
                </Text>
                <Text style={[
                    styles.time,
                    message.isMine ? styles.myTime : styles.theirTime
                ]}>
                    {message.time}
                </Text>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.xs,
        maxWidth: '75%',
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    theirMessage: {
        alignSelf: 'flex-start',
    },
    bubble: {
        padding: spacing.md,
        borderRadius: 16,
        elevation: 1,
    },
    myBubble: {
        backgroundColor: colors.messageSent,
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: colors.messageReceived,
        borderBottomLeftRadius: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 20,
    },
    myText: {
        color: '#ffffff',
    },
    theirText: {
        color: colors.text,
    },
    time: {
        fontSize: 11,
        marginTop: spacing.xs,
    },
    myTime: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    theirTime: {
        color: colors.textSecondary,
    },
});
