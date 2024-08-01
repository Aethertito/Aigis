import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import IP from '../../IP';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const url = `http://${IP}:3000/paqueteComprado/usuario/${userId}`;
      const response = await axios.get(url);
      setOrders(response.data.paquetesComprados);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.paquete}</Text>
      <Text style={styles.price}>Price: ${item.precio}.00</Text>
      <Text style={styles.details}>Sensors:</Text>
      {item.sensores.map((sensor, index) => (
        <Text key={index} style={styles.sensor}>{sensor.tipo}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <Text style={styles.infoText2}>
        Review the security packages you've purchased. Details about your order, including the price and contents, are displayed.
      </Text>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          key={orders.length}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={styles.emptyText}>No orders found</Text>}
        />
      )}
      <Text style={styles.infoText}>
        If you encounter any issues with your order, please don't hesitate to contact technical support.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#424242',
  },
  infoText: {
    fontSize: 14,
    color: '#F4F6FC',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText2: {
    fontSize: 14,
    color: '#F4F6FC',
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 5,
    alignSelf: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#212121',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4F6FC',
  },
  price: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  sensor: {
    fontSize: 14,
    color: '#9E9E9E',
    marginLeft: 10,
  },
  loading: {
    fontSize: 18,
    color: '#F4F6FC',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#F4F6FC',
    alignSelf: 'center',
  },
});

export default OrdersScreen;
