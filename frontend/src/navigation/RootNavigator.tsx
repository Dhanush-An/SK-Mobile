import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import TechnicianNavigator from './TechnicianNavigator';
import AdminNavigator from './AdminNavigator';
import Loading from '../components/Loading';

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === 'admin' ? (
        <AdminNavigator />
      ) : user.role === 'technician' ? (
        <TechnicianNavigator />
      ) : (
        <CustomerNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
