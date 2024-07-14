import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';

const MembershipScreen = () => {
    const [memberships, setMemberships] = useState([]);
    const [checked, setChecked] = useState('');
    const navigation = useNavigation();

    const fetchMemberships = async () => {
        const url = `http://${IP}:3000/membership`;
        try {
            const response = await axios.get(url);
            console.log(response.data.membresias);
            setMemberships(response.data.membresias);
        } catch (error) {
            console.error('Error getting memberships:', error);
            Alert.alert('Error', 'Memberships could not be loaded');
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, []);

    const handleConfirm = () => {
        if (!checked) {
            Alert.alert('Error', 'Please select a membership');
            return;
        }

        console.log('Selected membership:', checked);
        navigation.navigate('Paquetes', { membershipId: checked });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Options')} style={styles.iconContainer}>
                    <Icon
                        name='arrow-back-ios'
                        type='MaterialIcons'
                        color='#E53935'
                        size={24}
                    />
                    <Text style={styles.iconText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.tituloMem}>Select Membership Duration</Text>
            </View>

            {memberships.map((membership) => (
                <TouchableOpacity
                    key={membership._id}
                    style={[styles.cardContainer, checked === membership._id && styles.selectedCard]}
                    onPress={() => setChecked(membership._id)}
                >
                    <View>
                        <Text style={styles.title}>{membership.cantidad}</Text>
                        <Text style={styles.months}>{membership.periodo}</Text>
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>CONFIRM</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#424242',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    tituloMem: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginTop: 100,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 10,
        top: 20,
    },
    iconText: {
        color: '#E53935',
        fontSize: 16,
        marginLeft: 1,
    },
    cardContainer: {
        backgroundColor: '#212121',
        borderColor: '#E53935',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
    },
    selectedCard: {
        backgroundColor: '#E53935',
        color: '#FFF',
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#F4F6FC',
        textAlign: 'center',
    },
    months: {
        fontSize: 33,
        fontWeight: 'bold',
        color: '#F4F6FC',
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#E53935',
        paddingVertical: 12,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        width: '38%',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MembershipScreen;
