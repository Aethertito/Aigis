import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';

const PayPackScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [cardNumber, setCardNumber] = useState('');
  const [cardTitular, setCardTitular] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const { cartData, totalAmount } = route.params;

  const handlePayment = async () => {
    if (cardNumber && cardTitular && expiryDate && cvv) {
      try {
        const userId = await AsyncStorage.getItem('userId');

        const paymentData = {
          usuario_id: userId,
          cartData,
          metodoPago: 'Credit Card',
          totalAmount
        };

        console.log('Datos de pago enviados:', paymentData);

        const apiUrl = `http://${IP}:3000/paqueteComprado/comprar`;
        const response = await axios.post(apiUrl, paymentData);
        console.log('Respuesta de la API:', response.data);
        navigation.navigate('Home');

        setCardNumber('');
        setCardTitular('');
        setExpiryDate('');
        setCvv('');

        Alert.alert('Success', 'Payment processed successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } catch (error) {
        console.error('Error processing payment:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'An error occurred while processing the payment. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please complete all card details');
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D+/g, ''); // Eliminar todos los caracteres no numéricos
    const formatted = cleaned.match(/.{1,4}/g)?.join('-') || '';
    setCardNumber(formatted);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D+/g, ''); // Eliminar todos los caracteres no numéricos
    const formatted = cleaned.match(/.{1,2}/g)?.join('/') || '';
    setExpiryDate(formatted.slice(0, 5)); // Limitar a 5 caracteres
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Paquetes')} style={styles.iconContainer}>
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
            onChangeText={setCardTitular}
            maxLength={60} // Limitar a 60 caracteres
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#9E9E9E"
            value={cardNumber}
            onChangeText={formatCardNumber}
            maxLength={19} // Limitar a 19 caracteres (incluyendo guiones)
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              value={expiryDate}
              onChangeText={formatExpiryDate}
              maxLength={5} // Limitar a 5 caracteres
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
              maxLength={3} // Limitar a 3 caracteres
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
    bottom: 65
  },
  iconText: {
    color: '#E53935',
    fontSize: 16,
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

export default PayPackScreen;
