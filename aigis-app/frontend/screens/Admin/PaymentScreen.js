import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import IP from '../../IP';

const PaymentScreen = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('memberships');

  useEffect(() => {
    fetchPayments();
  }, [view]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const endpoint = view === 'memberships' ? 'payments' : 'packpayments';
      const response = await axios.get(`http://${IP}:3000/pago/${endpoint}`);
      setPayments(response.data.pagos);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const groupPackages = (paqSelect) => {
    const groupedPackages = paqSelect.reduce((acc, paq) => {
      if (paq.paquete_id) {
        const existingPaq = acc.find(item => item.paquete === paq.paquete);
        if (existingPaq) {
          existingPaq.cantidad += paq.cantidad;
          existingPaq.totalPrice += (paq.paquete_id.precio || 0) * paq.cantidad;
        } else {
          acc.push({
            paquete: paq.paquete,
            cantidad: paq.cantidad,
            totalPrice: (paq.paquete_id.precio || 0) * paq.cantidad
          });
        }
      }
      return acc;
    }, []);
    return groupedPackages;
  };

  const renderMembershipItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>User: {item.nombre}</Text>
      <Text style={styles.details}>Membership: {item.memCantidad} {item.memPeriodo}</Text>
      <Text style={styles.details}>Start Date: {new Date(item.memFechaInicio).toLocaleDateString()}</Text>
      <Text style={styles.details2}>Price: ${item.membresia ? item.membresia.costo : 'N/A'}</Text>
    </View>
  );

  const renderPackageItem = ({ item }) => {
    const groupedPackages = groupPackages(item.paqSelect);
    return (
      <View style={styles.card}>
        <Text style={styles.name}>User: {item.nombre}</Text>
        {groupedPackages.map((paq, index) => (
          <View key={index} style={styles.packageItem}>
            <Text style={styles.packageName}>{paq.paquete}</Text>
            <Text style={styles.packageQuantity}>x{paq.cantidad}</Text>
            <Text style={styles.packageCost}>Price: ${paq.totalPrice.toFixed(2)}</Text>
          </View>
        ))}
        <Text style={styles.totalCost}>Total Cost: ${groupedPackages.reduce((sum, paq) => sum + paq.totalPrice, 0).toFixed(2)}</Text>
      </View>
    );
  };

  const renderItem = view === 'memberships' ? renderMembershipItem : renderPackageItem;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, view === 'memberships' && styles.activeButton]}
          onPress={() => setView('memberships')}
        >
          <Text style={styles.buttonText}>Memberships</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, view === 'packages' && styles.activeButton]}
          onPress={() => setView('packages')}
        >
          <Text style={styles.buttonText}>Packages</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No payments found</Text>}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#212121',
  },
  activeButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#F4F6FC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContentContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#212121',
    borderRadius: 10,
    padding: 18,
    marginBottom: 8,
    borderColor: '#E53935',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 4,
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  packageName: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  packageQuantity: {
    fontSize: 16,
    color: '#F4F6FC',
    fontWeight: 'bold',
  },
  packageCost: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  totalCost: {
    fontSize: 16,
    color: '#F4F6FC',
    fontWeight: 'bold',
    marginTop: 8,
  },
  details: {
    fontSize: 16,
    color: '#F4F6FC',
  },
  details2: {
    fontSize: 16,
    color: '#F4F6FC',
    fontWeight: 'bold'
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#F4F6FC',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#F4F6FC',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PaymentScreen;
