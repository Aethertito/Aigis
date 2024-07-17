import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PricingCard, Dialog, CheckBox } from '@rneui/themed';

const PaquetesScreen = () => {
  const [visible5, setVisible5] = useState(false);
  const [checked, setChecked] = useState(0);

  const toggleDialog5 = () => {
    setVisible5(!visible5);
  };

  const paquetes = [
    {
      title: 'Paquete Básico',
      price: '$50.00',
      info: ['RFID', 'Temperatura'],
      buttonTitle: 'Seleccionar Paquete',
    },
    {
      title: 'Paquete Intermedio',
      price: '$75.00',
      info: ['RFID', 'Temperatura', 'Presensia'],
      buttonTitle: 'Seleccionar Paquete',
    },
    {
      title: 'Paquete Avanzado',
      price: '$100.00',
      info: ['RFID', 'Temperatura', 'Presensia', 'Camara'],
      buttonTitle: 'Seleccionar Paquete',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {paquetes.map((paquete, index) => (
        <View key={index} style={styles.cardContainer}>
          <Dialog
            isVisible={visible5}
            onBackdropPress={toggleDialog5}
          >
            <Dialog.Title title="Select Membership Duration" />
            {['3 Months', '6 Months', '1 Year'].map((option, i) => (
              <CheckBox
                key={i}
                title={option}
                containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checked === i + 1}
                onPress={() => setChecked(i + 1)}
              />
            ))}

            <Dialog.Actions>
              <Dialog.Button
                title="CONFIRM"
                onPress={() => {
                  console.log(`Option ${checked} was selected!`);
                  toggleDialog5();
                }}
              />
              <Dialog.Button title="CANCEL" onPress={toggleDialog5} />
            </Dialog.Actions>
          </Dialog>
          <PricingCard
            color="#ff0000" // Red color for the card border
            title={paquete.title}
            titleStyle={styles.title}
            price={paquete.price}
            priceStyle={styles.price}
            info={paquete.info}
            infoStyle={styles.info}
            button={{ title: paquete.buttonTitle, icon: 'flight-takeoff', buttonStyle: styles.button, onPress: toggleDialog5 }}
            containerStyle={styles.pricingCard}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#333', // Dark grey background
  },
  cardContainer: {
    marginVertical: 10,
  },
  pricingCard: {
    backgroundColor: '#444', // Slightly lighter grey for the card background
  },
  title: {
    color: '#fff', // White text for title
  },
  price: {
    color: '#ff0000', // Red text for price
  },
  info: {
    color: '#ddd', // Light grey text for info
  },
  button: {
    backgroundColor: '#ff0000', // Red background for the button
  },
});

export default PaquetesScreen;
