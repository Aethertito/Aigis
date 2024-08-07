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
  const [entrada, setEntrada] = useState(null);
  const [salida, setSalida] = useState(null);
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
          // Obtener datos de entradas y salidas
          const entradasSalidasResponse = await axios.get(`http://${IP}:3000/api/entradas-salidas/${userId}`);
          console.log('Entradas y Salidas Response:', entradasSalidasResponse.data);
          setEntrada(entradasSalidasResponse.data.entrada || null);
          setSalida(entradasSalidasResponse.data.salida || null);

          // Notificación por RFID
          if (entradasSalidasResponse.data.entrada) {
            await enviarNotificacion(userId, 'RFID', 1, 'Entry registered');
          }
          if (entradasSalidasResponse.data.salida) {
            await enviarNotificacion(userId, 'RFID', 1, 'Exit registered');
          }

          // Obtener datos de humo
          const smokeResponse = await axios.get(`http://${IP}:3000/api/obtener-smoke/${userId}`);
          const maxValorHumo = smokeResponse.data.maxValor || null;
          setSmokeData(maxValorHumo);

          // Notificación por concentración de humo
          if (maxValorHumo > 2500) {
            await enviarNotificacion(userId, 'Smoke', maxValorHumo, `Alert: High concentration of smoke detected (${maxValorHumo} ppm)`);
          }

          // Obtener datos de presencia
          const presenceResponse = await axios.get(`http://${IP}:3000/api/ultmo-valor-presencia/${userId}`);
          const presencia = presenceResponse.data.ultimoValor || null;
          setPresenceData(presencia);

          // Notificación por presencia detectada
          if (presencia && presencia.valor) {
            await enviarNotificacion(userId, 'Presence', 1, 'Presence detected');
          }

        } catch (err) {
          // console.error('Error al obtener los datos de los sensores', err);
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [userId]);

  const enviarNotificacion = async (userId, tipoSensor, valor, mensaje) => {
    try {
      // Define un periodo de tiempo para considerar como reciente (por ejemplo, 1 hora)
      const now = new Date();
      const timeLimit = new Date(now);
      timeLimit.setHours(now.getHours() - 1); // Cambiar este valor según tus necesidades
  
      // Busca notificaciones similares dentro del periodo de tiempo definido
      const existingNotification = await axios.get(`http://${IP}:3000/api/notifications`, {
        params: {
          userId,
          tipoSensor,
          valor,
          mensaje,
          fecha: { $gte: timeLimit }
        }
      });
  
      // Si ya existe una notificación similar, no enviar otra
      if (existingNotification.data.notifications.length > 0) {
        console.log('Notificación ya enviada recientemente, no se enviará de nuevo.');
        return;
      }
  
      // Si no existe una notificación similar, enviar una nueva
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
              <Text style={styles.statValue}>Entry Registered</Text>
              <Text style={styles.statLabel}>{new Date(entrada.fecha).toLocaleString()}</Text>
            </View>
          )}

          {salida && (
            <View style={styles.statCard}>
              <Icon2 name="exit-run" size={24} color="#E53935" />
              <Text style={styles.statValue}>Exit Registered</Text>
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
});

export default SensorStats;
