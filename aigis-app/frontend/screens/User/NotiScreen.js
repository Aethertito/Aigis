import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../IP';

const NotiScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`http://${IP}:3000/api/notifications`, {
            params: { userId, page }
          });
          setNotifications(response.data.notifications);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [page]);

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://${IP}:3000/api/notifications/${id}`);
      // Actualizar la lista de notificaciones después de la eliminación
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.notificationContainer}>
            <View style={styles.notification}>
              <Text style={styles.message}>{item.mensaje}</Text>
              <Text style={styles.date}>{new Date(item.fecha).toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNotification(item._id)}
            >
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={() => {
          if (page < totalPages) {
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#424242',
  },
  title: {
    fontSize: 24,
    color: '#F4F6FC',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  notificationContainer: {
    position: 'relative',
    marginBottom: 10,
    marginTop: 10
  },
  notification: {
    backgroundColor: '#212121',
    padding: 15,
    borderRadius: 10,
    borderColor: '#E53935',
    borderWidth: 1,
  },
  message: {
    color: '#F4F6FC',
    fontSize: 16,
  },
  date: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  deleteButton: {
    position: 'absolute',
    right: -1,
    top: -8,
    backgroundColor: '#E53935',
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
  deleteText: {
    color: '#F4F6FC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotiScreen;
