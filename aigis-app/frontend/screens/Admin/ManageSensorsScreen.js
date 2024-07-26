import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import IP from '../../IP';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const ManageSensorsScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (selectedUser) {
        fetchData(selectedUser);
      }
    }, [selectedUser])
  );

  const fetchUsers = async () => {
    const url = `http://${IP}:3000/usuario`;
    try {
      const response = await axios.get(url);
      setUsers(response.data.users.filter(user => user.rol === 'user'));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async (userId) => {
    setLoading(true);
    const url = `http://${IP}:3000/sensor/usuario/${userId}`;
    try {
      const response = await axios.get(url);
      setData(response.data.sensores);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error fetching sensors');
    } finally {
      setLoading(false);
    }
  };

  const updateSensorStatus = async (sensorId) => {
    const url = `http://${IP}:3000/sensor/${sensorId}/updateStatus`;
    try {
      await axios.put(url);
      fetchData(selectedUser);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update sensor status');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedUser) {
      fetchData(selectedUser).then(() => {
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.tipo}</Text>
      <Text style={styles.details}>Location: {item.ubicacion}</Text>
      <Text style={styles.details}>Status: {item.estado}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => updateSensorStatus(item.sensor_id)}
        >
          <Text style={styles.optionButtonText}>
            {item.estado === 'active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Sensors</Text>
        <Picker
          selectedValue={selectedUser}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedUser(itemValue)}
        >
          <Picker.Item label="Select User" value={null} />
          {users.map(user => (
            <Picker.Item key={user._id} label={user.nombre} value={user._id} />
          ))}
        </Picker>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#E53935" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.sensor_id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.noDataText}>No sensors found</Text>}
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
  picker: {
    height: 50,
    width: 200,
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  optionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDataText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ManageSensorsScreen;
