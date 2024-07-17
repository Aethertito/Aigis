import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'
import IP from '../../IP.js';

const AddNewSensorScreen = ({ navigation }) => {
  const [tipo, setTipo] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('')
  const [image, setImagen] = useState(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImagen(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    const url = `http://${IP}:3000/sensor/`;
    const formData = new FormData();

    formData.append('tipo', tipo);
    formData.append('precio', precio);
    formData.append('descripcion', descripcion);
    formData.append('estado', 'inactivo');

    if (image) {
      const fileType = image.substring(image.lastIndexOf('.') + 1);
      formData.append('image', {
        uri: image,
        name: `sensor_image_${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    if (!tipo || !precio || !descripcion) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        Alert.alert("Éxito", "Sensor agregado correctamente");
        navigation.goBack(); // Navegar a la pantalla anterior
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al agregar el sensor");
    }
  };

  return (
    <View style={styles.overlay}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AdminHomeScreen')}>
          <Text style={styles.addButtonText}>Regresar</Text>
        </TouchableOpacity>
      <Text style={styles.title}>Add New Sensor</Text>
      <Text style={styles.nameField}>Tipo</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        value={tipo}
        onChangeText={setTipo}
      />
      <Text style={styles.nameField}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Agregar Sensor</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder='Descripcion'
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.submitButtonContainer}>
        <Button title="Agregar Sensor" onPress={handleSubmit} />
      </View>

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
    borderWidth: 1,
    borderRadius: 10,
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
  addButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 12,
  },
  submitButtonContainer: {
    marginTop: 20,
  },
});

export default AddNewSensorScreen;
