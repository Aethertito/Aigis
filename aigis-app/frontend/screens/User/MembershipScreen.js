import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';

const MembershipScreen = () => {
    const [memberships, setMemberships] = useState([]);
    const [checked, setChecked] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async () => {
        const url = `http://${IP}:3000/membership`;
        try {
            const response = await axios.get(url);
            // console.log(response.data.membresias);
            setMemberships(response.data.membresias);
        } catch (error) {
            console.error('Error getting memberships:', error);
            Alert.alert('Error', 'Memberships could not be loaded');
        }
    };

    const handleSelectMembership = (membershipId) => {
        if (checked === membershipId) {
            setChecked('');
        } else {
            setChecked(membershipId);
        }
    };

    const handleConfirm = () => {
        if (!checked) {
            Alert.alert('Error', 'Please select a membership');
            return;
        }

        const selectedMembership = memberships.find(membership => membership._id === checked);
        if (selectedMembership) {
            console.log(`Membership: ${selectedMembership.cantidad} ${selectedMembership.periodo}`);
            console.log(`Price: $${selectedMembership.costo}.00`);
            navigation.navigate('Paquetes', {
                membershipId: checked,
                membershipData: selectedMembership
            });
        } else {
            Alert.alert('Error', 'Selected membership not found');
        }
    };

    return (
        <View style={styles.container}>
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
                    onPress={() => handleSelectMembership(membership._id)}
                >
                    <View>
                        <Text style={styles.title}>{membership.cantidad}</Text>
                        <Text style={styles.months}>{membership.periodo}</Text>
                        <View style={styles.priceContainer}>
                            <Text style={[styles.price, checked === membership._id && styles.selectedText]}>${membership.costo}.00</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>CONFIRM</Text>
            </TouchableOpacity>
        </View>
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
        color: '#F4F6FC',
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
        color: '#F4F6FC',
        borderColor: '#F4F6FC',
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
    desc: {
        fontSize: 16,
        color: '#F4F6FC',
        marginTop: 5,
        textAlign: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E53935',
        textAlign: 'left',
    },
    selectedText: {
        color: '#F4F6FC',
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
        color: '#F4F6FC',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MembershipScreen;
