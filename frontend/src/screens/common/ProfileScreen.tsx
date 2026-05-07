import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('LOGOUT', 'Terminate current session?', [
      { text: 'CANCEL', style: 'cancel' },
      { text: 'LOGOUT', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScreenWrapper padded={false}>
      <ScrollView style={styles.container}>
        {/* Header Profile Section */}
        <View style={styles.header}>
           <View style={styles.profileHeaderContent}>
              <View style={styles.avatarContainer}>
                 <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase()}</Text>
                 </View>
                 <TouchableOpacity style={styles.editBadge}>
                    <Text style={styles.editBadgeText}>✎</Text>
                 </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{user?.name || 'TECHNICIAN'}</Text>
              <Text style={styles.userRole}>{user?.role?.toUpperCase() || 'CORE MEMBER'}</Text>
           </View>
        </View>

        <View style={styles.content}>
           {/* General Settings */}
           <Text style={styles.sectionTitle}>COMMAND SETTINGS</Text>
           
           <AppCard style={styles.settingsCard}>
              <View style={styles.settingItem}>
                 <View style={styles.settingInfo}>
                    <Text style={styles.settingIcon}>🌓</Text>
                    <View>
                       <Text style={styles.settingLabel}>DARK / NIGHT MODE</Text>
                       <Text style={styles.settingSub}>Optimize for low-light environments</Text>
                    </View>
                 </View>
                 <Switch 
                   value={isDarkMode} 
                   onValueChange={setIsDarkMode}
                   trackColor={{ false: '#333', true: Colors.accent }}
                   thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                 />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                 <View style={styles.settingInfo}>
                    <Text style={styles.settingIcon}>🔔</Text>
                    <View>
                       <Text style={styles.settingLabel}>SECURITY ALERTS</Text>
                       <Text style={styles.settingSub}>Critical infrastructure notifications</Text>
                    </View>
                 </View>
                 <Switch 
                   value={isNotificationsEnabled} 
                   onValueChange={setIsNotificationsEnabled}
                   trackColor={{ false: '#333', true: Colors.accent }}
                   thumbColor={isNotificationsEnabled ? '#fff' : '#f4f3f4'}
                 />
              </View>
           </AppCard>

           {/* Personal Intelligence */}
           <Text style={styles.sectionTitle}>IDENTITY DATA</Text>
           <AppCard style={styles.settingsCard}>
              <View style={styles.dataRow}>
                 <Text style={styles.dataLabel}>IDENTIFIER</Text>
                 <Text style={styles.dataValue}>{user?.email}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.dataRow}>
                 <Text style={styles.dataLabel}>COMMUNICATION</Text>
                 <Text style={styles.dataValue}>{user?.phone || '+91 98765 43210'}</Text>
              </View>
           </AppCard>

           <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>TERMINATE SESSION</Text>
           </TouchableOpacity>

           <Text style={styles.version}>SK TECHNOLOGY COMMAND CENTER v2.4.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020817' },
  header: { 
    paddingTop: 60, 
    paddingBottom: 40, 
    backgroundColor: 'rgba(41,121,255,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  profileHeaderContent: { alignItems: 'center' },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: Colors.accent, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  avatarText: { color: '#fff', fontSize: 48, fontWeight: '900' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  editBadgeText: { fontSize: 18, color: '#000' },
  userName: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  userRole: { color: Colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginTop: 4 },
  
  content: { padding: 25 },
  sectionTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: '900', letterSpacing: 1.5, marginBottom: 15, marginTop: 10 },
  settingsCard: { padding: 0, marginBottom: 25, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  settingIcon: { fontSize: 24 },
  settingLabel: { color: '#fff', fontSize: 14, fontWeight: '800' },
  settingSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },
  
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 20 },
  
  dataRow: { padding: 20 },
  dataLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', marginBottom: 5 },
  dataValue: { color: '#fff', fontSize: 14, fontWeight: '700' },
  
  logoutBtn: { 
    backgroundColor: 'rgba(255,59,48,0.1)', 
    paddingVertical: 20, 
    borderRadius: 18, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(255,59,48,0.2)',
    marginTop: 20
  },
  logoutBtnText: { color: '#FF3B30', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  version: { color: 'rgba(255,255,255,0.1)', fontSize: 10, textAlign: 'center', marginTop: 40, fontWeight: '700' }
});

export default ProfileScreen;
