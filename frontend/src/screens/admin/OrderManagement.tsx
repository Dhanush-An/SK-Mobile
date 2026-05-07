import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

const OrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [offlineModalVisible, setOfflineModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Offline Order Form State
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState('');
  const [amount, setAmount] = useState('');

  const orders = [
    { id: '#17C826', client: 'JOHN DOE', items: '4x Hikvision 4MP', total: '₹12,400', status: 'CONFIRMED', date: '20 May', phone: '9940252983', address: '123, Anna Salai, Chennai' },
    { id: '#17C827', client: 'AJITH S', items: '1x Solar Cam', total: '₹4,500', status: 'PENDING', date: '19 May', phone: '8870624512', address: '45, MG Road, Bangalore' },
    { id: '#17C828', client: 'POOVASARAN', items: '2x WiFi PTZ', total: '₹8,200', status: 'DELIVERED', date: '18 May', phone: '7760541236', address: '8, Race Course, Coimbatore' },
  ];

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'ALL') return orders;
    return orders.filter(order => order.status === activeFilter);
  }, [activeFilter]);

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ORDER PIPELINE</Text>
          <Text style={styles.subtitle}>MONAGE PRODUCT SALES & LOGISTICS</Text>
        </View>

        <TouchableOpacity 
          style={styles.offlineBtn}
          onPress={() => setOfflineModalVisible(true)}
        >
          <Text style={styles.offlineBtnText}>+ ADD OFFLINE ORDER</Text>
        </TouchableOpacity>

        <View style={styles.filterRow}>
          {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED'].map((tag) => (
            <TouchableOpacity 
              key={tag} 
              style={[styles.filterBtn, activeFilter === tag && styles.activeFilter]}
              onPress={() => setActiveFilter(tag)}
            >
              <Text style={[styles.filterText, activeFilter === tag && styles.activeFilterText]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <AppCard key={order.id} style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={[styles.statusTag, 
                    order.status === 'CONFIRMED' ? styles.statusConfirmed : 
                    order.status === 'PENDING' ? styles.statusPending : styles.statusDelivered
                  ]}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                  <Text style={styles.clientName}>{order.client}</Text>
                  <Text style={styles.itemsText}>{order.items}</Text>
                  <View style={styles.footerRow}>
                    <Text style={styles.totalText}>TOTAL: {order.total}</Text>
                    <TouchableOpacity style={styles.detailBtn} onPress={() => handleOpenDetails(order)}>
                      <Text style={styles.detailBtnText}>DETAILS</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AppCard>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No {activeFilter.toLowerCase()} orders found.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Order Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>ORDER DETAILS</Text>
                <Text style={styles.modalSubtitle}>{selectedOrder?.id}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIcon}>
                <Text style={{color: '#fff', fontSize: 20}}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionLabel}>CUSTOMER INFORMATION</Text>
                <AppCard style={styles.innerCard}>
                  <Text style={styles.detailName}>{selectedOrder?.client}</Text>
                  <Text style={styles.detailSub}>📞 {selectedOrder?.phone}</Text>
                  <Text style={styles.detailSub}>📍 {selectedOrder?.address}</Text>
                </AppCard>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionLabel}>ORDER ITEMS</Text>
                <AppCard style={styles.innerCard}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemName}>{selectedOrder?.items}</Text>
                    <Text style={styles.itemPrice}>{selectedOrder?.total}</Text>
                  </View>
                </AppCard>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionLabel}>LOGISTICS STATUS</Text>
                <View style={styles.statusTimeline}>
                  <View style={[styles.statusStep, {borderColor: Colors.accent}]}>
                    <View style={[styles.statusDot, {backgroundColor: Colors.accent}]} />
                    <Text style={styles.statusStepText}>Order Placed</Text>
                  </View>
                  <View style={[styles.statusStep, {borderColor: selectedOrder?.status === 'PENDING' ? Colors.border : Colors.accent}]}>
                    <View style={[styles.statusDot, {backgroundColor: selectedOrder?.status === 'PENDING' ? Colors.border : Colors.accent}]} />
                    <Text style={styles.statusStepText}>Confirmed</Text>
                  </View>
                  <View style={[styles.statusStep, {borderWidth: 0}]}>
                    <View style={[styles.statusDot, {backgroundColor: selectedOrder?.status === 'DELIVERED' ? Colors.accent : Colors.border}]} />
                    <Text style={styles.statusStepText}>Out for Delivery</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.updateBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.updateBtnText}>UPDATE STATUS</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Offline Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={offlineModalVisible}
        onRequestClose={() => setOfflineModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setOfflineModalVisible(false)}
        >
          <View style={[styles.modalContent, { height: 'auto', paddingBottom: 40 }]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>OFFLINE ORDER</Text>
                <Text style={styles.modalSubtitle}>MANUALLY LOG A NEW SALE</Text>
              </View>
              <TouchableOpacity onPress={() => setOfflineModalVisible(false)} style={styles.closeIcon}>
                <Text style={{color: '#fff', fontSize: 20}}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <AppInput 
                label="CLIENT NAME" 
                value={clientName} 
                onChangeText={setClientName} 
                placeholder="e.g. Ramesh Kumar" 
              />
              <AppInput 
                label="ITEMS / SERVICE" 
                value={items} 
                onChangeText={setItems} 
                placeholder="e.g. 2x Solar Cam + Installation" 
              />
              <AppInput 
                label="TOTAL AMOUNT (₹)" 
                value={amount} 
                onChangeText={setAmount} 
                placeholder="0.00" 
                keyboardType="numeric" 
              />

              <AppButton 
                title="LOG OFFLINE ORDER" 
                onPress={() => {
                  if(!clientName || !items || !amount) {
                    Alert.alert('Error', 'Please fill in all fields.');
                    return;
                  }
                  Alert.alert('Success', 'Offline order logged successfully.');
                  setOfflineModalVisible(false);
                  setClientName(''); setItems(''); setAmount('');
                }} 
                style={{ marginTop: 25 }}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, paddingTop: 40 },
  header: { marginBottom: 25 },
  title: { color: Colors.text, fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: Colors.mutedText, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 4 },
  
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 25, flexWrap: 'wrap' },
  offlineBtn: { backgroundColor: Colors.accent, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  offlineBtnText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  activeFilter: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { color: Colors.mutedText, fontSize: 10, fontWeight: '800' },
  activeFilterText: { color: '#fff' },
  
  listContent: { paddingBottom: 100 },
  orderCard: { marginBottom: 15, padding: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderId: { color: Colors.text, fontSize: 16, fontWeight: '900' },
  orderDate: { color: Colors.mutedText, fontSize: 11, fontWeight: '600', marginTop: 2 },
  
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusConfirmed: { backgroundColor: 'rgba(0, 230, 118, 0.1)' },
  statusPending: { backgroundColor: 'rgba(255, 196, 0, 0.1)' },
  statusDelivered: { backgroundColor: 'rgba(41, 121, 255, 0.1)' },
  statusText: { color: Colors.text, fontSize: 9, fontWeight: '900' },
  
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 15 },
  
  cardBody: {},
  clientName: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  itemsText: { color: Colors.mutedText, fontSize: 12, marginTop: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  totalText: { color: Colors.accent, fontSize: 16, fontWeight: '900' },
  detailBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.border },
  detailBtnText: { color: Colors.text, fontSize: 10, fontWeight: '800' },

  noDataContainer: { padding: 40, alignItems: 'center' },
  noDataText: { color: Colors.mutedText, fontSize: 14, fontWeight: '600' },

  // Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0A122A', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '80%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  modalSubtitle: { color: Colors.accent, fontSize: 12, fontWeight: '700', marginTop: 4 },
  closeIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  
  detailSection: { marginBottom: 25 },
  sectionLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  innerCard: { padding: 15, backgroundColor: 'rgba(255,255,255,0.02)' },
  detailName: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  detailSub: { color: Colors.mutedText, fontSize: 13, marginBottom: 4 },
  
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { color: '#fff', fontSize: 14, fontWeight: '700' },
  itemPrice: { color: Colors.accent, fontSize: 14, fontWeight: '900' },
  
  statusTimeline: { marginLeft: 10 },
  statusStep: { borderLeftWidth: 2, borderColor: Colors.border, paddingLeft: 20, paddingBottom: 25 },
  statusDot: { width: 12, height: 12, borderRadius: 6, position: 'absolute', left: -7, top: 0 },
  statusStepText: { color: '#fff', fontSize: 13, fontWeight: '700', top: -3 },
  
  updateBtn: { backgroundColor: Colors.accent, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  updateBtnText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 1 },
});

export default OrderManagement;
