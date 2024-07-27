import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import IP from '../../IP';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';

const AdminHomeScreen = ({ navigation }) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [supportIssues, setSupportIssues] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [activeMemberships, setActiveMemberships] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const usersResponse = await axios.get(`http://${IP}:3000/usuario`);
      const supportResponse = await axios.get(`http://${IP}:3000/usuario/support/comments`);
      const appointmentsResponse = await axios.get(`http://${IP}:3000/cita/`);
      const paymentsResponse = await axios.get(`http://${IP}:3000/pago/payments`);

      setActiveUsers(usersResponse.data.users.filter(user => user.memActiva === true).length);
      setSupportIssues(supportResponse.data.supportComments.length);
      setPendingAppointments(appointmentsResponse.data.filter(cita => cita.estado === 'Confirm' || cita.estado === 'pending').length);
      setActiveMemberships(usersResponse.data.users.filter(user => user.memActiva === true).length);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Administrator!</Text>
        <Image style={styles.imageLogo} source={require('../../assets/LOGO-Completo.png')} />
      </View>
      <View style={styles.dashboard}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Manage Users')}
        >
          <IconFA name="users" size={40} color="#FFF" />
          <Text style={styles.cardText}>Active Users</Text>
          <Text style={styles.cardCount}>{activeUsers}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Support Admin')}
        >
          <Icon name="support-agent" size={40} color="#FFF" />
          <Text style={styles.cardText}>Support Issues</Text>
          <Text style={styles.cardCount}>{supportIssues}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Manage Appointments')}
        >
          <Icon name="date-range" size={40} color="#FFF" />
          <Text style={styles.cardText}>Pending Appointments</Text>
          <Text style={styles.cardCount}>{pendingAppointments}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Manage Payments')}
        >
          <Icon name="payment" size={40} color="#FFF" />
          <Text style={styles.cardText}>Active Memberships</Text>
          <Text style={styles.cardCount}>{activeMemberships}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  imageLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  dashboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    backgroundColor: '#212121',
    borderRadius: 10,
    width: '45%', // Adjusted to take almost half of the screen width
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: '2.5%', // Adjusted to leave space between cards
    padding: 20,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginTop: 10,
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 5,
  },
});

export default AdminHomeScreen;
