import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import ManageSensorsScreen from '../screens/Admin/ManageSensorsScreen';
import ManageUsersScreen from '../screens/Admin/ManageUsersScreen';
import AddNewSensorScreen from '../screens/Admin/AddNewSensor';
import EditUserScreen from '../screens/Admin/EditUserScreen';
import DrawerContent from './DrawerStyle';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AdminDrawer = () => (
  <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Screen name="Admin Home" component={AdminHomeScreen} />
    <Drawer.Screen name="Manage Sensors" component={ManageSensorsScreen} />
    <Drawer.Screen name="Manage Users" component={ManageUsersScreen} />
  </Drawer.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
    <Stack.Screen name="AddNewSensor" component={AddNewSensorScreen} />
    <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
    <Stack.Screen name="EditUser" component={EditUserScreen} />
    <Stack.Screen name="ManageUser" component={ManageUsersScreen} />
  </Stack.Navigator>
);

export default AdminStack;
