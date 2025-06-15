import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';


export default function HomeScreen() {
  return (
    <View style={styles.mainView}>
      {/* 🔷 Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.greetingText}>Hello, user</Text>
        <Image
          source={require('../../assets/images/Icon-Notification.png')}
          style={styles.notificationIcon}
        />
      </View>

      {/* 🔷 Top Buttons Row */}
      <View style={styles.buttonRow}>
        {['Balance', 'Expense', 'Total'].map((label, index) => (
          <TouchableOpacity key={index} style={styles.iconButton} onPress={() => {}}>
            <Image
              source={require('../../assets/images/wallet.png')}
              style={styles.iconImage}
            />
            <Text style={styles.walletLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔷 Scrollable Entries Section */}
      <View style={styles.contentWrapper}>
        <View style={styles.secondaryView}>
          <ScrollView>
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
              <View key={sectionIndex}>
                <Text style={styles.dateText}>Date</Text>
                <Text style={styles.entryText}>Allowance: 100000</Text>
                <Text style={styles.entryText}>Food: 100000</Text>
                <Text style={styles.entryText}>Supply: 100000</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 🔷 Floating "+" Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#4E008E',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
    paddingTop: 60, // 32 + top offset (40)
  },

  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },

  greetingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  notificationIcon: {
    width: 34,
    height: 34,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 25,
  },

  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },

  walletLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  contentWrapper: {
    flex: 1,
    position: 'relative',
  },

  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 40,
  },

  dateText: {
    fontWeight: 'bold',
    backgroundColor: '#4E008E',
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 30,
    left: 30,
    bottom: 7,
  },

  entryText: {
    color: '#4E008E',
    fontSize: 16,
    marginBottom: 6,
    left: 40,
  },

  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#4E008E',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
