import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TotalScreen = ({ route, navigation }) => {
  const { selectedPackageData, membershipId, membershipData } = route.params;

  useEffect(() => {
    console.log('Datos recibidos en TotalScreen:', route.params); // Verificar si se recibieron los datos
  }, []);

  if (!selectedPackageData || !membershipData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Data not found</Text>
      </View>
    );
  }

  const totalCost = selectedPackageData.costo + membershipData.costo; // Sumar ambos precios

  const handleConfirm = () => {
    navigation.navigate('Pay', {
      totalCost: totalCost,
      selectedPackageData: selectedPackageData,
      membershipData: membershipData,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Package:</Text>
      <Text style={styles.packageName}>{selectedPackageData.paquete}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>Package Cost: ${selectedPackageData.costo}.00</Text>
        <Text style={styles.price}>Membership Cost: ${membershipData.costo}.00</Text>
        <Text style={styles.total}>Total Amount: ${totalCost}.00</Text>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleConfirm}>
        <Text style={styles.button}>Confirm and Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F6FC',
    marginBottom: 10,
  },
  packageName: {
    fontSize: 20,
    color: '#F4F6FC',
    marginBottom: 5,
  },
  priceContainer: {
    marginTop: 20,
    width: '100%',
  },
  price: {
    fontSize: 18,
    color: '#F4F6FC',
    marginBottom: 5,
  },
  total: {
    fontSize: 20,
    color: '#E53935',
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  button: {
    color: '#F4F6FC',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TotalScreen;
