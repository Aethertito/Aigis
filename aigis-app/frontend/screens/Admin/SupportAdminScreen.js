import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import IP from '../../IP';
import RNPickerSelect from 'react-native-picker-select';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const SupportAdminScreen = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://${IP}:3000/usuario/support/comments`);
      setComments(response.data.supportComments);
    } catch (error) {
      console.error('Error fetching support comments:', error);
      setError('Error fetching support comments');
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://${IP}:3000/support/comment/${commentId}`);

      if (response.data.status === 'success') {
        setComments(comments.filter(comment => comment._id !== commentId));
        Alert.alert('Success', 'Support comment deleted successfully');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting support comment:', error);
      Alert.alert('Error', 'Failed to delete support comment');
    }
  };

  const generateAppointment = (comment) => {
    setSelectedComment(comment);
    setModalVisible(true);
  };

  const handleSchedule = async () => {
    try {
      const usuario_id = selectedComment.usuario_id._id;
      if (!usuario_id) {
        Alert.alert('Error', 'User not identified');
        return;
      }

      if (!selectedDate || !selectedHour || !colonia || !calle || !numero || !referencia || !motivo) {
        Alert.alert('Error', 'Please fill in all fields');
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
        setModalVisible(false);
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
      setError(error.response?.data?.message || "Something went wrong with your registration");
    }
  };

const renderItem = ({ item }) => {
  if (!item.usuario_id) {
    return null;
  }
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.name}>Company: {item.usuario_id.nombre}</Text>
        <Text style={styles.date}>{new Date(item.fecha).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.email}>Email: {item.usuario_id.correo}</Text>
      <Text style={styles.title}>Problem: {item.titulo}</Text>
      <Text style={styles.problem}>Description: {item.problema}</Text>
      <TouchableOpacity
        style={styles.replyButton}
        onPress={() => deleteComment(item._id)}
      >
        <Text style={styles.replyButtonText}>Mark as Resolved</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.generateAppointmentButton}
        onPress={() => generateAppointment(item)}
      >
        <Text style={styles.generateAppointmentButtonText}>Generate Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};
  

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title2}>Support Comments</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#E53935" />
      ) : (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={<Text style={styles.noDataText}>No comments found</Text>}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity  onPress={() => setModalVisible(false)} style={styles.iconContainer}>
                <Icon name="arrow-back-ios" color="#E53935" size={24} />
              </TouchableOpacity>
            <Text style={styles.modalTitle}>Generate Appointment</Text>
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
              onValueChange={(value) => setSelectedHour(value || '')}
              items={availableHours}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select Time', value: '' }}
              value={selectedHour}
            />
            <Text style={styles.nameField}>Select Reason</Text>
            <RNPickerSelect
              onValueChange={(value) => setMotivo(value || '')}
              items={appointmentReasons}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select Reason', value: '' }}
              value={motivo}
            />
            <TouchableOpacity style={styles.button} onPress={handleSchedule}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#424242',
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#212121',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#E53935',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  date: {
    fontSize: 14,
    color: '#F4F6FC',
  },
  email: {
    fontSize: 16,
    color: '#F4F6FC',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 4,
  },
  problem: {
    fontSize: 16,
    color: '#F4F6FC',
    marginBottom: 8,
  },
  replyButton: {
    backgroundColor: '#E53935',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  replyButtonText: {
    color: '#F4F6FC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateAppointmentButton: {
    backgroundColor: '#E57373',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  generateAppointmentButtonText: {
    color: '#F4F6FC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#F4F6FC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#F4F6FC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#424242',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 15,
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 28,
    left: 10,
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
  button: {
    backgroundColor: '#E53935',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#757575',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#F4F6FC',
    fontSize: 18,
    fontWeight: 'bold',
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

export default SupportAdminScreen;
