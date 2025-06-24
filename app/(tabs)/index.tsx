import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function AnalysisScreen() {
  const router = useRouter();

  const barData = {
    labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
    datasets: [
      {
        data: [1200, 4500, 8000, 6000],
      },
    ],
  };

  return (
    <View style={styles.mainView}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.greetingText}>Hello, User</Text>
        <Image
          source={require('../../assets/images/Icon-Notification.png')}
          style={styles.notificationIcon}
        />
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        {['Balance', 'Expense', 'Total'].map((label) => (
          <TouchableOpacity
            key={label}
            style={[styles.iconButton, label === 'Expense' && { backgroundColor: '#8C52FF' }]}
          >
            <Image
              source={require('../../assets/images/wallet.png')}
              style={styles.iconImage}
            />
            <Text style={styles.walletLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Container */}
      <View style={styles.secondaryView}>
        <Text style={styles.chartTitle}>April Expenses</Text>
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => router.push('/screens/search')}
        >
          <Ionicons name="search" size={22} color="#4E008E" />
        </TouchableOpacity>

        <BarChart
          data={barData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="₱"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(78, 0, 142, ${opacity})`,
            labelColor: () => '#888',
            style: { borderRadius: 16 },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: '#eee',
            },
          }}
          verticalLabelRotation={0}
          style={styles.chart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: '#4E008E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
    paddingTop: 60,
  },
  profileImage: { width: 45, height: 45, borderRadius: 20 },
  greetingText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  notificationIcon: { width: 34, height: 34 },

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
  walletLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 40,
    position: 'relative',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  searchIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EEE6FF',
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
});
