import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import UserHomeScreen from '../screens/User/UserHomeScreen';
import ViewSensorsScreen from '../screens/User/ViewSensorsScreen';
import OrdersScreen from '../screens/User/OrdersScreen';
import EditProfileScreen from '../screens/User/EditProfileScreen';
import CamerasScreen from '../screens/User/CamerasScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const UserDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={UserHomeScreen} />
    <Drawer.Screen name="Sensors" component={ViewSensorsScreen} />
    <Drawer.Screen name="Orders" component={OrdersScreen} />
    <Drawer.Screen name="EditProfile" component={EditProfileScreen} />
    <Drawer.Screen name="Cameras" component={CamerasScreen} />
  </Drawer.Navigator>
);

const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserDrawer" component={UserDrawer} />
  </Stack.Navigator>
);

export default UserStack;
