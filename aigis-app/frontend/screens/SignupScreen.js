import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import IP from '../IP';

const SignupScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [giro, setGiro] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    const data = { nombre, correo, contrasena, direccion, telefono, giro, rol: 'usuario', membresia: false };

    try {
      const url = `http://${IP}:3000/usuario/signup`;
      const response = await axios.post(url, data);
      if (response.status === 200) {
        Alert.alert('Signup', 'Registro completado');
        navigation.navigate('Welcome');
      }
    } catch (error) {
      console.log('Error en try catch: ', error);
      setErrorMessage(error.response?.data?.message || "Algo salió mal con tu registro");
    }

    console.log(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.nameField}>Company</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#FFF"
        autoCapitalize='none'
        value={nombre}
        onChangeText={setNombre}
      />
      <Text style={styles.nameField}>Address</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#FFF"
        autoCapitalize='none'
        value={direccion}
        onChangeText={setDireccion}
      />
      <Text style={styles.nameField}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#FFF"
        autoCapitalize='none'
        keyboardType='numeric'
        value={telefono}
        onChangeText={setTelefono}
      />
      <Text style={styles.nameField}>Type of Company</Text>
      <RNPickerSelect
        onValueChange={(value) => setGiro(value)}
        items={[
          { label: 'Industry', value: 'Industry' },
          { label: 'Medicine', value: 'Medicine' },
          { label: 'House', value: 'House' },
          { label: 'Market', value: 'Market' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select a type of company', value: null }}
      />
      <Text style={styles.nameField}>Email</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#FFF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />
      <Text style={styles.nameField}>Create Password</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#FFF"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginRedirect}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backToWelcome}
        onPress={() => navigation.navigate('VSAT App')}>
        <Text style={styles.backToWelcomeText}>Back to Welcome</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </ScrollView>
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
    color: '#FFF',
    left: '3%',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    color: '#FFF',
    borderColor: '#E53935',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#212121',
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
    color: 'white',
    backgroundColor: 'red',
    marginTop: 10,
    padding: 4,
    borderRadius: 4,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#E53935',
    borderRadius: 5,
    color: '#FFF',
    backgroundColor: '#212121',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#E53935',
    borderRadius: 5,
    color: '#FFF',
    backgroundColor: '#212121',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
  },
});

export default SignupScreen;
