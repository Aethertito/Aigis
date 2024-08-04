import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../IP';

const TemperatureHumidityChart = () => {
  const [selectedData, setSelectedData] = useState('temperature');
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
        console.log('User ID:', id);
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://${IP}:3000/api/valores-temp/${userId}`);
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [userId]);

  // Preparar datos para la gráfica
  const dates = data.map(item => new Date(item.fecha).toLocaleString());
  const temperatureData = data.map(item => item.valor.temperatura);
  const humidityData = data.map(item => item.valor.humedad);

  return (
    <View>
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
              labels: dates,
              datasets: [
                {
                  data: selectedData === 'temperature' ? temperatureData : humidityData,
                },
              ],
            }}
            width={Math.max(dates.length * 50, Dimensions.get('window').width)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  switchButton: {
    backgroundColor: '#E53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  activeButton: {
    backgroundColor: '#B71C1C',
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
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 18,
  },
});

export default TemperatureHumidityChart;
