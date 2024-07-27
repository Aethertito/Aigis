import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
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

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://${IP}:3000/support/comment/${commentId}`);

      if (response.data.status === 'success') {
        setComments(comments.filter(comment => comment._id !== commentId));
        Alert.alert('Success', 'Support comment deleted successfully');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting support comment:', error);
      Alert.alert('Error', 'Failed to delete support comment');
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
      <TouchableOpacity
        style={styles.replyButton}
        onPress={() => deleteComment(item._id)}
      >
        <Text style={styles.replyButtonText}>Mark as Resolved</Text>
      </TouchableOpacity>
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
