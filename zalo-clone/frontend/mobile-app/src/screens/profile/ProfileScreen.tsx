import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Avatar, Button, Divider } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';

export default function ProfileScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Image
                    size={100}
                    source={{ uri: 'https://via.placeholder.com/100' }}
                />
                <List.Item
                    title="User Name"
                    description="@username"
                    titleStyle={styles.name}
                />
                <Button mode="outlined" style={styles.editButton}>
                    Chỉnh sửa thông tin
                </Button>
            </View>

            <Divider />

            <List.Section>
                <List.Subheader>Thông tin</List.Subheader>
                <List.Item
                    title="Email"
                    description="user@example.com"
                    left={props => <List.Icon {...props} icon="email" />}
                />
                <List.Item
                    title="Số điện thoại"
                    description="+84 123 456 789"
                    left={props => <List.Icon {...props} icon="phone" />}
                />
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Cài đặt</List.Subheader>
                <List.Item
                    title="Thông báo"
                    left={props => <List.Icon {...props} icon="bell" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                />
                <List.Item
                    title="Quyền riêng tư"
                    left={props => <List.Icon {...props} icon="shield-account" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                />
                <List.Item
                    title="Tài khoản"
                    left={props => <List.Icon {...props} icon="account-cog" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                />
            </List.Section>

            <Divider />

            <View style={styles.footer}>
                <Button mode="outlined" textColor={colors.error}>
                    Đăng xuất
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.surface,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    editButton: {
        marginTop: spacing.md,
    },
    footer: {
        padding: spacing.lg,
    },
});
