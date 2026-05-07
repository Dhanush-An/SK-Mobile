import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Colors } from '../../constants/colors';
import AppButton from '../../components/AppButton';
import { useWishlist } from '../../context/WishlistContext';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'ProductDetail'>;
type RoutePropType = RouteProp<AuthStackParamList, 'ProductDetail'>;

// Mock database to simulate fetching product by ID
const MOCK_DB: Record<string, any> = {
  '1': {
    id: '1',
    title: 'CONSISTENT 4MP',
    category: 'CCTV CAMERAS',
    rating: 4.8,
    reviews: 124,
    price: '2,300',
    originalPrice: '3,999',
    desc: 'Consistent 4 mp, Series 24/7 IP Indoor & Outdoor Bullet Camera. High definition monitoring for comprehensive security coverage.',
    features: ['1080p Full HD Resolution', 'Night Vision up to 30m', 'Motion Detection Alerts', 'Weatherproof IP67', 'Easy Mobile Access'],
  },
  '2': {
    id: '2',
    title: 'KRYSTAA 2 TB HDD',
    category: 'STORAGE',
    rating: 4.5,
    reviews: 89,
    price: '9,800',
    originalPrice: '12,500',
    desc: 'Internal Hard Disk Drive optimized specifically for continuous 24/7 video surveillance recording.',
    features: ['2 TB Capacity', 'SATA 6.0Gb/s Interface', 'Optimized for 24/7 loads', 'Low Power Consumption', '3 Year Warranty'],
  },
  '3': {
    id: '3',
    title: 'DAICHI 1 TB HDD',
    category: 'STORAGE',
    rating: 4.9,
    reviews: 210,
    price: '5,900',
    originalPrice: '7,000',
    desc: 'Daichi 1 TB Surveillance Systems Hard Disk. Reliable performance for small to medium security setups.',
    features: ['1 TB Capacity', 'Surveillance Grade', 'High Write Workload Rate', 'Vibration Tolerance'],
  },
  '4': {
    id: '4',
    title: 'DAICHI 500 HDD',
    category: 'STORAGE',
    rating: 4.8,
    reviews: 56,
    price: '2,900',
    originalPrice: '3,500',
    desc: 'Daichi 500GB AHD Security Camera Surveillance System Hard Drive.',
    features: ['500 GB Capacity', 'Cost Effective', 'Quiet Operation', 'Durable Build'],
  },
};

const ProductDetailScreen = ({ navigation, route }: { navigation: NavProp, route: RoutePropType }) => {
  const { productId } = route.params;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  // Fetch product or fallback to a default if not found
  const product = MOCK_DB[productId] || MOCK_DB['1'];
  
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRODUCT DETAILS</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Image Placeholder */}
        <View style={styles.imageSection}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>PRODUCT IMAGE</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryBadge}>{product.category}</Text>
            <Text style={styles.ratingText}>⭐ {product.rating} ({product.reviews} reviews)</Text>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>SAVE OFF</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.desc}</Text>

          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresList}>
            {product.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconActionBtn} onPress={toggleWishlist}>
          <Text style={[styles.iconActionText, inWishlist && { color: 'red' }]}>
            {inWishlist ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        <AppButton 
          title="BOOK NOW" 
          onPress={() => navigation.navigate('Login')} 
          style={styles.bookBtn} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: Colors.text, fontSize: 18 },
  headerTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: { fontSize: 18 },
  
  scrollContent: { paddingBottom: 100 },

  imageSection: {
    padding: 24,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageText: { color: Colors.mutedText, fontSize: 16, fontWeight: '700', letterSpacing: 2 },

  infoSection: { padding: 24 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { color: Colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1, backgroundColor: 'rgba(41,121,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  ratingText: { color: Colors.text, fontSize: 12, fontWeight: '700' },
  
  title: { color: Colors.text, fontSize: 28, fontWeight: '900', marginBottom: 16 },
  
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 32, gap: 12 },
  price: { color: Colors.text, fontSize: 32, fontWeight: '900' },
  originalPrice: { color: Colors.mutedText, fontSize: 16, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: Colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discountText: { color: 'white', fontSize: 10, fontWeight: '800' },

  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', marginBottom: 12, marginTop: 8 },
  description: { color: Colors.mutedText, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  
  featuresList: { gap: 12 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  featureIcon: { color: Colors.accent, fontSize: 16, fontWeight: '900' },
  featureText: { color: Colors.text, fontSize: 14, fontWeight: '600' },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  iconActionBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActionText: { fontSize: 24 },
  bookBtn: { flex: 1, height: 56 },
});

export default ProductDetailScreen;
