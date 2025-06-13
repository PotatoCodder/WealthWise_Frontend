import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';

export default function PrivacyScreen() {
  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.secondaryView}>
          <Text style={styles.heading}>Privacy Policy for Wealth Wise</Text>

          <Text style={styles.section}>
            Welcome to Wealth Wise – your intelligent budgeting companion. We respect your privacy and are committed to protecting any personal data you provide. This Privacy Policy explains how we collect, use, store, and safeguard your information when you use our mobile application.
          </Text>

          <Text style={styles.subheading}>1. Information We Collect</Text>
          <Text style={styles.section}>
            <Text style={styles.bold}>a. User-Provided Data{'\n'}</Text>
            • Expenses entered by the user{'\n'}
            • Categories assigned to transactions{'\n'}
            • Budget amounts and financial goals{'\n\n'}
            <Text style={styles.bold}>b. Device Data{'\n'}</Text>
            • Device type and operating system (for app performance purposes only){'\n'}
            Note: We do not collect personal identifiers such as your name, address, phone number, or government-issued IDs.
          </Text>

          <Text style={styles.subheading}>2. How Your Data Is Stored</Text>
          <Text style={styles.section}>
            Your data is stored locally on your device and optionally backed up via Firebase if you choose to enable cloud syncing. All data stored in the cloud is protected by Firebase’s built-in encryption and authentication mechanisms.
          </Text>

          <Text style={styles.subheading}>3. How We Use Your Data</Text>
          <Text style={styles.section}>
            We use your data only to:{'\n'}
            • Display and analyze your personal budgeting trends{'\n'}
            • Provide expense summaries and visual analytics{'\n'}
            • Offer basic forecasting based on your historical entries{'\n'}
            We do not use your data for marketing, third-party sharing, or profiling.
          </Text>

          <Text style={styles.subheading}>4. Data Security</Text>
          <Text style={styles.section}>
            Wealth Wise takes reasonable precautions to protect your information:{'\n'}
            • Local data is stored securely within your device.{'\n'}
            • Cloud-synced data is encrypted and hosted on secure Firebase servers.{'\n'}
            • Optional passcode or PIN access can be enabled within the app.{'\n\n'}
            Limitation: Wealth Wise does not support Two-Factor Authentication (2FA) at this time. We strongly advise users to secure their device with a lock screen to prevent unauthorized access.
          </Text>

          <Text style={styles.subheading}>5. No Data Sharing with Third Parties</Text>
          <Text style={styles.section}>
            We do not sell, trade, or share your data with third parties. Your information is used exclusively within the app for personal budgeting purposes.
          </Text>

          <Text style={styles.subheading}>6. Childrens Privacy</Text>
          <Text style={styles.section}>
            Wealth Wise is intended for users aged 13 and above. We do not knowingly collect data from children under 13.
          </Text>

          <Text style={styles.subheading}>7. Your Control and Rights</Text>
          <Text style={styles.section}>
            • You can delete any or all of your financial records at any time.{'\n'}
            • You may uninstall the app to remove all local data.{'\n'}
            • If using Firebase, contact us to request deletion of your cloud-stored data.
          </Text>

          <Text style={styles.subheading}>8. Changes to This Policy</Text>
          <Text style={styles.section}>
            We may update this Privacy Policy from time to time. Any changes will be communicated through the app or via update notes.
          </Text>

          <Text style={styles.subheading}>9. Contact Us</Text>
          <Text style={styles.section}>
            📧 Email: wealthwise.support@gmail.com{'\n'}
            🌐 App Name: Wealth Wise
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
