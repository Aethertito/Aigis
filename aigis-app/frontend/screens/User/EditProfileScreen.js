import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../IP';
import axios from 'axios';

const EditProfileScreen = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [refresh, setRefresh] = useState(false)

  const fetchData = async () => {
    const userId = await AsyncStorage.getItem('userId')
    console.log('METODO OBTENER DATOS: ', userId)
    const url = `http://${IP}:3000/usuario/${userId}`
    console.log(url)
    try {
      const response = await axios.get(url)
      const user = response.data
      setNombre(user.nombre)
      setCorreo(user.correo)
      setContrasena(user.contrasena)
      setDireccion(user.direccion)
      setTelefono(user.telefono)
      console.log(user)
    } catch (error) {
      console.log('error en el fetch',error)
    }
    
  }

  useEffect(() => {
    fetchData()
  }, [refresh])

  const handleSave = async () => {
    // Lógica para guardar cambios
    // Obtener el id y mandarlo por consola
    const userId = await AsyncStorage.getItem('userId')

    const data = {nombre, correo, contrasena, direccion, telefono}
    const url = `http://${IP}:3000/usuario/${userId}`

    try {
      const response = await axios.put(url, data)
      if (response.status === 200) {
        Alert.alert('Editar Perfil', 'Cambios guardados');
        setRefresh(!refresh)
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={correo}
        readOnly={true}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={telefono}
        keyboardType='numeric'
        onChangeText={setTelefono}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default EditProfileScreen;