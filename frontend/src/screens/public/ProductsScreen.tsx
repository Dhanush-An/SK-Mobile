import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Products'>;

const MOCK_PRODUCTS = [
  {
    id: '1',
    category: 'CCTV CAMERAS',
    rating: 4.8,
    title: 'CONSISTENT 4MP',
    desc: 'Consistent 4 mp, Series 24/7 IP Indoor & Outdoor Bullet Camera...',
    price: '2,300',
    originalPrice: '3,999',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    category: 'CCTV CAMERAS',
    rating: 4.5,
    title: 'KRYSTAA 2 TB HDD',
    desc: 'Internal Hard Disk Drive for Surveillance.',
    price: '9,800',
    originalPrice: '12,500',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    category: 'CCTV CAMERAS',
    rating: 4.9,
    title: 'DAICHI 1 TB HDD',
    desc: 'Daichi 1 TB Surveillance Systems Hard Disk',
    price: '5,900',
    originalPrice: '7,000',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    category: 'CCTV CAMERAS',
    rating: 4.8,
    title: 'DAICHI 500 HDD',
    desc: 'Daichi 500GB AHD Security Camera Surveillance System Hard Drive.',
    price: '2,900',
    originalPrice: '3,500',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '5',
    category: 'ACCESSORIES',
    rating: 4.6,
    title: 'POWER SUPPLY 5A',
    desc: 'Stable power supply for up to 4 cameras with surge protection.',
    price: '850',
    originalPrice: '1,200',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '6',
    category: 'CABLES',
    rating: 4.7,
    title: 'BNC CONNECTORS (10P)',
    desc: 'High-quality copper BNC connectors for video transmission.',
    price: '450',
    originalPrice: '600',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '7',
    category: 'STORAGE',
    rating: 4.8,
    title: 'SKYHAWK 4 TB HDD',
    desc: 'Seagate SkyHawk 4TB Surveillance Internal Hard Drive HDD.',
    price: '14,500',
    originalPrice: '18,000',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '8',
    category: 'CCTV CAMERAS',
    rating: 4.9,
    title: 'IP CAMERA 8MP',
    desc: 'Ultra HD 8MP IP Camera with Color Night Vision and AI Detection.',
    price: '4,800',
    originalPrice: '6,500',
    image: 'https://via.placeholder.com/150',
  },
];

const ITEMS_PER_PAGE = 4;

const ProductsScreen = ({ navigation }: { navigation: NavProp }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.title.toUpperCase().includes(search.toUpperCase()) || 
    p.category.toUpperCase().includes(search.toUpperCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderProduct = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Text style={{color: Colors.text}}>Image Placeholder</Text>
      </View>
      <View style={styles.cardHeader}>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Text style={styles.ratingText}>⭐ {item.rating}</Text>
      </View>
      <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.productDesc} numberOfLines={2}>{item.desc}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>₹{item.price}</Text>
        <Text style={styles.originalPriceText}>₹{item.originalPrice}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.buyBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buyBtnText}>BUY NOW</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.detailsBtn} 
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
          <Text style={styles.detailsBtnText}>DETAILS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRODUCT CATALOG</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="SEARCH PRODUCTS..."
            placeholderTextColor={Colors.mutedText}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setCurrentPage(1);
            }}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterBtnIcon}>⚲</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusText}>STATUS: {filteredProducts.length} PRODUCTS FOUND</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={paginatedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.rowWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* Pagination Footer */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationBtn, currentPage === 1 && styles.paginationBtnDisabled]} 
          onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationBtnText}>‹</Text>
        </TouchableOpacity>
        
        <View style={styles.pageIndicator}>
          <Text style={styles.pageNumberText}>{currentPage}</Text>
          <View style={styles.pageIndicatorDivider} />
          <Text style={styles.totalPageText}>{totalPages || 1}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.paginationBtn, (currentPage === totalPages || totalPages === 0) && styles.paginationBtnDisabled]} 
          onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <Text style={styles.paginationBtnText}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  backBtnText: { color: Colors.text, fontSize: 18 },
  headerTitle: { color: Colors.text, fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: Colors.text, paddingVertical: 12, fontSize: 12 },
  filterBtn: {
    width: 48,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnIcon: { color: Colors.text, fontSize: 18 },

  statusRow: { paddingHorizontal: 16, marginBottom: 16 },
  statusText: { color: Colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  listContainer: { paddingHorizontal: 12, paddingBottom: 40 },
  rowWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  
  productCard: {
    width: (width - 40) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoryText: { color: Colors.accent, fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  ratingText: { color: Colors.text, fontSize: 10, fontWeight: '700' },
  productTitle: { color: Colors.text, fontSize: 12, fontWeight: '800', marginBottom: 4 },
  productDesc: { color: Colors.mutedText, fontSize: 10, lineHeight: 14, marginBottom: 12, height: 28 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 16 },
  priceText: { color: Colors.text, fontSize: 16, fontWeight: '900' },
  originalPriceText: { color: Colors.mutedText, fontSize: 10, textDecorationLine: 'line-through', marginBottom: 2 },
  
  cardActions: { flexDirection: 'row', gap: 8 },
  buyBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  buyBtnText: { color: 'white', fontSize: 9, fontWeight: '800' },
  detailsBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  detailsBtnText: { color: Colors.text, fontSize: 9, fontWeight: '800' },
  
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paginationBtn: {
    backgroundColor: Colors.accent,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  paginationBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    elevation: 0,
  },
  paginationBtnText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -4, // Adjust for chevron vertical alignment
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageNumberText: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  pageIndicatorDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  totalPageText: {
    color: Colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProductsScreen;
