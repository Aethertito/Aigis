import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Title, Caption, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function DrawerAdminContent(props) {
    const [activeItem, setActiveItem] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const name = await AsyncStorage.getItem('adminName') || 'Admin Name';
            const email = await AsyncStorage.getItem('adminEmail') || '@adminusername';
            setAdminName(name);
            setAdminEmail(email);
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            // Limpiar los datos de administrador almacenados en AsyncStorage
            await AsyncStorage.removeItem('adminName');
            await AsyncStorage.removeItem('adminEmail');
            
            // Muestra una alerta de cierre de sesión exitoso
            Alert.alert(
                "Success",
                "Successfully logged out.",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );

            // Navega a la pantalla de bienvenida
            props.navigation.navigate('Welcome');
            console.log('Logout successful and navigating to Welcome screen');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
                <View style={styles.profileContainer}>
                    <Image
                        source={require('../assets/admin-icon.png')}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileText}>
                        <Title style={styles.title}>Administrador</Title>
                        <Caption style={styles.caption}>administrador@vsat.com</Caption>
                    </View>
                </View>
            </View>

            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="home" color={activeItem === 'Admin Home' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Home"
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
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="support-agent" color={activeItem === 'Support' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Support"
                    labelStyle={[styles.label, { color: activeItem === 'Support' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Support');
                        props.navigation.navigate('Support Admin');
                    }}
                    style={activeItem === 'Support' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="date-range" color={activeItem === 'Appointments' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Appointments"
                    labelStyle={[styles.label, { color: activeItem === 'Appointments' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Appointments');
                        props.navigation.navigate('Manage Appointments');
                    }}
                    style={activeItem === 'Appointments' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="payments" color={activeItem === 'Manage Payments' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Manage Payments"
                    labelStyle={[styles.label, { color: activeItem === 'Manage Payments' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Manage Payments');
                        props.navigation.navigate('Manage Payments');
                    }}
                    style={activeItem === 'Manage Payments' ? styles.activeItem : {}}
                />
            </Drawer.Section>
            <View style={styles.logoutSection}>
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="logout" color='#FFF' size={size} /> )}
                    label="Logout"
                    labelStyle={styles.label}
                    onPress={handleLogout}
                    style={styles.logoutItem}
                />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: '#212121',
    },
    userInfoSection: {
        paddingLeft: 8,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#313131',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    profileText: {
        marginLeft: 15,
    },
    title: {
        fontSize: 16,
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
        backgroundColor: '#424242',
    },
    logoutSection: {
        marginTop: 'auto',
    },
});

export default DrawerAdminContent;
