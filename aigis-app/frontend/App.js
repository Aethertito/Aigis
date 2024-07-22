import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AdminStack from './navigation/AdminStack';
import UserStack from './navigation/UserStack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';

import PaquetesScreen from './screens/User/PaquetesScreen';
import PayScreen from './screens/User/PayScreen';
import MembershipScreen from './screens/User/MembershipScreen';
import OptionScreen from './screens/User/OptionsScreen';
import TotalScreen from './screens/User/TotalScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        <Stack.Screen name="UserStack" component={UserStack}  />
        <Stack.Screen name="AdminStack" component={AdminStack} />

        <Stack.Screen name="Paquetes" component={PaquetesScreen} />
        <Stack.Screen name="Pay" component={PayScreen} />
        <Stack.Screen name="Membership" component={MembershipScreen} />
        <Stack.Screen name="Options" component={OptionScreen} />
        <Stack.Screen name="Total" component={TotalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
