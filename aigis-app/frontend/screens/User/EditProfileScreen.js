import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../../IP';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de tener este paquete instalado

const EditProfileScreen = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const url = `http://${IP}:3000/usuario/${userId}`;
    try {
      const response = await axios.get(url);
      const user = response.data;
      setNombre(user.nombre);
      setCorreo(user.correo);
      setContrasena(user.contrasena);
      setDireccion(user.direccion);
      setTelefono(user.telefono);
      console.log(user);
    } catch (error) {
      console.log('error en el fetch', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('userId');

    const data = { nombre, correo, contrasena, direccion, telefono };
    const url = `http://${IP}:3000/usuario/${userId}`;

    try {
      const response = await axios.put(url, data);
      if (response.status === 200) {
        Alert.alert('Editar Perfil', 'Cambios guardados');
        setRefresh(!refresh);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company data</Text>
      <Text style={styles.nameField}>Company:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#ccc"
        value={nombre}
        onChangeText={setNombre}
      />
      <Text style={styles.nameField}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={correo}
        editable={false}
        onChangeText={setCorreo}
      />
     <Text style={styles.nameField}>Password:</Text>
<View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Password"
    placeholderTextColor="#ccc"
    value={contrasena}
    onChangeText={setContrasena}
    secureTextEntry={!showPassword}
  />
  <Pressable 
    style={styles.eyeIconContainer} 
    onPress={() => setShowPassword(!showPassword)}
  >
    <Icon 
      name={showPassword ? "visibility" : "visibility-off"} 
      size={24} 
      color="#E53935"
    />
  </Pressable>
</View>
      <Text style={styles.nameField}>Address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#ccc"
        value={direccion}
        onChangeText={setDireccion}
      />
      <Text style={styles.nameField}>Phone:</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#ccc"
        value={telefono}
        keyboardType="numeric"
        onChangeText={setTelefono}
      />
      <Pressable style={styles.signupButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
    padding: 20,
  },
  nameField: {
    color: '#F4F6FC',
    left: '3%',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    color: '#F4F6FC',
    borderColor: '#E53935',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#212121',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#E53935',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#212121',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#F4F6FC',
    backgroundColor: 'transparent',
  },
  eyeIconContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginRedirect: {
    marginTop: 20,
  },
  loginText: {
    color: '#E53935',
    fontSize: 16,
  },
  backToWelcome: {
    marginTop: 10,
  },
  backToWelcomeText: {
    color: '#E53935',
    fontSize: 16,
  },
  errorText: {
    color: '#F4F6FC',
    backgroundColor: '#B71C1C',
    marginTop: 10,
    padding: 4,
    borderRadius: 4,
  },
});

export default EditProfileScreen;