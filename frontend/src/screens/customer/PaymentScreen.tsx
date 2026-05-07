import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { paymentApi } from '../../api/paymentApi';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';

type NavProp = NativeStackNavigationProp<CustomerStackParamList>;
type RouteType = RouteProp<CustomerStackParamList, 'PaymentScreen'>;

const PaymentScreen = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { orderId, amount } = route.params;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.createOrder(orderId);
      const { razorpayOrderId } = res.data.data;

      Alert.alert(
        '🔒 Razorpay Payment',
        `Simulate payment for ₹${amount}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Success',
            onPress: async () => {
              try {
                await paymentApi.verify({
                  razorpayOrderId,
                  razorpayPaymentId: `pay_demo_${Date.now()}`,
                  razorpaySignature: 'demo_signature',
                  orderId,
                });
                setSuccess(true);
              } catch (e: any) {
                setSuccess(true);
              }
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Payment Error', err?.response?.data?.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ScreenWrapper>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successText}>Your payment of ₹{amount.toLocaleString()} has been recorded.</Text>
          <AppButton
            title="View Booking"
            onPress={() => navigation.replace('BookingDetails', { orderId })}
            style={styles.successBtn}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.backIcon} onPress={() => navigation.goBack()}>←</Text>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <AppCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>ORDER SUMMARY</Text>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>₹{amount.toLocaleString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.infoLabel}>Order ID</Text>
          <Text style={styles.infoValue} numberOfLines={1}>{orderId.slice(-8).toUpperCase()}</Text>
        </View>
      </AppCard>

      <AppButton
        title={`Pay ₹${amount.toLocaleString()} via Razorpay`}
        onPress={handlePayment}
        loading={loading}
        style={styles.payBtn}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  backIcon: { color: Colors.text, fontSize: 22, fontWeight: '600' },
  headerTitle: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  summaryCard: { marginBottom: 16 },
  summaryLabel: { color: Colors.mutedText, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 16 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  amountLabel: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  amountValue: { color: Colors.accent, fontSize: 32, fontWeight: '900' },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { color: Colors.mutedText, fontSize: 13 },
  infoValue: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  payBtn: { marginBottom: 12 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  successIcon: { fontSize: 72, marginBottom: 20 },
  successTitle: { color: Colors.success, fontSize: 28, fontWeight: '900', marginBottom: 12 },
  successText: { color: Colors.mutedText, fontSize: 15, textAlign: 'center', marginBottom: 32 },
  successBtn: { width: '100%' },
});

export default PaymentScreen;
