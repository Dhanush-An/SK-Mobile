import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated, Dimensions, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { orderApi } from '../../api/orderApi';
import { expenseApi } from '../../api/expenseApi';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { leaveApi } from '../../api/leaveApi';
import { trackingApi } from '../../api/trackingApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import Loading from '../../components/Loading';

const { width, height } = Dimensions.get('window');

const TechnicianDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ income: 0, rating: 4.9, success: 0, load: '18m' });
  const [tasks, setTasks] = useState([
    { id: 'T-1024', title: 'AC System Diagnostics', client: 'Global Corp', location: 'Zone 7', priority: 'URGENT', status: 'PENDING' },
    { id: 'T-1089', title: 'Power Grid Calibration', client: 'Neo Link', location: 'Sector 4', priority: 'STANDARD', status: 'IN_PROGRESS' },
  ]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notiVisible, setNotiVisible] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [activeView, setActiveView] = useState('tasks');
  const [attendanceHistory, setAttendanceHistory] = useState([
    { date: '2026-05-05', punchIn: '09:00 AM', punchOut: '06:00 PM', duration: '09:00:00', status: 'PRESENT' },
    { date: '2026-05-04', punchIn: '08:55 AM', punchOut: '06:05 PM', duration: '09:10:00', status: 'PRESENT' },
    { date: '2026-05-03', punchIn: '09:10 AM', punchOut: '05:50 PM', duration: '08:40:00', status: 'PRESENT' },
  ]);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'NEW SAFETY PROTOCOL', content: 'ALL TECHNICIANS MUST WEAR GRADE-4 SAFETY HELMETS ON SITE.', date: '2026-05-06', priority: 'HIGH' },
    { id: 2, title: 'SOFTWARE UPDATE', content: 'VERSION 2.4.0 OF COMMAND CENTER IS NOW LIVE. RESTART APP TO APPLY.', date: '2026-05-04', priority: 'NORMAL' },
    { id: 3, title: 'WEEKLY MEETING', content: 'ALL HANDS MEETING ON FRIDAY AT 10:00 AM IN THE CONFERENCE ROOM.', date: '2026-05-03', priority: 'MEDIUM' },
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'TASK ASSIGNED', message: 'T-1024 HAS BEEN ASSIGNED TO YOU.', time: '2h ago', isRead: false },
    { id: 2, title: 'PAYMENT RECEIVED', message: 'YOUR INCENTIVE FOR PROJECT X HAS BEEN CREDITED.', time: '5h ago', isRead: true },
    { id: 3, title: 'LEAVE APPROVED', message: 'YOUR LEAVE REQUEST FOR NEXT MONDAY IS APPROVED.', time: '1d ago', isRead: true },
  ]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'CENTRAL COMMAND ONLINE. STANDBY FOR BRIEFING.', sender: 'ADMIN', time: '10:00 AM' },
    { id: 2, text: 'REQUESTING STATUS UPDATE ON PROJECT T-1024.', sender: 'ADMIN', time: '10:05 AM' },
  ]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskSeconds, setTaskSeconds] = useState(0);
  const [location, setLocation] = useState({ latitude: 12.9716, longitude: 77.5946 }); // Bangalore default

  // Tracking Simulation
  useEffect(() => {
    let interval: any;
    if (activeTaskId) {
      interval = setInterval(() => {
        // Move slightly to simulate movement
        setLocation(prev => ({
          latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        }));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTaskId]);

  useEffect(() => {
    if (activeTaskId) {
      trackingApi.updateLocation(location.latitude, location.longitude, activeTaskId);
    }
  }, [location, activeTaskId]);

  const [salaryLogs, setSalaryLogs] = useState([
    { id: 1, date: 'APRIL 26, 2026', hours: '0 hrs', earnings: '₹0', type: 'SUNDAY_AUTO' },
    { id: 2, date: 'APRIL 19, 2026', hours: '0 hrs', earnings: '₹0', type: 'SUNDAY_AUTO' },
    { id: 3, date: 'APRIL 12, 2026', hours: '0 hrs', earnings: '₹0', type: 'SUNDAY_AUTO' },
  ]);
  const [claims, setClaims] = useState<any[]>([]);
  const [isClaimFormVisible, setIsClaimFormVisible] = useState(false);
  const [claimCategory, setClaimCategory] = useState('TRAVEL');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  
  // Leave Form State
  const [isLeaveFormVisible, setIsLeaveFormVisible] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState(new Date());
  const [leaveEndDate, setLeaveEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [submittingLeave, setSubmittingLeave] = useState(false);

  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const fetchMyLeaves = useCallback(async () => {
    try {
      const res = await leaveApi.getAll();
      // Filter for current tech
      const filtered = res.data.data.filter((l: any) => 
        l.technicianId?._id === user?._id || l.technicianId === user?._id
      );
      setMyLeaves(filtered);
    } catch (err) {
      console.log('Error fetching my leaves:', err);
    }
  }, [user?._id]);

  useEffect(() => {
    if (activeView === 'leave_hub') fetchMyLeaves();
  }, [activeView, fetchMyLeaves]);

  const deleteSalaryLog = (id: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this operational log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            setSalaryLogs(prev => prev.filter(log => log.id !== id));
            Alert.alert('Success', 'Log removed from signal history.');
          }
        }
      ]
    );
  };

  const handleSubmitClaim = async () => {
    if (!claimAmount || !claimDescription) {
      Alert.alert('ERROR', 'PLEASE COMPLETE ALL FIELDS');
      return;
    }
    try {
      const response = await expenseApi.create({
        description: `[${claimCategory}] ${claimDescription}`,
        amount: Number(claimAmount),
        date: new Date()
      });
      if (response.data.success) {
        setClaims([response.data.data, ...claims]);
        setIsClaimFormVisible(false);
        setClaimAmount('');
        setClaimDescription('');
        Alert.alert('SUCCESS', 'CLAIM TRANSMITTED TO HQ');
      }
    } catch (error) {
      Alert.alert('ERROR', 'COULD NOT TRANSMIT CLAIM');
    }
  };

  const deleteClaim = (id: number) => {
    Alert.alert(
      'DELETE CLAIM',
      'REMOVE THIS RECORD FROM FINANCIAL LOGS?',
      [
        { text: 'CANCEL', style: 'cancel' },
        { 
          text: 'DELETE', 
          style: 'destructive', 
          onPress: () => {
            setClaims(prev => prev.filter(c => c.id !== id));
          }
        }
      ]
    );
  };

  const handleSubmitLeave = async () => {
    if (!leaveReason) {
      Alert.alert('ERROR', 'PLEASE SPECIFY REASON FOR LEAVE');
      return;
    }
    try {
      setSubmittingLeave(true);
      const res = await leaveApi.apply({
        reason: leaveReason,
        startDate: leaveStartDate,
        endDate: leaveEndDate
      });
      if (res.data.success) {
        setIsLeaveFormVisible(false);
        setLeaveReason('');
        fetchMyLeaves();
        Alert.alert('SUCCESS', 'LEAVE APPLICATION TRANSMITTED');
      }
    } catch (error) {
      Alert.alert('ERROR', 'COULD NOT TRANSMIT APPLICATION');
    } finally {
      setSubmittingLeave(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'TECH',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleAttachPress = () => {
    Alert.alert(
      'ATTACH SIGNAL',
      'SELECT MEDIA TYPE TO TRANSMIT TO HQ',
      [
        {
          text: '📸 CAMERA',
          onPress: async () => {
            try {
              const result = await launchCamera({ mediaType: 'photo', quality: 0.6 });
              if (result.assets && result.assets[0].uri) {
                const newMessage = {
                  id: messages.length + 1,
                  text: '📎 ATTACHED PHOTO',
                  image: result.assets[0].uri,
                  sender: 'TECH',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newMessage]);
              }
            } catch (err) {
              Alert.alert('Error', 'Camera transmission failed');
            }
          }
        },
        {
          text: '🖼️ GALLERY',
          onPress: async () => {
            try {
              const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.6 });
              if (result.assets && result.assets[0].uri) {
                const newMessage = {
                  id: messages.length + 1,
                  text: '📎 ATTACHED PHOTO',
                  image: result.assets[0].uri,
                  sender: 'TECH',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newMessage]);
              }
            } catch (err) {
              Alert.alert('Error', 'Library access failed');
            }
          }
        },
        { text: 'CANCEL', style: 'cancel' }
      ]
    );
  };

  const handlePhotoPress = () => {
    Alert.alert(
      'PROFILE PHOTO',
      'CHOOSE AN OPTION TO UPDATE YOUR SIGNAL AVATAR',
      [
        {
          text: '📸 TAKE PHOTO',
          onPress: async () => {
            try {
              const result = await launchCamera({ mediaType: 'photo', quality: 0.8, includeBase64: false });
              if (result.assets && result.assets[0].uri) {
                setProfileImage(result.assets[0].uri);
              }
            } catch (err) {
              Alert.alert('Error', 'Camera access failed');
            }
          }
        },
        {
          text: '🖼️ CHOOSE FROM GALLERY',
          onPress: async () => {
            try {
              const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
              if (result.assets && result.assets[0].uri) {
                setProfileImage(result.assets[0].uri);
              }
            } catch (err) {
              Alert.alert('Error', 'Gallery access failed');
            }
          }
        },
        { text: 'CANCEL', style: 'cancel' }
      ]
    );
  };

  const sidebarAnim = React.useRef(new Animated.Value(-width)).current;

  const handleNotiPress = (item: any) => {
    setNotiVisible(false);
    const title = item.title.toUpperCase();
    if (title.includes('TASK')) {
      setActiveView('tasks');
    } else if (title.includes('PAYMENT') || title.includes('EARNING')) {
      setActiveView('earnings');
    } else if (title.includes('LEAVE') || title.includes('ATTENDANCE')) {
      setActiveView('attendance');
    }
  };

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: menuVisible ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);

  const fetchStats = useCallback(async () => {
    try {
      const expenseRes = await expenseApi.getAll();
      if (expenseRes.data.success) {
        setClaims(expenseRes.data.data);
      }
      // Simulate fetching detailed telemetry
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 800);
    } catch (err) {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setShiftSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn]);

  useEffect(() => {
    let interval: any;
    if (activeTaskId) {
      interval = setInterval(() => {
        setTaskSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeTaskId]);


  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePunchToggle = () => {
    if (isPunchedIn) {
      // Punching Out
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];
      const duration = formatTime(shiftSeconds);
      
      const newEntry = {
        date: dateStr,
        punchIn: '09:00 AM', // Simplified for demo
        punchOut: timeStr,
        duration: duration,
        status: 'PRESENT'
      };
      
      setAttendanceHistory([newEntry, ...attendanceHistory]);
    } else {
      // Punching In
      setShiftSeconds(0);
    }
    setIsPunchedIn(!isPunchedIn);
  };

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return <Loading />;

  const renderTasks = () => (
    <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
      <View style={styles.viewHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.activeOpsBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.activeOpsText}>ACTIVE OPERATIONS</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={styles.largeTitle}>ASSIGNED <Text style={{ color: '#2979FF' }}>TASKS</Text></Text>
            <View style={styles.taskCountBadge}>
              <Text style={styles.taskCountText}>{tasks.length}</Text>
            </View>
          </View>
          <Text style={styles.viewSubtitle}>CURRENT MISSION DIRECTIVES</Text>
        </View>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.tableEmpty}>
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={styles.emptyText}>NO TASKS ASSIGNED</Text>
        </View>
      ) : (
        tasks.map((task, i) => (
          <AppCard key={i} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <View>
                <Text style={styles.taskId}>{task.id}</Text>
                <Text style={styles.taskTitle}>{task.title}</Text>
              </View>
              <View style={[styles.priorityBadge, { borderColor: task.priority === 'URGENT' ? '#FF5252' : '#2979FF' }]}>
                <Text style={[styles.priorityText, { color: task.priority === 'URGENT' ? '#FF5252' : '#2979FF' }]}>{task.priority}</Text>
              </View>
            </View>
            
            <View style={styles.taskDetails}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>CLIENT</Text>
                <Text style={styles.detailValue}>{task.client}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>LOCATION</Text>
                <Text style={styles.detailValue}>{task.location}</Text>
              </View>
            </View>

            <View style={styles.hDivider} />

            <View style={styles.taskFooter}>
              <View>
                <Text style={styles.detailLabel}>MISSION DURATION</Text>
                <Text style={[styles.detailValue, activeTaskId === task.id && { color: '#00E676' }]}>
                  {activeTaskId === task.id ? formatTime(taskSeconds) : '00:00:00'}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.startMissionBtn, activeTaskId === task.id && { backgroundColor: '#FF5252' }]}
                onPress={() => {
                  if (activeTaskId === task.id) {
                    setActiveTaskId(null);
                    Alert.alert('Mission Suspended', 'Final report and duration signal broadcasted to HQ.');
                  } else {
                    setActiveTaskId(task.id);
                    setTaskSeconds(0);
                    Alert.alert('Mission Active', 'Operational timer started. Monitoring signal established.');
                  }
                }}
              >
                <Text style={styles.startMissionText}>
                  {activeTaskId === task.id ? 'FINISH MISSION' : 'START MISSION'}
                </Text>
              </TouchableOpacity>
            </View>
          </AppCard>
        ))
      )}
    </View>
  );

  const renderDashboard = () => (
    <>
      <View style={styles.telemetryHeader}>
        <View>
          <View style={styles.connectionStatus}>
            <View style={styles.pulseDot} />
            <Text style={styles.connectionText}>TERMINAL CONNECTION ACTIVE</Text>
          </View>
          <Text style={styles.boardTitle} adjustsFontSizeToFit numberOfLines={1}>SERVICE <Text style={{ color: Colors.accent }}>BOARD</Text></Text>
          <Text style={styles.boardSubtitle}>Task Management & Schedule</Text>
        </View>

        <View style={styles.punchSection}>
          <View style={styles.punchRow}>
            <View style={styles.punchInfo}>
              <Text style={styles.punchLabel}>STATUS</Text>
              <View style={[styles.statusBadge, { backgroundColor: isPunchedIn ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)' }]}>
                <View style={[styles.statusDot, { backgroundColor: isPunchedIn ? '#00E676' : '#FF5252' }]} />
                <Text style={[styles.statusText, { color: isPunchedIn ? '#00E676' : '#FF5252' }]}>{isPunchedIn ? 'ONLINE' : 'OFFLINE'}</Text>
              </View>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.punchInfo}>
              <Text style={styles.punchLabel}>SHIFT</Text>
              <Text style={styles.timerText}>{formatTime(shiftSeconds)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.punchBtn, isPunchedIn && styles.punchBtnOut]} 
              onPress={handlePunchToggle}
            >
              <Text style={styles.punchBtnText}>{isPunchedIn ? 'PUNCH OUT' : 'PUNCH IN'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.analyticsGrid}>
        <AppCard style={styles.analyticsCard}>
          <View style={styles.analyticsIconBox}><Text style={styles.analyticsIcon}>₹</Text></View>
          <Text style={styles.analyticsLabel}>INCOME</Text>
          <Text style={styles.analyticsValue}>₹{stats.income}</Text>
        </AppCard>
        <AppCard style={styles.analyticsCard}>
          <View style={[styles.analyticsIconBox, { borderColor: '#FFC400' }]}><Text style={[styles.analyticsIcon, { color: '#FFC400' }]}>⭐</Text></View>
          <Text style={styles.analyticsLabel}>RATING</Text>
          <Text style={styles.analyticsValue}>{stats.rating}/5</Text>
        </AppCard>
        <AppCard style={styles.analyticsCard}>
          <View style={[styles.analyticsIconBox, { borderColor: '#2979FF' }]}><Text style={[styles.analyticsIcon, { color: '#2979FF' }]}>🛡️</Text></View>
          <Text style={styles.analyticsLabel}>SUCCESS</Text>
          <Text style={styles.analyticsValue}>{stats.success}</Text>
        </AppCard>
        <AppCard style={styles.analyticsCard}>
          <View style={[styles.analyticsIconBox, { borderColor: '#D500F9' }]}><Text style={[styles.analyticsIcon, { color: '#D500F9' }]}>⚡</Text></View>
          <Text style={styles.analyticsLabel}>LOAD</Text>
          <Text style={styles.analyticsValue}>{stats.load}</Text>
        </AppCard>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>📈 PRODUCTIVITY MATRIX</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>SYSTEM_SYNC</Text>
        </View>
      </View>
      <AppCard style={styles.productivityCard}>
        <View style={styles.prodRow}>
          <View>
            <Text style={styles.prodLabel}>AVG RESPONSE</Text>
            <Text style={styles.prodValue}>12.4m</Text>
          </View>
          <View style={styles.vDivider} />
          <View>
            <Text style={styles.prodLabel}>COMPLETION</Text>
            <Text style={styles.prodValue}>98.2%</Text>
          </View>
        </View>
        <View style={styles.prodPlaceholder}>
          <Text style={styles.prodPlaceholderText}>NO SESSIONS LOGGED</Text>
        </View>
      </AppCard>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>📋 MISSION DIRECTIVES</Text>
        <Text style={styles.sideNote}>0 ASSIGNED</Text>
      </View>
      <View style={styles.directiveContainer}>
        <Text style={styles.directiveText}>NO SYSTEM DIRECTIVES ISSUED</Text>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>📡 CENTER COMMAND</Text>
      </View>
      <AppCard style={styles.commandCard}>
        <View style={styles.commandHeader}>
          <Text style={styles.commandTitle}>Real-time Operations Log</Text>
          <View style={styles.liveBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>LIVE SIGNAL</Text>
          </View>
        </View>
        <View style={styles.commandContent}>
          <Text style={styles.commandPlaceholder}>No operational logs found</Text>
        </View>
      </AppCard>
    </>
  );

  const renderExpenses = () => (
    <View style={{ padding: 20 }}>
      <View style={[styles.viewHeader, { alignItems: 'center' }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <View style={styles.statusBadgeSmall}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusTextSmall}>FINANCIAL PORTAL</Text>
          </View>
          <Text style={styles.largeTitle} adjustsFontSizeToFit numberOfLines={1}>FIELD <Text style={{ color: Colors.accent }}>EXPENSES</Text></Text>
          <Text style={styles.viewSubtitle}>SUBMIT CLAIMS & REIMBURSEMENTS</Text>
        </View>
        {!isClaimFormVisible && (
          <TouchableOpacity 
            style={styles.actionBtnPrimary} 
            onPress={() => setIsClaimFormVisible(true)}
          >
            <Text style={styles.actionBtnIcon}>+</Text>
            <Text style={styles.actionBtnText}>NEW CLAIM</Text>
          </TouchableOpacity>
        )}
      </View>

      {isClaimFormVisible && (
        <AppCard style={styles.claimFormCard}>
          <View style={styles.formRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CATEGORY</Text>
              <View style={styles.pickerContainer}>
                <TextInput 
                  value={claimCategory}
                  onChangeText={setClaimCategory}
                  style={styles.formInput}
                  placeholder="CATEGORY..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.inputLabel}>AMOUNT (INR)</Text>
              <TextInput 
                value={claimAmount}
                onChangeText={setClaimAmount}
                style={styles.formInput}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.2)"
              />
            </View>
          </View>
          <View style={{ marginTop: 15 }}>
            <Text style={styles.inputLabel}>DESCRIPTION</Text>
            <TextInput 
              value={claimDescription}
              onChangeText={setClaimDescription}
              style={[styles.formInput, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
              multiline
              placeholder="Purpose of claim..."
              placeholderTextColor="rgba(255,255,255,0.2)"
            />
          </View>
          <View style={styles.formActions}>
            <TouchableOpacity onPress={() => setIsClaimFormVisible(false)}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitClaimBtn} onPress={handleSubmitClaim}>
              <Text style={styles.submitClaimText}>SUBMIT CLAIM</Text>
            </TouchableOpacity>
          </View>
        </AppCard>
      )}

      <AppCard style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHead, { flex: 3 }]} numberOfLines={1}>SERVICE DETAILS</Text>
          <Text style={[styles.tableHead, { flex: 1.8 }]} numberOfLines={1}>CATEGORY</Text>
          <Text style={[styles.tableHead, { flex: 1.2 }]} numberOfLines={1}>DATE</Text>
          <Text style={[styles.tableHead, { flex: 1.2 }]} numberOfLines={1}>AMOUNT</Text>
          <Text style={[styles.tableHead, { flex: 1 }]} numberOfLines={1}>STATUS</Text>
        </View>
        {claims.length > 0 ? (
          claims.map((claim) => (
            <View key={claim._id || claim.id} style={styles.logItem}>
              <Text style={[styles.logDate, { flex: 3, fontSize: 10 }]} numberOfLines={1}>{claim.description}</Text>
              <Text style={[styles.logHours, { flex: 1.8, fontSize: 10 }]}>{claim.category || 'GENERAL'}</Text>
              <Text style={[styles.logDate, { flex: 1.2, fontSize: 10 }]}>{new Date(claim.date).toLocaleDateString()}</Text>
              <Text style={[styles.logEarnings, { flex: 1.2, fontSize: 10 }]}>₹{claim.amount}</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                 <View style={[styles.statusMiniBadge, { 
                   backgroundColor: claim.status === 'approved' ? 'rgba(0,230,118,0.1)' : 
                                    claim.status === 'rejected' ? 'rgba(255,82,82,0.1)' : 
                                    'rgba(255,196,0,0.1)' 
                 }]}>
                    <Text style={[styles.statusMiniText, { 
                      color: claim.status === 'approved' ? '#00E676' : 
                             claim.status === 'rejected' ? '#FF5252' : 
                             '#FFC400' 
                    }]}>{claim.status?.toUpperCase()}</Text>
                 </View>
                 <TouchableOpacity onPress={() => deleteClaim(claim._id || claim.id)}>
                   <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>✕</Text>
                 </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.tableEmpty}>
            <Text style={styles.emptyIcon}>₹</Text>
            <Text style={styles.emptyText}>NO CLAIMS REGISTERED</Text>
          </View>
        )}
      </AppCard>
    </View>
  );

  const renderEarnings = () => (
    <View style={{ padding: 20 }}>
      <View style={[styles.viewHeader, { alignItems: 'center' }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <View style={styles.statusBadgeSmall}>
            <Text style={styles.statusTextSmall}>ENTERPRISE WAGE MATRIX</Text>
          </View>
          <Text style={styles.largeTitle} adjustsFontSizeToFit numberOfLines={1}>SALARY <Text style={{ color: Colors.accent }}>REPORT</Text></Text>
          <Text style={styles.viewSubtitle}>AUTOMATED DAILY EARNINGS TRACKING</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.actionBtnOutline}>
            <Text style={styles.actionBtnText}>EXPORT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnPrimary}>
            <Text style={styles.actionBtnText}>LOG HOURS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.salaryStatsRow}>
        <AppCard style={styles.salaryStatCard}>
          <Text style={styles.salaryStatLabel}>TODAY</Text>
          <Text style={styles.salaryStatValue}>₹0</Text>
          <Text style={styles.salaryStatSub}>0 hrs</Text>
        </AppCard>
        <AppCard style={styles.salaryStatCard}>
          <Text style={styles.salaryStatLabel}>THIS WEEK</Text>
          <Text style={[styles.salaryStatValue, { color: '#00E676' }]}>₹0</Text>
          <Text style={styles.salaryStatSub}>0 hrs</Text>
        </AppCard>
        <AppCard style={styles.salaryStatCard}>
          <Text style={styles.salaryStatLabel}>THIS MONTH</Text>
          <Text style={[styles.salaryStatValue, { color: '#D500F9' }]}>₹0</Text>
          <Text style={styles.salaryStatSub}>0 hrs</Text>
        </AppCard>
      </View>

      <View style={styles.chartsRow}>
        <AppCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>📈 EARNINGS TREND</Text>
          <View style={styles.chartPlaceholder}>
             <View style={styles.gridLine} />
             <View style={styles.gridLine} />
             <View style={styles.gridLine} />
          </View>
        </AppCard>
        <AppCard style={styles.chartCard}>
          <Text style={styles.chartTitle}>⌛ WORKLOAD BALANCE</Text>
          <View style={styles.chartPlaceholder}>
             <View style={styles.gridLine} />
             <View style={styles.workloadLine} />
          </View>
        </AppCard>
      </View>

      <AppCard style={styles.tableCard}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableTitle}>OPERATION LOG HISTORY</Text>
          <View style={styles.logBadge}><Text style={styles.logBadgeText}>LAST 30 CYCLES</Text></View>
        </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHead, { flex: 1.5 }]} numberOfLines={1}>DATE</Text>
          <Text style={[styles.tableHead, { flex: 1 }]} numberOfLines={1}>HOURS</Text>
          <Text style={[styles.tableHead, { flex: 1 }]} numberOfLines={1}>EARNINGS</Text>
          <Text style={[styles.tableHead, { flex: 1.2 }]} numberOfLines={1}>TYPE</Text>
          <Text style={[styles.tableHead, { flex: 1 }]} numberOfLines={1}>ACTIONS</Text>
        </View>
        {salaryLogs.map((log) => (
          <View key={log.id} style={styles.logItem}>
            <Text style={[styles.logDate, { flex: 1.5 }]}>{log.date}</Text>
            <Text style={[styles.logHours, { flex: 1 }]}>{log.hours}</Text>
            <Text style={[styles.logEarnings, { flex: 1 }]}>{log.earnings}</Text>
            <View style={[styles.typeBadge, { flex: 1.2 }]}><Text style={styles.typeText}>{log.type}</Text></View>
            <View style={{ flex: 1, flexDirection: 'row', gap: 15, justifyContent: 'flex-start', paddingLeft: 10 }}>
              <TouchableOpacity onPress={() => Alert.alert('Information', 'Log modification protocol required. Please contact supervisor.')}>
                <Text style={{ color: 'rgba(255,255,255,0.4)' }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteSalaryLog(log.id)}>
                <Text style={{ color: 'rgba(255,255,255,0.4)' }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {salaryLogs.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={styles.emptyChatSub}>NO SIGNAL HISTORY LOGGED</Text>
          </View>
        )}
      </AppCard>
    </View>
  );

  const renderProfile = () => (
    <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
      <View style={{ flexDirection: 'column', gap: 15 }}>
        <AppCard style={styles.profileSummaryCard}>
          <View style={styles.profileAvatarBox}>
            <View style={styles.profileAvatar}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={{ fontSize: 40, color: 'rgba(255,255,255,0.1)' }}>👤</Text>
              )}
            </View>
            <TouchableOpacity style={styles.cameraBtn} onPress={handlePhotoPress}>
              <Text style={{ color: '#fff' }}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user?.name || 'DEFAULT TECHNICIAN'}</Text>
          <Text style={styles.profileRole}>TECHNICIAN</Text>
          <View style={styles.hDivider} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.profileStatVal}>5.0</Text>
              <Text style={styles.profileStatLab}>EFFICIENCY</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.profileStatVal}>0</Text>
              <Text style={styles.profileStatLab}>DEPLOYMENTS</Text>
            </View>
          </View>
        </AppCard>

        <AppCard style={styles.profileIntelCard}>
          <Text style={styles.intelTitle}>OPERATIONAL <Text style={{ color: Colors.accent }}>INTEL</Text></Text>
          
          <View style={styles.intelGrid}>
            <View style={styles.intelItem}>
              <Text style={styles.intelLabel}>EMAIL SIGNAL</Text>
              <Text style={styles.intelValue}>{user?.email || 'tech@sktech.com'}</Text>
            </View>
            <View style={styles.intelItem}>
              <Text style={styles.intelLabel}>TACTICAL CONTACT</Text>
              <Text style={styles.intelValue}>{user?.phone || '9876543210'}</Text>
            </View>
            <View style={styles.intelItem}>
              <Text style={styles.intelLabel}>ASSIGNED ZONE</Text>
              <Text style={styles.intelValue}>Global Operations</Text>
            </View>
            <View style={styles.intelItem}>
              <Text style={styles.intelLabel}>FIELD SPECIALIST</Text>
              <Text style={styles.intelValue}>General Deployment</Text>
            </View>
            <View style={styles.intelItem}>
              <Text style={styles.intelLabel}>STRATEGIC HEADQUARTERS</Text>
              <Text style={styles.intelValue}>Service Center A</Text>
            </View>
          </View>
        </AppCard>
      </View>
    </View>
  );

  const renderChat = () => (
    <View style={{ padding: 20 }}>
      <AppCard style={styles.chatCommandCard}>
        <View style={styles.commandHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <View style={styles.shieldIcon}><Text style={{ color: '#fff', fontSize: 12 }}>🛡️</Text></View>
            <View>
              <Text style={styles.chatCommandTitle}>COMMAND <Text style={{ color: Colors.accent }}>INTERFACE</Text></Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={[styles.pulseDot, { backgroundColor: '#00E676' }]} />
                <Text style={styles.secureText}>SECURE LINE TO HQ</Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.responseTimeLabel}>RESPONSE TIME</Text>
            <Text style={styles.responseTimeValue}>{'< 5 MINS'}</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.chatArea} 
          contentContainerStyle={{ flexGrow: 1, justifyContent: messages.length > 0 ? 'flex-end' : 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyChatBox}>
              <View style={styles.emptyChatIcon}><Text style={{ color: 'rgba(255,255,255,0.1)', fontSize: 30 }}>💬</Text></View>
              <Text style={styles.emptyChatTitle}>NO TRANSMISSIONS LOGGED</Text>
              <Text style={styles.emptyChatSub}>Start a secure communication thread with Admin Command.</Text>
            </View>
          ) : (
            messages.map(msg => (
              <View key={msg.id} style={[styles.messageWrapper, msg.sender === 'TECH' ? styles.techMsgWrapper : styles.adminMsgWrapper]}>
                <View style={[styles.messageBubble, msg.sender === 'TECH' ? styles.techBubble : styles.adminBubble]}>
                  {(msg as any).image && (
                    <Image source={{ uri: (msg as any).image }} style={styles.messageImage} />
                  )}
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.messageTime}>{msg.time}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.chatInputRow}>
          <TouchableOpacity style={styles.attachBtn} onPress={handleAttachPress}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }}>📎</Text>
          </TouchableOpacity>
          <View style={styles.chatInputWrapper}>
            <TextInput 
              placeholder="TYPE STATUS UPDATE..."
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={styles.chatInput}
              value={inputText}
              onChangeText={setInputText}
            />
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
            <Text style={{ color: '#fff' }}>✈️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.chatFooterText}>🛡️ END-TO-END ENCRYPTION ACTIVE</Text>
          <Text style={styles.chatFooterText}>ℹ️ STANDARD PROTOCOL APPLIES</Text>
        </View>
      </AppCard>
    </View>
  );

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return renderDashboard();
      case 'tasks': return renderTasks();
      case 'attendance': return renderAttendance();
      case 'announcements': return renderAnnouncements();
      case 'expenses': return renderExpenses();
      case 'earnings': return renderEarnings();
      case 'profile': return renderProfile();
      case 'chat': return renderChat();
      case 'leave_hub': return renderLeaveHub();
      default: return renderDashboard();
    }
  };


  const renderLeaveHub = () => (
    <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
      <View style={styles.viewHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.largeTitle}>LEAVE <Text style={{ color: '#2979FF' }}>HUB</Text></Text>
          <Text style={styles.viewSubtitle}>TIME-OFF MANAGEMENT TERMINAL</Text>
        </View>
        <TouchableOpacity 
          style={styles.actionBtnPrimary} 
          onPress={() => setIsLeaveFormVisible(true)}
        >
          <Text style={styles.actionBtnIcon}>+</Text>
          <Text style={styles.actionBtnText}>NEW REQUEST</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isLeaveFormVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.taskModalContent}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsLeaveFormVisible(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.modalTitleRow}>
              <Text style={styles.modalMainTitle}>LEAVE <Text style={{color: Colors.accent}}>MANIFEST</Text></Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>START DATE</Text>
                  <TouchableOpacity 
                    style={styles.formInput} 
                    onPress={() => setShowStartPicker(true)}
                  >
                    <Text style={{ color: '#fff', lineHeight: 48 }}>{leaveStartDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showStartPicker && (
                    <DateTimePicker
                      value={leaveStartDate}
                      mode="date"
                      display="default"
                      onChange={(_e, date) => { setShowStartPicker(false); if(date) setLeaveStartDate(date); }}
                    />
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.inputLabel}>END DATE</Text>
                  <TouchableOpacity 
                    style={styles.formInput} 
                    onPress={() => setShowEndPicker(true)}
                  >
                    <Text style={{ color: '#fff', lineHeight: 48 }}>{leaveEndDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showEndPicker && (
                    <DateTimePicker
                      value={leaveEndDate}
                      mode="date"
                      display="default"
                      onChange={(_e, date) => { setShowEndPicker(false); if(date) setLeaveEndDate(date); }}
                    />
                  )}
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputLabel}>REASON FOR LEAVE</Text>
                <TextInput 
                  value={leaveReason}
                  onChangeText={setLeaveReason}
                  style={[styles.formInput, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                  multiline
                  placeholder="Specify reason for mission absence..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.submitClaimBtn, { backgroundColor: Colors.accent, marginTop: 30, width: '100%' }]} 
                onPress={async () => {
                  await handleSubmitLeave();
                  fetchMyLeaves();
                }}
                disabled={submittingLeave}
              >
                <Text style={styles.submitClaimText}>{submittingLeave ? 'TRANSMITTING...' : 'DEPLOY LEAVE REQUEST'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {myLeaves.map((item, idx) => (
          <AppCard key={item._id || idx} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <View>
                <Text style={styles.taskId}>LR_{item._id?.slice(-4).toUpperCase()}</Text>
                <Text style={styles.taskTitle}>{item.reason}</Text>
              </View>
              <View style={[styles.statusMiniBadge, { 
                backgroundColor: item.status === 'approved' ? 'rgba(0,230,118,0.1)' : 
                                item.status === 'rejected' ? 'rgba(255,82,82,0.1)' : 
                                'rgba(255,196,0,0.1)' 
              }]}>
                <Text style={[styles.statusMiniText, { 
                  color: item.status === 'approved' ? '#00E676' : 
                         item.status === 'rejected' ? '#FF5252' : 
                         '#FFC400' 
                }]}>{item.status?.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.taskDetails}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>TIMELINE</Text>
                <Text style={styles.detailValue}>
                  {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </AppCard>
        ))}
        {myLeaves.length === 0 && (
          <View style={styles.tableEmpty}>
            <Text style={styles.emptyIcon}>🏖️</Text>
            <Text style={styles.emptyText}>NO LEAVE HISTORY</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderAttendance = () => (
    <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
      <View style={styles.viewHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.largeTitle}>ATTENDANCE <Text style={{ color: '#2979FF' }}>LOGS</Text></Text>
          <Text style={styles.viewSubtitle}>OPERATIONAL TIME TRACKING</Text>
        </View>
        <TouchableOpacity 
          style={styles.actionBtnPrimary} 
          onPress={() => setIsLeaveFormVisible(true)}
        >
          <Text style={styles.actionBtnIcon}>+</Text>
          <Text style={styles.actionBtnText}>APPLY LEAVE</Text>
        </TouchableOpacity>
      </View>

      <AppCard style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHead, { flex: 1.2 }]}>DATE</Text>
          <Text style={styles.tableHead}>PUNCH IN</Text>
          <Text style={styles.tableHead}>PUNCH OUT</Text>
          <Text style={styles.tableHead}>DURATION</Text>
          <Text style={[styles.tableHead, { textAlign: 'right' }]}>STATUS</Text>
        </View>
        {attendanceHistory.map((item, idx) => (
          <View key={idx} style={[styles.tableRow, idx === attendanceHistory.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={[styles.tableCell, { flex: 1.2, color: '#fff', fontWeight: '800' }]}>{item.date}</Text>
            <Text style={styles.tableCell}>{item.punchIn}</Text>
            <Text style={styles.tableCell}>{item.punchOut}</Text>
            <Text style={styles.tableCell}>{item.duration}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View style={[styles.statusMiniBadge, { backgroundColor: 'rgba(0,230,118,0.1)' }]}>
                <Text style={[styles.statusMiniText, { color: '#00E676' }]}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </AppCard>
    </View>
  );

  const renderAnnouncements = () => (
    <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
      <View style={styles.viewHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.largeTitle}>HQ <Text style={{ color: '#2979FF' }}>ANNOUNCEMENTS</Text></Text>
          <Text style={styles.viewSubtitle}>OFFICIAL COMMAND BROADCASTS</Text>
        </View>
      </View>

      {announcements.map((item) => (
        <AppCard key={item.id} style={styles.announcementCard}>
          <View style={styles.announcementHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'HIGH' ? 'rgba(255,82,82,0.1)' : 'rgba(41,121,255,0.1)' }]}>
                <Text style={[styles.priorityText, { color: item.priority === 'HIGH' ? '#FF5252' : '#2979FF' }]}>{item.priority}</Text>
              </View>
              <Text style={styles.announcementDate}>{item.date}</Text>
            </View>
            <Text style={styles.announcementId}>MSG_00{item.id}</Text>
          </View>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementContent}>{item.content}</Text>
          <View style={styles.announcementFooter}>
            <Text style={styles.announcementAuthor}>ISSUED BY: CENTRAL_COMMAND</Text>
            <TouchableOpacity style={styles.acknowledgeBtn}>
              <Text style={styles.acknowledgeText}>ACKNOWLEDGE</Text>
            </TouchableOpacity>
          </View>
        </AppCard>
      ))}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScreenWrapper refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }}>
        <View style={styles.topBar}>
          <View style={styles.brandContainer}>
            <Image source={require('../../assets/Sk tech logo.png')} style={styles.miniLogo} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>Sk <Text style={{ color: '#2979FF' }}>technology</Text></Text>
              <Text style={styles.brandTagline}>COMMAND CENTER</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.floatingMenuBtn} onPress={() => setNotiVisible(true)}>
              <Text style={styles.floatingMenuIcon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.floatingMenuBtn} 
              onPress={() => setMenuVisible(true)}
            >
              <Text style={styles.floatingMenuIcon}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderContent()}
        <View style={{ height: 100 }} />
      </ScreenWrapper>


      <Modal
        visible={notiVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNotiVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            onPress={() => setNotiVisible(false)} 
          />
          <View style={styles.notiContainer}>
            <View style={styles.notiHeader}>
              <Text style={styles.notiTitle}>NOTIFICATIONS</Text>
              <TouchableOpacity onPress={() => setNotiVisible(false)}>
                <Text style={styles.closeText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {notifications.map(item => (
                <TouchableOpacity key={item.id} style={styles.notiItem} onPress={() => handleNotiPress(item)}>
                  <View style={[styles.notiDot, item.isRead && { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.notiItemTitle, item.isRead && { opacity: 0.5 }]}>{item.title}</Text>
                    <Text style={styles.notiItemMsg}>{item.message}</Text>
                    <Text style={styles.notiTime}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.sidebar, 
              { transform: [{ translateX: sidebarAnim }] }
            ]}
          >
            <View style={styles.sidebarHeader}>
              <View style={styles.logoBox}>
                <Image source={require('../../assets/Sk tech logo.png')} style={styles.sidebarLogo} resizeMode="contain" />
              </View>
              <View>
                <Text style={styles.sidebarTitle}>SK <Text style={{ color: '#2979FF' }}>TECHNOLOGY</Text></Text>
                <Text style={styles.sidebarSubtitle}>COMMAND CENTER</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { id: 'dashboard', label: 'DASHBOARD', icon: '⊞' },
                { id: 'noti', label: 'NOTIFICATIONS', icon: '🔔' },
                { id: 'tasks', label: 'MY TASKS', icon: '💼' },
                { id: 'attendance', label: 'ATTENDANCE', icon: '🕒' },
                { id: 'leave_hub', label: 'LEAVE HUB', icon: '🏖️' },
                { id: 'announcements', label: 'ANNOUNCEMENTS', icon: '📢' },
                { id: 'expenses', label: 'EXPENSES', icon: '₹' },
                { id: 'earnings', label: 'EARNINGS', icon: '📈' },
                { id: 'profile', label: 'MY PROFILE', icon: '👤' },
                { id: 'chat', label: 'ADMIN CHAT', icon: '💬' },
              ].map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.menuItem, activeView === item.id && styles.activeMenuItem]}
                  onPress={() => {
                    if (item.id === 'noti') { setNotiVisible(true); setMenuVisible(false); return; }
                    setActiveView(item.id);
                    setMenuVisible(false);
                  }}
                >
                  <View style={styles.menuIconContainer}>
                    <Text style={[styles.menuItemIcon, activeView === item.id && styles.activeMenuItemText]}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.menuItemLabel, activeView === item.id && styles.activeMenuItemText]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sidebarFooter}>
              <TouchableOpacity 
                style={styles.signOutBtn}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert('Logout', 'Are you sure you want to sign out?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign Out', style: 'destructive', onPress: logout },
                  ]);
                }}
              >
                <Text style={styles.signOutText}>↳ SIGN OUT</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <TouchableOpacity 
            style={styles.modalDismiss} 
            activeOpacity={1} 
            onPress={() => setMenuVisible(false)} 
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#020617' },
  telemetryHeader: { padding: 20, paddingTop: 40 },
  connectionStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2979FF' },
  connectionText: { color: '#2979FF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  boardTitle: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  boardSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginTop: 2 },
  
  punchSection: { marginTop: 20 },
  punchRow: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  punchInfo: { paddingHorizontal: 12 },
  punchLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '900', marginBottom: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusDot: { width: 4, height: 4, borderRadius: 2 },
  statusText: { fontSize: 10, fontWeight: '900' },
  vDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },
  hDivider: { height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 },
  timerText: { color: '#fff', fontSize: 14, fontWeight: '800', fontFamily: 'monospace' },
  punchBtn: { backgroundColor: '#2979FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginLeft: 'auto' },
  punchBtnOut: { backgroundColor: '#FF5252' },
  punchBtnText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 },
  analyticsCard: { width: '48%', padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  analyticsIconBox: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: '#00E676', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  analyticsIcon: { color: '#00E676', fontSize: 14, fontWeight: '900' },
  analyticsLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  analyticsValue: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 4 },

  gridStatusCard: { margin: 20, padding: 40, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  gridInner: { alignItems: 'center' },
  gridIndicator: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0,230,118,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  gridTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 10 },
  gridSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 25 },
  gridActionRow: { flexDirection: 'row', gap: 12 },
  gridPrimaryBtn: { backgroundColor: '#2979FF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  gridPrimaryText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  gridSecondaryBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  gridSecondaryText: { color: '#fff', fontSize: 11, fontWeight: '900' },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionHeader: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  badgeCount: { backgroundColor: '#FFC400', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 10 },
  badgeText: { color: '#000', fontSize: 10, fontWeight: '900' },
  sideNote: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', marginLeft: 'auto' },

  productivityCard: { marginHorizontal: 20, padding: 20, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.02)' },
  prodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  prodLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', marginBottom: 4 },
  prodValue: { color: '#fff', fontSize: 18, fontWeight: '900' },
  prodPlaceholder: { marginTop: 30, paddingTop: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  prodPlaceholderText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  directiveContainer: { marginHorizontal: 20, padding: 40, borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center' },
  directiveText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  commandCard: { marginHorizontal: 20, padding: 20, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.02)' },
  commandHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  commandTitle: { color: '#fff', fontSize: 14, fontWeight: '800' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,230,118,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  liveText: { color: '#00E676', fontSize: 8, fontWeight: '900' },
  commandContent: { padding: 40, alignItems: 'center', borderStyle: 'dotted', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
  commandPlaceholder: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600' },

  headerActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  floatingMenuBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  floatingMenuIcon: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // Notifications
  modalOverlayCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
  notiContainer: { width: '85%', backgroundColor: '#0A0F1E', borderRadius: 24, padding: 20, maxHeight: '60%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  notiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  notiTitle: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  closeText: { color: Colors.accent, fontSize: 10, fontWeight: '900' },
  notiItem: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  notiDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  notiItemTitle: { color: '#fff', fontSize: 13, fontWeight: '600' },
  notiTime: { color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 4 },

  // Sidebar Styles
  modalOverlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.85)' },
  modalDismiss: { flex: 1 },
  sidebar: { width: width * 0.75, backgroundColor: '#020617', height: '100%', padding: 20, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)', borderTopRightRadius: 32, borderBottomRightRadius: 32 },
  sidebarHeader: { marginTop: 40, marginBottom: 40, flexDirection: 'row', alignItems: 'center', gap: 15 },
  logoBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#2979FF', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  sidebarTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  sidebarSubtitle: { color: '#2979FF', fontSize: 10, fontWeight: '900', marginTop: 2 },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 16, marginBottom: 5 },
  activeMenuItem: { backgroundColor: 'rgba(41, 121, 255, 0.12)' },
  menuIconContainer: { width: 45, height: 45, alignItems: 'center', justifyContent: 'center' },
  menuItemIcon: { color: 'rgba(255,255,255,0.4)', fontSize: 22 },
  menuItemLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '700', letterSpacing: 0.5, includeFontPadding: false, lineHeight: 45 },
  activeMenuItemText: { color: '#fff' },
  
  sidebarFooter: { marginTop: 'auto', paddingTop: 20, gap: 15 },
  userBadge: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  userLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 7, fontWeight: '900', marginBottom: 4 },
  userName: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

  signOutBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, paddingHorizontal: 5 },
  signOutIcon: { color: '#FF5252', fontSize: 20, fontWeight: '900' },
  signOutText: { color: '#FF5252', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

  // Subview Specific Styles
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 15, marginBottom: 5 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniLogo: { width: 40, height: 40, marginRight: 12 },
  sidebarLogo: { width: 60, height: 60 },
  brandName: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  brandTagline: { color: 'rgba(255,255,255,0.3)', fontSize: 7, fontWeight: '900', marginTop: 1 },
  viewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, paddingHorizontal: 15, paddingTop: 5 },
  statusBadgeSmall: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 10 },
  statusTextSmall: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  largeTitle: { color: '#fff', fontSize: 28, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 },
  viewSubtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '900', marginTop: 5, letterSpacing: 1 },
  
  actionBtnPrimary: { backgroundColor: '#2979FF', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  actionBtnOutline: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  actionBtnText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  actionBtnIcon: { color: '#fff', fontSize: 16, fontWeight: '900' },

  tableCard: { marginHorizontal: 15, padding: 0, borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tableHeader: { flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.01)' },
  tableHead: { flex: 1, color: 'rgba(255,255,255,0.3)', fontSize: 7.5, fontWeight: '900', textAlign: 'left', letterSpacing: 0.1 },
  tableEmpty: { padding: 80, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 40, color: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  emptyText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', letterSpacing: 2 },

  // Earnings
  salaryStatsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 25 },
  salaryStatCard: { flex: 1, padding: 15, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.02)', alignItems: 'center' },
  salaryStatLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 7, fontWeight: '900', marginBottom: 8 },
  salaryStatValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  salaryStatSub: { color: 'rgba(255,255,255,0.2)', fontSize: 8, fontWeight: '600', marginTop: 4 },
  
  chartsRow: { flexDirection: 'row', gap: 15, paddingHorizontal: 20, marginBottom: 25 },
  chartCard: { flex: 1, padding: 20, height: 220, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.02)' },
  chartTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', marginBottom: 20 },
  chartPlaceholder: { flex: 1, justifyContent: 'space-between', paddingBottom: 20 },
  gridLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.03)' },
  workloadLine: { height: 2, backgroundColor: '#00E676', width: '100%', position: 'absolute', top: '50%' },

  tableHeaderRow: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tableTitle: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  logBadge: { backgroundColor: 'rgba(41, 121, 255, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  logBadgeText: { color: '#2979FF', fontSize: 7, fontWeight: '900' },
  logItem: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  logDate: { flex: 1, color: '#fff', fontSize: 11, fontWeight: '900' },
  logHours: { color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'left' },
  logEarnings: { color: '#2979FF', fontSize: 11, fontWeight: '900', textAlign: 'left' },
  typeBadge: { flex: 1, alignItems: 'center' },
  typeText: { color: '#00E676', fontSize: 7, fontWeight: '900', backgroundColor: 'rgba(0,230,118,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },

  // Tasks Refined
  activeOpsBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(41, 121, 255, 0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(41, 121, 255, 0.1)', alignSelf: 'flex-start', marginBottom: 15 },
  activeOpsText: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  taskCountBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(41, 121, 255, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(41, 121, 255, 0.2)' },
  taskCountText: { color: '#2979FF', fontSize: 12, fontWeight: '900' },

  taskCard: { marginHorizontal: 15, marginBottom: 20, padding: 25, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  taskId: { color: '#2979FF', fontSize: 10, fontWeight: '900', marginBottom: 4 },
  taskTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.2 },
  priorityBadge: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 9, fontWeight: '900' },
  taskDetails: { flexDirection: 'row', marginBottom: 25 },
  detailLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900', marginBottom: 8 },
  detailValue: { color: '#fff', fontSize: 14, fontWeight: '900' },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusCapsule: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  miniDot: { width: 6, height: 6, borderRadius: 3 },
  statusCapsuleText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  startMissionBtn: { backgroundColor: '#2979FF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  startMissionText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

  // Profile
  profileSummaryCard: { width: '100%', padding: 25, alignItems: 'center', borderRadius: 32 },
  profileAvatarBox: { marginBottom: 25 },
  profileAvatar: { width: 120, height: 120, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  cameraBtn: { position: 'absolute', bottom: 0, right: -5, width: 36, height: 36, borderRadius: 12, backgroundColor: '#2979FF', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#020617' },
  profileName: { color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  profileRole: { color: '#2979FF', fontSize: 9, fontWeight: '900', marginTop: 4 },
  profileStatVal: { color: '#fff', fontSize: 18, fontWeight: '900' },
  profileStatLab: { color: 'rgba(255,255,255,0.3)', fontSize: 7, fontWeight: '900', marginTop: 4 },

  profileIntelCard: { width: '100%', padding: 25, borderRadius: 32 },
  intelTitle: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic', marginBottom: 30 },
  intelGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 30 },
  intelItem: { width: '50%' },
  intelLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900', marginBottom: 8 },
  intelValue: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // Chat
  chatCommandCard: { marginHorizontal: 20, padding: 30, borderRadius: 32, minHeight: height * 0.7 },
  shieldIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#2979FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#2979FF', shadowOpacity: 0.5, shadowRadius: 15 },
  chatCommandTitle: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
  secureText: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900' },
  responseTimeLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900' },
  responseTimeValue: { color: '#2979FF', fontSize: 12, fontWeight: '900', marginTop: 4 },
  
  chatArea: { flex: 1, marginVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  emptyChatBox: { alignItems: 'center', paddingVertical: 40 },
  emptyChatIcon: { width: 80, height: 80, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.02)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyChatTitle: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  emptyChatSub: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '600', textAlign: 'center', width: '80%' },

  messageWrapper: { marginBottom: 15, maxWidth: '85%' },
  techMsgWrapper: { alignSelf: 'flex-end' },
  adminMsgWrapper: { alignSelf: 'flex-start' },
  messageBubble: { padding: 15, borderRadius: 20 },
  techBubble: { backgroundColor: '#2979FF', borderBottomRightRadius: 4 },
  adminBubble: { backgroundColor: 'rgba(255,255,255,0.05)', borderBottomLeftRadius: 4 },
  messageText: { color: '#fff', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  messageImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 10, backgroundColor: 'rgba(0,0,0,0.1)' },
  messageTime: { color: 'rgba(255,255,255,0.4)', fontSize: 8, marginTop: 4, textAlign: 'right', fontWeight: '900' },

  chatInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  attachBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chatInputWrapper: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, height: 44, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chatInput: { flex: 1, color: '#fff', fontSize: 11, fontWeight: '700', paddingHorizontal: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#2979FF', alignItems: 'center', justifyContent: 'center' },
  chatFooter: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20 },
  chatFooterText: { color: 'rgba(255,255,255,0.2)', fontSize: 8, fontWeight: '900' },

  // New Views Styles
  tableRow: { flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)', alignItems: 'center' },
  tableCell: { flex: 1, color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '700' },
  statusMiniBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusMiniText: { fontSize: 8, fontWeight: '900' },

  announcementCard: { marginBottom: 15, padding: 25, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  announcementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  announcementDate: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '700' },
  announcementId: { color: 'rgba(255,255,255,0.1)', fontSize: 14, fontWeight: '900' },
  announcementTitle: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  announcementContent: { color: 'rgba(255,255,255,0.5)', fontSize: 11, lineHeight: 18, marginBottom: 20 },
  announcementFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.03)', paddingTop: 15 },
  announcementAuthor: { color: 'rgba(255,255,255,0.3)', fontSize: 7, fontWeight: '900' },
  acknowledgeBtn: { backgroundColor: 'rgba(41,121,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  acknowledgeText: { color: '#2979FF', fontSize: 8, fontWeight: '900' },
  notiItemMsg: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },
  
  // Claim Form Styles
  claimFormCard: { marginHorizontal: 15, marginBottom: 20, padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  formRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900', marginBottom: 8, letterSpacing: 0.5 },
  formInput: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', color: '#fff', paddingHorizontal: 15, height: 48, fontSize: 12, fontWeight: '700' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 25, gap: 30 },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  submitClaimBtn: { backgroundColor: '#2979FF', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12, shadowColor: '#2979FF', shadowOpacity: 0.3, shadowRadius: 10 },
  submitClaimText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  pickerContainer: { width: '100%' },
  
  // Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  taskModalContent: { width: '90%', backgroundColor: '#020617', borderRadius: 32, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', maxHeight: '80%' },
  modalCloseBtn: { position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  modalCloseText: { color: '#fff', fontSize: 16, fontWeight: '300' },
  modalTitleRow: { marginBottom: 25 },
  modalMainTitle: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
});

export default TechnicianDashboard;
