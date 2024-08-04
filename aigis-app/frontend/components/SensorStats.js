import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import IP from '../IP';

const SensorStats = () => {
  const [userId, setUserId] = useState(null);
  const [smokeData, setSmokeData] = useState(null);
  const [presenceData, setPresenceData] = useState(null);
  const [entradas, setEntradas] = useState(0);
  const [salidas, setSalidas] = useState(0);
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
            const { entradas: entradasCount, salidas: salidasCount } = entradasSalidasResponse.data || { entradas: 0, salidas: 0 };
            setEntradas(entradasCount);
            setSalidas(salidasCount);
          // Fetch smoke data
          const smokeResponse = await axios.get(`http://${IP}:3000/api/obtener-smoke/${userId}`);
          setSmokeData(smokeResponse.data.ultimoValor || null);
  
          // Fetch presence data
          const presenceResponse = await axios.get(`http://${IP}:3000/api/ultmo-valor-presencia/${userId}`);
          setPresenceData(presenceResponse.data.ultimoValor || null);
  
          // Fetch entradas y salidas data

  
        } catch (err) {
          console.error('Error al obtener los datos de los sensores', err);
        }
        setLoading(false);
      };
  
      fetchData();
    }
  }, [userId]);
  

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;

  const maxSmoke = smokeData ? smokeData.valor : null;
  const presenceDetected = presenceData ? (presenceData.valor ? 'Detected' : 'Not Detected') : null;

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
  <View style={styles.statsContainer}>
    {maxSmoke !== null && (
      <View style={styles.statCard}>
        <Icon2 name="smoke-detector" size={24} color="#E53935" />
        <Text style={styles.statValue}>{`${maxSmoke} ppm`}</Text>
        <Text style={styles.statLabel}>Smoke Concentration</Text>
      </View>
    )}

    {presenceDetected !== null && (
      <View style={styles.statCard}>
        <Icon2 name="motion-sensor" size={24} color="#E53935" />
        <Text style={styles.statValue}>{presenceDetected}</Text>
        <Text style={styles.statLabel}>Presence</Text>
      </View>
    )}

    <View style={styles.statCard}>
      <Icon2 name="account-check" size={24} color="#E53935" />
      <Text style={styles.statValue}>{entradas}</Text>
      <Text style={styles.statLabel}>Entradas</Text>
    </View>

    <View style={styles.statCard}>
      <Icon2 name="exit-run" size={24} color="#E53935" />
      <Text style={styles.statValue}>{salidas}</Text>
      <Text style={styles.statLabel}>Salidas</Text>
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
    textAlign: 'center',
  },
  statLabel: {
    color: '#F4F6FC',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SensorStats;
