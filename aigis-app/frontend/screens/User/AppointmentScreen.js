import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import IP from '../../IP.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const availableHours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSchedule = async () => {
    try {
      const usuario_id = await AsyncStorage.getItem('userId');
      if (!usuario_id) {
        setErrorMessage('Usuario no identificado');
        return;
      }

      const newAppointment = {
        usuario_id,
        colonia,
        calle,
        numero,
        referencia,
        fecha: selectedDate,
        hora: selectedHour,
      };

      const url = `http://${IP}:3000/cita/createCita`;
      const response = await axios.post(url, newAppointment);
      if (response.status === 200) {
        Alert.alert('Citas', 'Se guardó la cita');
        setAppointments([...appointments, newAppointment]);
        setSelectedDate('');
        setSelectedHour('');
        setColonia('');
        setCalle('');
        setNumero('');
        setReferencia('');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Algo salió mal con tu registro");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>Location: {item.location}</Text>
      <Text style={styles.details}>Colonia: {item.colonia}</Text>
      <Text style={styles.details}>Calle: {item.calle}</Text>
      <Text style={styles.details}>Número: {item.numero}</Text>
      <Text style={styles.details}>Referencia: {item.referencia}</Text>
      <Text style={styles.details}>Date: {item.date}</Text>
      <Text style={styles.details}>Hour: {item.hour}</Text>
    </View>
  );

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <Text style={styles.title}>Agendar Cita</Text>
      <TextInput
        style={styles.input}
        placeholder="Colonia"
        value={colonia}
        onChangeText={setColonia}
      />
      <TextInput
        style={styles.input}
        placeholder="Calle"
        value={calle}
        onChangeText={setCalle}
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
      />
      <TextInput
        style={styles.input}
        placeholder="Referencia"
        value={referencia}
        onChangeText={setReferencia}
        maxLength={50}
      />
      <Calendar
        minDate={today}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#E53935' },
        }}
        theme={{
          todayTextColor: '#E53935',
          selectedDayBackgroundColor: '#E53935',
        }}
        style={styles.calendar}
      />
      <Picker
        selectedValue={selectedHour}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedHour(itemValue)}
      >
        <Picker.Item label="Seleccionar Hora" value="" />
        {availableHours.map((hour) => (
          <Picker.Item key={hour} label={hour} value={hour} />
        ))}
      </Picker>
      <Button title="Confirmar" onPress={handleSchedule} />
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
  item: {
    padding: 16,
    marginVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 8,
  },
  calendar: {
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  errorText: {
    color: '#F4F6FC',
    backgroundColor: '#B71C1C',
    marginTop: 10,
    padding: 4,
    borderRadius: 4,
  },
});

export default AppointmentScreen;
