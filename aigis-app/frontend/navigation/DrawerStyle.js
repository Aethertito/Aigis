import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function DrawerContent(props) {
    const [activeItem, setActiveItem] = useState('');

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                        <Title style={styles.title}>Admin Name</Title>
                        <Caption style={styles.caption}>@adminusername</Caption>
                    </View>
                </View>
            </View>

            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="home" color={activeItem === 'Admin Home' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Admin Home"
                    labelStyle={[styles.label, { color: activeItem === 'Admin Home' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Admin Home');
                        props.navigation.navigate('Admin Home');
                    }}
                    style={activeItem === 'Admin Home' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="sensor-occupied" color={activeItem === 'Manage Sensors' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Manage Sensors"
                    labelStyle={[styles.label, { color: activeItem === 'Manage Sensors' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Manage Sensors');
                        props.navigation.navigate('Manage Sensors');
                    }}
                    style={activeItem === 'Manage Sensors' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="manage-accounts" color={activeItem === 'Manage Users' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Manage Users"
                    labelStyle={[styles.label, { color: activeItem === 'Manage Users' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Manage Users');
                        props.navigation.navigate('Manage Users');
                    }}
                    style={activeItem === 'Manage Users' ? styles.activeItem : {}}
                />
            </Drawer.Section>

            {/* Cerrar sesión al final */}
            <View style={styles.logoutSection}>
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="logout" color='#FFF' size={size} /> )}
                    label="Logout"
                    labelStyle={styles.label}
                    onPress={() => {
                        // Implementar lógica para cerrar sesión aquí
                        props.navigation.navigate('Welcome'); // Cambia 'Welcome' al nombre de la pantalla a la que deseas navegar después de cerrar sesión
                        console.log('Logout pressed');
                    }}
                    style={styles.logoutItem}
                />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: '#424242',
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
        color: '#F4F6FC',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        color: '#F4F6FC',
    },
    drawerSection: {
        marginTop: 15,
    },
    label: {
        color: '#F4F6FC', 
    },
    activeItem: {
        backgroundColor: '#212121', 
    },
    logoutSection: {
        marginTop: 'auto',
        top: 520
    },
    logoutItem: {
        backgroundColor: '#424242', 
    },
});

export default DrawerContent;