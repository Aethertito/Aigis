import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import IP from '../IP';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // URL de tu API de login
      const url = `http://${IP}:3000/usuario/login`;

      // Datos de las credenciales de usuario
      const data = {
        correo: email,
        contrasena: password
      };
      // Hacer la solicitud POST
      const response = await axios.post(url, data);
      console.log('Respuesta del servidor:', response.data);

      // Manejar la respuesta
      if (response.status === 200) {
        console.log('Login exitoso');

        // Verifica el rol del usuario
        const user = response.data.user;
        const userRole = user.rol;
        Alert.alert('Welcome', `${user.nombre}`);

        // Redireccionar basado en el rol del usuario
        if (userRole === 'administrador') {
          navigation.navigate('AdminStack');
        } else if (userRole === 'usuario' && !user.membresia) {
          navigation.navigate('Paquetes');
        }else{
          navigation.navigate('UserStack');
        }
      }  else {
        console.log('Error en el login');
        setErrorMessage('Error en el login');
      }
    } catch (error) {
      // Manejar errores
      console.log('Error al realizar el login:', error);
      setErrorMessage(error.response?.data?.message || 'Error al realizar el login');
    }
  };


  return (
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.nameField}>Email</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.nameField}>Password</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.linkText}>Back to Welcome</Text>
          </TouchableOpacity>
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  nameField:{
    color: '#FFF',
    left: '3%',
    alignSelf: 'flex-start',
  },
  overlay: {
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
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
  loginButton: {
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
  linksContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    marginBottom: 10,
  },
  linkText: {
    color: '#E53935',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'white',
    backgroundColor: 'red',
    marginTop: 10,
    padding: 4,
    borderRadius: 4
  },
});

export default LoginScreen;