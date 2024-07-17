import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import IP from '../../IP';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';

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
      <Button title="Edit" onPress={() => {}} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Sensors</Text>
      <Button title='Add New Sensor' color="#0d9488" onPress={() => {navigation.navigate('AddNewSensor')}}/>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
  },
});

export default ManageSensorsScreen;
