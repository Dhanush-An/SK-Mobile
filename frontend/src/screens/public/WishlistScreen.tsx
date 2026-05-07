import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Colors } from '../../constants/colors';
import { useWishlist } from '../../context/WishlistContext';

const { width } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Wishlist'>;

const ITEMS_PER_PAGE = 4;

const WishlistScreen = ({ navigation }: { navigation: NavProp }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWishlist = wishlist.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page if wishlist becomes smaller than current page allows
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [wishlist.length, totalPages]);

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Text style={{color: Colors.text}}>Image Placeholder</Text>
      </View>
      <View style={styles.cardHeader}>
        <Text style={styles.categoryText}>{item.category}</Text>
        <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
          <Text style={styles.removeIcon}>❌</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.productDesc} numberOfLines={2}>{item.desc}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>₹{item.price}</Text>
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
        <Text style={styles.headerTitle}>YOUR WISHLIST</Text>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Products')}>
            <Text style={styles.exploreBtnText}>EXPLORE PRODUCTS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedWishlist}
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
        </>
      )}
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
  headerTitle: { color: Colors.text, fontSize: 20, fontWeight: '900', fontStyle: 'italic' },
  
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyText: { color: Colors.mutedText, fontSize: 16, marginBottom: 24 },
  exploreBtn: { backgroundColor: Colors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  exploreBtnText: { color: 'white', fontSize: 12, fontWeight: '800' },

  listContainer: { paddingHorizontal: 12, paddingBottom: 40, paddingTop: 16 },
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
  removeIcon: { fontSize: 12 },
  productTitle: { color: Colors.text, fontSize: 12, fontWeight: '800', marginBottom: 4 },
  productDesc: { color: Colors.mutedText, fontSize: 10, lineHeight: 14, marginBottom: 12, height: 28 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 16 },
  priceText: { color: Colors.text, fontSize: 16, fontWeight: '900' },
  
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
    marginTop: -4,
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

export default WishlistScreen;
