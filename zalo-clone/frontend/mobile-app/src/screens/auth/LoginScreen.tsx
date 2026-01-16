import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>
                Zalo Clone
            </Text>
            <Text variant="headlineSmall" style={styles.subtitle}>
                Đăng nhập
            </Text>

            <TextInput
                label="Tên đăng nhập"
                mode="outlined"
                style={styles.input}
                placeholder="Nhập tên đăng nhập"
            />

            <TextInput
                label="Mật khẩu"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                placeholder="Nhập mật khẩu"
            />

            <Button mode="contained" style={styles.button}>
                Đăng nhập
            </Button>

            <Button mode="text" style={styles.textButton}>
                Chưa có tài khoản? Đăng ký ngay
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.md,
        color: colors.primary,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    input: {
        marginBottom: spacing.md,
    },
    button: {
        marginTop: spacing.md,
        paddingVertical: spacing.sm,
    },
    textButton: {
        marginTop: spacing.md,
    },
});
