import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import IP from '../../IP.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationsScreen = () => {
  const [paquetesComprados, setPaquetesComprados] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPaquetesComprados = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const url = `http://${IP}:3000/paqueteComprado/usuario/${userId}`; // Ajusta esta URL según tu API
      const response = await axios.get(url);
      setPaquetesComprados(response.data.paquetesComprados);
    } catch (error) {
      console.error('Error fetching paquetes comprados:', error);
      Alert.alert('Error', 'Failed to fetch purchased packages');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPaquetesComprados();
    }, [])
  );

  const updateLocation = async (paqueteId, newLocation) => {
    try {
      const url = `http://${IP}:3000/paqueteComprado/${paqueteId}`; // Ajusta esta URL según tu API
      await axios.put(url, { ubicacion: newLocation });
      fetchPaquetesComprados(); // Actualiza la lista después de la actualización
      Alert.alert('Success', 'Location updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Error', 'Failed to update location');
    }
  };

  const renderSensor = ({ item }) => (
    <View style={styles.sensorItem}>
      <Text style={styles.sensorText}>{item.tipo}</Text>
    </View>
  );

  const renderPaquete = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.paquete}</Text>
      <Text style={styles.description}>Price: ${item.precio}</Text>
      <Text style={styles.description}>Location:</Text>
      <View style={styles.locationContainer}>
        <TextInput
          style={styles.locationInput}
          placeholder="Enter location"
          placeholderTextColor="#757575"
          value={item.ubicacion}
          onChangeText={(text) => {
            const updatedPaquetes = paquetesComprados.map(paquete =>
              paquete._id === item._id ? { ...paquete, ubicacion: text } : paquete
            );
            setPaquetesComprados(updatedPaquetes);
          }}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => updateLocation(item._id, item.ubicacion)}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sensoresTitle}>Sensors:</Text>
      <FlatList
        data={item.sensores}
        renderItem={renderSensor}
        keyExtractor={(sensor) => sensor._id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title2}>Purchased Packages</Text>
      <FlatList
        data={paquetesComprados}
        renderItem={renderPaquete}
        keyExtractor={item => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No purchased packages found</Text>}
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
  listContentContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#212121',
    borderRadius: 10,
    padding: 18,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4F6FC',
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    alignSelf: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#F4F6FC',
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#303030',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#F4F6FC',
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#F4F6FC',
  },
  sensoresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginTop: 10,
    marginBottom: 5,
  },
  sensorItem: {
    backgroundColor: '#303030',
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
  },
  sensorText: {
    color: '#F4F6FC',
    fontSize: 12,
  },
});

export default LocationsScreen;