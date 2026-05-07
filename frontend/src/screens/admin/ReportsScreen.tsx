import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import ScreenWrapper from '../../components/ScreenWrapper';
import AppCard from '../../components/AppCard';

const ReportsScreen = () => {
  return (
    <ScreenWrapper padded={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ANALYTICS HUB</Text>
          <Text style={styles.subtitle}>ENTERPRISE PERFORMANCE METRICS</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AppCard style={styles.chartPlaceholder}>
            <Text style={styles.chartTitle}>REVENUE GROWTH</Text>
            <View style={styles.chartMock}>
              {[40, 70, 50, 90, 60, 100].map((h, i) => (
                <View key={i} style={[styles.bar, {height: h}]} />
              ))}
            </View>
            <View style={styles.chartLabels}>
              {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map(l => (
                <Text key={l} style={styles.label}>{l}</Text>
              ))}
            </View>
          </AppCard>

          <View style={styles.grid}>
            <AppCard style={styles.miniStat}>
              <Text style={styles.miniLabel}>CONVERSION</Text>
              <Text style={styles.miniValue}>18.4%</Text>
              <Text style={[styles.trend, {color: '#00E676'}]}>↑ 2.1%</Text>
            </AppCard>
            <AppCard style={styles.miniStat}>
              <Text style={styles.miniLabel}>RETENTION</Text>
              <Text style={styles.miniValue}>92.0%</Text>
              <Text style={[styles.trend, {color: '#00E676'}]}>↑ 0.5%</Text>
            </AppCard>
          </View>

          <AppCard style={styles.recentActivity}>
            <Text style={styles.chartTitle}>SYSTEM HEALTH</Text>
            <View style={styles.healthRow}>
              <Text style={styles.healthText}>API Response Time</Text>
              <Text style={styles.healthValue}>124ms</Text>
            </View>
            <View style={styles.healthRow}>
              <Text style={styles.healthText}>Database Sync</Text>
              <Text style={[styles.healthValue, {color: '#00E676'}]}>Healthy</Text>
            </View>
          </AppCard>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, paddingTop: 40 },
  header: { marginBottom: 25 },
  title: { color: Colors.text, fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: Colors.mutedText, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 4 },
  
  scrollContent: { paddingBottom: 100 },
  chartPlaceholder: { padding: 20, marginBottom: 20 },
  chartTitle: { color: Colors.text, fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 20 },
  chartMock: { height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 10 },
  bar: { width: 30, backgroundColor: Colors.accent, borderRadius: 6, opacity: 0.8 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5 },
  label: { color: Colors.mutedText, fontSize: 9, fontWeight: '700' },
  
  grid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  miniStat: { flex: 1, padding: 15, alignItems: 'center' },
  miniLabel: { color: Colors.mutedText, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  miniValue: { color: Colors.text, fontSize: 20, fontWeight: '900', marginVertical: 4 },
  trend: { fontSize: 10, fontWeight: '900' },
  
  recentActivity: { padding: 20 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  healthText: { color: Colors.mutedText, fontSize: 12, fontWeight: '600' },
  healthValue: { color: Colors.text, fontSize: 12, fontWeight: '800' },
});

export default ReportsScreen;
