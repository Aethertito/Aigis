import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../IP.js';

const AddEmployeeScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleAddEmployee = async () => {
    if (!nombre || !email || !telefono) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.post(`http://${IP}:3000/paqueteComprado/agregarEmpleado`, {
        nombre,
        email,
        telefono,
        userId
      });

      Alert.alert('Éxito', 'Empleado agregado correctamente');
      setNombre('')
      setEmail('')
      setTelefono('')
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      Alert.alert('Error', 'No se pudo agregar el empleado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Agregar Empleado</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#999"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#999"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
        <Text style={styles.buttonText}>Agregar Empleado</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    alignSelf: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#212121',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    color: '#F4F6FC',
  },
  button: {
    backgroundColor: '#E53935',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEmployeeScreen;