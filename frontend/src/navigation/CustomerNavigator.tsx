import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';

import CustomerDashboard from '../screens/customer/CustomerDashboard';
import ServicesScreen from '../screens/customer/ServicesScreen';
import MyBookings from '../screens/customer/MyBookings';
import ProfileScreen from '../screens/common/ProfileScreen';
import BookService from '../screens/customer/BookService';
import BookingDetails from '../screens/customer/BookingDetails';
import PaymentScreen from '../screens/customer/PaymentScreen';

export type CustomerStackParamList = {
  CustomerDashboard: undefined;
  Services: undefined;
  MyBookings: undefined;
  Profile: undefined;
  BookService: { serviceId?: string };
  BookingDetails: { orderId: string };
  PaymentScreen: { orderId: string; amount: number };
};

const Stack = createNativeStackNavigator();
const CustomerNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
    <Stack.Screen name="Services" component={ServicesScreen} />
    <Stack.Screen name="MyBookings" component={MyBookings} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="BookService" component={BookService} />
    <Stack.Screen name="BookingDetails" component={BookingDetails} />
    <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
  </Stack.Navigator>
);

export default CustomerNavigator;
