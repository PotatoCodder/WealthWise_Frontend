import React, { useEffect, useState } from 'react';
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
  color: (opacity = 1) => rgba(76, 0, 153, ${opacity}),
  labelColor: (opacity = 1) => rgba(0, 0, 0, ${opacity}),
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#4E008E',
  },
  propsForBackgroundLines: {
    stroke: '#e3e3e3',
    strokeDasharray: '0',
  },
};

export default function ForecastingScreen() {
  const router = useRouter();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentMonthData();
  }, []);

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
        fetch(http://192.168.0.105:3000/api/get-incomes?userId=${userId}),
        fetch(http://192.168.0.105:3000/api/get-expenses-by-category?userId=${userId}&category=all),
      ]);

      const incomeJson = await incomeRes.json();
      const expenseJson = await expenseRes.json();

      const thisMonthIncome = incomeJson.incomes?.filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      }) || [];

      const thisMonthExpense = expenseJson.expenses?.filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      }) || [];

      const totalIncome = thisMonthIncome.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const totalExpense = thisMonthExpense.reduce((sum, item) => sum + parseFloat(item.amount), 0);

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
        data: [income, predictedIncome],
        color: (opacity = 1) => rgba(140, 82, 255, ${opacity}),
        strokeWidth: 2,
      },
      {
        data: [expense, predictedExpense],
        color: (opacity = 1) => rgba(255, 111, 97, ${opacity}),
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.secondaryView}>
        <Text style={styles.header}>📈 Forecast: Income vs Expense</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4E008E" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                width={screenWidth - 60}
                height={250}
                chartConfig={chartConfig}
                bezier
                fromZero
                style={styles.chart}
              />
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>📌 Summary</Text>
              <Text style={styles.incomeText}>This Month's Income: ₱{income.toFixed(2)}</Text>
              <Text style={styles.expenseText}>This Month's Expense: ₱{expense.toFixed(2)}</Text>
              <Text style={styles.incomeText}>Predicted Income: ₱{predictedIncome}</Text>
              <Text style={styles.expenseText}>Predicted Expense: ₱{predictedExpense}</Text>
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
  mainView: { flex: 1, backgroundColor: '#4E008E' },
  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 40,
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
  },
  chart: {
    borderRadius: 16,
  },
  summaryBox: {
    backgroundColor: '#EFE7FF',
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4E008E',
    marginBottom: 10,
  },
  incomeText: {
    color: '#8C52FF',
    fontSize: 14,
    marginBottom: 4,
  },
  expenseText: {
    color: '#FF6F61',
    fontSize: 14,
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