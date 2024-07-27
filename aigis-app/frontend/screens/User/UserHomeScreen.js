import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const UserHomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState('day');
  const [userId, setUserId] = useState(null);
  const [weather, setWeather] = useState({ temperature: null, location: 'Your Location' });

  useEffect(() => {
    getUserId();
    fetchWeather();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchData(viewMode);
    }
  }, [viewMode, userId]);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  };

  const fetchData = async (mode) => {
    try {
      const startDate = '2023-07-01';
      const endDate = '2023-07-14';
      const response = await axios.get(`http://localhost:3000/api/statistics?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
      const statistics = response.data;

      const processedData = processData(statistics, mode);
      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=f847590632224d78a8093009242707&q=auto:ip`);
      const { temp_c, location } = response.data.current;
      setWeather({ temperature: temp_c, location: location.name });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const processData = (statistics, mode) => {
    const dataPoints = statistics[0].valores.map(entry => ({
      date: new Date(entry.fecha).toISOString().split('T')[0],
      temperature: entry.valor.temperatura
    }));

    if (mode === 'day') {
      return dataPoints.map(point => ({
        date: point.date,
        temperature: point.temperature
      }));
    } else if (mode === 'week') {
      const weeklyData = dataPoints.reduce((acc, point) => {
        const week = getWeekNumber(new Date(point.date));
        if (!acc[week]) {
          acc[week] = { week, temperature: 0, count: 0 };
        }
        acc[week].temperature += point.temperature;
        acc[week].count += 1;
        return acc;
      }, {});

      return Object.values(weeklyData).map(item => ({
        week: item.week,
        temperature: item.temperature / item.count
      }));
    }
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>{weather.temperature}°C</Text>
          <Text style={styles.date}>{moment().format('DD MMM YYYY')}</Text>
          <Text style={styles.location}>{weather.location}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Temperature and Humidity</Text>
        <LineChart
          data={{
            labels: data.map(item => viewMode === 'day' ? item.date : `Week ${item.week}`),
            datasets: [
              {
                data: data.map(item => item.temperature),
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="°C"
          chartConfig={{
            backgroundColor: '#1f212b',
            backgroundGradientFrom: '#1f212b',
            backgroundGradientTo: '#1f212b',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
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

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="bolt" size={24} color="#fff" />
          <Text style={styles.statValue}>174 MW</Text>
          <Text style={styles.statLabel}>Electricity</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="tint" size={24} color="#fff" />
          <Text style={styles.statValue}>216 Units</Text>
          <Text style={styles.statLabel}>Water</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="wifi" size={24} color="#fff" />
          <Text style={styles.statValue}>5 Users</Text>
          <Text style={styles.statLabel}>WiFi</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="video" size={24} color="#fff" />
          <Text style={styles.statValue}>12 Active</Text>
          <Text style={styles.statLabel}>Cameras</Text>
        </View>
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
    backgroundColor: '#1f212b',
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
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  location: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: '#292b36',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },
  chartTitle: {
    color: '#fff',
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
  },
  switchButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#2e86c1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#292b36',
    borderRadius: 16,
    width: '48%',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    marginVertical: 10,
  },
  statLabel: {
    color: '#fff',
    fontSize: 16,
  },
  packageButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserHomeScreen;
