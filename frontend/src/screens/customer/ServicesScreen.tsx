import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { serviceApi } from '../../api/serviceApi';
import { Service } from '../../types/service.types';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';
import Loading from '../../components/Loading';
import AppButton from '../../components/AppButton';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';

type NavProp = NativeStackNavigationProp<CustomerStackParamList>;

const CATEGORY_ICONS: Record<string, string> = {
  CCTV: '📹',
  'Smart Security': '🛡️',
  Monitoring: '👁️',
  Networking: '🌐',
  Maintenance: '🔧',
};

const ServicesScreen = () => {
  const navigation = useNavigation<NavProp>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await serviceApi.getAll();
      setServices(res.data.data.services);
    } catch {
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  if (loading) return <Loading />;

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Services</Text>
        <Text style={styles.headerSub}>{services.length} services available</Text>
      </View>

      <FlatList
        data={services}
        keyExtractor={s => s._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); fetchServices(); }}
        renderItem={({ item }) => (
          <AppCard style={styles.card} noPadding>
            {/* Service Image */}
            <View style={styles.imageBox}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Text style={styles.imageIcon}>{CATEGORY_ICONS[item.category] || '🔒'}</Text>
                </View>
              )}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceDesc} numberOfLines={2}>{item.description}</Text>

              <View style={styles.footer}>
                <View>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
                </View>
                <AppButton
                  title="Book Now"
                  onPress={() => navigation.navigate('BookService', { serviceId: item._id })}
                  style={styles.bookBtn}
                  fullWidth={false}
                />
              </View>
            </View>
          </AppCard>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔒</Text>
            <Text style={styles.emptyText}>No services available</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { padding: 20, paddingBottom: 12 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '900' },
  headerSub: { color: Colors.mutedText, fontSize: 13, marginTop: 4 },
  list: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { overflow: 'hidden' },
  imageBox: { position: 'relative' },
  image: { width: '100%', height: 160 },
  imagePlaceholder: { backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  imageIcon: { fontSize: 52 },
  categoryBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(2,8,23,0.7)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border },
  categoryText: { color: Colors.accent, fontSize: 11, fontWeight: '700' },
  cardContent: { padding: 16 },
  serviceTitle: { color: Colors.text, fontSize: 18, fontWeight: '800', marginBottom: 6 },
  serviceDesc: { color: Colors.mutedText, fontSize: 13, lineHeight: 20, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: Colors.mutedText, fontSize: 11 },
  price: { color: Colors.accent, fontSize: 22, fontWeight: '900' },
  bookBtn: { paddingHorizontal: 20, paddingVertical: 11, borderRadius: 12 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: Colors.mutedText, fontSize: 16 },
});

export default ServicesScreen;
