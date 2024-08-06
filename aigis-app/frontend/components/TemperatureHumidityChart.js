import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import IP from '../IP';
import moment from 'moment';

const TemperatureHumidityChart = () => {
  const [selectedData, setSelectedData] = useState('temperature');
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState('');
  const [sensors, setSensors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // Estado para seleccionar vista diaria o semanal

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
        fetchUserSensors(id);
        console.log('User ID:', id);
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };

    getUserId();
  }, []);

  const fetchUserSensors = async (userId) => {
    try {
      const response = await axios.get(`http://${IP}:3000/api/sensors`, {
        params: { userId }
      });
      setSensors(response.data.sensores || []);
    } catch (error) {
      console.error('Error fetching user sensors:', error);
    }
  };

  const fetchTemperatureHumidityData = async () => {
    try {
      let startDate;
      const endDate = new Date();

      if (viewMode === 'day') {
        // Modo diario: obtener datos del día actual
        startDate = moment().startOf('day').toDate();
        endDate.setHours(23, 59, 59, 999); // Final del día actual
      } else if (viewMode === 'week') {
        // Modo semanal: obtener datos de los últimos 7 días
        startDate = moment().subtract(7, 'days').startOf('day').toDate();
      }

      const response = await axios.get(`http://${IP}:3000/api/valores-temp/${userId}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchTemperatureHumidityData();
    } else {
      setData([]); // Clear data when no location is selected
    }
  }, [selectedLocation, sensors, viewMode]); // Se agrega viewMode a la dependencia para actualizar la gráfica

  // Prepare data for the chart
  const dates = data.map(item => 
    viewMode === 'day'
      ? moment(item.fecha).format('HH:mm')
      : moment(item.fecha).format('DD/MM/YY')
  );
  const temperatureData = data.map(item => item.valor.temperatura);
  const humidityData = data.map(item => item.valor.humedad);

  return (
    <View>
      <View style={styles.sensorSelector}>
        <Text style={styles.selectorLabel}>Select Temperature Sensor:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedLocation(value)}
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
  sensorSelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    color: '#F4F6FC',
    fontSize: 16,
    marginBottom: 5,
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
    marginBottom: 10,
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
    marginBottom: 10,
    width: '100%',
  },
});

export default TemperatureHumidityChart;
