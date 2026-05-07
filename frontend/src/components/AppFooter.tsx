import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { Colors } from '../constants/colors';
import AppLogo from './AppLogo';

const AppFooter = () => {
  return (
    <View style={styles.footerContainer}>
      {/* ─── Main Footer ─── */}
      <View style={styles.mainFooter}>
        <View style={styles.footerGrid}>
          
          {/* Column 1: Brand & Socials */}
          <View style={styles.footerCol}>
            <View style={styles.brandBox}>
              <AppLogo size={32} />
              <Text style={styles.brandName}>SK TECHNOLOGY</Text>
            </View>
            <Text style={styles.brandDesc}>
              Building the future of home and business security. We provide smart camera systems for all types of buildings and needs.
            </Text>
            <View style={styles.socialRow}>
              {['📸', '📹', '🔗'].map((icon, idx) => (
                <TouchableOpacity key={idx} style={styles.socialIcon}>
                  <Text style={{fontSize: 18}}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Column 2: Our Products */}
          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>OUR PRODUCTS</Text>
            {['Shop CCTV', 'Home Security', 'Night Vision', 'Smart Monitoring', 'Network Systems'].map((link) => (
              <TouchableOpacity key={link} style={styles.footerLink}>
                <Text style={styles.footerLinkText}>
                  {link === 'Night Vision' ? '→ ' + link : link}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Column 3: Helpful Links */}
          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>HELPFUL LINKS</Text>
            {['SUCCESS STORIES', 'HOW TO INSTALL', 'CUSTOMER HELP', 'REGISTER WARRANTY', 'PRIVACY POLICY'].map((link) => (
              <TouchableOpacity key={link} style={styles.footerLink}>
                <Text style={styles.footerLinkText}>{link}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Column 4: Contact Us */}
          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>CONTACT US</Text>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📍</Text>
              <Text style={styles.contactText}>2/222A , Down street, Berigai Main Road , Soolagiri, Pincode - 635117.</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>9600975483, 9940252983</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactText}>sktechnologycctv@gmail.com</Text>
            </View>

            {/* Badges */}
            <View style={styles.badgeGrid}>
              {[
                { title: 'SECURE', sub: 'PROTECTED SYSTEMS', icon: '🔒' },
                { title: 'PAYMENTS', sub: '100% SECURE', icon: '💳' },
                { title: 'TRUSTED', sub: '5+ YEARS EXPERIENCE', icon: '⭐' },
                { title: 'EXPERTS', sub: 'BEST INSTALLERS', icon: '🛠️' },
              ].map((b) => (
                <View key={b.title} style={styles.badgeCard}>
                  <Text style={styles.badgeIcon}>{b.icon}</Text>
                  <View>
                    <Text style={styles.badgeTitle}>{b.title}</Text>
                    <Text style={styles.badgeSub}>{b.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

        </View>
      </View>

      {/* ─── Bottom Copyright Bar ─── */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyrightText}>
          © 2026 SK TECHNOLOGY. BEST IN CCTV TECHNOLOGY. POWERED BY FIC.
        </Text>
        <View style={styles.statusBox}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>WEBSITE STATUS: ONLINE</Text>
        </View>
        <View style={styles.bottomLinks}>
          {['PRIVACY POLICY', 'HOW IT WORKS', 'SAFETY RULES'].map((link) => (
            <TouchableOpacity key={link}>
              <Text style={styles.bottomLinkText}>{link}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: Colors.card, 
    borderTopWidth: 1,
    borderColor: Colors.border,
    marginTop: 40,
    width: '100%',
  },
  mainFooter: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerGrid: {
    flexDirection: 'column', 
    gap: 32,
  },
  footerCol: {
    flex: 1,
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  brandLogo: {
    fontSize: 28,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.accent,
    letterSpacing: 1.5,
  },
  brandDesc: {
    fontSize: 13,
    color: Colors.mutedText,
    lineHeight: 20,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  footerLink: {
    marginBottom: 10,
  },
  footerLinkText: {
    fontSize: 13,
    color: Colors.mutedText,
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  contactIcon: {
    fontSize: 14,
  },
  contactText: {
    flex: 1,
    fontSize: 12,
    color: Colors.mutedText,
    lineHeight: 18,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  badgeCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.text,
  },
  badgeSub: {
    fontSize: 8,
    color: Colors.mutedText,
    fontWeight: '600',
  },
  bottomBar: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 12,
  },
  copyrightText: {
    fontSize: 10,
    color: Colors.mutedText,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.mutedText,
    letterSpacing: 1,
  },
  bottomLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  bottomLinkText: {
    fontSize: 10,
    color: Colors.mutedText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default AppFooter;
