import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderApi } from '../../api/orderApi';
import { trackingApi } from '../../api/trackingApi';
import { Order } from '../../types/order.types';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import StatusBadge from '../../components/StatusBadge';
import AppButton from '../../components/AppButton';
import Loading from '../../components/Loading';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';

type NavProp = NativeStackNavigationProp<CustomerStackParamList>;
type RouteType = RouteProp<CustomerStackParamList, 'BookingDetails'>;

const STATUS_STEPS = ['pending', 'assigned', 'accepted', 'in_progress', 'completed'];

const BookingDetails = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [techLocation, setTechLocation] = useState<any>(null);
  const [eta, setEta] = useState<string | null>(null);

  const fetchTracking = useCallback(async (techId: string) => {
    try {
      const res = await trackingApi.getTechnicianLocation(techId);
      if (res.data.success) {
        setTechLocation(res.data.data);
        // Mock ETA calculation based on a random point
        setEta(`${Math.floor(Math.random() * 15 + 5)} mins`);
      }
    } catch (err) {
      console.log('Tracking not available yet');
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (order?.technicianId && (order.status === 'accepted' || order.status === 'in_progress')) {
      const techId = typeof order.technicianId === 'object' ? (order.technicianId as any)._id : order.technicianId;
      fetchTracking(techId);
      interval = setInterval(() => fetchTracking(techId), 5000);
    }
    return () => clearInterval(interval);
  }, [order, fetchTracking]);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await orderApi.getById(route.params.orderId);
      setOrder(res.data.data.order);
    } catch {
      Alert.alert('Error', 'Failed to load booking details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [route.params.orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            setCancelling(true);
            await orderApi.cancel(route.params.orderId);
            fetchOrder();
          } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to cancel');
          } finally {
            setCancelling(false);
          }
        },
      },
    ]);
  };

  if (loading) return <Loading />;
  if (!order) return null;

  const service = typeof order.serviceId === 'object' ? order.serviceId : null;
  const technician = typeof order.technicianId === 'object' ? order.technicianId : null;
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const canCancel = !['completed', 'in_progress', 'cancelled', 'rejected'].includes(order.status);
  const canPay = order.status === 'completed' && order.paymentStatus === 'pending';

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <StatusBadge status={order.status} />
      </View>

      {/* Service Info */}
      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>🔒 Service Details</Text>
        <Text style={styles.serviceName}>{(service as any)?.title || 'N/A'}</Text>
        <Text style={styles.serviceDesc}>{(service as any)?.description}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{(service as any)?.category || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text style={[styles.value, { color: Colors.accent, fontWeight: '800', fontSize: 18 }]}>
            ₹{order.totalAmount.toLocaleString()}
          </Text>
        </View>
      </AppCard>

      {/* Status Timeline */}
      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>📊 Status Timeline</Text>
        {STATUS_STEPS.map((step, i) => (
          <View key={step} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View style={[
                styles.timelineDot,
                i <= currentStep && styles.timelineDotDone,
                i === currentStep && styles.timelineDotActive,
              ]} />
              {i < STATUS_STEPS.length - 1 && (
                <View style={[styles.timelineLine, i < currentStep && styles.timelineLineDone]} />
              )}
            </View>
            <Text style={[styles.timelineLabel, i <= currentStep && styles.timelineLabelDone]}>
              {step.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
          </View>
        ))}
      </AppCard>

      {/* Live Tracking */}
      {techLocation && (order.status === 'accepted' || order.status === 'in_progress') && (
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>📡 LIVE TRACKING</Text>
          <View style={styles.mapMock}>
            {/* Grid lines to simulate map */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#1A233A', borderRadius: 12 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={`v-${i}`} style={{ position: 'absolute', left: `${i * 10}%`, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={`h-${i}`} style={{ position: 'absolute', top: `${i * 10}%`, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
              ))}
              {/* Technician Marker */}
              <View style={{ 
                position: 'absolute', 
                left: '50%', 
                top: '50%', 
                width: 24, 
                height: 24, 
                backgroundColor: Colors.accent, 
                borderRadius: 12, 
                borderWidth: 3, 
                borderColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 10 }}>🔧</Text>
              </View>
            </View>
            
            <View style={styles.trackingOverlay}>
              <View style={styles.etaBox}>
                <Text style={styles.etaLabel}>ETA</Text>
                <Text style={styles.etaValue}>{eta}</Text>
              </View>
              <View style={styles.vDivider} />
              <View style={styles.etaBox}>
                <Text style={styles.etaLabel}>STATUS</Text>
                <Text style={[styles.etaValue, { color: '#00E676' }]}>ON THE WAY</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.detailText, { marginTop: 10, textAlign: 'center' }]}>Technician is moving towards your location.</Text>
        </AppCard>
      )}

      {/* Booking Info */}
      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>📋 Booking Info</Text>
        {[
          ['Preferred Date', new Date(order.preferredDate).toLocaleDateString()],
          ['Preferred Time', order.preferredTime],
          ['Address', order.address],
          ['Contact', order.contactPhone],
          ['Notes', order.notes || '—'],
        ].map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, { flex: 1, textAlign: 'right' }]}>{value}</Text>
          </View>
        ))}
      </AppCard>

      {/* Technician Info */}
      {technician && (
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>🔧 Assigned Technician</Text>
          <View style={styles.techRow}>
            <View style={styles.techAvatar}>
              <Text style={styles.techAvatarText}>{(technician as any).name?.[0]}</Text>
            </View>
            <View>
              <Text style={styles.techName}>{(technician as any).name}</Text>
              <Text style={styles.techPhone}>📞 {(technician as any).phone}</Text>
            </View>
          </View>
        </AppCard>
      )}

      {/* Actions */}
      {canPay && (
        <AppButton
          title="💳 Pay Now"
          onPress={() => navigation.navigate('PaymentScreen', { orderId: order._id, amount: order.totalAmount })}
          style={styles.actionBtn}
        />
      )}
      {canCancel && (
        <AppButton
          title="Cancel Booking"
          variant="danger"
          onPress={handleCancel}
          loading={cancelling}
          style={styles.actionBtn}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  backBtn: { padding: 4 },
  backIcon: { color: Colors.text, fontSize: 22, fontWeight: '600' },
  headerTitle: { color: Colors.text, fontSize: 20, fontWeight: '800', flex: 1 },
  card: { marginBottom: 16 },
  cardTitle: { color: Colors.mutedText, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 14 },
  serviceName: { color: Colors.text, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  serviceDesc: { color: Colors.mutedText, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.mutedText, fontSize: 13 },
  value: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  detailText: { color: Colors.mutedText, fontSize: 13, lineHeight: 18 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 },
  timelineLeft: { alignItems: 'center', width: 24, marginRight: 14 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border, marginTop: 3 },
  timelineDotDone: { backgroundColor: Colors.accent },
  timelineDotActive: { backgroundColor: Colors.accent, width: 16, height: 16, borderRadius: 8, marginTop: 1 },
  timelineLine: { width: 2, height: 28, backgroundColor: Colors.border, marginTop: 2 },
  timelineLineDone: { backgroundColor: Colors.accent },
  timelineLabel: { color: Colors.mutedText, fontSize: 14, paddingVertical: 4 },
  timelineLabelDone: { color: Colors.text, fontWeight: '600' },
  techRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  techAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  techAvatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  techName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  techPhone: { color: Colors.mutedText, fontSize: 13 },
  actionBtn: { marginBottom: 12 },
  mapMock: { height: 180, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1A233A' },
  trackingOverlay: { 
    position: 'absolute', 
    bottom: 10, 
    left: 10, 
    right: 10, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    borderRadius: 8, 
    flexDirection: 'row', 
    padding: 10 
  },
  etaBox: { flex: 1, alignItems: 'center' },
  etaLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: '800' },
  etaValue: { color: '#fff', fontSize: 12, fontWeight: '900' },
  vDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 5 },
});

export default BookingDetails;
