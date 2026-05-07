import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput, Modal, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import AppCard from '../../components/AppCard';
import { Colors } from '../../constants/colors';
import { expenseApi } from '../../api/expenseApi';
import { orderApi } from '../../api/orderApi';
import { authApi } from '../../api/authApi';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import { leaveApi } from '../../api/leaveApi';
import { trackingApi } from '../../api/trackingApi';
import { notificationApi } from '../../api/notificationApi';
import { campaignApi } from '../../api/campaignApi';

export const SalaryView = ({ onBack }: { onBack: () => void }) => {
  const salaries = [
    { id: '1', name: 'Praveen Technician', role: 'Senior Tech', amount: 25000, status: 'PAID', date: '01-05-2026' },
    { id: '2', name: 'Naveen Kumar', role: 'Junior Tech', amount: 18000, status: 'PENDING', date: '01-05-2026' },
    { id: '3', name: 'Ajith S', role: 'Field Operative', amount: 20000, status: 'PAID', date: '01-05-2026' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>SALARY MANAGEMENT</Text>
      </View>
      <Text style={styles.subtitle}>PAYROLL & DISBURSEMENTS</Text>

      <View style={styles.statsRow}>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>₹63K</Text><Text style={styles.miniSub}>TOTAL PAYROLL</Text></View>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>₹18K</Text><Text style={styles.miniSub}>PENDING</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {salaries.map(item => (
          <AppCard key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.techName}>{item.name}</Text>
              <Text style={[styles.statusTag, item.status === 'PAID' ? styles.statusApproved : styles.statusPending]}>{item.status}</Text>
            </View>
            <Text style={styles.detailText}>{item.role}</Text>
            <View style={styles.menuDivider} />
            <View style={styles.cardDetails}>
              <Text style={styles.itemAmount}>₹{item.amount.toLocaleString()}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            {item.status === 'PENDING' && (
              <TouchableOpacity style={[styles.addBtn, {marginTop: 15, marginBottom: 0}]}>
                <Text style={styles.addBtnText}>PROCESS PAYMENT</Text>
              </TouchableOpacity>
            )}
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
};

export const BillingView = ({ onBack }: { onBack: () => void }) => {
  const billingItems = [
    { id: 'B-101', type: 'SERVICE', title: 'CCTV Installation', amount: 14999, customer: 'Rajesh', date: '07-05-2026' },
    { id: 'B-102', type: 'PRODUCT', title: 'Solar Camera Pro', amount: 8500, customer: 'Anand', date: '06-05-2026' },
    { id: 'B-103', type: 'SERVICE', title: 'Network Setup', amount: 5999, customer: 'Meenakshi', date: '05-05-2026' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>BILLING CENTER</Text>
      </View>
      <Text style={styles.subtitle}>REVENUE & INVOICE TRACKING</Text>

      <View style={styles.statsRow}>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>₹29.5K</Text><Text style={styles.miniSub}>GROSS BILLING</Text></View>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>8</Text><Text style={styles.miniSub}>INVOICES</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {billingItems.map(item => (
          <AppCard key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{item.id}</Text>
              <View style={[styles.statusTag, {backgroundColor: item.type === 'SERVICE' ? 'rgba(41,121,255,0.1)' : 'rgba(213,0,249,0.1)'}]}>
                <Text style={{fontSize: 9, color: item.type === 'SERVICE' ? '#2979FF' : '#D500F9', fontWeight: '900'}}>{item.type}</Text>
              </View>
            </View>
            <Text style={styles.techName}>{item.title}</Text>
            <Text style={styles.detailText}>Customer: {item.customer}</Text>
            <View style={styles.menuDivider} />
            <View style={styles.cardDetails}>
              <Text style={styles.itemAmount}>₹{item.amount.toLocaleString()}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
};

export const ExpensesView = ({ onBack }: { onBack: () => void }) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('All Claims');
  
  // New Expense Form State
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [expenseType, setExpenseType] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await expenseApi.getAll();
      setExpenses(res.data.data);
    } catch (err) {
      console.error('Fetch expenses failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async () => {
    if (!desc || !amount) {
      Alert.alert('Error', 'Please fill in required fields.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await expenseApi.create({
        description: `[${expenseType.toUpperCase()}] ${desc}`,
        amount: Number(amount),
        date: new Date(),
        category: category,
        type: expenseType
      });
      if (res.data.success) {
        Alert.alert('Success', 'Expense logged successfully.');
        setModalVisible(false);
        setDesc(''); setAmount('');
        fetchExpenses();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to log expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await expenseApi.updateStatus(id, status);
      if (res.data.success) {
        Alert.alert('Success', `Expense ${status} successfully.`);
        fetchExpenses();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update expense status.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>EXPENSE BOARD</Text>
      </View>
      <Text style={styles.subtitle}>FINANCIAL OUTFLOW & REIMBURSEMENTS</Text>

      <View style={styles.filterRow}>
        {['All Claims', 'Employee Claims', 'Admin Expenses'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.filterBtn, activeTab === tab && styles.activeFilter]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.filterText, activeTab === tab && styles.activeFilterText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ ADD NEW EXPENSE</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {expenses && expenses.filter(e => {
            if (activeTab === 'All Claims') return true;
            if (activeTab === 'Employee Claims') return e.type === 'employee';
            if (activeTab === 'Admin Expenses') return e.type === 'admin';
            return true;
          }).length > 0 ? expenses.filter(e => {
            if (activeTab === 'All Claims') return true;
            if (activeTab === 'Employee Claims') return e.technicianId;
            if (activeTab === 'Admin Expenses') return !e.technicianId;
            return true;
          }).map(item => (
            <AppCard key={item._id} style={styles.itemCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemAmount}>₹{item.amount}</Text>
              </View>
              <View style={styles.cardDetails}>
                <View>
                   <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
                   <Text style={[styles.detailText, {marginTop: 4}]}>By: {item.technicianId?.name || 'Central Admin'}</Text>
                </View>
                <Text style={[styles.statusTag, item.status === 'approved' ? styles.statusApproved : item.status === 'rejected' ? styles.statusRejected : styles.statusPending]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>

              {item.status === 'pending' && item.technicianId && (
                <View style={styles.expenseActions}>
                  <TouchableOpacity 
                    style={styles.approveBtn} 
                    onPress={() => handleUpdateStatus(item._id, 'approved')}
                  >
                    <Text style={styles.btnTextSmall}>APPROVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.rejectBtn} 
                    onPress={() => handleUpdateStatus(item._id, 'rejected')}
                  >
                    <Text style={styles.btnTextSmall}>REJECT</Text>
                  </TouchableOpacity>
                </View>
              )}
            </AppCard>
          )) : (
            <Text style={styles.placeholderText}>No expenses reported in this category.</Text>
          )}
        </ScrollView>
      )}

      {/* Add Expense Modal */}
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
          <View style={styles.taskModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeaderRow}>
               <Text style={styles.modalMainTitle}>LOG <Text style={{color: Colors.accent}}>EXPENSE</Text></Text>
               <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                 <Text style={styles.modalCloseText}>✕</Text>
               </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.typeSelectorRow}>
                 <TouchableOpacity 
                    style={[styles.typeBtn, expenseType === 'admin' && styles.activeTypeBtn]}
                    onPress={() => setExpenseType('admin')}
                  >
                    <Text style={[styles.typeBtnText, expenseType === 'admin' && styles.activeTypeBtnText]}>ADMIN</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                    style={[styles.typeBtn, expenseType === 'employee' && styles.activeTypeBtn]}
                    onPress={() => setExpenseType('employee')}
                  >
                    <Text style={[styles.typeBtnText, expenseType === 'employee' && styles.activeTypeBtnText]}>EMPLOYEE</Text>
                 </TouchableOpacity>
              </View>

              <AppInput label="DESCRIPTION" value={desc} onChangeText={setDesc} placeholder="e.g. Office Supplies, Fuel" />
              <AppInput label="AMOUNT (₹)" value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" />
              <AppInput label="CATEGORY" value={category} onChangeText={setCategory} placeholder="e.g. TRAVEL, OFFICE, TOOLS" />

              <AppButton 
                title="SUBMIT EXPENSE" 
                onPress={handleAddExpense} 
                loading={submitting}
                style={{ marginTop: 20 }}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const OrdersView = ({ onBack }: { onBack: () => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAllOrders();
      if (res.data.data && res.data.data.length > 0) {
        setOrders(res.data.data);
      } else {
        setOrders([
          { _id: '17C826', date: '20 May', customerId: { name: 'JOHN DOE' }, items: '4x Hikvision 4MP', totalAmount: 12400, status: 'confirmed' },
          { _id: '17C827', date: '19 May', customerId: { name: 'AJITH S' }, items: '1x Solar Cam', totalAmount: 4500, status: 'pending' },
          { _id: '17C828', date: '18 May', customerId: { name: 'POOVASARAN' }, items: '2x WIFI PTZ', totalAmount: 8200, status: 'delivered' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>ORDER PIPELINE</Text>
      </View>
      <Text style={styles.subtitle}>MONAGE PRODUCT SALES & LOGISTICS</Text>

      <View style={styles.statusTabs}>
        {['All', 'Pending', 'Confirmed', 'Delivered'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tagBtn, activeFilter === tab && styles.activeTag]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.tagText, activeFilter === tab && styles.activeTagText]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {orders && orders.filter(o => activeFilter === 'All' || o.status.toLowerCase() === activeFilter.toLowerCase()).length > 0 ? 
           orders.filter(o => activeFilter === 'All' || o.status.toLowerCase() === activeFilter.toLowerCase()).map(order => (
            <AppCard key={order._id} style={styles.orderPipeCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderIdText}>#{order._id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.orderDateText}>{order.date || new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
                </View>
                <View style={[
                  styles.statusPill, 
                  { backgroundColor: order.status === 'confirmed' ? 'rgba(0,230,118,0.1)' : order.status === 'delivered' ? 'rgba(41,121,255,0.1)' : 'rgba(255,255,255,0.05)' }
                ]}>
                  <Text style={[
                    styles.statusPillText,
                    { color: order.status === 'confirmed' ? '#00E676' : order.status === 'delivered' ? '#2979FF' : '#8A94AD' }
                  ]}>{order.status.toUpperCase()}</Text>
                </View>
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={styles.orderCustomerText}>{order.customerId?.name?.toUpperCase() || 'CUSTOMER'}</Text>
                <Text style={styles.orderItemsText}>{order.items || order.serviceId?.title || 'Items details...'}</Text>
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotalText}>TOTAL: ₹{(order.totalAmount || 0).toLocaleString()}</Text>
                <TouchableOpacity 
                  style={styles.detailsBtn}
                  onPress={() => {
                    setSelectedOrder(order);
                    setDetailsVisible(true);
                  }}
                >
                  <Text style={styles.detailsBtnText}>DETAILS</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          )) : (
            <Text style={styles.placeholderText}>No orders found.</Text>
          )}
        </ScrollView>
      )}

      {/* Order Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsVisible}
        onRequestClose={() => setDetailsVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.taskModalContent, { height: '70%' }]}>
            <View style={styles.modalHeaderRow}>
               <Text style={styles.modalMainTitle}>ORDER <Text style={{color: Colors.accent}}>DETAILS</Text></Text>
               <TouchableOpacity onPress={() => setDetailsVisible(false)} style={styles.modalCloseBtn}>
                 <Text style={styles.modalCloseText}>✕</Text>
               </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>ORDER ID</Text>
                  <Text style={styles.detailValue}>#{selectedOrder._id.toUpperCase()}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={{flex: 1}}>
                    <Text style={styles.detailLabel}>CUSTOMER</Text>
                    <Text style={styles.detailValue}>{selectedOrder.customerId?.name || 'Customer'}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.detailLabel}>DATE</Text>
                    <Text style={styles.detailValue}>{selectedOrder.date || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>ITEMS / SERVICE</Text>
                  <Text style={styles.detailValue}>{selectedOrder.items || selectedOrder.serviceId?.title}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>TOTAL AMOUNT</Text>
                  <Text style={[styles.detailValue, {color: Colors.accent, fontSize: 24}]}>₹{selectedOrder.totalAmount?.toLocaleString()}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>STATUS</Text>
                  <View style={[styles.statusTag, selectedOrder.status === 'confirmed' ? styles.statusApproved : styles.statusPending, {alignSelf: 'flex-start', marginTop: 8}]}>
                    <Text style={{color: '#fff', fontWeight: '800'}}>{selectedOrder.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row', gap: 12, marginTop: 30}}>
                   <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#00E676', flex: 1}]}>
                      <Text style={styles.actionBtnText}>CONFIRM ORDER</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#FF5252', flex: 1}]}>
                      <Text style={styles.actionBtnText}>CANCEL</Text>
                   </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const TechniciansView = ({ onBack }: { onBack: () => void }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTech, setSelectedTech] = useState<any>(null);
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTechs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi.getTechs();
      setTechs(res.data.data);
    } catch (err) {
      console.error('Fetch techs failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechs();
  }, [fetchTechs]);

  const handleOnboard = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await authApi.onboardTech({ name, email, password, phone, address });
      Alert.alert('Success', 'Technician onboarded successfully.');
      setModalVisible(false);
      // Reset form
      setName(''); setEmail(''); setPassword(''); setPhone(''); setAddress('');
      fetchTechs();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to onboard technician.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPress = (tech: any) => {
    setSelectedTech(tech);
    setName(tech.name);
    setEmail(tech.email);
    setPhone(tech.phone || '');
    setAddress(tech.address || '');
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!name) {
      Alert.alert('Error', 'Name is required.');
      return;
    }

    try {
      setSubmitting(true);
      await authApi.updateUser(selectedTech._id, { name, phone, address });
      Alert.alert('Success', 'Technician details updated.');
      setEditModalVisible(false);
      fetchTechs();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update technician.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>SERVICE TEAM</Text>
      </View>
      <Text style={styles.subtitle}>MANAGE TECHNICIAN PERFORMANCE</Text>

      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ ONBOARD NEW TECH</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {techs && techs.length > 0 ? (
            techs.map(tech => (
              <TouchableOpacity key={tech._id} onPress={() => handleEditPress(tech)}>
                <AppCard style={styles.itemCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.techName}>{tech.name}</Text>
                    <Text style={[styles.statusTag, styles.statusAvailable]}>AVAILABLE</Text>
                  </View>
                  <Text style={styles.detailText}>{tech.email} • {tech.phone || 'No phone'}</Text>
                </AppCard>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={styles.placeholderText}>No technicians onboarded yet.</Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.taskModalContent} onStartShouldSetResponder={() => true}>
            <TouchableOpacity 
              style={styles.modalCloseBtn} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.modalTitleRow}>
              <Text style={styles.modalMainTitle}>Add <Text style={{color: Colors.accent}}>Technician</Text></Text>
              <Text style={styles.modalSubtitle}>REGISTER A NEW TECHNICIAN</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <AppInput label="Full Name" value={name} onChangeText={setName} placeholder="Enter full name" />
              <AppInput label="Email Address" value={email} onChangeText={setEmail} placeholder="admin@sktech.com" autoCapitalize="none" />
              <AppInput label="Account Password" value={password} onChangeText={setPassword} placeholder="••••••••" isPassword />
              <AppInput label="Contact Number" value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" />
              <AppInput label="Service Area / Address" value={address} onChangeText={setAddress} placeholder="Enter area or full address" multiline />

              <AppButton 
                title="ADD TECHNICIAN" 
                onPress={handleOnboard} 
                loading={submitting}
                style={{ marginTop: 20 }}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Technician Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setEditModalVisible(false)}
        >
          <View style={styles.taskModalContent} onStartShouldSetResponder={() => true}>
            <TouchableOpacity 
              style={styles.modalCloseBtn} 
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.modalTitleRow}>
              <Text style={styles.modalMainTitle}>Edit <Text style={{color: Colors.accent}}>Technician</Text></Text>
              <Text style={styles.modalSubtitle}>MODIFY SERVICE PERSONNEL DETAILS</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <AppInput label="Full Name" value={name} onChangeText={setName} placeholder="Enter full name" />
              <AppInput label="Email Address (Locked)" value={email} onChangeText={() => {}} placeholder="Email cannot be changed" editable={false} containerStyle={{ opacity: 0.6 }} />
              <AppInput label="Contact Number" value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" />
              <AppInput label="Service Area / Address" value={address} onChangeText={setAddress} placeholder="Enter area or full address" multiline />

              <AppButton 
                title="UPDATE DETAILS" 
                onPress={handleUpdate} 
                loading={submitting}
                style={{ marginTop: 20 }}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const ProductsView = ({ onBack }: { onBack: () => void }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [resolution, setResolution] = useState('');
  const [brand, setBrand] = useState('SK TECH');
  const [sensorType, setSensorType] = useState('');
  const [connectivity, setConnectivity] = useState('');
  const [price, setPrice] = useState('0');
  const [stockQty, setStockQty] = useState('0');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('CCTV Cameras');
  const [storage, setStorage] = useState('');
  const [nightVision, setNightVision] = useState('');
  const [weatherproofing, setWeatherproofing] = useState('');
  const [usageEnvironment, setUsageEnvironment] = useState('Outdoor');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [strategicViews, setStrategicViews] = useState<{ [key: string]: any }>({});
  const [threeSixtyImages, setThreeSixtyImages] = useState<any[]>([]);

  const pickImage = async (type: 'gallery' | 'strategic' | '360', strategicKey?: string) => {
    const options: any = {
      mediaType: 'photo',
      selectionLimit: type === 'strategic' ? 1 : 0,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Picker Error');
        return;
      }

      if (response.assets) {
        if (type === 'gallery') {
          setGalleryImages([...galleryImages, ...response.assets]);
        } else if (type === 'strategic' && strategicKey) {
          setStrategicViews({ ...strategicViews, [strategicKey]: response.assets[0] });
        } else if (type === '360') {
          setThreeSixtyImages([...threeSixtyImages, ...response.assets]);
        }
      }
    });
  };

  const products = [
    { id: '1', name: 'CONSISTENT 4 MP IP CAMERA BULLET', cat: 'CCTV CAMERAS', stock: '10 UNITS', price: '₹2,500' },
    { id: '2', name: 'KRYSTAA 2 TB HDD', cat: 'CCTV CAMERAS', stock: '5 UNITS', price: '₹5,000' },
    { id: '3', name: 'CP PLUS DVR 8 CHANNEL', cat: 'CCTV CAMERAS', stock: '25 UNITS', price: '₹4,500' },
  ];

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>PRODUCT INVENTORY</Text>
      </View>
      <Text style={styles.subtitle}>MANAGE HARDWARE & GEAR</Text>

      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ ADD NEW PRODUCT</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {products.map(item => (
          <AppCard key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={[styles.techName, {flex: 1}]}>{item.name}</Text>
              <Text style={styles.priceTag}>{item.price}</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.categoryText}>{item.cat}</Text>
              <Text style={[styles.statusTag, styles.statusAvailable]}>{item.stock} IN STOCK</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.taskModalContent, { height: '90%', width: '100%', alignSelf: 'center' }]}>
            <View style={styles.modalHeaderRow}>
               <Text style={styles.modalMainTitle}>NEW <Text style={{color: Colors.accent}}>PRODUCT</Text></Text>
               <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                 <Text style={styles.modalCloseText}>✕</Text>
               </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.formGrid}>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>PRODUCT NAME</Text>
                  <TextInput style={styles.formInput} placeholder="Product Name" placeholderTextColor="rgba(255,255,255,0.2)" value={productName} onChangeText={setProductName} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>RESOLUTION</Text>
                  <TextInput style={styles.formInput} placeholder="Resolution (e.g. 4K, 1080p)" placeholderTextColor="rgba(255,255,255,0.2)" value={resolution} onChangeText={setResolution} />
                </View>
              </View>

              <View style={styles.formGrid}>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.formLabel}>BRAND</Text>
                  <TextInput style={styles.formInput} placeholder="Brand" placeholderTextColor="rgba(255,255,255,0.2)" value={brand} onChangeText={setBrand} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>SENSOR TYPE</Text>
                  <TextInput style={styles.formInput} placeholder="e.g. 1/2.8 CMOS" placeholderTextColor="rgba(255,255,255,0.2)" value={sensorType} onChangeText={setSensorType} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>CONNECTIVITY</Text>
                  <TextInput style={styles.formInput} placeholder="e.g. RJ45, Wi-Fi" placeholderTextColor="rgba(255,255,255,0.2)" value={connectivity} onChangeText={setConnectivity} />
                </View>
              </View>

              <View style={styles.formGrid}>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>PRICE (₹)</Text>
                  <TextInput style={styles.formInput} placeholder="0" placeholderTextColor="rgba(255,255,255,0.2)" keyboardType="numeric" value={price} onChangeText={setPrice} />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.formLabel}>STOCK QTY</Text>
                  <TextInput style={styles.formInput} placeholder="0" placeholderTextColor="rgba(255,255,255,0.2)" keyboardType="numeric" value={stockQty} onChangeText={setStockQty} />
                </View>
                <View style={[styles.formCol, { flex: 2 }]}>
                  <Text style={styles.formLabel}>VIDEO URL (DEMO)</Text>
                  <TextInput style={styles.formInput} placeholder="YouTube/MP4 URL" placeholderTextColor="rgba(255,255,255,0.2)" value={videoUrl} onChangeText={setVideoUrl} />
                </View>
              </View>

              <View style={styles.formGrid}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>GALLERY IMAGES</Text>
                  <View style={styles.imageUploadGrid}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {galleryImages.map((img, idx) => (
                        <Image key={idx} source={{ uri: img.uri }} style={[styles.imagePlaceholder, { borderWidth: 1 }]} />
                      ))}
                      <TouchableOpacity 
                        style={styles.imagePlaceholder}
                        onPress={() => pickImage('gallery')}
                      >
                        <Text style={{ fontSize: 24 }}>📤</Text>
                        <Text style={styles.imagePlaceholderText}>ADD</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.formLabel}>CATEGORY</Text>
                  <TextInput style={styles.formInput} placeholder="Category" placeholderTextColor="rgba(255,255,255,0.2)" value={category} onChangeText={setCategory} />
                </View>
              </View>

              <View style={styles.formGrid}>
                 <View style={{ flex: 1 }}>
                    <Text style={styles.formLabel}>STRATEGIC VIEWS (4-POINT)</Text>
                    <View style={styles.strategicGrid}>
                       {['FRONT', 'TOP', 'BOTTOM', 'SIDE'].map(v => (
                         <TouchableOpacity 
                            key={v} 
                            style={styles.viewBox}
                            onPress={() => pickImage('strategic', v)}
                          >
                           {strategicViews[v] ? (
                             <Image source={{ uri: strategicViews[v].uri }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
                           ) : (
                             <>
                               <Text style={{fontSize: 20}}>📷</Text>
                               <Text style={styles.viewLabel}>{v} VIEW</Text>
                             </>
                           )}
                         </TouchableOpacity>
                       ))}
                    </View>
                 </View>
                 <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.formGrid}>
                       <View style={styles.formCol}>
                          <Text style={styles.formLabel}>STORAGE</Text>
                          <TextInput style={styles.formInput} placeholder="e.g. 256GB MicroSD" placeholderTextColor="rgba(255,255,255,0.2)" value={storage} onChangeText={setStorage} />
                       </View>
                       <View style={styles.formCol}>
                          <Text style={styles.formLabel}>NIGHT VISION</Text>
                          <TextInput style={styles.formInput} placeholder="e.g. 30m IR" placeholderTextColor="rgba(255,255,255,0.2)" value={nightVision} onChangeText={setNightVision} />
                       </View>
                    </View>
                    <View style={styles.formGrid}>
                       <View style={styles.formCol}>
                          <Text style={styles.formLabel}>WEATHERPROOFING</Text>
                          <TextInput style={styles.formInput} placeholder="e.g. IP67" placeholderTextColor="rgba(255,255,255,0.2)" value={weatherproofing} onChangeText={setWeatherproofing} />
                       </View>
                       <View style={styles.formCol}>
                          <Text style={styles.formLabel}>USAGE ENVIRONMENT</Text>
                          <TextInput style={styles.formInput} value={usageEnvironment} onChangeText={setUsageEnvironment} />
                       </View>
                    </View>
                 </View>
              </View>

              <View style={styles.formGrid}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>360 VIEW IMAGES</Text>
                  <View style={styles.imageUploadGrid}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {threeSixtyImages.map((img, idx) => (
                        <Image key={idx} source={{ uri: img.uri }} style={[styles.imagePlaceholder, { width: 100, borderWidth: 1 }]} />
                      ))}
                      <TouchableOpacity 
                        style={[styles.imagePlaceholder, { width: 100 }]}
                        onPress={() => pickImage('360')}
                      >
                        <Text style={{ fontSize: 24 }}>📤</Text>
                        <Text style={styles.imagePlaceholderText}>ADD</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
                <View style={{ flex: 2, marginLeft: 15 }}>
                  <Text style={styles.formLabel}>CORE FEATURES</Text>
                  <View style={styles.featuresBox}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                      {features.map((f, idx) => (
                        <View key={idx} style={styles.featureTag}><Text style={styles.featureTagText}>{f}</Text></View>
                      ))}
                    </ScrollView>
                    <TextInput 
                      style={styles.featureInput} 
                      placeholder="+ ADD FEATURE (PRESS ENTER)" 
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      value={newFeature}
                      onChangeText={setNewFeature}
                      onSubmitEditing={handleAddFeature}
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.formLabel}>DESCRIPTION</Text>
              <TextInput 
                style={[styles.formInput, { height: 100, textAlignVertical: 'top' }]} 
                placeholder="Product description..." 
                placeholderTextColor="rgba(255,255,255,0.2)" 
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity style={styles.submitTaskBtn} onPress={() => Alert.alert('Success', 'Product catalog updated.')}>
                <Text style={styles.submitTaskText}>ADD NEW PRODUCT</Text>
              </TouchableOpacity>
              <View style={{ height: 50 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const TasksView = ({ onBack }: { onBack: () => void }) => {
  const { simulateRole } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTech, setSelectedTech] = useState('Select Technician...');
  const [techListVisible, setTechListVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('Standard Priority');
  const [priorityListVisible, setPriorityListVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (_event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setTime(selectedTime);
  };

  const technicians = ['NAVEEN KUMAR', 'AJITH S', 'PRAVEEN P', 'GANESAN R', 'POOVASARAN P'];
  const priorities = ['HIGH', 'MEDIUM', 'LOW'];

  const tasks = [
    { id: '1', title: 'SEMBA DAMUDHUR 5 IP CAMERA INSTALLATION', tech: 'AJITH S', status: 'IN PROGRESS', priority: 'HIGH' },
    { id: '2', title: 'SOLAR CAMERA FIXING', tech: 'NAVEEN KUMAR', status: 'PENDING', priority: 'MEDIUM' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>TASK ALLOCATION</Text>
      </View>
      <Text style={styles.subtitle}>ASSIGN & MONITOR PRODUCTIVITY</Text>

      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ ASSIGN NEW TASK</Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>81</Text><Text style={styles.miniSub}>TOTAL</Text></View>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>8</Text><Text style={styles.miniSub}>PENDING</Text></View>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>73</Text><Text style={styles.miniSub}>DONE</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {tasks.map(item => (
          <AppCard key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={[styles.itemDesc, {fontSize: 14}]}>{item.title}</Text>
              <View style={[styles.priorityDot, {backgroundColor: item.priority === 'HIGH' ? '#FF5252' : '#FFC400'}]} />
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.techNameSmall}>👷 {item.tech}</Text>
              <Text style={[styles.statusTag, item.status === 'PENDING' ? styles.statusPending : styles.statusAssigned]}>{item.status}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>

      {/* Task Assignment Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.taskModalContent} onStartShouldSetResponder={() => true}>
            <TouchableOpacity 
              style={[styles.modalCloseBtn, {zIndex: 10}]} 
              onPress={() => setModalVisible(false)}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.modalTitleRow}>
              <Text style={styles.modalMainTitle}>STRATEGIC <Text style={{color: Colors.accent}}>TASKING</Text></Text>
              <Text style={styles.modalSubtitle}>NEW ASSIGNMENT PROTOCOL</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>OBJECTIVE TITLE</Text>
              <TextInput 
                style={styles.taskInput} 
                placeholder="e.g. Server Room Maintenance" 
                placeholderTextColor="rgba(255,255,255,0.3)"
              />

              <View style={styles.formRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>ASSIGN OPERATIVE</Text>
                  <TouchableOpacity 
                    style={styles.selectBox}
                    onPress={() => setTechListVisible(!techListVisible)}
                  >
                    <Text style={[styles.selectText, selectedTech !== 'Select Technician...' && {color: '#fff'}]}>{selectedTech}</Text>
                    <Text style={styles.arrowIcon}>▼</Text>
                  </TouchableOpacity>

                  {techListVisible && (
                    <View style={{backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginTop: 5, padding: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'}}>
                      {technicians.map(t => (
                        <TouchableOpacity 
                          key={t} 
                          style={{padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'}}
                          onPress={() => { setSelectedTech(t); setTechListVisible(false); }}
                        >
                          <Text style={{color: '#fff', fontSize: 12, fontWeight: '600'}}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>PRIORITY LEVEL</Text>
                  <TouchableOpacity 
                    style={styles.selectBox}
                    onPress={() => setPriorityListVisible(!priorityListVisible)}
                  >
                    <Text style={[styles.selectText, selectedPriority !== 'Standard Priority' && {color: '#fff'}]}>{selectedPriority}</Text>
                    <Text style={styles.arrowIcon}>▼</Text>
                  </TouchableOpacity>

                  {priorityListVisible && (
                    <View style={{backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginTop: 5, padding: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'}}>
                      {priorities.map(p => (
                        <TouchableOpacity 
                          key={p} 
                          style={{padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'}}
                          onPress={() => { setSelectedPriority(p); setPriorityListVisible(false); }}
                        >
                          <Text style={{
                            color: p === 'HIGH' ? '#FF5252' : p === 'MEDIUM' ? '#FFC400' : '#2979FF', 
                            fontSize: 12, 
                            fontWeight: '900'
                          }}>{p}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>DUE DATE</Text>
                  <TouchableOpacity 
                    style={styles.taskInputRow}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={{color: '#fff', flex: 1, paddingVertical: 12}}>
                      {date.toLocaleDateString('en-GB')}
                    </Text>
                    <Text style={styles.inputIcon}>📅</Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>TIME ALLOCATION</Text>
                  <TouchableOpacity 
                    style={styles.taskInput}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={{color: '#fff', paddingVertical: 12}}>
                      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <DateTimePicker
                      value={time}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={onTimeChange}
                    />
                  )}
                </View>
              </View>

              <Text style={styles.inputLabel}>DETAILED INSTRUCTIONS</Text>
              <TextInput 
                style={[styles.taskInput, {height: 120, textAlignVertical: 'top'}]} 
                placeholder="Outline the operational steps..." 
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
              />

              <TouchableOpacity 
                style={styles.submitTaskBtn}
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    Alert.alert("Success", "Task Execution Sequence Initiated.");
                  }, 500);
                }}
              >
                <Text style={styles.submitTaskText}>EXECUTE ASSIGNMENT</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const AttendanceView = ({ onBack }: { onBack: () => void }) => {
  const attendance = [
    { name: 'POOVASARAN P', time: '09:55 AM', status: 'PRESENT' },
    { name: 'GANESAN R', time: '10:00 AM', status: 'PRESENT' },
    { name: 'NAVEEN KUMAR N', time: '10:12 AM', status: 'PRESENT' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>ATTENDANCE CONTROL</Text>
      </View>
      <Text style={styles.subtitle}>PERSONNEL WORK HISTORY & TRACKING</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionBtnText}>🔄 SYNC MONTH</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: Colors.accent}]}><Text style={[styles.actionBtnText, {color: '#fff'}]}>📥 EXPORT REPORT</Text></TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, {marginTop: 20, marginBottom: 10}]}>Pending Leave Requests</Text>
      <LeaveRequestsView onBack={() => {}} hideHeader={true} />

      <Text style={[styles.sectionTitle, {marginTop: 30, marginBottom: 10}]}>Daily Attendance Log</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {attendance.map(item => (
          <AppCard key={item.name} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.techName}>{item.name}</Text>
              <Text style={[styles.statusTag, styles.statusAvailable]}>{item.status}</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.detailText}>IN: {item.time}</Text>
              <Text style={styles.detailText}>DEVICE: Verified</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
};

export const ServiceRequestsView = ({ onBack }: { onBack: () => void }) => {
  const { simulateRole } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedTech, setSelectedTech] = useState('Select Technician...');
  const [techListVisible, setTechListVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('Standard Priority');
  const [priorityListVisible, setPriorityListVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (_event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setTime(selectedTime);
  };

  const technicians = ['NAVEEN KUMAR', 'AJITH S', 'PRAVEEN P', 'GANESAN R', 'POOVASARAN P'];
  const priorities = ['HIGH', 'MEDIUM', 'LOW'];

  const requests = [
    { id: 'SR001', customer: 'ANAND KUMAR', type: 'IP CAMERA INSTALLATION', location: 'Hosur, TN', priority: 'HIGH', status: 'NEW', date: '06-05-2026' },
    { id: 'SR002', customer: 'SENTHIL V', type: 'DVR MAINTENANCE', location: 'Bangalore, KA', priority: 'MEDIUM', status: 'NEW', date: '05-05-2026' },
    { id: 'SR003', customer: 'MEENAKSHI TRADERS', type: 'BIOMETRIC SETUP', location: 'Krishnagiri, TN', priority: 'CRITICAL', status: 'IN_PROGRESS', date: '06-05-2026' },
  ];

  const handleAssignPress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>SERVICE MANAGEMENT</Text>
      </View>
      <Text style={styles.subtitle}>INCOMING CUSTOMER APPLICATIONS</Text>

      <View style={styles.statsRow}>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>12</Text><Text style={styles.miniSub}>NEW</Text></View>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>5</Text><Text style={styles.miniSub}>ACTIVE</Text></View>
        <View style={styles.statMiniBox}><Text style={styles.miniLabel}>₹45K</Text><Text style={styles.miniSub}>PENDING</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {requests.map(item => (
          <AppCard key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View style={[styles.priorityDot, {backgroundColor: item.priority === 'CRITICAL' ? '#FF5252' : item.priority === 'HIGH' ? '#FFC400' : '#2979FF'}]} />
                <Text style={styles.techName}>{item.customer}</Text>
              </View>
              <Text style={styles.orderId}>#{item.id}</Text>
            </View>
            
            <Text style={[styles.detailText, {color: Colors.accent, marginVertical: 4}]}>{item.type}</Text>
            
            <View style={[styles.cardDetails, {marginTop: 10}]}>
              <View>
                <Text style={styles.detailText}>📍 {item.location}</Text>
                <Text style={styles.detailText}>📅 {item.date}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={[styles.statusTag, item.status === 'NEW' ? styles.statusPending : styles.statusAssigned]}>
                  {item.status.replace('_', ' ')}
                </Text>
                <TouchableOpacity 
                  style={[styles.assignBtn, {marginTop: 10, paddingVertical: 6, paddingHorizontal: 12}]}
                  onPress={() => handleAssignPress(item)}
                >
                  <Text style={styles.btnTextSmall}>ASSIGN TECH</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AppCard>
        ))}
      </ScrollView>

      {/* Assignment Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => { setModalVisible(false); setTechListVisible(false); setPriorityListVisible(false); }}
        >
          <View style={styles.taskModalContent} onStartShouldSetResponder={() => true}>
            <TouchableOpacity 
              style={styles.modalCloseBtn} 
              onPress={() => { setModalVisible(false); setTechListVisible(false); setPriorityListVisible(false); }}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.modalTitleRow}>
              <Text style={styles.modalMainTitle}>STRATEGIC <Text style={{color: Colors.accent}}>TASKING</Text></Text>
              <Text style={styles.modalSubtitle}>NEW ASSIGNMENT PROTOCOL</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>OBJECTIVE TITLE</Text>
              <TextInput 
                style={styles.taskInput} 
                defaultValue={selectedRequest ? selectedRequest.type : ''}
                placeholderTextColor="rgba(255,255,255,0.3)"
              />

              <View style={styles.formRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>ASSIGN OPERATIVE</Text>
                  <TouchableOpacity 
                    style={styles.selectBox} 
                    onPress={() => { setTechListVisible(!techListVisible); setPriorityListVisible(false); }}
                  >
                    <Text style={[styles.selectText, selectedTech !== 'Select Technician...' && {color: '#fff'}]}>{selectedTech}</Text>
                    <Text style={styles.arrowIcon}>▼</Text>
                  </TouchableOpacity>
                  
                  {techListVisible && (
                    <View style={{
                      position: 'absolute',
                      top: 75,
                      left: 0,
                      right: 0,
                      backgroundColor: '#0A1F44',
                      borderRadius: 12,
                      padding: 5,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.1)',
                      zIndex: 1000,
                      elevation: 5,
                    }}>
                      {technicians.map(t => (
                        <TouchableOpacity 
                          key={t} 
                          style={{padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'}}
                          onPress={() => { setSelectedTech(t); setTechListVisible(false); }}
                        >
                          <Text style={{color: '#fff', fontSize: 12, fontWeight: '600'}}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>PRIORITY LEVEL</Text>
                  <TouchableOpacity 
                    style={styles.selectBox}
                    onPress={() => { setPriorityListVisible(!priorityListVisible); setTechListVisible(false); }}
                  >
                    <Text style={[styles.selectText, selectedPriority !== 'Standard Priority' && {color: '#fff'}]}>{selectedPriority}</Text>
                    <Text style={styles.arrowIcon}>▼</Text>
                  </TouchableOpacity>

                  {priorityListVisible && (
                    <View style={{
                      position: 'absolute',
                      top: 75,
                      left: 0,
                      right: 0,
                      backgroundColor: '#0A1F44',
                      borderRadius: 12,
                      padding: 5,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.1)',
                      zIndex: 1000,
                      elevation: 5,
                    }}>
                      {priorities.map(p => (
                        <TouchableOpacity 
                          key={p} 
                          style={{padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'}}
                          onPress={() => { setSelectedPriority(p); setPriorityListVisible(false); }}
                        >
                          <Text style={{
                            color: p === 'HIGH' ? '#FF5252' : p === 'MEDIUM' ? '#FFC400' : '#2979FF', 
                            fontSize: 12, 
                            fontWeight: '900'
                          }}>{p}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>DUE DATE</Text>
                  <TouchableOpacity 
                    style={styles.taskInputRow}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={{color: '#fff', flex: 1, paddingVertical: 12}}>
                      {date.toLocaleDateString('en-GB')}
                    </Text>
                    <Text style={styles.inputIcon}>📅</Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>TIME ALLOCATION</Text>
                  <TouchableOpacity 
                    style={styles.taskInput}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={{color: '#fff', paddingVertical: 12}}>
                      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <DateTimePicker
                      value={time}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={onTimeChange}
                    />
                  )}
                </View>
              </View>

              <Text style={styles.inputLabel}>DETAILED INSTRUCTIONS</Text>
              <TextInput 
                style={[styles.taskInput, {height: 80, textAlignVertical: 'top'}]} 
                multiline 
                placeholder="Outline the operational steps..." 
                placeholderTextColor="rgba(255,255,255,0.3)"
              />

              <TouchableOpacity 
                style={styles.submitTaskBtn}
                onPress={() => {
                  setModalVisible(false);
                  Alert.alert("Success", "Task assigned. Switching to Technician terminal...", [
                    { text: "OK", onPress: () => simulateRole('technician') }
                  ]);
                }}
              >
                <Text style={styles.submitTaskText}>EXECUTE ASSIGNMENT</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const AvailabilityView = ({ onBack }: { onBack: () => void }) => {
  const techs = [
    { name: 'NAVEEN KUMAR', status: 'AVAILABLE', color: '#00E676' },
    { name: 'AJITH S', status: 'BUSY NOW', color: '#FFC400' },
    { name: 'POOVASARAN P', status: 'AVAILABLE', color: '#00E676' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>TECHNICIAN AVAILABILITY</Text>
      </View>
      <Text style={styles.subtitle}>REAL TIME SLOT TRACKING</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.grid}>
          {techs.map(tech => (
            <View key={tech.name} style={{width: '100%', marginBottom: 15}}>
              <AppCard style={styles.itemCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.techName}>{tech.name}</Text>
                  <View style={[styles.liveDot, {backgroundColor: tech.color}]} />
                </View>
                <Text style={[styles.detailText, {color: tech.color, fontWeight: '800'}]}>{tech.status}</Text>
                <View style={styles.slotBar}>
                  {[1,2,3,4,5].map(i => <View key={i} style={[styles.slotSegment, i < 4 && {backgroundColor: tech.color}]} />)}
                </View>
              </AppCard>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export const ReviewsView = ({ onBack }: { onBack: () => void }) => {
  const reviews = [
    { id: '1', customer: 'Ajith', rating: '5/5', comment: 'Super', status: 'APPROVED' },
    { id: '2', customer: 'Ajith', rating: '5/5', comment: 'Super Fast Service', status: 'APPROVED' },
    { id: '3', customer: 'Anonymous', rating: '5/5', comment: 'good', status: 'APPROVED' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>CUSTOMER REVIEWS</Text>
      </View>
      <Text style={styles.subtitle}>MANAGE RATINGS FROM SERVICE JOBS</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {reviews.map(item => (
          <AppCard key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.techName}>{item.customer}</Text>
              <Text style={styles.statusTag}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.itemComment}>"{item.comment}"</Text>
            <View style={[styles.statusTag, styles.statusAvailable, {marginTop: 10, alignSelf: 'flex-start'}]}>
              <Text style={{fontSize: 9, color: '#00E676', fontWeight: '900'}}>{item.status}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
};

export const LiveTrackingView = ({ onBack }: { onBack: () => void }) => {
  const [activeTracking, setActiveTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTracking = useCallback(async () => {
    try {
      const res = await trackingApi.getAllActive();
      if (res.data.success) {
        setActiveTracking(res.data.data);
      }
    } catch (err) {
      console.error('Fetch tracking failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 5000);
    return () => clearInterval(interval);
  }, [fetchTracking]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={styles.liveBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>GPS TELEMETRY ACTIVE</Text>
          </View>
          <Text style={styles.title}>LIVE <Text style={{ color: Colors.accent }}>TRACKING</Text></Text>
        </View>
      </View>
      <Text style={styles.subtitle}>REAL-TIME NODE MONITORING SYSTEM</Text>

      <View style={[styles.mapMock, { flex: 1, marginTop: 20 }]}>
        {/* Map Simulation */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0A122A', borderRadius: 25 }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={`v-${i}`} style={{ position: 'absolute', left: `${i * 7}%`, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(41, 121, 255, 0.05)' }} />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={`h-${i}`} style={{ position: 'absolute', top: `${i * 7}%`, left: 0, right: 0, height: 1, backgroundColor: 'rgba(41, 121, 255, 0.05)' }} />
          ))}
        </View>

        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{activeTracking.length} OPERATIVES ONLINE</Text>
        </View>
        
        <ScrollView style={{ marginTop: 60, paddingHorizontal: 15 }} showsVerticalScrollIndicator={false}>
          {activeTracking.map(track => (
            <AppCard key={track.technicianId._id} style={[styles.techMapCard, { marginBottom: 16, backgroundColor: 'rgba(10, 31, 68, 0.9)', borderColor: 'rgba(255,255,255,0.05)' }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.techName}>{track.technicianId.name || 'Unknown'}</Text>
                  <Text style={styles.orderId}>SIGNAL: {track.technicianId._id.slice(-6).toUpperCase()}</Text>
                </View>
                <View style={[styles.statusTag, styles.statusAvailable, { backgroundColor: 'rgba(0, 230, 118, 0.1)' }]}>
                  <Text style={{ fontSize: 9, color: '#00E676', fontWeight: '900' }}>ONLINE</Text>
                </View>
              </View>
              
              <View style={styles.menuDivider} />
              
              <View style={styles.coordBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.miniSub}>LATITUDE</Text>
                  <Text style={styles.miniLabel}>{track.latitude?.toFixed(5) || '0.00000'}</Text>
                </View>
                <View style={styles.vDivider} />
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.miniSub}>LONGITUDE</Text>
                  <Text style={styles.miniLabel}>{track.longitude?.toFixed(5) || '0.00000'}</Text>
                </View>
              </View>

              <View style={[styles.statusTag, track.orderId ? styles.statusOnJob : styles.statusAssigned, { marginTop: 15, alignSelf: 'flex-start' }]}>
                <Text style={{ fontSize: 9, color: track.orderId ? '#FFC400' : '#2979FF', fontWeight: '900' }}>
                  {track.orderId ? `ACTIVE MISSION: ${track.orderId.slice(-6).toUpperCase()}` : 'STANDBY MODE'}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                <TouchableOpacity style={[styles.detailsBtn, { flex: 1, backgroundColor: 'rgba(41, 121, 255, 0.1)', borderColor: 'rgba(41, 121, 255, 0.2)' }]}>
                  <Text style={[styles.detailsBtnText, { textAlign: 'center' }]}>🛰️ VIEW ON MAP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.detailsBtn, { flex: 1 }]}>
                  <Text style={[styles.detailsBtnText, { textAlign: 'center' }]}>📞 CONTACT</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          ))}
          
          {activeTracking.length === 0 && !loading && (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <Text style={styles.emptyIcon}>📡</Text>
              <Text style={styles.emptyText}>SCANNING FOR SIGNALS...</Text>
              <Text style={[styles.placeholderText, { fontSize: 10 }]}>No active operatives detected in the field.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export const MarketingHubView = ({ onBack }: { onBack: () => void }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await campaignApi.getAll();
      setCampaigns(res.data.data);
    } catch (err) {
      console.log('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSelectAsset = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0) {
        setSelectedAsset(result.assets[0]);
      }
    } catch (err) {
      console.error('Image selection failed:', err);
    }
  };

  const handleDeploy = async () => {
    if (!title || !desc || !discount) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    try {
      await campaignApi.create({
        title,
        description: desc,
        discount: discount + '% OFF',
        voucherCode: voucher,
        image: selectedAsset?.uri
      });
      Alert.alert('System', 'Campaign deployment successful.');
      setModalVisible(false);
      setSelectedAsset(null);
      setTitle('');
      setVoucher('');
      setDiscount('');
      setDesc('');
      fetchCampaigns();
    } catch (err) {
      Alert.alert('Error', 'Failed to deploy campaign.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Command Centre', 'Campaign termination sequence initiated.', [
      { text: 'Cancel' },
      { text: 'Confirm', onPress: async () => {
        try {
          await campaignApi.delete(id);
          fetchCampaigns();
        } catch (err) {
          Alert.alert('Error', 'Failed to delete campaign.');
        }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>MARKETING HUB</Text>
      </View>
      <Text style={styles.subtitle}>GLOBAL CAMPAIGN TERMINAL</Text>

      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>NEW CAMPAIGN</Text>
      </TouchableOpacity>

      {loading ? <ActivityIndicator color={Colors.accent} /> : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {campaigns.map(item => (
            <AppCard key={item._id} style={[styles.itemCard, {padding: 0, overflow: 'hidden'}]}>
              <View style={styles.campaignHeader}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text style={styles.discountTag}>{item.discount}</Text>
                )}
              </View>
              <View style={{padding: 16}}>
                <Text style={styles.techName}>{item.title}</Text>
                <Text style={styles.detailText}>{item.description}</Text>
                <View style={styles.campaignFooter}>
                  <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View>
                  <TouchableOpacity 
                    style={styles.trashBtn} 
                    onPress={() => handleDelete(item._id)}
                  >
                    <Text>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </AppCard>
          ))}
          {campaigns.length === 0 && <Text style={styles.emptyText}>No active campaigns.</Text>}
        </ScrollView>
      )}

      {/* Campaign Manifest Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.taskModalContent}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => {
              setModalVisible(false);
              setSelectedAsset(null);
            }}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalMainTitle}>CAMPAIGN <Text style={{color: Colors.accent}}>MANIFEST</Text></Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>DISPLAY ASSET</Text>
              <TouchableOpacity 
                style={[styles.imagePlaceholder, {width: '100%', height: 180, borderStyle: selectedAsset ? 'solid' : 'dashed', overflow: 'hidden'}]}
                onPress={handleSelectAsset}
              >
                {selectedAsset ? (
                  <Image source={{ uri: selectedAsset.uri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                ) : (
                  <>
                    <Text style={{fontSize: 30}}>🖼️</Text>
                    <Text style={styles.imagePlaceholderText}>SELECT PROMOTION MEDIA</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.inputLabel}>CAMPAIGN DETAILS</Text>
              <TextInput 
                style={styles.taskInput} 
                placeholder="Campaign Title (e.g. Summer Lockdown Sale)" 
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={title}
                onChangeText={setTitle}
              />

              <View style={styles.formRow}>
                <View style={{flex: 1}}>
                  <TextInput 
                    style={styles.taskInput} 
                    placeholder="VOUCHER CODE" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={voucher}
                    onChangeText={setVoucher}
                  />
                </View>
                <View style={{flex: 1}}>
                  <TextInput 
                    style={styles.taskInput} 
                    placeholder="Discount %" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                    value={discount}
                    onChangeText={setDiscount}
                  />
                </View>
              </View>

              <TextInput 
                style={[styles.taskInput, {height: 100, textAlignVertical: 'top'}]} 
                placeholder="Campaign Intelligence / Description..." 
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                value={desc}
                onChangeText={setDesc}
              />

              <TouchableOpacity 
                style={styles.submitTaskBtn} 
                onPress={handleDeploy}
              >
                <Text style={styles.submitTaskText}>DEPLOY CAMPAIGN</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const AnnouncementsView = ({ onBack }: { onBack: () => void }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'NEW SAFETY PROTOCOL', date: '06-05-2026', priority: 'HIGH', content: 'All technicians must wear grade-4 safety helmets.' },
    { id: '2', title: 'SOFTWARE UPDATE', date: '04-05-2026', priority: 'NORMAL', content: 'Version 2.4.0 is now live.' },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleBroadcast = () => {
    if (!newTitle || !newContent) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    const newAnn = {
      id: (announcements.length + 1).toString(),
      title: newTitle.toUpperCase(),
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      priority: 'NORMAL',
      content: newContent
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewTitle('');
    setNewContent('');
    setModalVisible(false);
    Alert.alert('Success', 'Announcement broadcasted successfully.');
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>ANNOUNCEMENT HUB</Text>
      </View>
      <Text style={styles.subtitle}>BROADCAST GLOBAL COMMANDS</Text>

      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addBtnText}>+ CREATE ANNOUNCEMENT</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {announcements.map(item => (
          <AppCard key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.techName}>{item.title}</Text>
              <View style={[styles.priorityDot, {backgroundColor: item.priority === 'HIGH' ? '#FF5252' : '#2979FF'}]} />
            </View>
            <Text style={styles.detailText}>{item.date} • Priority: {item.priority}</Text>
            <Text style={[styles.detailText, {marginTop: 10, color: Colors.text}]}>{item.content}</Text>
          </AppCard>
        ))}
      </ScrollView>

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
          <View style={styles.taskModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalMainTitle}>New <Text style={{color: Colors.accent}}>Broadcast</Text></Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <AppInput label="Title" value={newTitle} onChangeText={setNewTitle} placeholder="e.g. SYSTEM MAINTENANCE" />
              <AppInput label="Content" value={newContent} onChangeText={setNewContent} placeholder="Describe the announcement..." multiline />
              <AppButton title="SEND BROADCAST" onPress={handleBroadcast} style={{marginTop: 20}} />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const LeaveRequestsView = ({ onBack, hideHeader = false }: { onBack: () => void, hideHeader?: boolean }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leaveApi.getAll();
      setRequests(res.data.data);
    } catch (err) {
      console.error('Fetch leave requests failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await leaveApi.updateStatus(id, status);
      if (res.data.success) {
        Alert.alert('Success', `Leave request ${status} successfully.`);
        fetchRequests();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update leave status.');
    }
  };

  return (
    <View style={hideHeader ? { flex: 1 } : styles.container}>
      {!hideHeader && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>←</Text></TouchableOpacity>
            <Text style={styles.title}>LEAVE REQUESTS</Text>
          </View>
          <Text style={styles.subtitle}>MANAGE TECHNICIAN ABSENCE APPLICATIONS</Text>
        </>
      )}

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView 
          contentContainerStyle={{ paddingBottom: hideHeader ? 0 : 100 }} 
          scrollEnabled={!hideHeader}
        >
          {requests && requests.length > 0 ? requests.map(item => (
            <AppCard key={item._id} style={styles.itemCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.techName}>{item.technicianId?.name || 'Technician'}</Text>
                <Text style={[styles.statusTag, item.status === 'approved' ? styles.statusApproved : item.status === 'rejected' ? styles.statusRejected : styles.statusPending]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
              
              <Text style={[styles.detailText, {color: Colors.text, marginTop: 4}]}>{item.reason}</Text>
              
              <View style={[styles.cardDetails, {marginTop: 10}]}>
                <View>
                  <Text style={styles.detailText}>📅 {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</Text>
                  <Text style={[styles.detailText, {marginTop: 2}]}>Submitted: {new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>

              {item.status === 'pending' && (
                <View style={styles.expenseActions}>
                  <TouchableOpacity 
                    style={styles.approveBtn} 
                    onPress={() => handleUpdateStatus(item._id, 'approved')}
                  >
                    <Text style={styles.btnTextSmall}>APPROVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.rejectBtn} 
                    onPress={() => handleUpdateStatus(item._id, 'rejected')}
                  >
                    <Text style={styles.btnTextSmall}>REJECT</Text>
                  </TouchableOpacity>
                </View>
              )}
            </AppCard>
          )) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No leave requests found.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};





const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  backBtn: { marginRight: 15, padding: 5 },
  backBtnText: { color: Colors.text, fontSize: 24, fontWeight: 'bold' },
  title: { color: Colors.text, fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  subtitle: { color: Colors.mutedText, fontSize: 11, marginBottom: 20, letterSpacing: 1, fontWeight: '700' },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '900', letterSpacing: 1, marginBottom: 15 },
  
  addBtn: { backgroundColor: Colors.accent, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  addBtnText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 1 },

  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: Colors.card, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  actionBtnText: { color: Colors.text, fontWeight: '700', fontSize: 11 },

  searchBox: { padding: 15, borderRadius: 12, marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.border },
  placeholderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  placeholderText: { color: Colors.mutedText, fontSize: 12, textAlign: 'center', marginTop: 10, fontWeight: '700' },
  emptyText: { color: Colors.mutedText, fontSize: 13, textAlign: 'center', fontWeight: '600' },

  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, backgroundColor: Colors.card },
  activeFilter: { backgroundColor: Colors.accent },
  filterText: { color: Colors.mutedText, fontWeight: '700', fontSize: 12 },
  activeFilterText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  processingTimeBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  processingLabel: { color: Colors.mutedText, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  processingValue: { color: Colors.accent, fontSize: 12, fontWeight: '900', fontFamily: 'monospace' },

  statusTabs: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  tagBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  activeTag: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tagText: { color: Colors.mutedText, fontSize: 10, fontWeight: '700' },
  activeTagText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statMiniBox: { flex: 1, backgroundColor: Colors.card, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  miniLabel: { color: Colors.text, fontSize: 20, fontWeight: '900' },
  miniSub: { color: Colors.mutedText, fontSize: 10, fontWeight: '700' },

  itemCard: { padding: 16, marginBottom: 12, borderRadius: 15, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  itemDesc: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  itemAmount: { color: Colors.accent, fontSize: 16, fontWeight: '900' },
  itemDate: { color: Colors.mutedText, fontSize: 11, fontWeight: '700' },
  detailText: { color: Colors.mutedText, fontSize: 12, fontWeight: '600' },

  // Order Pipeline Styles
  orderPipeCard: { 
    padding: 24, 
    marginBottom: 20, 
    borderRadius: 24, 
    backgroundColor: '#0A122A', // Dark navy as per screenshot
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)' 
  },
  orderIdText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  orderDateText: { color: '#8A94AD', fontSize: 12, fontWeight: '600', marginTop: 2 },
  statusPill: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  statusPillText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  orderCustomerText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  orderItemsText: { color: '#8A94AD', fontSize: 14, fontWeight: '600', marginTop: 4 },
  orderFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)'
  },
  orderTotalText: { color: '#2979FF', fontSize: 18, fontWeight: '900' },
  detailsBtn: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  detailsBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },

  // Details Modal Specifics
  detailSection: { marginBottom: 24 },
  detailRow: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  detailLabel: { color: '#8A94AD', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  detailValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  
  modalHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },

  expenseActions: { flexDirection: 'row', gap: 10, marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: Colors.border },
  techName: { color: Colors.text, fontSize: 14, fontWeight: '800' },
  techNameSmall: { color: Colors.text, fontSize: 12, fontWeight: '600' },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 9, fontWeight: '900', overflow: 'hidden' },
  statusApproved: { backgroundColor: 'rgba(0, 230, 118, 0.1)', color: '#00E676' },
  statusPending: { backgroundColor: 'rgba(255, 196, 0, 0.1)', color: '#FFC400' },
  statusAssigned: { backgroundColor: 'rgba(41, 121, 255, 0.1)', color: '#2979FF' },
  statusAvailable: { backgroundColor: 'rgba(0, 230, 118, 0.1)', color: '#00E676' },
  statusOnJob: { backgroundColor: 'rgba(255, 196, 0, 0.1)', color: '#FFC400' },

  orderId: { color: Colors.text, fontSize: 14, fontWeight: '800' },
  customerName: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  categoryText: { color: Colors.mutedText, fontSize: 11, fontWeight: '700' },
  totalText: { color: Colors.accent, fontSize: 14, fontWeight: '700' },

  priceTag: { color: Colors.accent, fontSize: 16, fontWeight: '900' },

  itemComment: { color: Colors.text, fontSize: 13, fontStyle: 'italic', marginTop: 4 },
  
  mapMock: { height: 400, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 15, justifyContent: 'flex-end' },
  liveIndicator: { position: 'absolute', top: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 12 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00E676' },
  liveText: { color: '#00E676', fontSize: 10, fontWeight: '900' },
  
  techMapCard: { backgroundColor: Colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  staleTag: { backgroundColor: 'rgba(255,82,82,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  staleText: { color: '#FF5252', fontSize: 8, fontWeight: '900' },
  coordBox: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  
  assignBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: Colors.accent, alignItems: 'center' },
  assignBtnText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  mapsBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: 'transparent', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  mapsBtnText: { color: Colors.text, fontWeight: '800', fontSize: 11 },

  campaignHeader: { height: 100, backgroundColor: 'rgba(41,121,255,0.1)', padding: 12, justifyContent: 'flex-end' },
  discountTag: { backgroundColor: Colors.accent, color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 10, fontWeight: '900', alignSelf: 'flex-start' },
  campaignFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,230,118,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  trashBtn: { padding: 8 },
  
  menuDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 10 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00E676' },
  vDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 10 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  slotBar: { flexDirection: 'row', gap: 4, marginTop: 12 },
  slotSegment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.05)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  // Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  taskModalContent: { backgroundColor: '#0A1F44', borderRadius: 30, padding: 25, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
  modalCloseBtn: { 
    position: 'absolute', 
    top: 20, 
    right: 20, 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderColor: 'rgba(255,255,255,0.2)', 
    borderWidth: 1,
    zIndex: 999,
    elevation: 5
  },
  modalCloseText: { color: '#fff', fontSize: 18 },
  modalTitleRow: { marginBottom: 25 },
  modalMainTitle: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  modalSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 4 },
  inputLabel: { color: '#fff', fontSize: 10, fontWeight: '800', marginBottom: 8, letterSpacing: 1, marginTop: 15 },
  taskInput: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 15, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 5 },
  formRow: { flexDirection: 'row', gap: 15 },
  selectBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  selectText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  arrowIcon: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
  taskInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingRight: 15 },
  inputIcon: { fontSize: 16, marginLeft: 10 },
  submitTaskBtn: { backgroundColor: Colors.accent, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30, shadowColor: Colors.accent, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  submitTaskText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 2 },
  
  approveBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#00E676', alignItems: 'center' },
  rejectBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#FF5252', alignItems: 'center' },
  btnTextSmall: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  statusRejected: { backgroundColor: 'rgba(255, 82, 82, 0.1)', color: '#FF5252' },

  formGrid: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  formCol: { flex: 1 },
  formLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900', marginBottom: 6, letterSpacing: 1 },
  formInput: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, color: '#fff', fontSize: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontWeight: '700' },
  imageUploadGrid: { flexDirection: 'row', gap: 10 },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.01)' },
  imagePlaceholderText: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '900', marginTop: 4 },
  strategicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  viewBox: { width: '47%', height: 100, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  viewLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900', marginTop: 8 },
  featuresBox: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  featureTag: { backgroundColor: 'rgba(41,121,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  featureTagText: { color: '#2979FF', fontSize: 10, fontWeight: '900' },
  featureInput: { color: '#fff', fontSize: 10, fontWeight: '800' },
  
  // Expense Type Selector
  typeSelectorRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  activeTypeBtn: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  typeBtnText: { color: Colors.mutedText, fontSize: 11, fontWeight: '800' },
  activeTypeBtnText: { color: '#fff' },
});
