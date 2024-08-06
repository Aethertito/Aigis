import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import IP from '../../IP';

const CitasAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${IP}:3000/cita/`);
      setCitas(response.data);
    } catch (error) {
      console.error('Error fetching citas:', error);
      Alert.alert('Error', 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const confirmCita = async (citaId) => {
    try {
      const url = `http://${IP}:3000/cita/${citaId}`;
      const response = await axios.put(url, { estado: 'Confirm' });

      if (response.data.status === 'success') {
        fetchCitas(); // Actualiza la lista después de la confirmación
        Alert.alert('Success', 'Appointment confirmed successfully');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      Alert.alert('Error', 'Failed to confirm appointment');
    }
  };

  const attendCita = async (citaId) => {
    try {
      const url = `http://${IP}:3000/cita/attend/${citaId}`;
      const response = await axios.put(url, { estado: 'attended' });

      if (response.data.status === 'success') {
        fetchCitas(); // Actualiza la lista después de marcar como atendida
        Alert.alert('Success', 'Appointment marked as attended');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error marking appointment as attended:', error);
      Alert.alert('Error', 'Failed to mark appointment as attended');
    }
  };

  const renderCita = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.usuario_id.nombre}</Text>
      <Text style={styles.description}>Correo: {item.usuario_id.correo}</Text>
      <Text style={styles.description}>Teléfono: {item.usuario_id.telefono}</Text>
      <Text style={styles.description}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
      <Text style={styles.description}>Hora: {item.hora}</Text>
      <Text style={styles.description}>Colonia: {item.colonia}</Text>
      <Text style={styles.description}>Calle: {item.calle}</Text>
      <Text style={styles.description}>Número: {item.numero}</Text>
      <Text style={styles.description}>Referencia: {item.referencia}</Text>
      <Text style={styles.description}>Estado: {item.estado}</Text>
      <Text style={styles.description}>Motivo: {item.motivo}</Text>
      {item.estado !== 'attended' && (
        <>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => confirmCita(item._id)}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attendButton}
            onPress={() => attendCita(item._id)}
          >
            <Text style={styles.attendButtonText}>Mark as Attended</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#E53935" />
      ) : (
        <>
          <Text style={styles.title2}>Citas</Text>
          <FlatList
            data={citas.filter(cita => cita.estado !== 'attended')} // Filtra las citas para mostrar solo las que no están atendidas
            renderItem={renderCita}
            keyExtractor={item => item._id}
            ListEmptyComponent={<Text style={styles.emptyText}>No appointments found</Text>}
            contentContainerStyle={styles.listContentContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    padding: 10,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#212121',
    borderRadius: 10,
    padding: 18,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4F6FC',
  },
  title2: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F4F6FC',
    alignSelf: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#F4F6FC',
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#F4F6FC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  attendButton: {
    backgroundColor: '#E57373',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  attendButtonText: {
    color: '#F4F6FC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#F4F6FC',
  },
});

export default CitasAdmin;
