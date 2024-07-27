import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../IP.js';

const PremiumPackagesScreen = ({ navigation }) => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPremiumPackages();
  }, []);

  const fetchPremiumPackages = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://${IP}:3000/paqueteComprado/premium/${userId}`);
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching premium packages:', error);
    }
  };

  const renderPackage = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.location}>Ubicación: {item.ubicacion}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AccessControlScreen', { packageId: item._id })}
      >
        <Text style={styles.buttonText}>Control de Acceso</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Paquetes Premium</Text>
      <FlatList
        data={packages}
        renderItem={renderPackage}
        keyExtractor={item => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron paquetes Premium</Text>}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#212121',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#F4F6FC',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#E53935',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#F4F6FC',
    marginTop: 20,
  },
});

export default PremiumPackagesScreen;