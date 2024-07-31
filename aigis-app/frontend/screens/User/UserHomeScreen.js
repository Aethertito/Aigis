import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
  const [temperatureSensors, setTemperatureSensors] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    getUserId();
    fetchWeather();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTemperatureSensorsByLocation();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedLocation) {
      fetchData(viewMode);
    }
  }, [viewMode, selectedLocation]);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
      console.log('User ID:', id);
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  };

  const fetchTemperatureSensorsByLocation = async () => {
    try {
      if (!userId) return;

      console.log('Enviando userId:', userId);

      const response = await axios.get(`http://${IP}:3000/sensor/temperature/locations`, {
        params: { userId: userId }
      });

      console.log('Response data:', response.data);
      setTemperatureSensors(response.data.sensores || {});
    } catch (error) {
      console.error('Error fetching temperature sensors by location:', error);
    }
  };

  const fetchData = async (mode) => {
    if (!selectedLocation || !temperatureSensors[selectedLocation]) return;
    try {
      const startDate = '2023-07-01';
      const endDate = '2023-07-14';
      const sensorIds = temperatureSensors[selectedLocation].map(sensor => sensor.sensor_id).join(',');
      console.log('Fetching data for sensor IDs:', sensorIds); // Verificación de sensor IDs
  
      const response = await axios.get(`http://${IP}:3000/api/statistics`, {
        params: { sensorIds, startDate, endDate }
      });
      const statistics = response.data;
  
      console.log('Statistics data received:', statistics); // Verificación de los datos recibidos
      const processedData = processData(statistics, mode);
      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const processData = (statistics, mode) => {
    if (!statistics || statistics.length === 0) return [];
    const dataPoints = statistics[0].valores.map(entry => ({
      date: new Date(entry.fecha).toISOString().split('T')[0],
      temperature: entry.valor.temperatura,
      humidity: entry.valor.humedad
    }));

    if (mode === 'day') {
      return dataPoints;
    } else if (mode === 'week') {
      const weeklyData = dataPoints.reduce((acc, point) => {
        const week = getWeekNumber(new Date(point.date));
        if (!acc[week]) {
          acc[week] = { week, temperature: 0, humidity: 0, count: 0 };
        }
        acc[week].temperature += point.temperature;
        acc[week].humidity += point.humidity;
        acc[week].count += 1;
        return acc;
      }, {});

      return Object.values(weeklyData).map(item => ({
        week: item.week,
        temperature: item.temperature / item.count,
        humidity: item.humidity / item.count
      }));
    }
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
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
        <View style={styles.statCard}>
          <Icon name="bolt" size={24} color="#E53935" />
          <Text style={styles.statValue}>174 MW</Text>
          <Text style={styles.statLabel}>Electricity</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="tint" size={24} color="#E53935" />
          <Text style={styles.statValue}>216 Units</Text>
          <Text style={styles.statLabel}>Water</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="wifi" size={24} color="#E53935" />
          <Text style={styles.statValue}>5 Users</Text>
          <Text style={styles.statLabel}>WiFi</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="video" size={24} color="#E53935" />
          <Text style={styles.statValue}>12 Active</Text>
          <Text style={styles.statLabel}>Cameras</Text>
        </View>
      </View>

      <View style={styles.sensorSelector}>
        <Text style={styles.selectorLabel}>Select Temperature Sensor:</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            setSelectedLocation(value);
            console.log('Ubicación seleccionada:', value);
          }}
          items={Object.keys(temperatureSensors).map(location => ({
            label: location,
            value: location,
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
        <LineChart
          data={{
            labels: data.map(item => viewMode === 'day' ? item.date : `Week ${item.week}`),
            datasets: [
              {
                data: data.map(item => selectedData === 'temperature' ? item.temperature : item.humidity),
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
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
        />
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
  statValue: {
    color: '#F4F6FC',
    fontSize: 24,
    marginVertical: 10,
  },
  statLabel: {
    color: '#F4F6FC',
    fontSize: 16,
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
    padding: 10,
    marginBottom: 20,
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
