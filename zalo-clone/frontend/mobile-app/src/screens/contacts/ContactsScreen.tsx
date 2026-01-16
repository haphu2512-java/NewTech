import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, List, Avatar } from 'react-native-paper';
import { colors, spacing } from '../../styles/theme';

export default function ContactsScreen() {
    const [searchQuery, setSearchQuery] = React.useState('');

    // Placeholder contacts
    const contacts = [
        { id: '1', name: 'Alice Johnson', status: 'Online' },
        { id: '2', name: 'Bob Smith', status: 'Offline' },
        { id: '3', name: 'Charlie Brown', status: 'Away' },
    ];

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Tìm kiếm danh bạ..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description={item.status}
                        left={props => (
                            <Avatar.Text
                                {...props}
                                size={40}
                                label={item.name.charAt(0)}
                            />
                        )}
                        right={props => <List.Icon {...props} icon="message" />}
                    />
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
