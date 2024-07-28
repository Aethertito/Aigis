import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Title, Caption, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function DrawerUserContent(props) {
    const [activeItem, setActiveItem] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const name = await AsyncStorage.getItem('userName');
            const email = await AsyncStorage.getItem('userEmail');
            setUserName(name);
            setUserEmail(email);
        };

        fetchUserData();
    }, []);

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
                <View style={styles.profileContainer}>
                    <Image
                        source={require('../assets/corporate-user-icon.png')}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileText}>
                        <Title style={styles.title}> {userName}</Title>
                        <Caption style={styles.caption}>{userEmail}</Caption>
                    </View>
                </View>
            </View>

            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="home" color={activeItem === 'Home' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Home"
                    labelStyle={[styles.label, { color: activeItem === 'Home' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Home');
                        props.navigation.navigate('Home');
                    }}
                    style={activeItem === 'Home' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="sensor-occupied" color={activeItem === 'Sensors' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Sensors"
                    labelStyle={[styles.label, { color: activeItem === 'Sensors' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Sensors');
                        props.navigation.navigate('Sensors');
                    }}
                    style={activeItem === 'Sensors' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="shopping-cart" color={activeItem === 'Orders' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Orders"
                    labelStyle={[styles.label, { color: activeItem === 'Orders' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Orders');
                        props.navigation.navigate('Orders');
                    }}
                    style={activeItem === 'Orders' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="camera" color={activeItem === 'Cameras' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Cameras"
                    labelStyle={[styles.label, { color: activeItem === 'Cameras' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Cameras');
                        props.navigation.navigate('Cameras');
                    }}
                    style={activeItem === 'Cameras' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="event" color={activeItem === 'Appointment' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Appointment"
                    labelStyle={[styles.label, { color: activeItem === 'Appointment' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Appointment');
                        props.navigation.navigate('Appointment');
                    }}
                    style={activeItem === 'Appointment' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="location-on" color={activeItem === 'Locations Sensors' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Locations Sensors"
                    labelStyle={[styles.label, { color: activeItem === 'Locations Sensors' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Locations Sensors');
                        props.navigation.navigate('Ubicaciones');
                    }}
                    style={activeItem === 'Locations Sensors' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="contact-support" color={activeItem === 'Support' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Support"
                    labelStyle={[styles.label, { color: activeItem === 'Support' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Support');
                        props.navigation.navigate('Help');
                    }}
                    style={activeItem === 'Support' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="history" color={activeItem === 'Support History' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Support History"
                    labelStyle={[styles.label, { color: activeItem === 'Support History' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Support History');
                        props.navigation.navigate('SupportHistory');
                    }}
                    style={activeItem === 'Support History' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="history" color={activeItem === 'Support History' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="PremiumPackagesScreen"
                    labelStyle={[styles.label, { color: activeItem === 'Support History' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Support History');
                        props.navigation.navigate('PremiumPackagesScreen');
                    }}
                    style={activeItem === 'Support History' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="history" color={activeItem === 'Support History' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="AddEmployeeScreen"
                    labelStyle={[styles.label, { color: activeItem === 'Support History' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Support History');
                        props.navigation.navigate('AddEmployeeScreen');
                    }}
                    style={activeItem === 'Support History' ? styles.activeItem : {}}
                />
            </Drawer.Section>

            <View style={styles.logoutSection}>
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon2 name="user-gear" color={activeItem === 'Configurations' ? '#E53935' : '#FFF'} size={size} /> )}
                    label="Configurations"
                    labelStyle={[styles.label, { color: activeItem === 'Configurations' ? '#E53935' : '#F4F6FC' }]}
                    onPress={() => {
                        setActiveItem('Configurations');
                        props.navigation.navigate('EditProfile');
                    }}
                    style={activeItem === 'Configurations' ? styles.activeItem : {}}
                />
                <DrawerItem 
                    icon={({ color, size }) => ( <Icon name="logout" color='#FFF' size={size} /> )}
                    label="Logout"
                    labelStyle={styles.label}
                    onPress={() => {
                        props.navigation.navigate('Welcome');
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

export default DrawerUserContent;
