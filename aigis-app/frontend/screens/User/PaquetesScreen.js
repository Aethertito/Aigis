import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../../IP';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@rneui/base';

const PaquetesScreen = () => {
    const navigation = useNavigation();

    const [packages, setPackages] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
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

    const addToCart = (paquete) => {
        const existingItem = cart.find(item => item._id === paquete._id);
        if (existingItem) {
            if (existingItem.quantity < 30) {
                setCart(cart.map(item => 
                    item._id === paquete._id ? {...item, quantity: item.quantity + 1} : item
                ));
            } else {
                Alert.alert('Error', 'Maximum quantity is 30');
            }
        } else {
            setCart([...cart, {...paquete, quantity: 1}]);
        }
    };

    const removeFromCart = (paqueteId) => {
        setCart(cart.filter(item => item._id !== paqueteId));
    };

    const updateQuantity = (paqueteId, newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 30) {
            setCart(cart.map(item => 
                item._id === paqueteId ? {...item, quantity: newQuantity} : item
            ));
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
    };

    const handlePayment = async () => {
        if (cart.length > 0) {
            const cartData = cart.map(item => ({
                id: item._id,
                paquete: item.paquete,
                cantidad: item.quantity,
                costo: item.precio * item.quantity,
                precio: item.precio // Añadir el precio del paquete
            }));
            await AsyncStorage.setItem('cartData', JSON.stringify(cartData));
            navigation.navigate('PayPack', {
                cartData,
                totalAmount: getTotalPrice(),
            });
        } else {
            Alert.alert('Error', 'Cart is empty');
        }
    };
    
    const clearCart = () => {
        setCart([]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <Icon
                        name='arrow-back-ios'
                        type='MaterialIcons'
                        color='#E53935'
                        size={24}
                    />
                    <Text style={styles.iconText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.tituloMem}>Packages</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {packages.map((paquete) => (
                    <View key={paquete._id} style={styles.cardContainer}>
                        <Text style={styles.title}>{paquete.paquete}</Text>
                        <Text style={styles.desc}>{paquete.descripcion}</Text>
                        <Text style={styles.contText}>Contains:</Text>
                        {paquete.contenido.map((sensor, sensorIndex) => (
                            <Text key={sensorIndex} style={styles.contText}>    - {sensor}</Text>
                        ))}
                        <View style={styles.priceContainer}>
                            <Text style={styles.textPrice}>Cost:</Text>
                            <Text style={styles.price}>${paquete.precio}.00</Text>
                        </View>
                        <Button
                            onPress={() => addToCart(paquete)}
                            icon={<Icon name="shopping-cart" size={20} color="white" />} 
                            iconRight 
                            buttonStyle={styles.addButton}
                        />
                    </View>
                ))}
            </ScrollView>
            {cart.length > 0 && (
                <View style={styles.cartContainer}>
                    <Text style={styles.cartTitle}>Cart</Text>
                    {cart.map((item) => (
                        <View key={item._id} style={styles.cartItem}>
                            <Text style={styles.cartItemName}>{item.paquete}</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity - 1)}>
                                    <Text style={styles.quantityButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity + 1)}>
                                    <Text style={styles.quantityButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cartItemPrice}>${item.precio * item.quantity}.00</Text>
                            <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                                <Icon name="close" size={24} color="#E53935" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Text style={styles.totalPrice}>Total: ${getTotalPrice()}.00</Text>
                    <View style={styles.cartButtons}>
                        <Button title="Pay" onPress={handlePayment} buttonStyle={styles.payButton} />
                        <Button title="Clear Cart" onPress={clearCart} buttonStyle={styles.clearButton} />
                    </View>
                </View>
            )}
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
    addButton: {
        backgroundColor: '#E53935',
        marginTop: 10,
        width: '15%',
        marginLeft: '85%'
    },
    cartContainer: {
        backgroundColor: '#212121',
        padding: 10,
        marginTop: 1,
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F4F6FC',
        marginBottom: 10,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cartItemName: {
        color: '#F4F6FC',
        flex: 2,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    quantityButton: {
        color: '#E53935',
        fontSize: 20,
        paddingHorizontal: 10,
    },
    quantity: {
        color: '#F4F6FC',
        paddingHorizontal: 10,
    },
    cartItemPrice: {
        color: '#F4F6FC',
        flex: 1,
        textAlign: 'right',
    },
    totalPrice: {
        color: '#F4F6FC',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cartButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        margin: '2%',
    },
    payButton: {
        backgroundColor: '#E53935',
    },
    clearButton: {
        backgroundColor: '#424242',
    },
});

export default PaquetesScreen;
