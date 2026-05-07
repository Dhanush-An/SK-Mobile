import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';

import TechnicianDashboard from '../screens/technician/TechnicianDashboard';
import AssignedTasks from '../screens/technician/AssignedTasks';
import WorkHistory from '../screens/technician/WorkHistory';
import ProfileScreen from '../screens/common/ProfileScreen';
import JobDetails from '../screens/technician/JobDetails';

export type TechnicianStackParamList = {
  TechnicianTabs: undefined;
  JobDetails: { orderId: string };
};

const Stack = createNativeStackNavigator();

const TechnicianNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TechnicianDashboard" component={TechnicianDashboard} />
    <Stack.Screen name="JobDetails" component={JobDetails} />
  </Stack.Navigator>
);

export default TechnicianNavigator;
