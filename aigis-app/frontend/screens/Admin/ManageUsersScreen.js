import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import IP from '../../IP';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ManageUsersScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const url = `http://${IP}:3000/usuario`;
    try {
      const response = await axios.get(url);
      setData(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  };

  const handleEdit = (userId) => {
    navigation.navigate('EditUser', { userId });
  };

  const handleDelete = (userId) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const url = `http://${IP}:3000/usuario/${userId}`;
              await axios.delete(url);
              fetchData(); // Actualiza la lista de usuarios
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
              console.log(error)
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.name}>{item.nombre}</Text>
          <Text style={styles.details}>Email: {item.correo}</Text>
          <Text style={styles.details}>Role: {item.rol}</Text>
          <Text style={styles.details}>Phone: {item.telefono}</Text>
          <Text style={styles.details}>Membership: {item.memActiva ? 'Active' : 'Inactive'}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(item._id)}>
            <Icon name='edit' color='#FFF' size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleDelete(item._id)}>
            <Icon name='delete' color='#FFF' size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Users</Text>
        {/* Puedes descomentar y usar esta parte si tienes una pantalla para añadir nuevos usuarios */}
        {/* <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNewUser')}>
          <Text style={styles.addButtonText}>New</Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#212121',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#ffffff',
  },
  details: {
    fontSize: 16,
    color: '#ffffff',
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
});

export default ManageUsersScreen;
