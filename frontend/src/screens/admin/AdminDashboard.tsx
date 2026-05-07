import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Dimensions } from 'react-native';
import { orderApi } from '../../api/orderApi';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import Loading from '../../components/Loading';
import AppLogo from '../../components/AppLogo';
import { ExpensesView, OrdersView, TechniciansView, ProductsView, TasksView, AttendanceView, ServiceRequestsView, AvailabilityView, ReviewsView, LiveTrackingView, MarketingHubView, AnnouncementsView, LeaveRequestsView, SalaryView, BillingView } from './AdminSubViews';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../api/notificationApi';

const { width, height } = Dimensions.get('window');

const CATEGORIES = ['Operations', 'HR & Finance', 'Management'];

const MENU_ITEMS = [
  // Operations
  { label: 'Dashboard', icon: '⊞', cat: 'Operations', route: 'AdminDashboard' },
  { label: 'Expenses', icon: '🕒', cat: 'Operations', route: 'Expenses' },
  { label: 'Orders', icon: '🛍️', cat: 'Operations', route: 'OrderManagement' },
  { label: 'Technicians', icon: '👥', cat: 'Operations', route: 'UserManagement' },
  { label: 'Products', icon: '📦', cat: 'Management', route: 'ProductManagement' },
  { label: 'Tasks', icon: '📋', cat: 'Operations', route: 'TaskManagement' },
  { label: 'Attendance', icon: '📈', cat: 'HR & Finance', route: 'Attendance' },
  { label: 'Salary', icon: '💰', cat: 'HR & Finance', route: 'Salary' },
  { label: 'Billing', icon: '🧾', cat: 'HR & Finance', route: 'Billing' },
  { label: 'Leave Requests', icon: '📅', cat: 'HR & Finance', route: 'LeaveRequests' },
  { label: 'Service Requests', icon: '⚒️', cat: 'Operations', route: 'ServiceRequests' },
  { label: 'Availability', icon: '⏰', cat: 'HR & Finance', route: 'Availability' },
  { label: 'Live Tracking', icon: '🛰️', cat: 'Operations', route: 'LiveTracking' },
  { label: 'Reviews', icon: '⭐', cat: 'Management', route: 'Reviews' },
  { label: 'Marketing Hub', icon: '📢', cat: 'Management', route: 'MarketingHub' },
  { label: 'Announcements', icon: '📣', cat: 'Management', route: 'Announcements' },
];


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Operations');
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifVisible, setNotifVisible] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    setMenuVisible(false);
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() },
    ]);
  };

  const handleMenuPress = (view: string) => {
    setCurrentView(view);
    setMenuVisible(false);
  };

  const fetchReports = useCallback(async () => {
    try {
      const res = await orderApi.getReports();
      setData(res.data.data);
    } catch (err) {
      console.log('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationApi.getAll();
      setNotifications(res.data.data);
    } catch (err) {
      console.log('Error fetching notifications:', err);
    }
  }, []);

  useEffect(() => { 
    fetchReports();
    fetchNotifications();
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchReports, fetchNotifications]);

  if (loading) return <Loading />;

  const s = data?.summary || {};

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return (
          <>
            <View style={styles.topContainer}>
              <View style={styles.headerRow}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                  <AppLogo size={32} />
                  <Text style={styles.headerTitle}>SKTECH ADMIN</Text>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.notifBtn} onPress={() => setNotifVisible(true)}>
                    <Text style={styles.notifIcon}>🔔</Text>
                    {notifications.some(n => !n.isRead) && <View style={styles.notifDot} />}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.kebabBtn} onPress={() => setMenuVisible(true)}>
                    <Text style={styles.kebabIcon}>⋮</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <AppCard style={styles.revenueBanner}>
                <Text style={styles.revenueLabel}>TOTAL REVENUE</Text>
                <Text style={styles.revenueValue}>₹{(s.revenue || 0).toLocaleString()}</Text>
              </AppCard>

              {/* Quick Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Active Orders</Text>
                  <Text style={styles.statValue}>{s.activeOrders || 0}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Pending Tasks</Text>
                  <Text style={styles.statValue}>{s.pendingTasks || 0}</Text>
                </View>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Recent Bookings</Text>
              <AppCard style={styles.listCard}>
                <Text style={styles.emptyText}>No recent bookings found.</Text>
              </AppCard>

              <Text style={styles.sectionTitle}>Service Team Status</Text>
              <View style={styles.grid}>
                {[
                  { name: 'Naveen Kumar', status: 'Available', icon: '👤' },
                  { name: 'Ajith S', status: 'On Job', icon: '👤' },
                  { name: 'Praveen P', status: 'Available', icon: '👤' },
                  { name: 'Ganesan R', status: 'Available', icon: '👤' },
                ].map(tech => (
                  <TouchableOpacity key={tech.name} style={styles.cardWrapper}>
                    <AppCard style={styles.menuCardSmall}>
                      <Text style={{fontSize: 24}}>{tech.icon}</Text>
                      <Text style={styles.techNameSmall}>{tech.name}</Text>
                      <Text style={[styles.techStatusSmall, tech.status === 'Available' ? {color: '#00E676'} : {color: '#FFC400'}]}>
                        ● {tech.status}
                      </Text>
                    </AppCard>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Management Modules</Text>
              <View style={styles.grid}>
                {MENU_ITEMS.filter(i => i.cat === 'Management' || i.cat === 'Operations' || i.cat === 'HR & Finance').slice(0, 20).map(item => (
                  <TouchableOpacity key={item.label} style={styles.cardWrapper} onPress={() => handleMenuPress(item.label)}>
                    <AppCard style={styles.menuCard}>
                      <View style={styles.iconCircle}>
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </AppCard>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>
        );
      case 'Salary': return <SalaryView onBack={() => setCurrentView('Dashboard')} />;
      case 'Billing': return <BillingView onBack={() => setCurrentView('Dashboard')} />;
      case 'Expenses': return <ExpensesView onBack={() => setCurrentView('Dashboard')} />;
      case 'Orders': return <OrdersView onBack={() => setCurrentView('Dashboard')} />;
      case 'Technicians': return <TechniciansView onBack={() => setCurrentView('Dashboard')} />;
      case 'Products': return <ProductsView onBack={() => setCurrentView('Dashboard')} />;
      case 'Tasks': return <TasksView onBack={() => setCurrentView('Dashboard')} />;
      case 'Attendance': return <AttendanceView onBack={() => setCurrentView('Dashboard')} />;
      case 'Service Requests': return <ServiceRequestsView onBack={() => setCurrentView('Dashboard')} />;
      case 'Availability': return <AvailabilityView onBack={() => setCurrentView('Dashboard')} />;
      case 'Reviews': return <ReviewsView onBack={() => setCurrentView('Dashboard')} />;
      case 'Live Tracking': return <LiveTrackingView onBack={() => setCurrentView('Dashboard')} />;
      case 'Marketing Hub': return <MarketingHubView onBack={() => setCurrentView('Dashboard')} />;
      case 'Announcements': return <AnnouncementsView onBack={() => setCurrentView('Dashboard')} />;
      case 'Leave Requests': return <LeaveRequestsView onBack={() => setCurrentView('Dashboard')} />;
      default:
        return (
          <View style={styles.placeholderContainer}>
            <TouchableOpacity onPress={() => setCurrentView('Dashboard')} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back to Dashboard</Text>
            </TouchableOpacity>
            <Text style={styles.placeholderText}>{currentView} View Coming Soon</Text>
          </View>
        );
    }
  };

  return (
    <ScreenWrapper padded={false} scrollable={currentView !== 'Dashboard'}>
      {renderContent()}

      {/* Main Menu Drawer-like Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <View style={styles.menuHeaderLeft}>
                <AppLogo size={50} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.menuHeaderTitle}>SKTECH</Text>
                  <Text style={styles.menuHeaderSub}>ENTERPRISE ADMIN</Text>
                </View>
              </View>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.mainMenuLabel}>MAIN MENU</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map((item) => (
                <TouchableOpacity 
                  key={item.label} 
                  style={[
                    styles.drawerItem,
                    currentView === item.label && styles.drawerItemActive
                  ]}
                  onPress={() => handleMenuPress(item.label)}
                >
                  <View style={[
                    styles.drawerIconBox,
                    currentView === item.label && { backgroundColor: 'rgba(255,255,255,0.2)' }
                  ]}>
                    <Text style={styles.drawerIcon}>{item.icon}</Text>
                  </View>
                  <Text style={[
                    styles.drawerLabel,
                    currentView === item.label && styles.drawerLabelActive
                  ]}>{item.label}</Text>
                  {currentView === item.label && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              ))}

              <View style={styles.menuDivider} />
              
              <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
                <View style={styles.drawerIconBox}>
                  <Text style={styles.drawerIcon}>🚪</Text>
                </View>
                <Text style={[styles.drawerLabel, { color: '#FF5252' }]}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={notifVisible}
        onRequestClose={() => setNotifVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setNotifVisible(false)}
        >
          <View style={styles.notifContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>NOTIFICATIONS</Text>
              <TouchableOpacity onPress={() => setNotifVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.length > 0 ? notifications.map(n => (
                <TouchableOpacity 
                  key={n._id} 
                  style={[styles.notifItem, !n.isRead && styles.notifItemUnread]}
                  onPress={async () => {
                    if (!n.isRead) {
                      await notificationApi.markAsRead(n._id);
                      fetchNotifications();
                    }
                  }}
                >
                  <View style={styles.notifIconBox}>
                    <Text style={{fontSize: 16}}>{n.type === 'order' ? '🛍️' : n.type === 'expense' ? '💰' : '🔔'}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.notifItemTitle}>{n.title}</Text>
                    <Text style={styles.notifItemMsg}>{n.message}</Text>
                    <Text style={styles.notifItemTime}>{new Date(n.createdAt).toLocaleTimeString()}</Text>
                  </View>
                  {!n.isRead && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              )) : (
                <View style={{padding: 40, alignItems: 'center'}}>
                  <Text style={styles.emptyText}>No notifications yet.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenWrapper>


  );
};

const styles = StyleSheet.create({
  topContainer: { padding: 20, paddingTop: 10, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  headerSub: { color: Colors.mutedText, fontSize: 13, marginBottom: 20, letterSpacing: 0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: Colors.card, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    borderWidth: 1.5,
    borderColor: Colors.card
  },
  notifIcon: { fontSize: 18 },
  kebabBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  kebabIcon: { color: Colors.text, fontSize: 24, fontWeight: 'bold' },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    width: '85%',
    height: '100%',
    backgroundColor: '#0A122A', // Dark blue background as per screenshot
    padding: 24,
    paddingTop: 60,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  menuHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  menuHeaderSub: {
    color: '#8A94AD',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676', // Bright green for LIVE
  },
  liveText: {
    color: '#00E676',
    fontSize: 10,
    fontWeight: '800',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    opacity: 0.7,
  },
  mainMenuLabel: {
    color: '#8A94AD',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(41,121,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(41,121,255,0.3)',
  },
  drawerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  drawerIcon: {
    fontSize: 20,
  },
  drawerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  drawerLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  statBox: { 
    flex: 1, 
    backgroundColor: Colors.card, 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: Colors.border,
    alignItems: 'center'
  },
  statLabel: { color: Colors.mutedText, fontSize: 11, fontWeight: '700', marginBottom: 4 },
  statValue: { color: Colors.text, fontSize: 24, fontWeight: '900' },
  
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '800', marginBottom: 15, paddingHorizontal: 20 },
  placeholderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  placeholderText: { color: Colors.mutedText, fontSize: 16, textAlign: 'center', marginTop: 20 },
  backLink: { padding: 10 },
  backLinkText: { color: Colors.accent, fontWeight: '700' },

  listCard: { padding: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginHorizontal: 20 },
  emptyText: { color: Colors.mutedText, fontSize: 13, fontStyle: 'italic' },
  
  menuCardSmall: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  techNameSmall: { color: Colors.text, fontSize: 11, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  techStatusSmall: { fontSize: 9, fontWeight: '800', marginTop: 4 },

  revenueBanner: { 
    marginBottom: 24, 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: 'rgba(41,121,255,0.05)',
    borderColor: Colors.accent, 
    borderWidth: 1.5,
    borderRadius: 20
  },
  revenueLabel: { color: Colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  revenueValue: { color: Colors.text, fontSize: 40, fontWeight: '900' },
  
  tabBar: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  tab: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 25, 
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border
  },
  activeTab: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText: { color: Colors.mutedText, fontSize: 12, fontWeight: '700' },
  activeTabText: { color: '#fff' },

  scrollContent: { padding: 20, paddingTop: 10, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 },
  cardWrapper: { width: '47%' },
  menuCard: { 
    padding: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    height: 140,
    backgroundColor: Colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(41,121,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  menuIcon: { fontSize: 24 },
  menuLabel: { color: Colors.text, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  arrowIcon: { position: 'absolute', top: 12, right: 12 },

  // Notifications
  notifContainer: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#0A122A',
    borderRadius: 24,
    padding: 20,
    marginTop: 100,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  notifTitle: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  notifItem: { 
    flexDirection: 'row', 
    gap: 12, 
    padding: 12, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.02)', 
    marginBottom: 8 
  },
  notifItemUnread: { backgroundColor: 'rgba(41,121,255,0.1)' },
  notifIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  notifItemTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  notifItemMsg: { color: Colors.mutedText, fontSize: 12, marginTop: 2 },
  notifItemTime: { color: Colors.mutedText, fontSize: 10, marginTop: 4, fontStyle: 'italic' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent, alignSelf: 'center' },
});

export default AdminDashboard;
