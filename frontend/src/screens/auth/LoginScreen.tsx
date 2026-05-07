import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import AppFooter from '../../components/AppFooter';
import AppLogo from '../../components/AppLogo';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (err: any) {
      const message = err?.response?.data?.message || 
                     (err?.request ? 'Cannot connect to server. Please check your network or server status.' : 'An unexpected error occurred.');
      Alert.alert('Login Failed', message);
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <AppLogo size={28} />
              <Text style={styles.logoText}>SK Technology</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => Alert.alert('Notifications', 'Please sign in to view notifications.')}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleBox}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your dashboard</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="your@email.com"
                leftIcon="✉️"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <AppInput
                label="Password"
                placeholder="Enter your password"
                leftIcon="🔒"
                isPassword
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <AppButton
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>

        {/* Demo Credentials */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>🔑 Demo Credentials</Text>
          <Text style={styles.demoText}>Admin: admin@sktechnology.com / Admin@123</Text>
          <Text style={styles.demoText}>Tech: tech@sktechnology.com / Tech@123</Text>
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main App Footer */}
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

  titleBox: { marginBottom: 32 },
  title: { color: Colors.text, fontSize: 32, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: Colors.mutedText, fontSize: 15 },

  form: { marginBottom: 8 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: Colors.accent, fontSize: 13, fontWeight: '600' },
  submitBtn: { marginTop: 4 },

  demoBox: {
    backgroundColor: 'rgba(41,121,255,0.08)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 16,
    gap: 4,
  },
  demoTitle: { color: Colors.accent, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  demoText: { color: Colors.mutedText, fontSize: 12 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: Colors.mutedText, fontSize: 14 },
  footerLink: { color: Colors.accent, fontSize: 14, fontWeight: '700' },
});

export default LoginScreen;
