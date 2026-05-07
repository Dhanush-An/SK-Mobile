import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Colors } from '../../constants/colors';
import AppButton from '../../components/AppButton';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Support'>;

const SupportScreen = ({ navigation }: { navigation: NavProp }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.badgeText}>24/7 EXPERT SUPPORT</Text>
          <Text style={styles.mainTitle}>HELP <Text style={{ color: Colors.accent }}>CENTER</Text></Text>
          <Text style={styles.subTitle}>Get professional assistance for your security systems. Our team is available 24/7.</Text>
          
          <View style={styles.titleButtons}>
            <TouchableOpacity style={styles.activeBtn}><Text style={styles.activeBtnText}>SUPPORT TICKETS</Text></TouchableOpacity>
            <TouchableOpacity style={styles.inactiveBtn}><Text style={styles.inactiveBtnText}>TRACK INSTALLATION</Text></TouchableOpacity>
          </View>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactGrid}>
          {/* Email */}
          <View style={styles.contactCard}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactLabel}>EMAIL SUPPORT</Text>
            <Text style={styles.contactValue}>support@sktechnology.com</Text>
          </View>
          {/* Phone */}
          <View style={styles.contactCard}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactLabel}>CALL SUPPORT</Text>
            <Text style={styles.contactValue}>+91 98765 43210</Text>
          </View>
        </View>

        {/* Message Form */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>SEND US A <Text style={{ color: Colors.accent }}>MESSAGE</Text></Text>
          <View style={styles.inputRow}>
            <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Full Name" placeholderTextColor={Colors.mutedText} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Email Address" placeholderTextColor={Colors.mutedText} />
          </View>
          <TextInput style={styles.input} placeholder="Subject" placeholderTextColor={Colors.mutedText} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="How can we help you?" placeholderTextColor={Colors.mutedText} multiline numberOfLines={4} />
          <AppButton title="SEND MESSAGE →" onPress={() => {}} style={{ marginTop: 12 }} />
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>04</Text>
            <Text style={styles.statLabel}>SERVICE CENTERS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{'<'}2min</Text>
            <Text style={styles.statLabel}>AVG RESPONSE TIME</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>38</Text>
            <Text style={styles.statLabel}>SUPPORT SPECIALISTS</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: Colors.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: Colors.text, fontSize: 18 },
  scrollContent: { paddingBottom: 60 },

  titleSection: { padding: 24, alignItems: 'center' },
  badgeText: { color: Colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  mainTitle: { color: Colors.text, fontSize: 32, fontWeight: '900', fontStyle: 'italic', marginBottom: 12 },
  subTitle: { color: Colors.mutedText, fontSize: 13, textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  titleButtons: { flexDirection: 'row', gap: 12 },
  activeBtn: { backgroundColor: Colors.accent, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 24 },
  activeBtnText: { color: 'white', fontSize: 10, fontWeight: '800' },
  inactiveBtn: { backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 24, borderWidth: 1, borderColor: Colors.border },
  inactiveBtnText: { color: Colors.text, fontSize: 10, fontWeight: '800' },

  contactGrid: { flexDirection: 'row', paddingHorizontal: 24, gap: 16, marginBottom: 32 },
  contactCard: { flex: 1, backgroundColor: Colors.card, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  contactIcon: { fontSize: 24, marginBottom: 12 },
  contactLabel: { color: Colors.mutedText, fontSize: 10, fontWeight: '700', marginBottom: 4 },
  contactValue: { color: Colors.text, fontSize: 12, fontWeight: '600' },

  formSection: { paddingHorizontal: 24, marginBottom: 40 },
  formTitle: { color: Colors.text, fontSize: 20, fontWeight: '800', fontStyle: 'italic', marginBottom: 20 },
  inputRow: { flexDirection: 'row', marginBottom: 12 },
  input: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: Colors.text, fontSize: 13, marginBottom: 12 },
  textArea: { height: 100, textAlignVertical: 'top' },

  statsSection: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 40 },
  statBox: { flex: 1, backgroundColor: Colors.card, paddingVertical: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statValue: { color: Colors.text, fontSize: 24, fontWeight: '900', marginBottom: 6 },
  statLabel: { color: Colors.mutedText, fontSize: 9, fontWeight: '800', textAlign: 'center' },
});

export default SupportScreen;
