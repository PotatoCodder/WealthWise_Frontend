// Still using react-native-chart-kit & react-native-svg

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const CHART_WIDTH = screenWidth - 60;
const CHART_HEIGHT = 200;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(76, 0, 153, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: '#e3e3e3',
    strokeDasharray: '0',
  },
  barPercentage: 0.5,
};

const TABS = ['Daily', 'Weekly', 'Monthly', 'Year'];

export default function CalendarChart() {
  const [activeTab, setActiveTab] = useState('Daily');
  const [chartData, setChartData] = useState({ labels: [], incomeData: [], expenseData: [] });
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });

  const router = useRouter();

  useEffect(() => {
    fetchChartData();
  }, [activeTab]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString || '{}');
      const userId = user.email;

      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`http://192.168.0.104:3000/api/get-incomes?userId=${userId}`),
        fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`),
      ]);

      const [incomeJson, expenseJson] = await Promise.all([
        incomeRes.json(),
        expenseRes.json(),
      ]);

      const grouped = groupData(incomeJson.incomes || [], expenseJson.expenses || []);
      setChartData(grouped);

      const totalIncome = grouped.incomeData.reduce((a, b) => a + b, 0);
      const totalExpense = grouped.expenseData.reduce((a, b) => a + b, 0);
      setSummary({ totalIncome, totalExpense });

    } catch (err) {
      console.error('🔥 Chart data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupData = (incomes, expenses) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    let labels = [];
    let incomeData = [];
    let expenseData = [];

    const isSameMonth = (date) => {
      const d = new Date(date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    };

    switch (activeTab) {
      case 'Daily':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        incomeData = Array(7).fill(0);
        expenseData = Array(7).fill(0);

        const getDayIndex = (date) => {
          const d = new Date(date);
          return d.getDay() === 0 ? 6 : d.getDay() - 1;
        };

        incomes.forEach(({ date, amount }) => {
          if (isSameMonth(date)) incomeData[getDayIndex(date)] += parseFloat(amount);
        });
        expenses.forEach(({ date, amount }) => {
          if (isSameMonth(date)) expenseData[getDayIndex(date)] += parseFloat(amount);
        });
        break;

      case 'Weekly':
        labels = ['W1', 'W2', 'W3', 'W4'];
        incomeData = Array(4).fill(0);
        expenseData = Array(4).fill(0);

        const getWeekIndex = (date) => Math.floor((new Date(date).getDate() - 1) / 7);

        incomes.forEach(({ date, amount }) => {
          if (isSameMonth(date)) incomeData[getWeekIndex(date)] += parseFloat(amount);
        });
        expenses.forEach(({ date, amount }) => {
          if (isSameMonth(date)) expenseData[getWeekIndex(date)] += parseFloat(amount);
        });
        break;

      case 'Monthly':
        labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
        incomeData = Array(12).fill(0);
        expenseData = Array(12).fill(0);

        incomes.forEach(({ date, amount }) => {
          const d = new Date(date);
          if (d.getFullYear() === thisYear) incomeData[d.getMonth()] += parseFloat(amount);
        });
        expenses.forEach(({ date, amount }) => {
          const d = new Date(date);
          if (d.getFullYear() === thisYear) expenseData[d.getMonth()] += parseFloat(amount);
        });
        break;

      case 'Year':
        const years = new Set();
        incomes.concat(expenses).forEach(({ date }) => {
          years.add(new Date(date).getFullYear());
        });
        labels = Array.from(years).sort().map(String);
        incomeData = Array(labels.length).fill(0);
        expenseData = Array(labels.length).fill(0);

        incomes.forEach(({ date, amount }) => {
          const idx = labels.indexOf(new Date(date).getFullYear().toString());
          if (idx >= 0) incomeData[idx] += parseFloat(amount);
        });
        expenses.forEach(({ date, amount }) => {
          const idx = labels.indexOf(new Date(date).getFullYear().toString());
          if (idx >= 0) expenseData[idx] += parseFloat(amount);
        });
        break;
    }

    return { labels, incomeData, expenseData };
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.secondaryView}>
        <View style={styles.balanceSummary}>
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>₱{(summary.totalIncome - summary.totalExpense).toFixed(2)}</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceLabel}>Total Expense</Text>
            <Text style={styles.balanceValue}>₱{summary.totalExpense.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.balanceBreakdown}>
          <Text style={styles.breakdownText}>💵 Cash: ₱{(summary.totalIncome * 0.5).toFixed(2)}</Text>
          <Text style={styles.breakdownText}>💳 Card: ₱{(summary.totalIncome * 0.5).toFixed(2)}</Text>
        </View>

        <View style={styles.buttonRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.iconButton,
                activeTab === tab && { backgroundColor: '#8C52FF' },
              ]}
            >
              <Text style={styles.walletLabel}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4E008E" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.scrollContent}>
              <ChartBlock
                title="Income"
                data={chartData.incomeData}
                labels={chartData.labels}
                color="#8C52FF"
              />
              <ChartBlock
                title="Expense"
                data={chartData.expenseData}
                labels={chartData.labels}
                color="#FF6F61"
              />

              <View style={styles.summaryContainer}>
                <SummaryRow icon="wallet" color="#4E008E" label="Income" amount={summary.totalIncome} />
                <SummaryRow icon="money-bill-wave" color="#FF6F61" label="Expense" amount={summary.totalExpense} />
              </View>
            </View>
          </ScrollView>
        )}

        <TouchableOpacity onPress={() => router.push('/screens/detailedAnalysis')} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ChartBlock = ({ title, data, labels, color }) => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>{title}</Text>
    <BarChart
      data={{ labels, datasets: [{ data }] }}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      chartConfig={{ ...chartConfig, color: () => color }}
      fromZero
      showBarTops
      style={styles.chartStyle}
    />
  </View>
);

const SummaryRow = ({ icon, color, label, amount }) => (
  <View style={styles.summaryRow}>
    <FontAwesome5 name={icon} size={18} color={color} style={{ marginRight: 8 }} />
    <Text style={{ fontSize: 16, fontWeight: 'bold', color }}>
      {label}: ₱{amount.toFixed(2)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: '#4E008E' },
  balanceSummary: {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  backgroundColor: '#4E008E',
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
  borderTopLeftRadius: 65,
  borderTopRightRadius: 65,
},
balanceColumn: {
  alignItems: 'center',
  width: '45%',
},
verticalDivider: {
  width: 1,
  height: '70%',
  backgroundColor: '#C3A1FF',
},
balanceLabel: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},
balanceValue: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 5,
},
balanceBreakdown: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 30,
  paddingBottom: 20,
  backgroundColor: '#4E008E',
},
breakdownText: {
  color: '#D3D3D3',
  fontSize: 14,
},

  secondaryView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
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
  walletLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 60,
    paddingHorizontal: 10,
  },
  chartContainer: {
    backgroundColor: '#F7F2FF',
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4E008E',
    marginBottom: 10,
    marginLeft: 10,
  },
  chartStyle: {
    borderRadius: 20,
  },
  summaryContainer: {
    marginTop: 20,
    paddingLeft: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
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
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
