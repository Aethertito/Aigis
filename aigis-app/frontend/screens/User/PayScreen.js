import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PayScreen = () => {
    const navigation = useNavigation();
    const [cardNumber, setCardNumber] = useState('');
    const [cardTitular, setCardTitular] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePayment = () => {
        console.log('Número de tarjeta:', cardNumber);
        console.log('Titular de la tarjeta:', cardTitular);
        console.log('Fecha de expiración:', expiryDate);
        console.log('CVV:', cvv);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Paquetes')} style={styles.iconContainer}>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#424242',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 70
    },
    iconText: {
        color: '#E53935',
        fontSize: 18,
        marginLeft: 1,
    },
    imageContainer: {
        alignItems: 'center',
        bottom: 50
    },
    image: {
        width: 250, 
        height: 250,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F4F6FC',
        alignSelf: 'center',
        marginBottom: 24,
        bottom: 40
    },
    inputContainer: {
        marginBottom: 16,
        bottom: 40
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: "36%",
        bottom: 50
    },
});

export default PayScreen;
