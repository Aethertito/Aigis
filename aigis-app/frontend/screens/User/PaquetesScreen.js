import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaquetesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { membershipId, membershipData } = route.params;

    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        console.log('Membership Data:', membershipData, membershipId);
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        const url = `http://${IP}:3000/packages`;
        try {
            const response = await axios.get(url);
            setPackages(response.data.paquetes);
        } catch (error) {
            console.error('Error getting packages:', error);
            Alert.alert('Error', 'Packages could not be loaded');
        }
    };

    const handleSelectPackage = (index) => {
        if (selectedPackage === index) {
            setSelectedPackage(null);
        } else {
            setSelectedPackage(index);
        }
    };

    const handleConfirmPackage = async () => {
        if (selectedPackage !== null) {
            const selectedPackageData = {
                id: packages[selectedPackage]._id,
                paquete: packages[selectedPackage].paquete,
                costo: packages[selectedPackage].precio,
            };
            // Save user id in AsyncStorage
            await AsyncStorage.setItem('membresiaId', membershipId)
            await AsyncStorage.setItem('packageId', selectedPackageData.id)

            const totalAmount = packages[selectedPackage].precio;
            console.log('Datos enviados a TotalScreen:', {
                selectedPackageData,
                totalAmount,
                membershipData
            });
            navigation.navigate('Total', {
                selectedPackageData,
                totalAmount,
                membershipData
            });
        } else {
            Alert.alert('Error', 'Please select a package');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Membership')} style={styles.iconContainer}>
                    <Icon
                        name='arrow-back-ios'
                        type='MaterialIcons'
                        color='#E53935'
                        size={24}
                    />
                    <Text style={styles.iconText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.tituloMem}>Select a package</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {packages.map((paquete, index) => (
                    <TouchableOpacity
                        key={paquete._id}
                        style={[styles.cardContainer, selectedPackage === index && styles.selectedCard]}
                        onPress={() => handleSelectPackage(index)}
                    >
                        <View>
                            <Text style={styles.title}>{paquete.paquete}</Text>
                            <Text style={styles.desc}>{paquete.descripcion}</Text>
                            <Text style={styles.contText}>Contains:</Text>
                            {paquete.contenido.map((sensor, sensorIndex) => (
                                <Text key={sensorIndex} style={styles.contText}>{sensor}</Text>
                            ))}
                            <View style={styles.priceContainer}>
                                <Text style={styles.textPrice}>Cost:</Text>
                                <Text style={[styles.price, selectedPackage === index && { color: '#FFFFFF' }]}>${paquete.precio}.00</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPackage}>
                    <Text style={styles.confirmButtonText}>CONFIRM PACKAGE</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#424242',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 28,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    tituloMem: {
        color: '#F4F6FC',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginTop: 60,
        right: 35
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 20,
    },
    iconText: {
        color: '#E53935',
        fontSize: 16,
    },
    scrollViewContent: {
        paddingHorizontal: 10,
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
        borderColor: '#F4F6FC',
        color: '#F4F6FC',
    },
    title: {
        fontSize: 24,
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
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    textPrice: {
        fontSize: 16,
        color: '#F4F6FC',
    },
    price: {
        fontSize: 18,
        color: '#E53935',
        fontWeight: 'bold',
    },
    contText: {
        fontSize: 16,
        color: '#F4F6FC',
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#E53935',
        paddingVertical: 12,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 40,
        width: '80%',
    },
    confirmButtonText: {
        color: '#F4F6FC',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PaquetesScreen;
