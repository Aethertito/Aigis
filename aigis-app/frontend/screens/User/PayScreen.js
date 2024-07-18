import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';

const PayScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedMembership, selectedPackage } = route.params;
    const [cardNumber, setCardNumber] = useState('');
    const [cardTitular, setCardTitular] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    console.log('Datos recibidos en PayScreen: ', route.params)

    const handlePayment = async () => {
        if (cardNumber && cardTitular && expiryDate && cvv) {
            try {
                const paymentData = {
                    selectedMembership,
                    selectedPackage,
                    cardNumber,
                    cardTitular,
                    expiryDate,
                    cvv
                };
                console.log(paymentData);

                // URL de tu API para procesar el pago
                const apiUrl = `http://${IP}:3000/pago`;

                // Realizar la solicitud POST a la API con los datos mínimos necesarios
                const response = await axios.post(apiUrl, paymentData);

                // Limpiar los datos sensibles después del pago
                setCardNumber('');
                setCardTitular('');
                setExpiryDate('');
                setCvv('');

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
        } else {
            alert('Por favor completa todos los detalles de la tarjeta');
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

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre en la Tarjeta</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#9E9E9E"
                    value={cardTitular}
                    onChangeText={setCardTitular}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Número de Tarjeta</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholderTextColor="#9E9E9E"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                />
            </View>

            <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Fecha de Expiración</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="MM/AA"
                        placeholderTextColor="#9E9E9E"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                    />
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>CVV</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholderTextColor="#9E9E9E"
                        placeholder="123"
                        secureTextEntry
                        value={cvv}
                        onChangeText={setCvv}
                    />
                </View>
            </View>

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
        position: 'absolute',
        left: 10,
        top: 48,
    },
    iconText: {
        color: '#E53935',
        fontSize: 16,
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
    inputContainer: {
        marginBottom: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#F4F6FC',
        marginBottom: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E53935',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#212121',
        color: '#F4F6FC',
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default PayScreen;
