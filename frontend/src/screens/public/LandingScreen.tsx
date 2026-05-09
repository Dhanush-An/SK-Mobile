import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Colors as StaticColors } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';
import AppButton from '../../components/AppButton';
import LoadingAnimation from '../../components/LoadingAnimation';
import AppLogo from '../../components/AppLogo';

const { width } = Dimensions.get('window');

const SERVICES = [
  { id: '1', icon: '📹', title: 'CCTV Installation', desc: 'HD cameras for homes & businesses' },
  { id: '2', icon: '🛡️', title: 'Smart Monitoring', desc: '24/7 intelligent security alerts' },
  { id: '3', icon: '🏠', title: 'Home Security', desc: 'Complete home protection systems' },
  { id: '4', icon: '🌐', title: 'Network Systems', desc: 'Enterprise networking solutions' },
];

const FEATURES = [
  { icon: '🎓', title: 'Expert Consultation', desc: 'Certified security professionals' },
  { icon: '⚡', title: 'Professional Service', desc: 'Fast, clean installations' },
  { icon: '🕐', title: '24/7 Support', desc: 'Round-the-clock assistance' },
  { icon: '🔐', title: 'Data Privacy', desc: 'Your data stays secure' },
];

const TESTIMONIALS = [
  { id: '1', name: 'Rajesh Kumar', role: 'Business Owner', text: 'SK Technology transformed our office security. Excellent CCTV setup and responsive team!', rating: 5 },
  { id: '2', name: 'Priya Sharma', role: 'Homeowner', text: 'Best home security installation service. The team was professional and quick.', rating: 5 },
  { id: '3', name: 'Amit Patel', role: 'Factory Manager', text: 'Covered our entire factory with CCTV at a great price. Highly recommended!', rating: 5 },
];

const BRANCHES = [
  { id: '1', hub: 'BANGALORE HUB', title: 'BANGALORE HEADQUARTERS', address: '404 Tech Corridor, Electronic City,\nBangalore, KA 560100', phone: '+91 80 4567 8901' },
  { id: '2', hub: 'HYDERABAD HUB', title: 'HYDERABAD TECH NODE', address: 'Level 5, HITEC City, Kondapur,\nHyderabad, TS 500081', phone: '+91 40 1234 5678' },
  { id: '3', hub: 'CHENNAI HUB', title: 'CHENNAI STRATEGIC NODE', address: 'Suite 12, Naval Tech Park, OMR,\nChennai, TN 600113', phone: '+91 44 9876 5432' },
];

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

const StarRating = ({ count }: { count: number }) => (
  <Text style={{ fontSize: 14 }}>{'⭐'.repeat(count)}</Text>
);

