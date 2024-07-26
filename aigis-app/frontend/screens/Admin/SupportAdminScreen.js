import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import IP from '../../IP';

const SupportAdminScreen = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://${IP}:3000/usuario/support/comments`);
      setComments(response.data.supportComments);
    } catch (error) {
      console.error('Error fetching support comments:', error);
      setError('Error fetching support comments');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.name}>Company: {item.usuario_id.nombre}</Text>
        <Text style={styles.date}>{new Date(item.fecha).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.email}>Email: {item.usuario_id.correo}</Text>
      <Text style={styles.title}>Problem: {item.titulo}</Text>
      <Text style={styles.problem}>Description: {item.problema}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title2}>Support Comments</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#E53935" />
      ) : (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={<Text style={styles.noDataText}>No comments found</Text>}
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
  title2: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  date: {
    fontSize: 14,
    color: '#F4F6FC',
  },
  email: {
    fontSize: 16,
    color: '#F4F6FC',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 4,
  },
  problem: {
    fontSize: 16,
    color: '#F4F6FC',
    marginBottom: 8,
  },
  replyButton: {
    backgroundColor: '#E53935',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  replyButtonText: {
    color: '#F4F6FC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#F4F6FC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#F4F6FC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SupportAdminScreen;
