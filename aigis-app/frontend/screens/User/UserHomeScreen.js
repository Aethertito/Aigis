import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import IP from '../../IP';
import SensorStats from '../../components/SensorStats';
import TemperatureHumidityChart from '../../components/TemperatureHumidityChart';
import SmokeGrafica from '../../components/SmokeGrafica';

const UserHomeScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [weather, setWeather] = useState({});
  const [weeklySmokeData, setWeeklySmokeData] = useState([
    { name: 'Sun', maxSmoke: 1786, color: '#FF0000', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Mon', maxSmoke: 2699, color: '#FF4500', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Tue', maxSmoke: 0, color: '#FF6347', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Wed', maxSmoke: 3405, color: '#FF7F50', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Thu', maxSmoke: 2867, color: '#FFA07A', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Fri', maxSmoke: 2084, color: '#FF8C00', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Sat', maxSmoke: 2145, color: '#FF4500', legendFontColor: "#F4F6FC", legendFontSize: 15 },
  ]);
  const [hasSmokeData, setHasSmokeData] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      await getUserId();
      await fetchWeather();
      await fetchWeeklyMaxSmokeValues();
    };
    fetchInitialData();
  }, [userId]);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      console.log('User ID:', id);
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  };

  const fetchWeather = async () => {
    try {
      const latitude = 32.455544;
      const longitude = -116.828109;
      const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=f847590632224d78a8093009242707&q=${latitude},${longitude}`);
      const { location, current } = response.data;
      setWeather({
        temperature: current.temp_c,
        location: location.name,
        date: location.localtime,
        icon: `https:${current.condition.icon}`,
        condition: current.condition.text
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchWeeklyMaxSmokeValues = async () => {
    try {
      const response = await axios.get(`http://${IP}:3000/api/obtener-smoke/${userId}`);
      if (response.data && response.data.maxValor) {
        setWeeklySmokeData(prevData => prevData.map(dayData => {
          if (dayData.name === 'Tue') {
            return { ...dayData, maxSmoke: response.data.maxValor };
          }
          return dayData;
        }));
        setHasSmokeData(true);
      } else {
        console.log('No data available from API.');
      }
    } catch (error) {
      // console.error('Error fetching weekly max smoke values:', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: '#424242' }}
      bounces={false}
    >
      <View style={styles.weatherContainer}>
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherDate}>
            {weather.date ? moment(weather.date).format('DD MMM YYYY') : 'Unknown Date'}
          </Text>
          <Text style={styles.weatherLocation}>
            {weather.location || 'Unknown Location'}
          </Text>
        </View>
        <View style={styles.weatherDetails}>
          <Text style={styles.weatherTemp}>
            {weather.temperature !== undefined ? `${weather.temperature}°C` : 'N/A'}
          </Text>
          <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
          <Text style={styles.weatherCondition}>
            {weather.condition || 'Unknown Condition'}
          </Text>
        </View>
      </View>

      {/*Traer las graficas y estadisticas de las dems screens*/}
      <SensorStats />
      <TemperatureHumidityChart />
      {hasSmokeData && <SmokeGrafica weeklySmokeData={weeklySmokeData} />}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Paquetes')}>
        <Text style={styles.buttonText}>View Packages</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#424242',
    padding: 20,
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
  weatherInfo: {
    flex: 2,
    bottom: 20,
  },
  weatherDate: {
    color: '#F4F6FC',
    marginBottom: 10,
    fontSize: 18,
  },
  weatherLocation: {
    color: '#bbb',
    fontSize: 16,
  },
  weatherDetails: {
    flex: 1,
    alignItems: 'center',
    bottom: 2,
  },
  weatherTemp: {
    color: '#F4F6FC',
    fontSize: 22,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 80,
    height: 80,
    bottom: 10,
  },
  weatherCondition: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    bottom: 20,
  },
  button: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 18,
  },
});

export default UserHomeScreen;
