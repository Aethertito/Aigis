import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { PieChart } from 'react-native-chart-kit';
import IP from '../IP';

const SensorStats = () => {
  const [userId, setUserId] = useState(null);
  const [smokeData, setSmokeData] = useState(null);
  const [presenceData, setPresenceData] = useState(null);
  const [entrada, setEntrada] = useState(null);
  const [salida, setSalida] = useState(null);
  const [weeklySmokeData, setWeeklySmokeData] = useState([
    { name: 'Sun', maxSmoke: 2786, color: '#FF0000', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Mon', maxSmoke: 2699, color: '#FF4500', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Tue', maxSmoke: 0, color: '#FF6347', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Wed', maxSmoke: 2405, color: '#FF7F50', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Thu', maxSmoke: 2867, color: '#FFA07A', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Fri', maxSmoke: 2984, color: '#FF8C00', legendFontColor: "#F4F6FC", legendFontSize: 15 },
    { name: 'Sat', maxSmoke: 2145, color: '#FF4500', legendFontColor: "#F4F6FC", legendFontSize: 15 },
  ]);
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
        try {
          const entradasSalidasResponse = await axios.get(`http://${IP}:3000/api/entradas-salidas/${userId}`);
          console.log('Entradas y Salidas Response:', entradasSalidasResponse.data);
          setEntrada(entradasSalidasResponse.data.entrada || null);
          setSalida(entradasSalidasResponse.data.salida || null);

          // Fetch smoke data
          const smokeResponse = await axios.get(`http://${IP}:3000/api/obtener-smoke/${userId}`);
          setSmokeData(smokeResponse.data.maxValor || null);

          // Update Tuesday data with actual smoke data
          setWeeklySmokeData(prevData => prevData.map(dayData =>
            dayData.name === 'Tue' ? { ...dayData, maxSmoke: smokeResponse.data.maxValor || 0 } : dayData
          ));

          // Fetch presence data
          const presenceResponse = await axios.get(`http://${IP}:3000/api/ultmo-valor-presencia/${userId}`);
          setPresenceData(presenceResponse.data.ultimoValor || null);

        } catch (err) {
          // console.error('Error al obtener los datos de los sensores', err);
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [userId]);

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.statsContainer}>
        <View style={styles.sensorRow}>
          {presenceData !== null && (
            <View style={styles.statCard}>
              <Icon2 name="motion-sensor" size={24} color="#E53935" />
              <Text style={styles.statValue}>{presenceData.valor ? 'Detected' : 'Not Detected'}</Text>
              <Text style={styles.statLabel}>Presence</Text>
            </View>
          )}

          {smokeData !== null && (
            <View style={styles.statCard}>
              <Icon2 name="smoke-detector" size={24} color="#E53935" />
              <Text style={styles.statValue}>{smokeData ? `${smokeData} ppm` : 'No data for today'}</Text>
              <Text style={styles.statLabel}>Max Smoke Concentration</Text>
            </View>
          )}
        </View>

        <View style={styles.entryExitRow}>
          {entrada && (
            <View style={styles.statCard}>
              <Icon2 name="account-check" size={24} color="#E53935" />
              <Text style={styles.statValue}>Entry Recorded</Text>
              <Text style={styles.statLabel}>{new Date(entrada.fecha).toLocaleString()}</Text>
            </View>
          )}

          {salida && (
            <View style={styles.statCard}>
              <Icon2 name="exit-run" size={24} color="#E53935" />
              <Text style={styles.statValue}>Exit Recorded</Text>
              <Text style={styles.statLabel}>{new Date(salida.fecha).toLocaleString()}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#424242',
    padding: 20,
  },
  loadingText: {
    color: '#F4F6FC',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  statsContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  entryExitRow: {
    flexDirection: 'row',
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
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  statLabel: {
    color: '#F4F6FC',
    fontSize: 17,
    textAlign: 'center',
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
});

export default SensorStats;
