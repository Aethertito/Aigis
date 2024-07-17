import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';

const PayScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedMembership, selectedPackage } = route.params;

    const handlePayment = async () => {
        try {
            const paymentData = {
                selectedMembership,
                selectedPackage
            };

            console.log(paymentData);

            // URL de tu API para procesar el pago
            const apiUrl = `http://${IP}:3000/pago`;

            // Realizar la solicitud POST a la API con los datos mínimos necesarios
            const response = await axios.post(apiUrl, paymentData);

            // Si la respuesta es exitosa, navegar a la pantalla de bienvenida
            navigation.navigate('Welcome', {
                selectedPackageData: selectedPackage,
                membershipData: selectedMembership,
            });

            console.log('Respuesta de la API:', response.data);
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                <Icon
                    name='arrow-back-ios'
                    type='MaterialIcons'
                    color='#E53935'
                    size={24}
                />
                <Text style={styles.iconText}>Volver</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <Image source={require('../../assets/LOGO-Completo.png')} style={styles.image} />
            </View>
            <Text style={styles.title}>Información de Pago</Text>

            <View style={styles.buttonContainer}>
                <Button title="Pagar" onPress={handlePayment} color="#E53935" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#424242',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconText: {
        color: '#E53935',
        fontSize: 18,
        marginLeft: 1,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    image: {
        width: 250,
        height: 250,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F4F6FC',
        alignSelf: 'center',
        marginBottom: 24,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default PayScreen;
