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
    <View style={styles.container}>
      <Text style={styles.title}>Add New Sensor</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
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
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
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
