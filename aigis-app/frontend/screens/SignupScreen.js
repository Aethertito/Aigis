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
        navigation.navigate('Options');
      }
    } catch (error) {
      console.log('Error en try catch: ', error);
      setErrorMessage(error.response?.data?.message || "Algo salió mal con tu registro");
    }

    console.log(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrate</Text>
      <Text style={styles.nameField}>Nombre de la empresa</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        autoCapitalize='none'
        value={nombre}
        onChangeText={setNombre}
      />
      <Text style={styles.nameField}>Dirección</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        autoCapitalize='none'
        value={direccion}
        onChangeText={setDireccion}
      />
      <Text style={styles.nameField}>Número de teléfono de contacto</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        autoCapitalize='none'
        keyboardType='numeric'
        value={telefono}
        onChangeText={setTelefono}
      />
      <Text style={styles.nameField}>Tipo de empresa</Text>
      <RNPickerSelect
        onValueChange={(value) => setGiro(value)}
        items={[
          { label: 'Industrial', value: 'Industrial' },
          { label: 'Medicina', value: 'Medicina' },
          { label: 'Almacenes', value: 'Almacenes' },
          { label: 'Tecnología', value: 'Tecnología' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Seleccione el tipo de empresa', value: null }}
      />
      <Text style={styles.nameField}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />
      <Text style={styles.nameField}>Crear contraseña</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginRedirect}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>¿Ya tienes una cuenta? Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.backToWelcome}
        onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.backToWelcomeText}>Volver al menú</Text>
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
