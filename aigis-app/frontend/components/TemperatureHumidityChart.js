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

  const notificationHistory = {}; // Para rastrear las notificaciones enviadas

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
        fetchUserSensors(id);
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
      let endDate = new Date();

      if (viewMode === 'day') {
        // Modo diario: obtener datos del día actual
        startDate = moment(endDate).startOf('day').toDate();
        endDate = moment(endDate).endOf('day').toDate();
      } else if (viewMode === 'week') {
        // Modo semanal: obtener datos de los últimos 7 días
        startDate = moment(endDate).subtract(7, 'days').startOf('day').toDate();
        endDate = moment(endDate).endOf('day').toDate();
      }

      const response = await axios.get(`http://${IP}:3000/api/valores-temp/${userId}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      });

      if (viewMode === 'day') {
        setData(response.data);
      } else if (viewMode === 'week') {
        // Agrupar datos por día y calcular el promedio para el modo semanal
        const groupedData = {};
        response.data.forEach(item => {
          const day = moment(item.fecha).format('YYYY-MM-DD');
          if (!groupedData[day]) {
            groupedData[day] = [];
          }
          groupedData[day].push(item);
        });

        const weeklyData = Object.keys(groupedData).map(day => {
          const dailyValues = groupedData[day];
          const avgTemperature = dailyValues.reduce((sum, val) => sum + val.valor.temperatura, 0) / dailyValues.length;
          const avgHumidity = dailyValues.reduce((sum, val) => sum + val.valor.humedad, 0) / dailyValues.length;

          return {
            fecha: day,
            valor: {
              temperatura: avgTemperature,
              humedad: avgHumidity
            }
          };
        });

        setData(weeklyData);
      }

      // Verificar datos de temperatura y humedad para enviar notificaciones
      verificarNotificaciones(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const verificarNotificaciones = async (datos) => {
    const umbralTemperaturaBaja = 10; // Umbral de temperatura baja en °C
    const umbralTemperaturaAlta = 25; // Umbral de temperatura alta en °C
    const umbralHumedadAlta = 50; // Umbral de humedad alta en %
  
    for (const item of datos) {
      const { temperatura, humedad } = item.valor;
      const ubicacion = sensors.find(sensor => sensor.tipo === 'Temperature and Humidity' && sensor.ubicacion === selectedLocation)?.ubicacion || 'Unknown location';
  
      // Notificación para temperatura baja
      if (temperatura < umbralTemperaturaBaja) {
        if (shouldSendNotification('Temperature', 'Low', temperatura, ubicacion)) {
          await enviarNotificacion(userId, 'Temperature', temperatura, `Low temperature alert: ${temperatura}°C at ${ubicacion}`);
        }
      }
      // Notificación para temperatura alta
      if (temperatura > umbralTemperaturaAlta) {
        if (shouldSendNotification('Temperature', 'High', temperatura, ubicacion)) {
          await enviarNotificacion(userId, 'Temperature', temperatura, `High temperature alert: ${temperatura}°C at ${ubicacion}`);
        }
      }
      // Notificación para humedad alta
      if (humedad > umbralHumedadAlta) {
        if (shouldSendNotification('Humidity', 'High', humedad, ubicacion)) {
          await enviarNotificacion(userId, 'Humidity', humedad, `High humidity alert: ${humedad}% at ${ubicacion}`);
        }
      }
    }
  };
  

  const shouldSendNotification = (tipoSensor, nivel, valor, ubicacion) => {
    const currentTime = new Date();
    const historyKey = `${tipoSensor}-${nivel}-${ubicacion}`;

    if (!notificationHistory[historyKey] || (currentTime - notificationHistory[historyKey]) > 3600000) { // 1 hora
      notificationHistory[historyKey] = currentTime;
      return true;
    }
    return false;
  };

  const enviarNotificacion = async (userId, tipoSensor, valor, mensaje) => {
    try {
      await axios.post(`http://${IP}:3000/api/notifications`, {
        userId,
        tipoSensor,
        valor,
        mensaje
      });
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchTemperatureHumidityData();
    } else {
      setData([]);
    }
  }, [selectedLocation, sensors, viewMode]);

  // Set the maximum number of data points to display
  const maxDataPoints = viewMode === 'day' ? 30 : 7;

  // Prepare data for the chart
  const dates = data.slice(-maxDataPoints).map(item => 
    viewMode === 'day'
      ? moment(item.fecha).format('HH:mm')
      : moment(item.fecha).format('DD/MM')
  );

  const temperatureData = data.slice(-maxDataPoints).map(item => 
    item.valor.temperatura !== null ? item.valor.temperatura : 0
  );

  const humidityData = data.slice(-maxDataPoints).map(item => 
    item.valor.humedad !== null ? item.valor.humedad : 0
  );

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
