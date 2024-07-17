import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UserStack from './navigation/UserStack';
import AdminStack from './navigation/AdminStack';
import PaquetesScreen from './screens/User/PaquetesScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Paquetes" component={PaquetesScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserStack" component={UserStack} />
        <Stack.Screen name="AdminStack" component={AdminStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
