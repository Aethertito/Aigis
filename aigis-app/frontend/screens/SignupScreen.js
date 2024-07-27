import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP from '../IP';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SignupScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [giro, setGiro] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    const data = { nombre, correo, contrasena, direccion, telefono, giro, rol: 'user', memActiva: false };

    try {
      const url = `http://${IP}:3000/usuario/signup`;
      const response = await axios.post(url, data);
      if (response.status === 200) {
        await AsyncStorage.setItem('userId', response.data.usuario._id);
        Alert.alert('Signup', 'Registration completed');
        navigation.navigate('Options');
      }
    } catch (error) {
      console.log('Error in try catch: ', error);
      setErrorMessage(error.response?.data?.message || "Something went wrong with your registration");
    }

    console.log(data);
  };

  const handleNombreChange = (text) => {
    if (text.length <= 50) {
      setNombre(text.charAt(0).toUpperCase() + text.slice(1));
    }
  };

  const handleDireccionChange = (text) => {
    if (text.length <= 50) {
      setDireccion(text.charAt(0).toUpperCase() + text.slice(1));
    }
  };

  const handleTelefonoChange = (text) => {
    let formattedPhoneNumber = text.replace(/\D/g, ''); // Remove all non-numeric characters
    if (formattedPhoneNumber.length > 3 && formattedPhoneNumber.length <= 6) {
      formattedPhoneNumber = `${formattedPhoneNumber.slice(0, 3)}-${formattedPhoneNumber.slice(3)}`;
    } else if (formattedPhoneNumber.length > 6) {
      formattedPhoneNumber = `${formattedPhoneNumber.slice(0, 3)}-${formattedPhoneNumber.slice(3, 6)}-${formattedPhoneNumber.slice(6, 10)}`;
    }
    setTelefono(formattedPhoneNumber);
  };

  const handleCorreoChange = (text) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text.length <= 50) {
      setCorreo(text);
      if (!emailPattern.test(text)) {
        setErrorMessage('Invalid email format. Please use a valid email like example@example.com');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handleContrasenaChange = (text) => {
    if (text.length <= 40) {
      setContrasena(text);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.nameField}>Company Name</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        autoCapitalize='none'
        value={nombre}
        onChangeText={handleNombreChange}
        maxLength={50}
      />
      <Text style={styles.nameField}>Address</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        autoCapitalize='none'
        value={direccion}
        onChangeText={handleDireccionChange}
        maxLength={50}
      />
      <Text style={styles.nameField}>Contact Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        autoCapitalize='none'
        keyboardType='numeric'
        value={telefono}
        onChangeText={handleTelefonoChange}
        maxLength={12}
      />
      <Text style={styles.nameField}>Type of Business</Text>
      <RNPickerSelect
        onValueChange={(value) => setGiro(value)}
        items={[
          { label: 'Industrial', value: 'Industrial' },
          { label: 'Medical', value: 'Medical' },
          { label: 'Warehouses', value: 'Warehouses' },
          { label: 'Technology', value: 'Technology' },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select type of business', value: null }}
      />
      <Text style={styles.nameField}>Email</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#F4F6FC"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={handleCorreoChange}
        maxLength={50}
      />
      <Text style={styles.nameField}>Create Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholderTextColor="#F4F6FC"
          secureTextEntry={!showPassword}
          value={contrasena}
          onChangeText={handleContrasenaChange}
          maxLength={40}
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
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginRedirect}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.backToWelcome}
        onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.backToWelcomeText}>Back to menu</Text>
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
    fontWeight: 'bold',
    marginBottom: 2
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
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#212121',
  },
  signupButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '38%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginRedirect: {
    marginTop: 20,
  },
  loginText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold'
  },
  backToWelcome: {
    marginTop: 10,
  },
  backToWelcomeText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: '#F4F6FC',
    backgroundColor: '#B71C1C',
    marginTop: 10,
    padding: 4,
    borderRadius: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderColor: '#E53935',
    borderWidth: 1,
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
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
    borderWidth: 1,
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
