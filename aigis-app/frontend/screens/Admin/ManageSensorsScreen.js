import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import IP from '../../IP';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const ManageSensorsScreen = ({navigation}) => {

  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    const url = `http://${IP}:3000/sensor`
    try {
      const response = await axios.get(url)
      console.log(response.data.sensores)
      setData(response.data.sensores)
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    },[])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchData().then(() => {
      setRefreshing(false)
    })
  }
  
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.tipo}</Text>
      <Text style={styles.details}>Precio: {item.precio}</Text>
      <Text style={styles.details}>Estado: {item.estado}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
          <Text style={styles.optionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
          <Text style={styles.optionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Sensors</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNewSensor')}>
          <Text style={styles.addButtonText}>New</Text>
        </TouchableOpacity>
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
  optionButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    flex: 1,
    marginRight: 8
  },
  optionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
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
    backgroundColor: '#757575',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
    borderRadius: 10,
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
});

export default ManageSensorsScreen;
