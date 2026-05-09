import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, TextInput, Alert, Modal, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';
import { campaignApi } from '../../api/campaignApi';
import { useRef } from 'react';

const LogoImg = require('../../assets/sk_tech_logo.png');

const { width } = Dimensions.get('window');

const AnimatedProductCard = ({ item, onPress, horizontal = false }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={{ overflow: 'hidden' }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <AppCard style={horizontal ? styles.productCard : styles.focusedProductCard}>
           <Image source={{ uri: item.img }} style={horizontal ? styles.productImg : styles.focusedProductImg} />
           {horizontal ? (
             <>
               <Text style={styles.productName}>{item.name}</Text>
               <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{item.price}</Text>
                  <View style={styles.detailsBtn}>
                    <Text style={styles.detailsBtnText}>DETAILS</Text>
                  </View>
               </View>
             </>
           ) : (
             <View style={styles.focusedProductInfo}>
               <Text style={styles.productName}>{item.name}</Text>
               <Text style={styles.productPrice}>{item.price}</Text>
               <View style={styles.detailsBtn}>
                 <Text style={styles.detailsBtnText}>DETAILS →</Text>
               </View>
             </View>
           )}
        </AppCard>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CATEGORIES = [
  { id: '1', name: 'IP CAMERAS', icon: '📹' },
  { id: '2', name: 'PTZ DOME', icon: '📷' },
  { id: '3', name: 'NVR SYSTEMS', icon: '🖥️' },
  { id: '4', name: 'SMART LOCKS', icon: '🔐' },
  { id: '5', name: 'SOLAR CAM', icon: '☀️' },
  { id: '6', name: 'WIFI CAM', icon: '📶' },
  { id: '7', name: 'DOOR BELL', icon: '🔔' },
  { id: '8', name: 'STORAGE', icon: '💾' },
  { id: '9', name: 'CABLES', icon: '🔌' },
  { id: '10', name: 'ROUTERS', icon: '🌐' },
  { id: '11', name: 'ALL', icon: '📁' },
];

const HARDWARE: any[] = [];


type NavProp = NativeStackNavigationProp<CustomerStackParamList>;

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  
  const zoomAnim = useRef(new Animated.Value(1)).current;

  const handleZoomIn = () => {
    Animated.spring(zoomAnim, {
      toValue: 1.1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleZoomOut = () => {
    Animated.spring(zoomAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await campaignApi.getAll();
      setCampaigns(res.data.data);
    } catch (err) {
      console.log('Error fetching campaigns:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const filteredHardware = activeCategory && activeCategory !== 'ALL'
    ? HARDWARE.filter(item => item.category === activeCategory)
    : HARDWARE;

  return (
    <ScreenWrapper refreshing={refreshing} onRefresh={onRefresh} padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
           <TouchableOpacity style={styles.logoBox} onPress={() => setActiveCategory(null)}>
             <Image source={LogoImg} style={styles.logoImage} resizeMode="contain" />
           </TouchableOpacity>
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerIcon} onPress={() => (navigation as any).navigate('Profile')}>
                <Text style={{fontSize: 20}}>👤</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartBtn} onPress={logout}>
                <Text style={styles.cartBtnText}>LOGOUT</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Live Campaigns Carousel - Hide in Sector View */}
        {!activeCategory && campaigns.length > 0 && (
          <View style={styles.campaignContainer}>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 40}
              decelerationRate="fast"
            >
              {campaigns.map(camp => (
                <View key={camp._id} style={styles.campaignSlide}>
                  <AppCard style={styles.campaignCard}>
                    <View style={styles.campaignContent}>
                      <View style={{flex: 1}}>
                        <Text style={styles.campDiscount}>{camp.discount}</Text>
                        <Text style={styles.campTitle}>{camp.title}</Text>
                        <Text style={styles.campDesc} numberOfLines={2}>{camp.description}</Text>
                        {camp.voucherCode && (
                          <View style={styles.voucherBadge}>
                            <Text style={styles.voucherText}>CODE: {camp.voucherCode}</Text>
                          </View>
                        )}
                      </View>
                      {camp.image && (
                        <Image source={{ uri: camp.image }} style={styles.campImage} />
                      )}
                    </View>
                  </AppCard>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Hero Section - Hide in Sector View */}
        {!activeCategory && (
          <View style={styles.heroSection}>
             <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>CORPORATE <Text style={{color: Colors.accent}}>SECURITY</Text> SOLUTIONS</Text>
                <Text style={styles.heroSub}>Premier high-resolution surveillance and AI-powered security monitoring for your assets.</Text>
                <View style={styles.heroActionRow}>
                   <TouchableOpacity style={styles.primaryBtn} onPress={() => (navigation as any).navigate('Services')}>
                     <Text style={styles.primaryBtnText}>VIEW SERVICES →</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.secondaryBtn}>
                     <Text style={styles.secondaryBtnText}>CONSULT EXPERT</Text>
                   </TouchableOpacity>
                </View>
             </View>
             <View style={styles.heroImageBox}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800' }} 
                  style={styles.heroImage}
                  resizeMode="cover"
                />
                <View style={styles.heroImageOverlay} />
             </View>
          </View>
        )}

        {/* Top Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>TOP <Text style={{color: Colors.accent}}>CATEGORIES</Text></Text>
          <View style={styles.categoriesGrid}>
             {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.categoryItem}
                  onPress={() => {
                    setActiveCategory(cat.name === 'ALL' ? null : cat.name);
                    setIsModalVisible(false);
                  }}
                >
                  <View style={[styles.categoryIconBox, (activeCategory === cat.name || (!activeCategory && cat.name === 'ALL')) && styles.activeCategoryBox]}>
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  </View>
                  <Text style={[styles.categoryName, (activeCategory === cat.name || (!activeCategory && cat.name === 'ALL')) && styles.activeCategoryText]}>{cat.name}</Text>
                </TouchableOpacity>
             ))}
          </View>
        </View>

        {/* Strategic Hardware - Focused View */}
        <View style={styles.sectionContainer}>
           <View style={styles.sectionHeaderRow}>
             <Text style={styles.sectionHeading}>
               {activeCategory ? activeCategory : 'STRATEGIC'} <Text style={{color: Colors.accent}}>{activeCategory ? 'INVENTORY' : 'HARDWARE'}</Text>
             </Text>
             {activeCategory && (
               <TouchableOpacity onPress={() => setActiveCategory(null)}>
                 <Text style={styles.viewAllText}>SHOW ALL SECTORS ←</Text>
               </TouchableOpacity>
             )}
           </View>
           
           <View style={activeCategory ? styles.focusedProductGrid : styles.horizontalProductRow}>
             {activeCategory ? (
               <View style={styles.verticalGrid}>
                  {filteredHardware.map(item => (
                    <AnimatedProductCard 
                      key={item.id}
                      item={item}
                      onPress={() => {
                        setSelectedProduct(item);
                        setIsProductModalVisible(true);
                      }}
                    />
                  ))}
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
                  {filteredHardware.map(item => (
                    <AnimatedProductCard 
                      key={item.id}
                      item={item}
                      horizontal
                      onPress={() => {
                        setSelectedProduct(item);
                        setIsProductModalVisible(true);
                      }}
                    />
                  ))}
                </ScrollView>
              )}
           </View>

           {filteredHardware.length === 0 && (
             <View style={styles.emptyProducts}>
               <Text style={styles.emptyProductsText}>NO PRODUCTS IN THIS CATEGORY</Text>
             </View>
           )}
        </View>

        {/* Technical Solutions - Hide in Sector View */}
        {!activeCategory && (
          <View style={styles.sectionContainer}>
             <Text style={[styles.sectionHeading, {textAlign: 'center'}]}>TECHNICAL <Text style={{color: Colors.accent}}>SOLUTIONS</Text></Text>
             <Text style={styles.sectionSubCenter}>Innovative monitoring systems for modern requirements.</Text>
             
             <View style={styles.solutionsGrid}>
                {[
                  { title: 'EXPERT CONSULTATION', desc: 'Customized security audits and planning.', icon: '🛡️', step: '01' },
                  { title: 'PROFESSIONAL ARMORY', desc: 'High-grade hardware from global leaders.', icon: '🔧', step: '02' },
                  { title: 'AUTOMATED VIGILANCE', desc: 'AI-driven alerts and 24/7 monitoring.', icon: '🤖', step: '03' },
                ].map(item => (
                  <View key={item.step} style={styles.solutionCard}>
                     <View style={styles.solutionHeader}>
                        <Text style={styles.solutionIcon}>{item.icon}</Text>
                        <Text style={styles.solutionStep}>{item.step}</Text>
                     </View>
                     <Text style={styles.solutionTitle}>{item.title}</Text>
                     <Text style={styles.solutionDesc}>{item.desc}</Text>
                  </View>
                ))}
             </View>
          </View>
        )}

        {/* Order Workflow - Hide in Sector View */}
        {!activeCategory && (
          <View style={[styles.sectionContainer, {backgroundColor: 'rgba(41,121,255,0.03)', paddingVertical: 40}]}>
             <Text style={styles.sectionHeading}>ORDER <Text style={{color: Colors.accent}}>WORKFLOW</Text></Text>
             <View style={styles.workflowRow}>
                {[
                  { name: 'DIAGNOSIS', num: '01' },
                  { name: 'HARDWARE', num: '02' },
                  { name: 'INSTALLATION', num: '03' },
                  { name: 'ACTIVATION', num: '04' },
                ].map((step, idx) => (
                  <View key={step.num} style={styles.workflowItem}>
                     <View style={styles.workflowCircle}><Text style={styles.workflowNum}>{step.num}</Text></View>
                     <Text style={styles.workflowName}>{step.name}</Text>
                  </View>
                ))}
             </View>
          </View>
        )}

        {/* Performance Section */}
        <View style={styles.performanceSection}>
           <View style={styles.performanceContent}>
              <Text style={styles.performanceTitle}>ENGINEERED FOR <Text style={{color: Colors.accent}}>TOTAL DOMINANCE</Text></Text>
              <View style={styles.perfItem}>
                 <Text style={styles.perfItemTitle}>⚡ SONIC PERFORMANCE</Text>
                 <Text style={styles.perfItemDesc}>Fastest response times in the industry.</Text>
              </View>
              <View style={styles.perfItem}>
                 <Text style={styles.perfItemTitle}>📦 24/7 SUPPORT</Text>
                 <Text style={styles.perfItemDesc}>Always available when you need us.</Text>
              </View>
           </View>
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600' }} 
             style={styles.performanceImage} 
           />
        </View>

        {/* Secured Sectors / Testimonials */}
        <View style={styles.sectionContainer}>
           <Text style={[styles.sectionHeading, {textAlign: 'center'}]}>SECURED <Text style={{color: Colors.accent}}>SECTORS</Text></Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
              {[].map((t: any, idx) => (

                <AppCard key={idx} style={styles.testimonialCard}>
                   <Text style={styles.testimonialText}>"{t.text}"</Text>
                   <Text style={styles.testimonialName}>{t.name}</Text>
                   <Text style={styles.testimonialSector}>{t.sector}</Text>
                </AppCard>
              ))}
           </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
           <Text style={styles.footerLogo}>SK <Text style={{color: Colors.accent}}>TECHNOLOGY</Text></Text>
           <Text style={styles.footerSub}>Providing world-class security infrastructure since 2012.</Text>
           <View style={styles.footerGrid}>
              <View style={styles.footerCol}>
                 <Text style={styles.footerColHeading}>RESOURCES</Text>
                 <Text style={styles.footerLink}>Knowledge Base</Text>
                 <Text style={styles.footerLink}>API Documentation</Text>
              </View>
              <View style={styles.footerCol}>
                 <Text style={styles.footerColHeading}>COMPANY</Text>
                 <Text style={styles.footerLink}>About Us</Text>
                 <Text style={styles.footerLink}>Careers</Text>
              </View>
           </View>
           <View style={styles.footerDivider} />
           <Text style={styles.copyright}>© 2026 SK TECHNOLOGY. ALL RIGHTS RESERVED.</Text>
        </View>

      </ScrollView>

      {/* Product Details Modal */}
      <Modal
        visible={isProductModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsProductModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismissArea} 
            activeOpacity={1} 
            onPress={() => setIsProductModalVisible(false)} 
          />
          <AppCard style={styles.productModalContent}>
            {selectedProduct && (
              <>
                <View style={styles.productModalHeader}>
                  <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsProductModalVisible(false)}>
                    <Text style={styles.closeModalText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView showsVerticalScrollIndicator={false}>
                  <TouchableOpacity 
                    activeOpacity={1}
                    onPressIn={handleZoomIn}
                    onPressOut={handleZoomOut}
                    style={{ overflow: 'hidden' }}
                  >
                    <Animated.Image 
                      source={{ uri: selectedProduct.img }} 
                      style={[
                        styles.detailImage, 
                        { transform: [{ scale: zoomAnim }] }
                      ]} 
                    />
                  </TouchableOpacity>
                  
                  <View style={styles.detailBody}>
                    <Text style={styles.detailCategory}>{selectedProduct.category}</Text>
                    <Text style={styles.detailName}>{selectedProduct.name}</Text>
                    <Text style={styles.detailPrice}>{selectedProduct.price}</Text>
                    
                    <View style={styles.detailDivider} />
                    
                    <Text style={styles.detailSectionTitle}>SPECIFICATIONS & DETAILS</Text>
                    <Text style={styles.detailDesc}>{selectedProduct.desc}</Text>
                    
                    <View style={styles.specsRow}>
                      <View style={styles.specItem}>
                        <Text style={styles.specIcon}>🛡️</Text>
                        <Text style={styles.specText}>SECURED</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Text style={styles.specIcon}>⚡</Text>
                        <Text style={styles.specText}>PRO-GRADE</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Text style={styles.specIcon}>📦</Text>
                        <Text style={styles.specText}>IN STOCK</Text>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={styles.bookNowBtn}
                      onPress={() => {
                        setIsProductModalVisible(false);
                        (navigation as any).navigate('BookService', { serviceId: selectedProduct.id });
                      }}
                    >
                      <Text style={styles.bookNowBtnText}>PROCEED TO BOOKING →</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </AppCard>
        </View>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalDismissArea} 
            activeOpacity={1} 
            onPress={() => setIsModalVisible(false)} 
          />
          <AppCard style={styles.categoryModalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{activeCategory}</Text>
                <Text style={styles.modalSubtitle}>{filteredHardware.length} PRODUCTS DISCOVERED</Text>
              </View>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {filteredHardware.map(item => (
                <View key={item.id} style={styles.modalProductCard}>
                  <Image source={{ uri: item.img }} style={styles.modalProductImg} />
                  <View style={styles.modalProductInfo}>
                    <Text style={styles.modalProductName}>{item.name}</Text>
                    <Text style={styles.modalProductPrice}>{item.price}</Text>
                    <TouchableOpacity 
                      style={styles.detailsBtn}
                      onPress={() => (navigation as any).navigate('Services')}
                    >
                      <Text style={styles.detailsBtnText}>DETAILS</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {filteredHardware.length === 0 && (
                <View style={styles.emptyModal}>
                  <Text style={styles.emptyModalText}>NO ASSETS REGISTERED IN THIS SECTOR</Text>
                </View>
              )}
            </ScrollView>
          </AppCard>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 50,
    backgroundColor: Colors.background 
  },
  logoBox: { flex: 1, height: 40, justifyContent: 'center' },
  logoImage: { width: 140, height: 40 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', margin: 20, paddingHorizontal: 20, height: 56, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(41,121,255,0.2)' },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  clearSearch: { color: 'rgba(255,255,255,0.4)', fontSize: 18, padding: 10 },

  cartBtn: { backgroundColor: Colors.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, marginLeft: 8 },
  cartBtnText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  
  campaignContainer: { paddingVertical: 10 },
  campaignSlide: { width: width, paddingHorizontal: 20 },
  campaignCard: { backgroundColor: '#0A122A', borderColor: 'rgba(41,121,255,0.3)', borderWidth: 1, padding: 20 },
  campaignContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  campDiscount: { color: Colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  campTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 6 },
  campDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  campImage: { width: 80, height: 80, borderRadius: 12 },
  voucherBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  voucherText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  heroSection: { padding: 20, paddingBottom: 40 },
  heroContent: { zIndex: 10 },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: '900', lineHeight: 48, marginBottom: 15 },
  heroSub: { color: Colors.mutedText, fontSize: 14, lineHeight: 22, marginBottom: 25, maxWidth: '80%' },
  heroActionRow: { flexDirection: 'row', gap: 15 },
  primaryBtn: { backgroundColor: Colors.accent, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 10 },
  primaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  secondaryBtn: { backgroundColor: 'transparent', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  secondaryBtnText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  
  heroImageBox: { marginTop: 40, height: 300, borderRadius: 30, overflow: 'hidden', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroImageOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(10,31,68,0.3)' },

  sectionContainer: { padding: 20, marginBottom: 40 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionHeading: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1, marginBottom: 20 },
  viewAllText: { color: Colors.accent, fontSize: 10, fontWeight: '800' },
  sectionSubCenter: { color: Colors.mutedText, fontSize: 12, textAlign: 'center', marginBottom: 30, top: -10 },

  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryItem: { width: '18%', alignItems: 'center', marginBottom: 20 },
  categoryIconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  categoryIcon: { fontSize: 20 },
  categoryName: { color: Colors.mutedText, fontSize: 8, fontWeight: '800', textAlign: 'center' },
  activeCategoryBox: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  activeCategoryText: { color: Colors.accent },

  emptyProducts: { padding: 40, width: width - 40, alignItems: 'center' },
  emptyProductsText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', letterSpacing: 2 },

  horizontalProductRow: { marginBottom: 10 },
  focusedProductGrid: { marginTop: 10 },

  verticalGrid: { gap: 15 },
  focusedProductCard: { flexDirection: 'row', padding: 15, borderRadius: 20 },
  focusedProductImg: { width: 100, height: 100, borderRadius: 15 },
  focusedProductInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },

  // Product Modal Styles
  productModalContent: { width: '95%', maxHeight: '90%', padding: 0, backgroundColor: '#020817', borderRadius: 32, overflow: 'hidden' },
  productModalHeader: { position: 'absolute', top: 20, right: 20, zIndex: 100 },
  detailImage: { width: '100%', height: 300, resizeMode: 'cover' },
  detailBody: { padding: 25 },
  detailCategory: { color: Colors.accent, fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  detailName: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 10 },
  detailPrice: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 20 },
  detailDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  detailSectionTitle: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 12 },
  detailDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 24, marginBottom: 25 },
  specsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  specItem: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 15, width: '30%' },
  specIcon: { fontSize: 20, marginBottom: 5 },
  specText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  bookNowBtn: { backgroundColor: Colors.accent, paddingVertical: 18, borderRadius: 15, alignItems: 'center' },
  bookNowBtnText: { color: '#fff', fontSize: 14, fontWeight: '900' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalDismissArea: { ...StyleSheet.absoluteFill },
  categoryModalContent: { width: '90%', maxHeight: '80%', padding: 25, backgroundColor: '#020817', borderRadius: 32, borderWidth: 1, borderColor: 'rgba(41,121,255,0.2)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  modalTitle: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  modalSubtitle: { color: Colors.accent, fontSize: 10, fontWeight: '900', marginTop: 4, letterSpacing: 1 },
  closeModalBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  closeModalText: { color: '#fff', fontSize: 18, fontWeight: '300' },
  modalScrollContent: { paddingBottom: 20 },
  modalProductCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalProductImg: { width: 100, height: 100, borderRadius: 15 },
  modalProductInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  modalProductName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  modalProductPrice: { color: Colors.accent, fontSize: 18, fontWeight: '900' },
  modalBuyBtn: { backgroundColor: Colors.accent, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, alignSelf: 'flex-start' },
  modalBuyBtnText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  emptyModal: { padding: 40, alignItems: 'center' },
  emptyModalText: { color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', textAlign: 'center', letterSpacing: 1 },

  productCard: { width: 200, marginRight: 15, padding: 15 },
  productImg: { width: '100%', height: 120, borderRadius: 15, marginBottom: 12 },
  productName: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 8 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { color: Colors.accent, fontSize: 14, fontWeight: '900' },
  detailsBtn: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  detailsBtnText: { color: '#fff', fontSize: 8, fontWeight: '800' },

  solutionsGrid: { gap: 15 },
  solutionCard: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 25, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  solutionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  solutionIcon: { fontSize: 32 },
  solutionStep: { color: 'rgba(255,255,255,0.1)', fontSize: 24, fontWeight: '900' },
  solutionTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  solutionDesc: { color: Colors.mutedText, fontSize: 12, lineHeight: 18 },

  workflowRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  workflowItem: { alignItems: 'center', width: '23%' },
  workflowCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  workflowNum: { color: '#fff', fontSize: 14, fontWeight: '900' },
  workflowName: { color: Colors.mutedText, fontSize: 8, fontWeight: '800' },

  performanceSection: { flexDirection: 'row', padding: 20, marginBottom: 40, alignItems: 'center' },
  performanceContent: { flex: 1 },
  performanceTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 20 },
  perfItem: { marginBottom: 15 },
  perfItemTitle: { color: '#fff', fontSize: 12, fontWeight: '900', marginBottom: 4 },
  perfItemDesc: { color: Colors.mutedText, fontSize: 11 },
  performanceImage: { width: 120, height: 200, borderRadius: 20, marginLeft: 20 },

  testimonialCard: { width: 280, marginRight: 15, padding: 25 },
  testimonialText: { color: '#fff', fontSize: 14, fontStyle: 'italic', lineHeight: 22, marginBottom: 15 },
  testimonialName: { color: Colors.accent, fontSize: 14, fontWeight: '900' },
  testimonialSector: { color: Colors.mutedText, fontSize: 10, fontWeight: '700' },

  footer: { backgroundColor: '#020817', padding: 40, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  footerLogo: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 10 },
  footerSub: { color: Colors.mutedText, fontSize: 12, lineHeight: 20, marginBottom: 30 },
  footerGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  footerCol: { width: '45%' },
  footerColHeading: { color: '#fff', fontSize: 12, fontWeight: '900', marginBottom: 15 },
  footerLink: { color: Colors.mutedText, fontSize: 12, marginBottom: 10 },
  footerDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 30 },
  copyright: { color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'center', fontWeight: '700' },
});

export default CustomerDashboard;
