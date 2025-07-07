import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function AnalysisScreen() {
  const router = useRouter();

  const [barData, setBarData] = useState({
    labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
    datasets: [{ data: [0, 0, 0, 0] }],
  });

  const [loading, setLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) return;
      const { email: userId } = JSON.parse(user);

      const res = await fetch(`http://10.0.2.2:3000/api/get-expenses?userId=${userId}`);
      const { expenses } = await res.json();

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const filtered = expenses.filter((e) => {
        return typeof e.date === 'string' && e.date.startsWith(currentMonth);
      });

      // Sort expenses by createdAt descending
      const sorted = [...filtered].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Compare the latest createdAt with the last one
      if (sorted.length > 0) {
        const latestDate = sorted[0].createdAt;
        if (latestDate === lastFetchedDate) {
          // No new data
          return;
        }
        setLastFetchedDate(latestDate);
      }

      // If new data is detected or first load
      const weeks = [0, 0, 0, 0];
      filtered.forEach((e) => {
        const day = parseInt(e.date.split('-')[2]);
        let weekIndex = Math.floor((day - 1) / 7);
        weekIndex = Math.min(weekIndex, 3);
        weeks[weekIndex] += Number(e.amount);
      });

      setBarData({
        labels: ['1st Week', '2nd Week', '3rd Week', '4th Week'],
        datasets: [{ data: weeks }],
      });
    } catch (err) {
      console.error('🔥 Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchExpenses(); // Initial

    const interval = setInterval(() => {
      fetchExpenses(); // Check only if there’s new data
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Monthly Expense Analysis</Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>This Month's Expenses</Text>

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

          {loading ? (
            <ActivityIndicator size="large" color="#8C52FF" style={{ marginTop: 40 }} />
          ) : (
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
          )}

          <TouchableOpacity
            onPress={() => router.push('/screens/detailedAnalysis.tsx')}
            style={{
              marginTop: 24,
              padding: 12,
              backgroundColor: '#8C52FF',
              borderRadius: 10,
              alignItems: 'center',
            }}
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
