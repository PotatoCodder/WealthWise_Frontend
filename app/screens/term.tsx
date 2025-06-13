import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';

export default function TermsScreen() {
  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.secondaryView}>
          <Text style={styles.heading}>Terms of Use for Wealth Wise</Text>

          <Text style={styles.section}>
            Welcome to Wealth Wise – your intelligent budgeting partner. Please read these Terms of Use carefully before using the app. By accessing or using Wealth Wise, you agree to be bound by these terms.
          </Text>

          <Text style={styles.subheading}>1. Acceptance of Terms</Text>
          <Text style={styles.section}>
            By using this application, you acknowledge that you have read, understood, and agree to comply with these Terms of Use and our Privacy Policy. If you do not agree, please do not use the application.
          </Text>

          <Text style={styles.subheading}>2. Description of the Service</Text>
          <Text style={styles.section}>
            Wealth Wise is a free, Android-based budgeting application designed to help users—especially students—manage their expenses, view analytics, and forecast future spending. The app is for personal, non-commercial use only.
          </Text>

          <Text style={styles.subheading}>3. User Responsibilities</Text>
          <Text style={styles.section}>
            As a user, you agree to:{'\n'}
            • Use the app for lawful and personal purposes only.{'\n'}
            • Enter accurate financial information to get meaningful insights.{'\n'}
            • Secure your device and access credentials to protect your data.{'\n'}
            • Avoid attempting to reverse-engineer or tamper with the application’s code or functionality.
          </Text>

          <Text style={styles.subheading}>4. Data and Storage</Text>
          <Text style={styles.section}>
            • All user-entered data is stored locally on your device.{'\n'}
            • Optional cloud sync (e.g., Firebase) may store data online, protected by Firebases security protocols.{'\n'}
            • Wealth Wise does not support Two-Factor Authentication (2FA). You are responsible for securing your device with a PIN, password, or biometric lock.
          </Text>

          <Text style={styles.subheading}>5. Intellectual Property</Text>
          <Text style={styles.section}>
            All content, design, code, and branding in the app are the intellectual property of the developers of Wealth Wise. You may not copy, modify, distribute, or republish any part of the app without written permission.
          </Text>

          <Text style={styles.subheading}>6. Limitations of Liability</Text>
          <Text style={styles.section}>
            Wealth Wise is provided “as is” and “as available” without warranties of any kind. We are not liable for:{'\n'}
            • Any financial loss or inaccuracy resulting from the use of the app.{'\n'}
            • Loss of data due to device damage, app malfunction, or uninstallation.{'\n'}
            • Unauthorized access due to lack of device-level security.
          </Text>

          <Text style={styles.subheading}>7. Modifications and Updates</Text>
          <Text style={styles.section}>
            We reserve the right to modify or discontinue any part of the app at any time. Updates to features or terms may occur without prior notice, and continued use constitutes your acceptance of any changes.
          </Text>

          <Text style={styles.subheading}>8. Termination</Text>
          <Text style={styles.section}>
            We may suspend or terminate your access to the app if you violate these Terms of Use. You may stop using the app and delete your data at any time by uninstalling it.
          </Text>

          <Text style={styles.subheading}>9. Governing Law</Text>
          <Text style={styles.section}>
            These terms shall be governed by the laws of [Insert Country or Region], without regard to its conflict of law provisions.
          </Text>

          <Text style={styles.subheading}>10. Contact Information</Text>
          <Text style={styles.section}>
            📧 Email: wealthwise.support@gmail.com{'\n'}
            📱 App Name: Wealth Wise
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#4E008E',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    marginTop: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E008E',
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
    color: '#4E008E',
  },
});