const LandingScreen = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const { colors: Colors, toggleTheme } = useTheme();
  const styles = createStyles(Colors, insets);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showAuthAnimation, setShowAuthAnimation] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const handleLogin = () => {
    setShowAuthAnimation(true);
    setTimeout(() => {
      setShowAuthAnimation(false);
      navigation.navigate('Login');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Colors.background} 
        translucent={true} 
      />
      {/* ─── Top Header Actions ─── */}
      <View style={styles.topActions}>
        <View style={styles.headerLogo}>
          <AppLogo size={28} />
          <Text style={styles.headerLogoText}>SK TECHNOLOGY</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Wishlist' as any)}>
            <Text style={styles.iconText}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Notifications', 'You have no new notifications.')}>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme}>
            <Text style={styles.iconText}>🌓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleLogin}>
            <Text style={styles.iconText}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Navigation Bar ─── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navBar} contentContainerStyle={styles.navBarContent}>
        {[
          { name: 'Home', screen: 'Landing' },
          { name: 'Products', screen: 'Products' },
          { name: 'Support', screen: 'Support' },
          { name: 'Subscriptions', screen: 'Subscriptions' },
          { name: 'Checkout', screen: 'Login' }
        ].map((item) => (
          <TouchableOpacity 
            key={item.name} 
            style={styles.navItem}
            onPress={() => {
              if (item.name === 'Checkout') {
                handleLogin();
              } else if (item.name !== 'Home') {
                (navigation.navigate as any)(item.screen);
              }
            }}
          >
            <Text style={styles.navText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* ─── Hero ─── */}
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <AppLogo size={48} />
            <View>
              <Text style={styles.logoText}>SK Technology</Text>
              <Text style={styles.logoSub}>Security Solutions</Text>
            </View>
          </View>

        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>🔰 Certified Security Experts</Text>
        </View>

        <Text style={styles.heroTitle}>Certified{'\n'}Security Setup</Text>
        <Text style={styles.heroSubtitle}>
          Expert CCTV installation, smart monitoring and security system support for homes and businesses.
        </Text>

        <View style={styles.heroButtons}>
          <AppButton
            title="📅 Book Installation"
            onPress={() => navigation.navigate('Register')}
            style={styles.primaryBtn}
            fullWidth={false}
          />
          <AppButton
            title="🔑 Login / Sign In"
            onPress={handleLogin}
            variant="outline"
            style={styles.outlineBtn}
            fullWidth={false}
          />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[['500+', 'Clients'], ['1000+', 'Cameras'], ['5★', 'Rating']].map(([val, label]) => (
            <View key={label} style={styles.statItem}>
              <Text style={styles.statValue}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ─── Services ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionBadge}>OUR SERVICES</Text>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        <View style={styles.servicesGrid}>
          {SERVICES.map(s => (
            <TouchableOpacity key={s.id} style={styles.serviceCard} activeOpacity={0.8}>
              <Text style={styles.serviceIcon}>{s.icon}</Text>
              <Text style={styles.serviceTitle}>{s.title}</Text>
              <Text style={styles.serviceDesc}>{s.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ─── Features ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionBadge}>WHY CHOOSE US</Text>
        <Text style={styles.sectionTitle}>Our Advantages</Text>
        {FEATURES.map(f => (
          <View key={f.title} style={styles.featureRow}>
            <View style={styles.featureIconBox}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* ─── Branches & Locations ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionBadge}>NETWORK</Text>
        <Text style={styles.sectionTitle}>Our Locations</Text>
        
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapOverlay}>
            <View style={styles.mapPin}><Text style={{fontSize: 10}}>📍</Text></View>
            <View style={[styles.mapPin, {top: '40%', left: '45%'}]}><Text style={{fontSize: 10}}>📍</Text></View>
            <View style={[styles.mapPin, {top: '70%', left: '30%'}]}><Text style={{fontSize: 10}}>📍</Text></View>
            <View style={styles.syncStatus}>
              <View style={styles.syncDot} />
              <Text style={styles.syncText}>LIVE SYNC STATUS: ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Branch Cards */}
        {BRANCHES.map(b => (
          <View key={b.id} style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <Text style={styles.branchBadge}>{b.hub}</Text>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
            <Text style={styles.branchTitle}>{b.title}</Text>
            <View style={styles.branchDetail}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{b.address}</Text>
            </View>
            <View style={styles.branchDetail}>
              <Text style={styles.detailIcon}>📞</Text>
              <Text style={styles.detailText}>{b.phone}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ─── Testimonials ─── */}
      <View style={styles.section}>
        <Text style={styles.sectionBadge}>TESTIMONIALS</Text>
        <Text style={styles.sectionTitle}>What Our Clients Say</Text>
        <FlatList
          ref={flatRef}
          data={TESTIMONIALS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          onMomentumScrollEnd={e => {
            setActiveTestimonial(Math.round(e.nativeEvent.contentOffset.x / (width - 40)));
          }}
          renderItem={({ item }) => (
            <View style={[styles.testimonialCard, { width: width - 40 }]}>
              <StarRating count={item.rating} />
              <Text style={styles.testimonialText}>"{item.text}"</Text>
              <Text style={styles.testimonialName}>{item.name}</Text>
              <Text style={styles.testimonialRole}>{item.role}</Text>
            </View>
          )}
        />
        <View style={styles.dotsRow}>
          {TESTIMONIALS.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeTestimonial && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* ─── Footer CTA ─── */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Ready to Secure Your Property?</Text>
        <Text style={styles.footerSub}>Join 500+ satisfied clients who trust SK Technology</Text>
        <AppButton
          title="Get Started — It's Free"
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: 16 }}
        />
        <TouchableOpacity onPress={handleLogin} style={{ marginTop: 14 }}>
          <Text style={styles.footerLogin}>Already have an account? <Text style={{ color: Colors.accent }}>Sign In</Text></Text>
        </TouchableOpacity>

        <View style={styles.footerContact}>
          <Text style={styles.footerContactText}>📞 +91 98765 43210</Text>
          <Text style={styles.footerContactText}>✉️ support@sktechnology.com</Text>
          <Text style={styles.footerContactText}>📍 Chennai, Tamil Nadu, India</Text>
        </View>

        <Text style={styles.copyright}>© 2024 SK Technology. All rights reserved.</Text>
      </View>
    </ScrollView>
    {showAuthAnimation && <LoadingAnimation />}
    </View>
  );
};



const createStyles = (Colors: any, insets: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  
  // Header Actions
  topActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0) + 10, 
    paddingBottom: 15,
    backgroundColor: Colors.primary 
  },
  headerLogo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogoIcon: { fontSize: 24 },
  headerLogoText: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  actionButtons: { flexDirection: 'row', gap: 12 },
  iconBtn: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  iconText: { fontSize: 18 },

  // Navigation Bar
  navBar: { 
    backgroundColor: Colors.card, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border,
    maxHeight: 50
  },
  navBarContent: { paddingHorizontal: 16, alignItems: 'center' },
  navItem: { paddingVertical: 12, paddingHorizontal: 16, marginRight: 8 },
  navText: { color: Colors.mutedText, fontSize: 14, fontWeight: '600' },

  // Hero
  hero: { padding: 24, paddingTop: 20, backgroundColor: Colors.primary },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  logoIcon: { fontSize: 36 },
  logoText: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  logoSub: { color: Colors.mutedText, fontSize: 12 },
  heroBadge: { backgroundColor: 'rgba(41,121,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: Colors.accent, alignSelf: 'flex-start', marginBottom: 20 },
  heroBadgeText: { color: Colors.accent, fontSize: 12, fontWeight: '700' },
  heroTitle: { color: Colors.text, fontSize: 40, fontWeight: '900', lineHeight: 48, marginBottom: 16 },
  heroSubtitle: { color: Colors.mutedText, fontSize: 15, lineHeight: 24, marginBottom: 28 },
  heroButtons: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  primaryBtn: { flex: 1, paddingVertical: 14 },
  outlineBtn: { flex: 1, paddingVertical: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, borderTopWidth: 1, borderTopColor: Colors.border },
  statItem: { alignItems: 'center' },
  statValue: { color: Colors.accent, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.mutedText, fontSize: 12, marginTop: 2 },

  // Sections
  section: { padding: 24 },
  sectionBadge: { color: Colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  sectionTitle: { color: Colors.text, fontSize: 26, fontWeight: '800', marginBottom: 20 },

  // Services Grid
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceCard: { width: (width - 60) / 2, backgroundColor: Colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: Colors.border },
  serviceIcon: { fontSize: 32, marginBottom: 10 },
  serviceTitle: { color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  serviceDesc: { color: Colors.mutedText, fontSize: 12, lineHeight: 18 },

  // Features
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  featureIconBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(41,121,255,0.12)', borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  featureIcon: { fontSize: 24 },
  featureTitle: { color: Colors.text, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  featureDesc: { color: Colors.mutedText, fontSize: 13 },

  // Testimonials
  testimonialCard: { backgroundColor: Colors.card, borderRadius: 18, padding: 20, marginRight: 12, borderWidth: 1, borderColor: Colors.border },
  testimonialText: { color: Colors.text, fontSize: 14, lineHeight: 22, marginVertical: 12, fontStyle: 'italic' },
  testimonialName: { color: Colors.accent, fontSize: 14, fontWeight: '700' },
  testimonialRole: { color: Colors.mutedText, fontSize: 12 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.accent, width: 18 },
  
  // Branches & Locations
  mapContainer: { 
    height: 220, 
    backgroundColor: Colors.card, 
    borderRadius: 24, 
    marginBottom: 24, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: { width: '100%', height: '100%', backgroundColor: 'rgba(41,121,255,0.05)' },
  mapPin: { position: 'absolute', top: '20%', left: '20%', width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(41,121,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.accent },
  syncStatus: { position: 'absolute', bottom: 16, left: 16, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border },
  syncDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  syncText: { color: Colors.accent, fontSize: 9, fontWeight: '800' },
  
  branchCard: { backgroundColor: Colors.card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  branchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  branchBadge: { color: Colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  shieldIcon: { fontSize: 18 },
  branchTitle: { color: Colors.text, fontSize: 17, fontWeight: '800', marginBottom: 14 },
  branchDetail: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  detailIcon: { fontSize: 14, marginTop: 2 },
  detailText: { color: Colors.mutedText, fontSize: 13, lineHeight: 20, flex: 1 },

  // Footer
  footer: { padding: 24, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border },
  footerTitle: { color: Colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  footerSub: { color: Colors.mutedText, fontSize: 14, textAlign: 'center', marginBottom: 4 },
  footerLogin: { color: Colors.mutedText, textAlign: 'center', fontSize: 14 },
  footerContact: { marginTop: 24, gap: 6 },
  footerContactText: { color: Colors.mutedText, fontSize: 13, textAlign: 'center' },
  copyright: { color: Colors.border, fontSize: 11, textAlign: 'center', marginTop: 20 },
});

export default LandingScreen;
