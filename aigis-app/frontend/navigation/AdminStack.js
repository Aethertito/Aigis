import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddNewSensorScreen from '../screens/Admin/AddNewSensor';
import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import EditUserScreen from '../screens/Admin/EditUserScreen';
import ManageSensorsScreen from '../screens/Admin/ManageSensorsScreen';
import ManageUsersScreen from '../screens/Admin/ManageUsersScreen';
import MoreInformationScreen from '../screens/Admin/MoreInformationScreen';
import SupportAdminScreen from '../screens/Admin/SupportAdminScreen';
import CitasAdmin from '../screens/Admin/CitasAdmin';
import PaymentScreen from '../screens/Admin/PaymentScreen';
import DrawerAdminContent from './DrawerAdminStyle';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AdminDrawer = () => (
  <Drawer.Navigator
    drawerContent={props => <DrawerAdminContent {...props} />}
    screenOptions={{
      headerStyle: {
        backgroundColor: '#212121',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Drawer.Screen name="Admin Home" component={AdminHomeScreen} />
    <Drawer.Screen name="Manage Sensors" component={ManageSensorsScreen} />
    <Drawer.Screen name="Manage Users" component={ManageUsersScreen} />
    <Drawer.Screen name="Support Admin" component={SupportAdminScreen} />
    <Drawer.Screen name="Manage Appointments" component={CitasAdmin} />
    <Drawer.Screen name="Manage Payments" component={PaymentScreen} />
  </Drawer.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
    <Stack.Screen name="AddNewSensor" component={AddNewSensorScreen} />
    <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
    <Stack.Screen name="EditUser" component={EditUserScreen} />
    <Stack.Screen name="ManageUser" component={ManageUsersScreen} />
    <Stack.Screen name="MoreInfo" component={MoreInformationScreen} />
  </Stack.Navigator>
);

export default AdminStack;
