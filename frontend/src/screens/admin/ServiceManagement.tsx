import React from 'react';
import { ServiceRequestsView } from './AdminSubViews';
import { useNavigation } from '@react-navigation/native';

const ServiceManagement = () => {
  const navigation = useNavigation();

  return (
    <ServiceRequestsView onBack={() => navigation.navigate('Home' as never)} />
  );
};

export default ServiceManagement;
