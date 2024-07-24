import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AppointmentScreen from '../screens/User/AppointmentScreen';
import CamerasScreen from '../screens/User/CamerasScreen';
import EditProfileScreen from '../screens/User/EditProfileScreen';
import OrdersScreen from '../screens/User/OrdersScreen';
import UserHomeScreen from '../screens/User/UserHomeScreen';
import ViewSensorsScreen from '../screens/User/ViewSensorsScreen';
import PayPackScreen from '../screens/User/PayPackScreen';

import DrawerUserContent from './DrawerUserStyle';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const UserDrawer = () => (
  <Drawer.Navigator drawerContent={props => <DrawerUserContent {...props} />}>
    <Drawer.Screen name="Home" component={UserHomeScreen} />
    <Drawer.Screen name="Sensors" component={ViewSensorsScreen} />
    <Drawer.Screen name="Orders" component={OrdersScreen} />
    <Drawer.Screen name="EditProfile" component={EditProfileScreen} />
    <Drawer.Screen name="Cameras" component={CamerasScreen} />
    <Drawer.Screen name="Appointment" component={AppointmentScreen} />
    <Drawer.Screen name="PayPack" component={PayPackScreen} />
  </Drawer.Navigator>
);

const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserDrawer" component={UserDrawer} />
  </Stack.Navigator>
);

export default UserStack;
