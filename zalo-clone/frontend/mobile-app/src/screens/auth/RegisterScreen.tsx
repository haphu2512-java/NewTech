import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';

export default function RegisterScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineLarge" style={styles.title}>
                Zalo Clone
            </Text>
            <Text variant="headlineSmall" style={styles.subtitle}>
                Đăng ký tài khoản
            </Text>

            <TextInput
                label="Tên đăng nhập"
                mode="outlined"
                style={styles.input}
                placeholder="Nhập tên đăng nhập"
            />

            <TextInput
                label="Email"
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
                placeholder="Nhập email"
            />

            <TextInput
                label="Số điện thoại"
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                placeholder="Nhập số điện thoại"
            />

            <TextInput
                label="Mật khẩu"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                placeholder="Nhập mật khẩu"
            />

            <TextInput
                label="Xác nhận mật khẩu"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
            />

            <Button mode="contained" style={styles.button}>
                Đăng ký
            </Button>

            <Button mode="text" style={styles.textButton}>
                Đã có tài khoản? Đăng nhập
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.xl,
        color: colors.primary,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: spacing.lg,
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
        marginBottom: spacing.xl,
    },
});
