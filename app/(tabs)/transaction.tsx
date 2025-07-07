import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(76, 0, 153, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '6',
    strokeWidth: '3',
    stroke: '#8C52FF',
  },
  propsForBackgroundLines: {
    stroke: '#E0E0E0',
  },
};

export default function ForecastingScreen() {
  const router = useRouter();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchCurrentMonthData();
    }, [])
  );

  const fetchCurrentMonthData = async () => {
    try {
      setLoading(true);
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString || '{}');
      const userId = user.email;

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`http://192.168.0.104:3000/api/get-incomes?userId=${userId}`),
        fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`),
      ]);

      const incomeJson = await incomeRes.json();
      const expenseJson = await expenseRes.json();

      const thisMonthIncome = incomeJson.incomes?.filter((item) => {
        const date = new Date(item.date + 'T00:00:00');
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }) || [];

      const thisMonthExpense = expenseJson.expenses?.filter((item) => {
        const date = new Date(item.date + 'T00:00:00');
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }) || [];

      const totalIncome = thisMonthIncome.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const totalExpense = thisMonthExpense.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

      setIncome(totalIncome);
      setExpense(totalExpense);
    } catch (error) {
      console.error('🔥 Forecast fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const predictedIncome = parseFloat((income * 1.05).toFixed(2));
  const predictedExpense = parseFloat((expense * 1.03).toFixed(2));

  const chartData = {
    labels: ['This Month', 'Next Month'],
    datasets: [
      {
        data: [parseFloat(income.toFixed(2)), predictedIncome],
        color: () => '#8C52FF',
        strokeWidth: 3,
      },
      {
        data: [parseFloat(expense.toFixed(2)), predictedExpense],
        color: () => '#FF6F61',
        strokeWidth: 3,
      },
    ],
    legend: ['📥 Income', '📤 Expense'],
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.secondaryView}>
        <Text style={styles.header}>📈 Forecast: Income vs Expense</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4E008E" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                width={screenWidth * 0.9 - 40}
                height={260}
                chartConfig={chartConfig}
                bezier
                fromZero
                style={styles.chart}
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#8C52FF' }]} />
                  <Text style={styles.legendText}>Income</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF6F61' }]} />
                  <Text style={styles.legendText}>Expense</Text>
                </View>
              </View>
            </View>

            <View style={styles.predictionContainer}>
              <Text style={styles.predictionLabel}>🔮 Predicted Summary:</Text>
              <View style={styles.predictionRow}>
                <View style={styles.predictionBox}>
                  <Text style={styles.predictionIcon}>📥</Text>
                  <Text style={styles.predictionValue}>₱{income.toFixed(2)}</Text>
                  <Text style={styles.predictionSub}>This Month Income</Text>
                </View>
                <View style={styles.predictionBox}>
                  <Text style={styles.predictionIcon}>📤</Text>
                  <Text style={styles.predictionValue}>₱{expense.toFixed(2)}</Text>
                  <Text style={styles.predictionSub}>This Month Expense</Text>
                </View>
              </View>
              <View style={styles.predictionRow}>
                <View style={styles.predictionBox}>
                  <Text style={styles.predictionIcon}>🔮</Text>
                  <Text style={styles.predictionValue}>₱{predictedIncome}</Text>
                  <Text style={styles.predictionSub}>Predicted Income</Text>
                </View>
                <View style={styles.predictionBox}>
                  <Text style={styles.predictionIcon}>🔮</Text>
                  <Text style={styles.predictionValue}>₱{predictedExpense}</Text>
                  <Text style={styles.predictionSub}>Predicted Expense</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1, 
    backgroundColor: '#4E008E' 
  },
  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 250,
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingBottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4E008E',
    marginBottom: 20,
  },
  chartWrapper: {
    backgroundColor: '#F7F2FF',
    borderRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    elevation: 3,
    width: '90%',
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
    alignSelf: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#4E008E',
  },
  predictionContainer: {
    width: '90%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  predictionLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#4E008E',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  predictionBox: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#EFE7FF',
    borderRadius: 20,
    width: '48%',
  },
  predictionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E008E',
  },
  predictionSub: {
    fontSize: 12,
    color: '#4E008E',
    marginTop: 4,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
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
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
});
