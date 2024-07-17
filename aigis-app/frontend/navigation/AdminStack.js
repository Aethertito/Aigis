import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import ManageSensorsScreen from '../screens/Admin/ManageSensorsScreen';
import ManageUsersScreen from '../screens/Admin/ManageUsersScreen';
import AddNewSensorScreen from '../screens/Admin/AddNewSensor';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={AdminHomeScreen} options={{ headerShown: false }}/>
    <Tab.Screen name="ManageSensors" component={ManageSensorsScreen} options={{ headerShown: false }}  />
    <Tab.Screen name="ManageUsers" component={ManageUsersScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const AdminDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={AdminHomeScreen} />
    <Drawer.Screen name="Manage Sensors" component={ManageSensorsScreen} />
    <Drawer.Screen name="Manage Users" component={ManageUsersScreen} />
  </Drawer.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
    <Stack.Screen name="AddNewSensor" component={AddNewSensorScreen} />
    <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
  </Stack.Navigator>
);

export default AdminStack;
