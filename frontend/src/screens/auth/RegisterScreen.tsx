import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppFooter from '../../components/AppFooter';
import AppLogo from '../../components/AppLogo';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper padded={false}>
      <View style={{ padding: 20, paddingTop: 10, paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Landing')} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.logoRow}>
              <AppLogo size={28} />
              <Text style={styles.logoText}>SK Technology</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => Alert.alert('Notifications', 'Please register to view notifications.')}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

      {/* Title */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join SK Technology today</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <AppInput label="Full Name" placeholder="Your full name" leftIcon="👤" value={value} onChangeText={onChange} error={errors.name?.message} />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AppInput label="Email Address" placeholder="your@email.com" leftIcon="✉️" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.email?.message} />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <AppInput 
              label="Phone Number" 
              placeholder="10-digit phone number" 
              leftIcon="📱" 
              keyboardType="phone-pad" 
              maxLength={10}
              value={value} 
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))} 
              error={errors.phone?.message} 
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <AppInput label="Password" placeholder="Min. 6 characters" leftIcon="🔒" isPassword value={value} onChangeText={onChange} error={errors.password?.message} />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <AppInput label="Confirm Password" placeholder="Re-enter password" leftIcon="🔒" isPassword value={value} onChangeText={onChange} error={errors.confirmPassword?.message} />
          )}
        />

        <View style={styles.termsBox}>
          <Text style={styles.termsText}>
            By registering, you agree to our{' '}
            <Text style={{ color: Colors.accent }}>Terms of Service</Text> and{' '}
            <Text style={{ color: Colors.accent }}>Privacy Policy</Text>.
          </Text>
        </View>

        <AppButton
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.submitBtn}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
      </View>
      
      <AppFooter />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 12, padding: 4 },
  backIcon: { color: Colors.text, fontSize: 22, fontWeight: '600' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoText: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  notifBtn: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: Colors.inputBg, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifIcon: { fontSize: 16 },
  titleBox: { marginBottom: 28 },
  title: { color: Colors.text, fontSize: 32, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: Colors.mutedText, fontSize: 15 },
  form: {},
  termsBox: { marginVertical: 16 },
  termsText: { color: Colors.mutedText, fontSize: 12, lineHeight: 18 },
  submitBtn: { marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: Colors.mutedText, fontSize: 14 },
  footerLink: { color: Colors.accent, fontSize: 14, fontWeight: '700' },
});

export default RegisterScreen;
