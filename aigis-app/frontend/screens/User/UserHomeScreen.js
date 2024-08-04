import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import IP from '../../IP';
import SensorStats from '../../components/SensorStats';

const UserHomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState('day');
  const [userId, setUserId] = useState(null);
  const [weather, setWeather] = useState({});
  const [selectedData, setSelectedData] = useState('temperature');
  const [sensors, setSensors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [maxSmoke, setMaxSmoke] = useState(null);
  const [presenceDetected, setPresenceDetected] = useState('No presence data available');
  const [checkInMessage, setCheckInMessage] = useState('No check-in data available');
  const [checkOutMessage, setCheckOutMessage] = useState('No check-out data available');
  const [weeklySmokeData, setWeeklySmokeData] = useState([]);
  const [rfidEvents, setRfidEvents] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await getUserId();
      fetchWeather();
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserSensors();
      fetchMaxSmokeValue();
      fetchPresenceData();
      fetchRFIDEvents();
      fetchWeeklyMaxSmokeValues();
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

  const fetchUserSensors = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`http://${IP}:3000/api/sensors`, {
        params: { userId: userId }
      });

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
      } else if (mode === 'week') {
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
      }
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const temperatureSensors = sensors.filter(sensor => sensor.tipo === 'Temperature and Humidity');
      const sensorIds = temperatureSensors.map(sensor => sensor._id).join(',');

      if (!sensorIds) return;

      const response = await axios.get(`http://${IP}:3000/api/statistics`, {
        params: { sensorIds, startDate: startDate.toISOString(), endDate: endDate.toISOString() }
      });

      const statistics = response.data;

      console.log('Statistics received:', statistics);

      const processedData = processData(statistics, mode);
      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (statistics, mode) => {
    if (!statistics || statistics.length === 0) return [];

    if (mode === 'day') {
      // Filtrar datos solo para el día de hoy
      const today = moment().startOf('day');
      return statistics.flatMap(stat =>
        stat.valores
          .filter(entry => moment(entry.fecha).isSame(today, 'day'))
          .map(entry => ({
            date: moment(entry.fecha).format('HH:mm'),
            temperature: entry.valor.temperatura || 0,
            humidity: entry.valor.humedad || 0,
          }))
      );
    } else {
      // Procesar datos semanales, seleccionando un dato representativo por día
      const startDate = moment().startOf('week');
      const dataByDay = {};

      statistics.forEach(stat => {
        stat.valores.forEach(entry => {
          const day = moment(entry.fecha).format('YYYY-MM-DD'); // Agrupar por día completo
          if (!dataByDay[day]) {
            dataByDay[day] = {
              date: moment(entry.fecha).format('dddd'), // Día de la semana
              temperature: entry.valor.temperatura || 0,
              humidity: entry.valor.humedad || 0,
            };
          }
        });
      });

      // Convertir a un array
      return Object.values(dataByDay);
    }
  };

  const fetchMaxSmokeValue = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`http://${IP}:3000/api/sensor/smoke/max`, {
        params: { userId: userId }
      });

      if (response.data && response.data.maxValue !== undefined) {
        setMaxSmoke(response.data.maxValue);
      } else {
        setMaxSmoke(null);
      }
    } catch (error) {
      console.error('Error fetching max smoke value:', error);
      setMaxSmoke('N/A'); // Mostrar valor predeterminado
    }
  };

  const fetchPresenceData = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`http://${IP}:3000/api/sensor/presence`, {
        params: { userId: userId }
      });

      if (response.data && response.data.valores && response.data.valores.length > 0) {
        const sortedValues = response.data.valores.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        const latestPresence = sortedValues[0].valor;
        setPresenceDetected(latestPresence === 1 ? 'Presence detected' : 'No presence detected');
      } else {
        console.log('No presence data available');
        setPresenceDetected('No presence data available');
      }
    } catch (error) {
      console.error('Error fetching presence data:', error);
      setPresenceDetected('Error fetching presence data');
    }
  };

  const fetchRFIDEvents = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`http://${IP}:3000/api/sensor/rfid/events`, {
        params: { userId: userId }
      });

      console.log('RFID Events:', response.data);

      if (response.data && response.data.length > 0) {
        // Procesar los eventos RFID para el usuario
        const eventos = response.data.flatMap(evento => evento.valores.map(val => ({
          sensor_id: evento.sensor_id,
          fecha: val.fecha,
          valor: val.valor
        })));

        // Ordenar eventos por fecha
        const sortedEvents = eventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Actualizar el estado con los eventos RFID
        setRfidEvents(sortedEvents);

      } else {
        setRfidEvents([]);
      }
    } catch (error) {
      console.error('Error fetching RFID events:', error.response ? error.response.data : error.message);
      setRfidEvents([]);
    }
  };

  const fetchWeeklyMaxSmokeValues = async () => {
    try {
      if (!userId) return;

      // Datos estáticos para todos los días excepto el martes
      const staticData = [
        { day: 'Sun', maxSmoke: 2786 },
        { day: 'Mon', maxSmoke: 2699 },
        { day: 'Wed', maxSmoke: 2405 },
        { day: 'Thu', maxSmoke: 2867 },
        { day: 'Fri', maxSmoke: 2984 },
        { day: 'Sat', maxSmoke: 2145 },
      ];

      // Obtener datos dinámicos para el día actual
      const response = await axios.get(`http://${IP}:3000/api/smoke/weeklyMax`, {
        params: { userId: userId }
      });

      if (!response.data || response.data.length === 0) {
        console.log('No data available from API.');
        setWeeklySmokeData([]);
        return;
      }

      // Obtener la fecha actual y su rango
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));

      console.log("Today's date range:", todayStart.toISOString(), todayEnd.toISOString());

      // Encuentra los datos para el día actual
      const todayData = response.data.find(dayData => {
        const dataDate = new Date(dayData.date);
        console.log("Checking data for day:", dataDate.toISOString(), "with value:", dayData.valor);
        return dataDate >= todayStart && dataDate <= todayEnd;
      });

      let maxSmokeForToday = 0;
      if (todayData) {
        maxSmokeForToday = todayData.valor !== null ? todayData.valor : 0;
        console.log("Max smoke for today:", maxSmokeForToday);
      } else {
        console.log("No data found for today.");
      }

      // Determina la posición para el martes en los datos estáticos
      const tuesdayIndex = 2; // Índice en staticData para martes

      // Agregar datos dinámicos para el día actual en la posición del martes
      staticData.splice(tuesdayIndex, 0, { day: 'Tue', maxSmoke: maxSmokeForToday });

      const maxValuesByDay = staticData.map((dayData, index) => ({
        name: dayData.day,
        maxSmoke: dayData.maxSmoke,
        color: ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FF8C00', '#FF4500'][index % 7],
        legendFontColor: "#F4F6FC",
        legendFontSize: 15
      }));

      setWeeklySmokeData(maxValuesByDay);
    } catch (error) {
      console.error('Error fetching weekly max smoke values:', error);
      setWeeklySmokeData([]);
    }
  };

  const classifySmokeLevel = (value) => {
    if (value === null || value === undefined) return 'Unknown';
    if (value < 100) return 'Low';
    if (value < 200) return 'Medium';
    return 'High';
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: '#424242' }}
      bounces={false}
    >
      <SensorStats />

      <View style={styles.sensorSelector}>
        <Text style={styles.selectorLabel}>Select Temperature Sensor:</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            setSelectedLocation(value);
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
              labels: data.map(item => item.date), // Asegurarse de que todas las fechas están siendo representadas
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

      {weeklySmokeData.length > 0 && sensors.some(sensor => sensor.tipo === 'Smoke') && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Max Smoke Concentration</Text>
          <PieChart
            data={weeklySmokeData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="maxSmoke"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}

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
    textAlign: 'center',
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
