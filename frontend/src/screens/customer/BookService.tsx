import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { serviceApi } from '../../api/serviceApi';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { bookingSchema, BookingFormData } from '../../utils/validators';
import { Service } from '../../types/service.types';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import { CustomerStackParamList } from '../../navigation/CustomerNavigator';

type NavProp = NativeStackNavigationProp<CustomerStackParamList>;
type RouteType = RouteProp<CustomerStackParamList, 'BookService'>;

const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookService = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { serviceId: route.params?.serviceId || '', contactPhone: user?.phone || '' },
  });

  useEffect(() => {
    serviceApi.getAll().then(res => {
      const svcs: Service[] = res.data.data.services;
      setServices(svcs);
      if (route.params?.serviceId) {
        const pre = svcs.find(s => s._id === route.params?.serviceId);
        if (pre) setSelectedService(pre);
      }
    });
  }, []);

  const onDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setValue('preferredDate', date.toISOString().split('T')[0]);
    }
  };

  const onTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue('preferredTime', time);
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      setLoading(true);
      const res = await orderApi.create(data);
      const orderId = res.data.data.order._id;
      Alert.alert('✅ Booking Confirmed!', 'Your service has been booked. We will assign a technician soon.', [
        { text: 'View Booking', onPress: () => navigation.replace('BookingDetails', { orderId }) },
      ]);
    } catch (err: any) {
      Alert.alert('Booking Failed', err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Service</Text>
      </View>

      {/* Service Selection */}
      <Text style={styles.sectionLabel}>Select Service</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {services.map(s => (
          <TouchableOpacity
            key={s._id}
            style={[styles.serviceOption, selectedService?._id === s._id && styles.serviceSelected]}
            onPress={() => { setSelectedService(s); setValue('serviceId', s._id); }}
            activeOpacity={0.8}>
            <Text style={styles.serviceOptionTitle}>{s.title}</Text>
            <Text style={styles.serviceOptionPrice}>₹{s.price.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.serviceId && <Text style={styles.errorText}>{errors.serviceId.message}</Text>}

      {/* Summary */}
      {selectedService && (
        <AppCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📋 Order Summary</Text>
          <Text style={styles.summaryService}>{selectedService.title}</Text>
          <Text style={styles.summaryPrice}>Total: <Text style={styles.summaryPriceVal}>₹{selectedService.price.toLocaleString()}</Text></Text>
        </AppCard>
      )}

      {/* Date */}
      <Text style={styles.sectionLabel}>Preferred Date</Text>
      <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateIcon}>📅</Text>
        <Text style={styles.dateText}>
          {selectedDate ? selectedDate.toDateString() : 'Select a date'}
        </Text>
      </TouchableOpacity>
      {errors.preferredDate && <Text style={styles.errorText}>{errors.preferredDate.message}</Text>}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={onDateChange}
        />
      )}

      {/* Time */}
      <Text style={styles.sectionLabel}>Preferred Time</Text>
      <View style={styles.timesGrid}>
        {TIMES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.timeChip, selectedTime === t && styles.timeChipSelected]}
            onPress={() => onTimeSelect(t)}>
            <Text style={[styles.timeText, selectedTime === t && styles.timeTextSelected]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.preferredTime && <Text style={styles.errorText}>{errors.preferredTime.message}</Text>}

      {/* Address */}
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Full Address" placeholder="House/Flat No, Street, City, PIN" leftIcon="📍" multiline numberOfLines={3} value={value} onChangeText={onChange} error={errors.address?.message} />
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="contactPhone"
        render={({ field: { onChange, value } }) => (
          <AppInput 
            label="Contact Number" 
            placeholder="10-digit phone number" 
            leftIcon="📱" 
            keyboardType="phone-pad" 
            maxLength={10}
            value={value} 
            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))} 
            error={errors.contactPhone?.message} 
          />
        )}
      />

      {/* Notes */}
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Additional Notes (Optional)" placeholder="Any specific requirements..." leftIcon="📝" multiline numberOfLines={3} value={value || ''} onChangeText={onChange} />
        )}
      />

      <AppButton title="Confirm Booking" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: 8 }} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  backBtn: { padding: 4 },
  backIcon: { color: Colors.text, fontSize: 22, fontWeight: '600' },
  headerTitle: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  sectionLabel: { color: Colors.mutedText, fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 4 },
  serviceOption: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, marginRight: 10, borderWidth: 1.5, borderColor: Colors.border, minWidth: 140 },
  serviceSelected: { borderColor: Colors.accent, backgroundColor: 'rgba(41,121,255,0.08)' },
  serviceOptionTitle: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  serviceOptionPrice: { color: Colors.accent, fontSize: 16, fontWeight: '800', marginTop: 4 },
  errorText: { color: Colors.error, fontSize: 12, marginBottom: 8 },
  summaryCard: { marginVertical: 16 },
  summaryTitle: { color: Colors.mutedText, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  summaryService: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  summaryPrice: { color: Colors.mutedText, fontSize: 14 },
  summaryPriceVal: { color: Colors.accent, fontWeight: '800', fontSize: 18 },
  datePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, padding: 14, marginBottom: 8, gap: 10 },
  dateIcon: { fontSize: 20 },
  dateText: { color: Colors.text, fontSize: 15 },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  timeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.inputBg },
  timeChipSelected: { borderColor: Colors.accent, backgroundColor: 'rgba(41,121,255,0.12)' },
  timeText: { color: Colors.mutedText, fontSize: 13, fontWeight: '600' },
  timeTextSelected: { color: Colors.accent },
});

export default BookService;
