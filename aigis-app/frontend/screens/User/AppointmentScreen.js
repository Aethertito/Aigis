import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [appointments, setAppointments] = useState([]);

  const handleSchedule = () => {
    const newAppointment = {
      id: Math.random().toString(),
      location: location,
      status: status,
      date: selectedDate,
    };

    setAppointments([...appointments, newAppointment]);
    setSelectedDate('');
    setLocation('');
    setStatus('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>Location: {item.location}</Text>
      <Text style={styles.details}>Status: {item.status}</Text>
      <Text style={styles.details}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <Text style={styles.title}>Agendar Cita</Text>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />
      <Calendar
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
});

export default AppointmentScreen;
