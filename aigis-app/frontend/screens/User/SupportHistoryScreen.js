import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP from '../../IP';

const SupportHistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSupportHistory();
  }, []);

  const fetchSupportHistory = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://${IP}:3000/usuario/${userId}/help`);
      setHistory(response.data.supportRequests);
    } catch (error) {
      console.error('Error fetching support history:', error);
      setError('Error fetching support history');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.date}>{new Date(item.fecha).toLocaleDateString()}</Text>
      <Text style={styles.description}>{item.problema}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Support History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#E53935" />
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No support requests found</Text>}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#424242',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#212121',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  date: {
    fontSize: 14,
    color: '#F4F6FC',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  emptyText: {
    fontSize: 16,
    color: '#F4F6FC',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F4F6FC',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SupportHistoryScreen;
