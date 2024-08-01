import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import IP from '../../IP.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

const availableHours = [
  { label: '08:00', value: '08:00' },
  { label: '09:00', value: '09:00' },
  { label: '10:00', value: '10:00' },
  { label: '11:00', value: '11:00' },
  { label: '12:00', value: '12:00' },
  { label: '13:00', value: '13:00' },
  { label: '14:00', value: '14:00' },
  { label: '15:00', value: '15:00' },
  { label: '16:00', value: '16:00' },
  { label: '17:00', value: '17:00' },
];

const appointmentReasons = [
  { label: 'Installation', value: 'installation' },
  { label: 'Maintenance', value: 'maintenance' },
];

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [motivo, setMotivo] = useState('');
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
        motivo,
      };

      const url = `http://${IP}:3000/cita/createCita`;
      const response = await axios.post(url, newAppointment);
      if (response.status === 200) {
        Alert.alert('Appointments', 'Appointment saved successfully');
        setAppointments([...appointments, newAppointment]);
        setSelectedDate('');
        setSelectedHour('');
        setColonia('');
        setCalle('');
        setNumero('');
        setReferencia('');
        setMotivo('');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Something went wrong with your registration");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>Location: {item.colonia}, {item.calle} {item.numero}</Text>
      <Text style={styles.details}>Reference: {item.referencia}</Text>
      <Text style={styles.details}>Date: {item.fecha}</Text>
      <Text style={styles.details}>Hour: {item.hora}</Text>
      <Text style={styles.details}>Reason: {item.motivo}</Text>
    </View>
  );

  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} bounces={false}>
      <View style={styles.container}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Text style={styles.title}>Schedule Appointment</Text>
        <Text style={styles.infoText}>
          Schedule an appointment for the installation or maintenance of your sensors.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Neighborhood"
          placeholderTextColor="#9E9E9E"
          value={colonia}
          onChangeText={setColonia}
        />
        <TextInput
          style={styles.input}
          placeholder="Street"
          placeholderTextColor="#9E9E9E"
          value={calle}
          onChangeText={setCalle}
        />
        <TextInput
          style={styles.input}
          placeholder="Number"
          placeholderTextColor="#9E9E9E"
          value={numero}
          onChangeText={setNumero}
        />
        <TextInput
          style={styles.input}
          placeholder="Reference"
          placeholderTextColor="#9E9E9E"
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
            calendarBackground: '#424242',
            dayTextColor: '#F4F6FC',
            textDisabledColor: '#9E9E9E',
            monthTextColor: '#F4F6FC',
            arrowColor: '#E53935',
            textDayFontWeight: 'bold',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
          }}
          style={styles.calendar}
        />
        <Text style={styles.nameField}>Select Time</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedHour(value)}
          items={availableHours}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Time', value: null }}
        />
        <Text style={styles.nameField}>Select Reason</Text>
        <RNPickerSelect
          onValueChange={(value) => setMotivo(value)}
          items={appointmentReasons}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Reason', value: null }}
        />
        <TouchableOpacity style={styles.button} onPress={handleSchedule}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        {appointments.length > 0 && (
          <FlatList
            data={appointments}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No appointments found</Text>}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#424242',
    padding: 16,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#F4F6FC',
    marginBottom: 8,
    textAlign: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#424242',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 5,
    textAlign: 'center',
  },
  title3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 5,
    textAlign: 'center',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#212121',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4F6FC',
  },
  details: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  input: {
    height: 40,
    borderColor: '#E53935',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 8,
    color: '#F4F6FC',
    backgroundColor: '#212121',
  },
  nameField: {
    color: '#F4F6FC',
    marginBottom: 10,
  },
  calendar: {
    marginBottom: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#F4F6FC',
    backgroundColor: '#B71C1C',
    marginTop: 10,
    padding: 4,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#F4F6FC',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 8,
    color: '#F4F6FC',
    backgroundColor: '#212121',
    paddingRight: 30,
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 8,
    color: '#F4F6FC',
    backgroundColor: '#212121',
    paddingRight: 30,
    marginBottom: 20,
  },
});

export default AppointmentScreen;
