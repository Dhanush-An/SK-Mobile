import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderApi } from '../../api/orderApi';
import { Order } from '../../types/order.types';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import { TechnicianStackParamList } from '../../navigation/TechnicianNavigator';

type NavProp = NativeStackNavigationProp<TechnicianStackParamList>;
type RouteType = RouteProp<TechnicianStackParamList, 'JobDetails'>;

const JobDetails = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [techNote, setTechNote] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      const res = await orderApi.getById(route.params.orderId);
      setOrder(res.data.data.order);
    } catch {
      Alert.alert('Error', 'Failed to load job details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [route.params.orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const updateStatus = async (status: string) => {
    try {
      setActionLoading(true);
      await orderApi.updateStatus(route.params.orderId, { status, technicianNote: techNote });
      Alert.alert('✅ Updated', `Job status updated to ${status.replace('_', ' ')}`);
      fetchOrder();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Update failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return null;

  const customer = typeof order.customerId === 'object' ? order.customerId : null;
  const service = typeof order.serviceId === 'object' ? order.serviceId : null;
  const { status } = order;

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <StatusBadge status={status} />
      </View>

      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>🔒 Service</Text>
        <Text style={styles.mainText}>{(service as any)?.title}</Text>
        <Text style={styles.subText}>{(service as any)?.description}</Text>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>👤 Customer</Text>
        <Text style={styles.mainText}>{(customer as any)?.name}</Text>
        <Text style={styles.subText}>📞 {(customer as any)?.phone}</Text>
        <Text style={styles.subText}>📍 {order.address}</Text>
      </AppCard>

      {['accepted', 'in_progress'].includes(status) && (
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>📝 Work Notes</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add work notes..."
            placeholderTextColor={Colors.mutedText}
            value={techNote}
            onChangeText={setTechNote}
            multiline
            numberOfLines={3}
          />
        </AppCard>
      )}

      <View style={styles.actions}>
        {status === 'assigned' && (
          <AppButton title="✅ Accept Job" onPress={() => updateStatus('accepted')} loading={actionLoading} />
        )}
        {status === 'accepted' && (
          <AppButton title="🔧 Start Work" onPress={() => updateStatus('in_progress')} loading={actionLoading} />
        )}
        {status === 'in_progress' && (
          <AppButton title="✔️ Mark Completed" onPress={() => updateStatus('completed')} loading={actionLoading} />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backIcon: { color: Colors.text, fontSize: 22 },
  headerTitle: { color: Colors.text, fontSize: 20, fontWeight: '800', flex: 1 },
  card: { marginBottom: 14 },
  cardTitle: { color: Colors.mutedText, fontSize: 11, fontWeight: '700', marginBottom: 10 },
  mainText: { color: Colors.text, fontSize: 17, fontWeight: '700' },
  subText: { color: Colors.mutedText, fontSize: 13, lineHeight: 22 },
  noteInput: { backgroundColor: Colors.inputBg, borderRadius: 10, color: Colors.text, padding: 12, minHeight: 80 },
  actions: { gap: 12, marginTop: 8 },
});

export default JobDetails;
