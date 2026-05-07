import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Colors } from '../../constants/colors';
import AppButton from '../../components/AppButton';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Subscriptions'>;

const SubscriptionsScreen = ({ navigation }: { navigation: NavProp }) => {
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚙ MAINTENANCE PLANS</Text>
          </View>
          <Text style={styles.mainTitle}>PROTECT YOUR</Text>
          <Text style={styles.mainTitleItalic}>INVESTMENT</Text>
          <Text style={styles.subTitle}>
            Ensure your security systems operate at peak performance 24/7 with our professional maintenance and support plans.
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          
          {/* Plan 1 */}
          <View style={styles.planCard}>
            <Text style={styles.planTitle}>ESSENTIAL MAINTENANCE</Text>
            <Text style={styles.planDesc}>Monthly preventive maintenance and priority support for peace of mind.</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹499</Text>
              <Text style={styles.period}>/month</Text>
            </View>

            <View style={styles.featuresList}>
              {['1 Monthly Physical Inspection', 'Lens Cleaning & Alignment Check', '24/7 Priority Phone Support', '10% Off on Replacement Parts'].map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <AppButton title="START MONTHLY PLAN" onPress={() => navigation.navigate('Login')} variant="outline" style={{ marginTop: 24 }} />
          </View>

          {/* Plan 2 */}
          <View style={[styles.planCard, styles.popularCard]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>⭐ MOST POPULAR</Text>
            </View>
            <Text style={styles.planTitle}>COMPREHENSIVE SHIELD</Text>
            <Text style={styles.planDesc}>Complete annual coverage with maximum savings and premium benefits.</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹4,999</Text>
              <Text style={styles.period}>/year</Text>
            </View>

            <View style={styles.featuresList}>
              {['12 Monthly Physical Inspections', 'Bi-Annual Firmware Updates', 'Free Replacement Devices (if under warranty)', 'Zero Labor Charges on Repairs', '24/7 Priority Tech Dispatch'].map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={[styles.featureIcon, { color: Colors.accent }]}>✓</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <AppButton title="GET ANNUAL SHIELD" onPress={() => navigation.navigate('Login')} style={{ marginTop: 24 }} />
          </View>

        </View>

        <View style={styles.customPlanSection}>
          <Text style={styles.customPlanText}>Need a custom enterprise maintenance plan?</Text>
          <TouchableOpacity>
            <Text style={styles.customPlanLink}>CONTACT SALES TEAM</Text>
          </TouchableOpacity>
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
  badge: { backgroundColor: 'rgba(41,121,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.accent, marginBottom: 24 },
  badgeText: { color: Colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  mainTitle: { color: Colors.text, fontSize: 32, fontWeight: '900' },
  mainTitleItalic: { color: Colors.text, fontSize: 32, fontWeight: '900', fontStyle: 'italic', marginBottom: 16 },
  subTitle: { color: Colors.mutedText, fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },

  plansContainer: { paddingHorizontal: 24, gap: 24 },
  planCard: { backgroundColor: Colors.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Colors.border },
  popularCard: { borderColor: Colors.accent, borderWidth: 2 },
  popularBadge: { position: 'absolute', top: -12, right: 24, backgroundColor: Colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  popularBadgeText: { color: 'white', fontSize: 9, fontWeight: '800' },
  
  planTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 },
  planDesc: { color: Colors.mutedText, fontSize: 12, lineHeight: 18, marginBottom: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 24 },
  price: { color: Colors.text, fontSize: 36, fontWeight: '900' },
  period: { color: Colors.mutedText, fontSize: 14, marginLeft: 4 },
  
  featuresList: { gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureIcon: { color: Colors.border, fontSize: 14, fontWeight: '900' },
  featureText: { color: Colors.text, fontSize: 13 },

  customPlanSection: { alignItems: 'center', marginTop: 40 },
  customPlanText: { color: Colors.mutedText, fontSize: 13, marginBottom: 12 },
  customPlanLink: { color: Colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
});

export default SubscriptionsScreen;
