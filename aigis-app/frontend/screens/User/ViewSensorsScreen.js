import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import IP from '../../IP.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewSensorsScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const url = `http://${IP}:3000/sensor/usuario/${userId}`;
      const response = await axios.get(url);
      const activeSensors = response.data.sensores.filter(sensor => sensor.estado === 'active');
      setData(activeSensors);
    } catch (error) {
      console.error('Error fetching sensors:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Filtrar los datos basados en el tipo seleccionado
  const filteredData = filter === 'All' ? data : data.filter(sensor => sensor.tipo === filter);

  const renderItem = ({ item }) => (
    
    <View style={styles.card}>
      <Text style={styles.title}>{item.tipo}</Text>
      <Text style={styles.description}>{item.descripcion}</Text>
      <Text style={styles.status}>Status: {item.estado}</Text>
      <Text style={styles.location}>Location: {item.ubicacion || 'Not assigned'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title2}>Your Sensors</Text>
      <Text style={styles.description}>En esta seccion podras visualizar que sensores tienes activos en tu cuenta. Puedes aplicar un filtro segun los sensores que desees revisar</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {['All', 'RFID', 'Temperature and Humidity', 'Smoke', 'Presence', 'Camera'].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setFilter(item)}
            style={[styles.filterButton, filter === item && styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, filter === item && styles.filterButtonTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.sensor_id}
        ListEmptyComponent={<Text style={styles.emptyText}>No active sensors found</Text>}
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#212121',
    marginRight: 10,
    marginBottom: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E53935',
  },
  filterButtonText: {
    color: '#F4F6FC',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  listContainer: {
    flex: 1,
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
  status: {
    fontSize: 14,
    color: '#E53935',
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    color: '#F4F6FC',
    marginTop: 5,
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#F4F6FC',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#F4F6FC',
  },
});

export default ViewSensorsScreen;
