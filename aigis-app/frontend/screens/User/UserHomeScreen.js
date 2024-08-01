import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import IP from '../../IP';

const UserHomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState('day');
  const [userId, setUserId] = useState(null);
  const [weather, setWeather] = useState({
    temperature: null,
    location: '',
    date: '',
    icon: '',
    condition: '',
  });
  const [selectedData, setSelectedData] = useState('temperature');
  const [sensors, setSensors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [maxSmoke, setMaxSmoke] = useState(null);
  const [presenceDetected, setPresenceDetected] = useState('No presence data available');

  useEffect(() => {
    getUserId();
    fetchWeather();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserSensors();
      fetchMaxSmokeValue();
      fetchPresenceData();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedLocation) {
      fetchData(viewMode);
    }
  }, [viewMode, selectedLocation]);

  useEffect(() => {
    if (userId) {
      fetchUserSensors();
    }
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
      console.log('Weather data:', { location, current });
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

  const fetchUserSensors = async () => {
    try {
      if (!userId) return;

      console.log('Enviando userId:', userId);

      const response = await axios.get(`http://${IP}:3000/api/sensors`, {
        params: { userId: userId }
      });

      console.log('Response data:', response.data);
      setSensors(response.data.sensores || []);
    } catch (error) {
      console.error('Error fetching user sensors:', error);
    }
  };
  
  const fetchData = async (mode) => {
    if (!selectedLocation || !sensors.length) return;
    try {
      const endDate = new Date();
      let startDate;

      if (mode === 'day') {
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      } else {
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
      }
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const temperatureSensors = sensors.filter(sensor => sensor.tipo === 'Temperature and Humidity');
      const sensorIds = temperatureSensors.map(sensor => sensor._id).join(',');
      console.log('Fetching data for sensor IDs:', sensorIds);
  
      if (!sensorIds) {
        console.log('No sensor IDs found for the selected location.');
        return;
      }

      const response = await axios.get(`http://${IP}:3000/api/statistics`, {
        params: { sensorIds, startDate: startDate.toISOString(), endDate: endDate.toISOString() }
      });
      const statistics = response.data;
  
      console.log('Statistics data received:', statistics);
      const processedData = processData(statistics, mode);
      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (statistics, mode) => {
    if (!statistics || statistics.length === 0) return [];

    const groupedData = {};

    statistics.forEach(stat => {
      stat.valores.forEach(entry => {
        const date = new Date(entry.fecha);
        let key;
        if (mode === 'day') {
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else {
          const week = moment(date).isoWeek(); // Week number
          key = `Week ${week}`;
        }

        if (!groupedData[key]) {
          groupedData[key] = { temperature: 0, humidity: 0, count: 0 };
        }

        groupedData[key].temperature += entry.valor.temperatura || 0;
        groupedData[key].humidity += entry.valor.humedad || 0;
        groupedData[key].count += 1;
      });
    });

    return Object.keys(groupedData).map(key => ({
      date: key,
      temperature: groupedData[key].temperature / groupedData[key].count,
      humidity: groupedData[key].humidity / groupedData[key].count,
    }));
  };

  const fetchMaxSmokeValue = async () => {
    try {
      if (!userId) return;
    
      console.log('Fetching max smoke value for user:', userId);
    
      const response = await axios.get(`http://${IP}:3000/api/sensor/smoke/max`, {
        params: { userId: userId }
      });
    
      console.log('Response data:', response.data);
    
      if (response.data && response.data.maxValue !== undefined) {
        console.log('Received max smoke value:', response.data.maxValue);
        setMaxSmoke(response.data.maxValue);
      } else {
        console.log('No smoke sensors found or no max value returned.');
        setMaxSmoke(null); // O puedes usar un valor alternativo como 'N/A'
      }
    } catch (error) {
      console.error('Error fetching max smoke value:', error);
      setMaxSmoke(null); // Asegura que el estado se establezca incluso en caso de error
    }
  };
  
  const fetchPresenceData = async () => {
    try {
      if (!userId) return;
  
      console.log('Fetching presence data for user:', userId);
  
      const response = await axios.get(`http://${IP}:3000/api/sensor/presence`, {
        params: { userId: userId }
      });
  
      console.log('Response data:', response.data);
  
      if (response.data && response.data.valores && response.data.valores.length > 0) {
        const latestPresence = response.data.valores[response.data.valores.length - 1].valor;
        setPresenceDetected(latestPresence === 1 ? 'Presence detected' : 'No presence detected');
      } else {
        setPresenceDetected('No presence data available');
      }
    } catch (error) {
      console.error('Error fetching presence data:', error);
      setPresenceDetected('Error fetching presence data');
    }
  };
  
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      style={{ backgroundColor: '#424242' }}
      bounces={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>{moment(weather.date).format('DD MMM YYYY')}</Text>
          <Text style={styles.location}>{weather.location}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.temperature}>{weather.temperature}°C</Text>
          {weather.icon ? (
            <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
          ) : (
            <View style={[styles.weatherIcon, styles.placeholderIcon]}>
              <Icon name="cloud" size={30} color="#bbb" />
            </View>
          )}
          <Text style={styles.condition}>{weather.condition}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {sensors.some(sensor => sensor.tipo === 'RFID') && (
          <View style={styles.statCard}>
            <Icon2 name="account-check" size={24} color="#E53935" />
            <Text style={styles.statValue}>RFID</Text>
            <Text style={styles.statLabel}>Check In</Text>
          </View>
        )}
        {sensors.some(sensor => sensor.tipo === 'Smoke') && (
          <View style={styles.statCard}>
            <Icon2 name="smoke-detector" size={24} color="#E53935" />
            <Text style={styles.statValue}>{maxSmoke !== null ? `${maxSmoke} %` : 'N/A'}</Text>
            <Text style={styles.statLabel}>Higher Smoke Value</Text>
          </View>
        )}
        {sensors.some(sensor => sensor.tipo === 'RFID') && (
          <View style={styles.statCard}>
            <Icon2 name="exit-run" size={24} color="#E53935" />
            <Text style={styles.statValue}>RFID</Text>
            <Text style={styles.statLabel}>Check Out</Text>
          </View>
        )}
        {sensors.some(sensor => sensor.tipo === 'Presence') && (
          <View style={styles.statCardCentered}>
            <Icon2 name="motion-sensor" size={24} color="#E53935" />
            <Text style={styles.statValue}>{presenceDetected}</Text>
            <Text style={styles.statLabel}>Presence</Text>
          </View>
        )}
      </View>

      <View style={styles.sensorSelector}>
        <Text style={styles.selectorLabel}>Select Temperature Sensor:</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            setSelectedLocation(value);
            console.log('Ubicación seleccionada:', value);
          }}
          items={sensors.filter(sensor => sensor.tipo === 'Temperature and Humidity').map(sensor => ({
            label: sensor.ubicacion || 'Unknown location',
            value: sensor.ubicacion,
          }))}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select a location', value: null }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.switchButton, selectedData === 'temperature' && styles.activeButton]}
          onPress={() => setSelectedData('temperature')}
        >
          <Text style={styles.buttonText}>Temperature</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, selectedData === 'humidity' && styles.activeButton]}
          onPress={() => setSelectedData('humidity')}
        >
          <Text style={styles.buttonText}>Humidity</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{selectedData === 'temperature' ? 'Temperature' : 'Humidity'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: data.map(item => viewMode === 'day' ? item.date : item.date),
              datasets: [
                {
                  data: data.map(item => selectedData === 'temperature' ? item.temperature : item.humidity),
                },
              ],
            }}
            width={Math.max(data.length * 50, Dimensions.get('window').width)} 
            height={220}
            yAxisLabel=""
            yAxisSuffix={selectedData === 'temperature' ? "°C" : "%"}
            chartConfig={{
              backgroundColor: '#212121',
              backgroundGradientFrom: '#212121',
              backgroundGradientTo: '#212121',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#E53935',
              },
            }}
            style={styles.chart}
            fromZero
          />
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.switchButton, viewMode === 'day' && styles.activeButton]}
          onPress={() => setViewMode('day')}
        >
          <Text style={styles.buttonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, viewMode === 'week' && styles.activeButton]}
          onPress={() => setViewMode('week')}
        >
          <Text style={styles.buttonText}>Weekly</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.packageButton} onPress={() => navigation.navigate('Paquetes')}>
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    justifyContent: 'center',
  },
  date: {
    color: '#F4F6FC',
    fontSize: 16,
    marginBottom: 5,
  },
  location: {
    color: '#bbb',
    fontSize: 16,
    marginTop: 5,
  },
  headerRight: {
    alignItems: 'center',
  },
  temperature: {
    color: '#F4F6FC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  placeholderIcon: {
    backgroundColor: '#333',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  condition: {
    color: '#bbb',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#212121',
    borderRadius: 16,
    width: '48%',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statCardCentered: {
    backgroundColor: '#212121',
    borderRadius: 16,
    width: '48%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: '#F4F6FC',
    fontSize: 24,
    marginVertical: 10,
    textAlign: 'center',
  },
  statLabel: {
    color: '#F4F6FC',
    fontSize: 16,
    textAlign: 'center',
  },
  sensorSelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    color: '#F4F6FC',
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    color: '#F4F6FC',
    backgroundColor: '#212121',
  },
  chartContainer: {
    backgroundColor: '#212121',
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    overflow: 'hidden',
  },
  chartTitle: {
    color: '#E53935',
    fontSize: 18,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  switchButton: {
    backgroundColor: '#E53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5
  },
  activeButton: {
    backgroundColor: '#B71C1C',
  },
  packageButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 5,
    color: '#F4F6FC',
    backgroundColor: '#212121',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 5,
    color: '#F4F6FC',
    backgroundColor: '#212121',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
  },
});

export default UserHomeScreen;
