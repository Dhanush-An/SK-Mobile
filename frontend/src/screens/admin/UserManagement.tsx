import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';

const UserManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState([
    { id: '1', name: 'AJITH S', email: 'ajith@sktech.com', phone: '9940252983', role: 'CUSTOMER', date: '20 May 2024', status: 'Active' },
    { id: '2', name: 'NAVEEN KUMAR', email: 'naveen@sktech.com', phone: '8870624512', role: 'TECHNICIAN', date: '18 May 2024', status: 'Active' },
    { id: '3', name: 'POOVASARAN P', email: 'poovarasan@gmail.com', phone: '7760541236', role: 'CUSTOMER', date: '15 May 2024', status: 'Inactive' },
  ]);

  const handleManagePress = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const updateStatus = (status: 'Active' | 'Inactive') => {
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status } : u));
    setModalVisible(false);
    Alert.alert('System Update', `${selectedUser.name} is now ${status.toUpperCase()}.`);
  };

  const deleteUser = () => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${selectedUser.name}? This action is irreversible.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'DELETE', 
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setModalVisible(false);
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>USER MANAGEMENT</Text>
          <Text style={styles.subtitle}>MANAGE ALL REGISTERED CLIENTS & STAFF</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{users.length}</Text>
            <Text style={styles.statSub}>TOTAL USERS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>12</Text>
            <Text style={styles.statSub}>NEW TODAY</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>

        {/* User List */}
        <ScrollView contentContainerStyle={styles.listContent}>
          {users.map(user => (
            <AppCard key={user.id} style={styles.userCard}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: user.status === 'Active' ? '#00E676' : '#FF5252' }]} />
                  </View>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={[styles.roleBadge, user.role === 'TECHNICIAN' ? styles.techBadge : styles.custBadge]}>
                  <Text style={styles.roleText}>{user.role}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.cardBottom}>
                <Text style={styles.detailText}>📞 {user.phone}</Text>
                <Text style={styles.detailText}>📅 {user.date}</Text>
                <TouchableOpacity 
                  style={styles.manageBtn}
                  onPress={() => handleManagePress(user)}
                >
                  <Text style={styles.manageBtnText}>MANAGE</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          ))}
        </ScrollView>

        {/* Manage Modal */}
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
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Manage <Text style={{color: Colors.accent}}>{selectedUser?.name}</Text></Text>
                <Text style={styles.modalSubtitle}>ACCOUNT CONTROL PANEL</Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.actionOption, selectedUser?.status === 'Active' && styles.activeOption]}
                  onPress={() => updateStatus('Active')}
                >
                  <Text style={styles.actionIcon}>✅</Text>
                  <View>
                    <Text style={styles.actionLabel}>SET ACTIVE</Text>
                    <Text style={styles.actionDesc}>Enable all platform features</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionOption, selectedUser?.status === 'Inactive' && styles.inactiveOption]}
                  onPress={() => updateStatus('Inactive')}
                >
                  <Text style={styles.actionIcon}>🚫</Text>
                  <View>
                    <Text style={styles.actionLabel}>SET INACTIVE</Text>
                    <Text style={styles.actionDesc}>Restrict account access temporarily</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.modalDivider} />

                <TouchableOpacity 
                  style={[styles.actionOption, styles.deleteOption]}
                  onPress={deleteUser}
                >
                  <Text style={styles.actionIcon}>🗑️</Text>
                  <View>
                    <Text style={[styles.actionLabel, {color: '#FF5252'}]}>DELETE USER</Text>
                    <Text style={styles.actionDesc}>Permanently remove from system</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.closeModalBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, paddingTop: 40 },
  header: { marginBottom: 25 },
  title: { color: Colors.text, fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: Colors.mutedText, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 4 },
  
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statBox: { flex: 1, backgroundColor: Colors.card, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  statLabel: { color: Colors.text, fontSize: 22, fontWeight: '900' },
  statSub: { color: Colors.mutedText, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  
  searchContainer: { marginBottom: 20 },
  searchInput: { backgroundColor: Colors.card, borderRadius: 15, padding: 15, color: '#fff', borderWidth: 1, borderColor: Colors.border, fontSize: 14 },
  
  listContent: { paddingBottom: 100 },
  userCard: { marginBottom: 15, padding: 15 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 45, height: 45, borderRadius: 23, backgroundColor: 'rgba(41,121,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.accent },
  avatarText: { color: Colors.accent, fontSize: 18, fontWeight: '900' },
  userInfo: { flex: 1, marginLeft: 15 },
  userName: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  userEmail: { color: Colors.mutedText, fontSize: 12, fontWeight: '600' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  techBadge: { backgroundColor: 'rgba(255, 196, 0, 0.1)' },
  custBadge: { backgroundColor: 'rgba(41, 121, 255, 0.1)' },
  roleText: { color: Colors.text, fontSize: 9, fontWeight: '900' },
  
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 15 },
  
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailText: { color: Colors.mutedText, fontSize: 11, fontWeight: '600' },
  manageBtn: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  manageBtnText: { color: Colors.text, fontSize: 10, fontWeight: '800' },

  // Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0A122A', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { marginBottom: 25 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  modalSubtitle: { color: Colors.mutedText, fontSize: 9, fontWeight: '800', letterSpacing: 2, marginTop: 4 },
  
  modalActions: { gap: 12 },
  actionOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 16, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)' 
  },
  activeOption: { borderColor: '#00E676', backgroundColor: 'rgba(0,230,118,0.05)' },
  inactiveOption: { borderColor: '#FF5252', backgroundColor: 'rgba(255,82,82,0.05)' },
  deleteOption: { marginTop: 8 },
  
  actionIcon: { fontSize: 20, marginRight: 15 },
  actionLabel: { color: '#fff', fontSize: 13, fontWeight: '800' },
  actionDesc: { color: Colors.mutedText, fontSize: 10, fontWeight: '600', marginTop: 2 },
  
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 8 },
  
  closeModalBtn: { marginTop: 25, padding: 15, alignItems: 'center' },
  closeModalText: { color: Colors.mutedText, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
});

export default UserManagement;
