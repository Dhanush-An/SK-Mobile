import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderApi } from '../../api/orderApi';
import { Order, OrderStatus } from '../../types/order.types';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';

type NavProp = NativeStackNavigationProp<CustomerStackParamList>;

const FILTER_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'assigned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const MyBookings = () => {
  const navigation = useNavigation<NavProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderApi.getMyOrders(activeTab !== 'all' ? activeTab : undefined);
      setOrders(res.data.data.orders);
    } catch {/* */} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => { setLoading(true); fetchOrders(); }, [fetchOrders]);

  if (loading) return <Loading />;

  const getService = (order: Order) => typeof order.serviceId === 'object' ? (order.serviceId as any).title : 'Service';

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerCount}>{orders.length} bookings</Text>
      </View>

      {/* Filter Tabs */}
      <View style={{ flexGrow: 0 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TABS}
          keyExtractor={t => t.value}
          contentContainerStyle={styles.tabs}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === item.value && styles.tabActive]}
              onPress={() => setActiveTab(item.value)}>
              <Text style={[styles.tabText, activeTab === item.value && styles.tabTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Orders */}
      <FlatList
        data={orders}
        keyExtractor={o => o._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); fetchOrders(); }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BookingDetails', { orderId: item._id })}>
            <AppCard style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.serviceName}>{getService(item)}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.date}>📅 {new Date(item.preferredDate).toLocaleDateString()} at {item.preferredTime}</Text>
              <Text style={styles.address} numberOfLines={1}>📍 {item.address}</Text>
              <View style={styles.cardBottom}>
                <StatusBadge status={item.paymentStatus} />
                <Text style={styles.amount}>₹{item.totalAmount.toLocaleString()}</Text>
              </View>
            </AppCard>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptyText}>Your bookings will appear here</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { padding: 20, paddingBottom: 8 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '900' },
  headerCount: { color: Colors.mutedText, fontSize: 13 },
  tabs: { paddingHorizontal: 16, paddingVertical: 12, height: 60, alignItems: 'center' },
  tab: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    backgroundColor: Colors.card,
    marginRight: 8,
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { color: Colors.mutedText, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  list: { flex: 1, padding: 16, gap: 12, paddingBottom: 40 },
  card: { gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceName: { color: Colors.text, fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8 },
  date: { color: Colors.mutedText, fontSize: 13 },
  address: { color: Colors.mutedText, fontSize: 13 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  amount: { color: Colors.accent, fontSize: 18, fontWeight: '900' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: Colors.mutedText, fontSize: 14 },
});

export default MyBookings;
