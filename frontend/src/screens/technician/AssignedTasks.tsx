import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types/order.types';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import { TechnicianStackParamList } from '../../navigation/TechnicianNavigator';

type NavProp = NativeStackNavigationProp<TechnicianStackParamList>;

const AssignedTasks = () => {
  const navigation = useNavigation<NavProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderApi.getAssigned();
      const all: Order[] = res.data.data.orders;
      setOrders(all.filter(o => !['completed', 'cancelled', 'rejected'].includes(o.status)));
    } catch {/* */} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (loading) return <Loading />;

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assigned Tasks</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={o => o._id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); fetchOrders(); }}
        renderItem={({ item }) => {
          const service = typeof item.serviceId === 'object' ? item.serviceId : null;
          return (
            <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { orderId: item._id })}>
              <AppCard style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.serviceTitle}>{(service as any)?.title || 'Service'}</Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text style={styles.infoText}>📍 {item.address}</Text>
                <Text style={styles.infoText}>📅 {new Date(item.preferredDate).toLocaleDateString()}</Text>
              </AppCard>
            </TouchableOpacity>
          );
        }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { padding: 20 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '900' },
  list: { padding: 16, gap: 14 },
  card: { gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  serviceTitle: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  infoText: { color: Colors.mutedText, fontSize: 13 },
});

export default AssignedTasks;
