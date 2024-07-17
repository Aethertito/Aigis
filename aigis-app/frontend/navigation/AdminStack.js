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
    <Tab.Screen name="Home" component={AdminHomeScreen} />
    <Tab.Screen name="ManageSensors" component={ManageSensorsScreen} />
    <Tab.Screen name="ManageUsers" component={ManageUsersScreen} />
  </Tab.Navigator>
);

const AdminDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Tabs" component={AdminTabs} />
  </Drawer.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
    <Stack.Screen name="AddNewSensor" component={AddNewSensorScreen} />
  </Stack.Navigator>
);

export default AdminStack;
