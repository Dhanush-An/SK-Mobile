import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';

import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagement from '../screens/admin/UserManagement';
import ServiceManagement from '../screens/admin/ServiceManagement';
import OrderManagement from '../screens/admin/OrderManagement';
import ReportsScreen from '../screens/admin/ReportsScreen';
import ProfileScreen from '../screens/common/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ color: focused ? Colors.accent : Colors.mutedText, fontSize: 12, fontWeight: '700' }}>
    {label}
  </Text>
);

const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: Colors.card, borderTopColor: Colors.border, height: 60, paddingBottom: 10 },
      tabBarActiveTintColor: Colors.accent,
    }}
  >
    <Tab.Screen 
      name="Home" 
      component={AdminDashboard} 
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} /> }}
    />
    <Tab.Screen 
      name="Users" 
      component={UserManagement} 
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="👥" focused={focused} /> }}
    />
    <Tab.Screen 
      name="Services" 
      component={ServiceManagement} 
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="🔒" focused={focused} /> }}
    />
    <Tab.Screen 
      name="Orders" 
      component={OrderManagement} 
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="📋" focused={focused} /> }}
    />
    <Tab.Screen 
      name="Reports" 
      component={ReportsScreen} 
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="📈" focused={focused} /> }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} /> }}
    />
  </Tab.Navigator>
);

export default AdminNavigator;
