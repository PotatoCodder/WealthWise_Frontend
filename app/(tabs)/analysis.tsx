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
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function AnalysisScreen() {
  const router = useRouter();

  // Placeholder data — replace with Firebase fetch later
  const barData = {
    labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
    datasets: [
      {
        data: [2500, 4800, 9000, 7500],
      },
    ],
  };

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 🔷 Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Monthly Expense Analysis</Text>
        </View>

        {/* 🔶 Chart Section */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>April Expenses</Text>

          {/* 🔍 Search Icon */}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/screens/search')}
            >
              <Ionicons name="search" size={22} color="#4E008E" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/screens/Calendar')}
            >
              <Ionicons name="calendar" size={22} color="#4E008E" />
            </TouchableOpacity>
          </View>


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
                <TouchableOpacity
        onPress={() => router.push('/screens/detailedAnalysis.tsx')}
        style={{ marginTop: 24, padding: 12, backgroundColor: '#8C52FF', borderRadius: 10, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go to Detailed Analysis</Text>
      </TouchableOpacity>
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
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    marginTop: -30,
    minHeight: 400,
  },
  chartTitle: {
    color: '#4E008E',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  searchIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#EEE6FF',
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  iconContainer: {
  position: 'absolute',
  top: 20,
  right: 20,
  flexDirection: 'row',
  gap: 10,
  zIndex: 10,
},

iconButton: {
  backgroundColor: '#EEE6FF',
  padding: 6,
  borderRadius: 20,
},

});
