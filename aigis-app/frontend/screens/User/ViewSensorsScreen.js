import React, { useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import IP from '../../IP.js';
import CardList from '../../components/CardList.js';

const ViewSensorsScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const url = `http://${IP}:3000/sensor/`;
    try {
      const response = await axios.get(url);
      //console.log(response.data.sensores); // Verifica la estructura de los datos


      setData(response.data.sensores); // Asegúrate de que response.data es un array
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );


  return (
    <View style={{ flex: 1 }}>
      <CardList sensores={data} fetchSensores={fetchData} loading={loading} />
    </View>
  );

};

export default ViewSensorsScreen;
