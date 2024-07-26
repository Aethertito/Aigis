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
      'Confirmation',
      'Are you sure you want to delete this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const url = `http://${IP}:3000/usuario/${userId}`;
              await axios.delete(url);
              fetchData(); // Actualiza la lista de usuarios
              Alert.alert('Success', 'User successfully deleted');
            } catch (error) {
              Alert.alert('Error', 'Could not delete user');
              console.log(error)
            }
          }
        }
      ]
    );
  };

  const handleMoreInfo = (userId) => {
    navigation.navigate('MoreInfo', { userId });
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
          <Text style={styles.moreInfo} onPress={() => handleMoreInfo(item._id)}>More Information...</Text>
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
        <Text style={styles.title}>Manage Companies</Text>
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
  moreInfo: {
    fontSize: 16,
    color: '#E53935',
    textDecorationLine: 'underline',
    marginTop: 5,
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
