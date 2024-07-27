import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';

const PayScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [cardNumber, setCardNumber] = useState('');
    const [cardTitular, setCardTitular] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [membershipData, setMembershipData] = useState(null);

    useEffect(() => {
        const fetchMembershipData = async () => {
            const membershipData = await AsyncStorage.getItem('membershipData');
            setMembershipData(JSON.parse(membershipData));
        };
        fetchMembershipData();
    }, []);

    const handlePayment = async () => {
        if (cardNumber && cardTitular && expiryDate && cvv) {
            try {
                const userId = await AsyncStorage.getItem('userId');

                if (!membershipData) {
                    Alert.alert('Error', 'No membership data found');
                    return;
                }

                const paymentData = {
                    usuario_id: userId,
                    membresia_id: membershipData._id,
                    paquete_id: null, // Adjust this if you need a package_id
                    monto: membershipData.costo,
                    metodoPago: 'Credit Card',
                    estado: 'complete'
                };

                console.log(paymentData);

                const apiUrl = `http://${IP}:3000/pago`;
                const response = await axios.post(apiUrl, paymentData);

                setCardNumber('');
                setCardTitular('');
                setExpiryDate('');
                setCvv('');

                Alert.alert('Success', 'Payment successfully processed', [
                    { text: 'OK', onPress: () => navigation.navigate('Welcome') }
                ]);

                console.log('API Response:', response.data);
            } catch (error) {
                console.error('Error processing payment:', error);
                Alert.alert('Error', 'An error occurred while processing the payment. Please try again.');
            }
        } else {
            Alert.alert('Error', 'Please complete all card details');
        }
    };

    const totalAmount = membershipData ? membershipData.costo : 0;

    const handleCardNumberChange = (text) => {
        let formattedCardNumber = text.replace(/\D/g, '');
        if (formattedCardNumber.length > 4 && formattedCardNumber.length <= 8) {
            formattedCardNumber = `${formattedCardNumber.slice(0, 4)}-${formattedCardNumber.slice(4)}`;
        } else if (formattedCardNumber.length > 8 && formattedCardNumber.length <= 12) {
            formattedCardNumber = `${formattedCardNumber.slice(0, 4)}-${formattedCardNumber.slice(4, 8)}-${formattedCardNumber.slice(8)}`;
        } else if (formattedCardNumber.length > 12) {
            formattedCardNumber = `${formattedCardNumber.slice(0, 4)}-${formattedCardNumber.slice(4, 8)}-${formattedCardNumber.slice(8, 12)}-${formattedCardNumber.slice(12, 16)}`;
        }
        setCardNumber(formattedCardNumber);
    };

    const handleExpiryDateChange = (text) => {
        let formattedExpiryDate = text.replace(/\D/g, '');
        if (formattedExpiryDate.length > 2) {
            formattedExpiryDate = `${formattedExpiryDate.slice(0, 2)}/${formattedExpiryDate.slice(2, 4)}`;
        }
        setExpiryDate(formattedExpiryDate);
    };

    const handleCardTitularChange = (text) => {
        if (text.length <= 60) {
            setCardTitular(text);
        }
    };

    const handleCvvChange = (text) => {
        if (text.length <= 3) {
            setCvv(text);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <Icon name='arrow-back-ios' type='MaterialIcons' color='#E53935' size={24} />
                    <Text style={styles.iconText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <Image source={require('../../assets/LOGO-Completo.png')} style={styles.image} />
                </View>
                <Text style={styles.title}>Payment Information</Text>
                <Text style={styles.totalAmount}>Total to pay: ${totalAmount}</Text>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Cardholder Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#9E9E9E"
                        value={cardTitular}
                        onChangeText={handleCardTitularChange}
                        maxLength={60}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Card Number</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholderTextColor="#9E9E9E"
                        value={cardNumber}
                        onChangeText={handleCardNumberChange}
                        maxLength={19}
                    />
                </View>

                <View style={styles.rowContainer}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Expiry Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/YY"
                            keyboardType="numeric"
                            placeholderTextColor="#9E9E9E"
                            value={expiryDate}
                            onChangeText={handleExpiryDateChange}
                            maxLength={5}
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
                            onChangeText={handleCvvChange}
                            maxLength={3}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                    <Text style={styles.payButtonText}>Pay</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#424242',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 55
    },
    iconText: {
        color: '#E53935',
        fontSize: 18,
        marginLeft: 1,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F4F6FC',
        alignSelf: 'center',
        marginBottom: 10,
    },
    totalAmount: {
        fontSize: 22,
        color: '#E53935',
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
    payButton: {
        backgroundColor: '#E53935',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    payButtonText: {
        color: '#F4F6FC',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PayScreen;
