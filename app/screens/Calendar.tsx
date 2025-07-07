import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const normalizeDate = (dateString) => {
    try {
      return new Date(dateString).toISOString().slice(0, 10);
    } catch {
      return dateString;
    }
  };

  // Load user ID from AsyncStorage
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserId(parsedUser.email);
          console.log('👤 Loaded user ID:', parsedUser.email);
        } else {
          console.warn('⚠️ No user object found in AsyncStorage!');
        }
      } catch (err) {
        console.error('❌ Failed to load user ID from AsyncStorage:', err);
      }
    };
    loadUserId();
  }, []);

  // Fetch when date and user ID are ready
  useEffect(() => {
    if (selectedDate && userId) {
      fetchData();
    }
  }, [selectedDate, userId]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const fetchData = async () => {
    console.log('📅 Selected Date:', selectedDate);
    console.log('👤 userId:', userId);

    try {
      const [expensesRes, incomesRes] = await Promise.all([
        fetch(`http://192.168.0.104:3000/api/get-expenses?userId=${userId}`),
        fetch(`http://192.168.0.104:3000/api/get-incomes?userId=${userId}`),
      ]);

      const expensesJson = await expensesRes.json();
      const incomesJson = await incomesRes.json();

      console.log('📥 Expenses from server:', expensesJson.expenses);
      console.log('📥 Incomes from server:', incomesJson.incomes);

      const filteredExpenses = expensesJson.expenses.filter((e) => {
        const match = normalizeDate(e.date) === normalizeDate(selectedDate);
        console.log(`🔍 Expense Match: ${normalizeDate(e.date)} === ${normalizeDate(selectedDate)} => ${match}`);
        return match;
      });

      const filteredIncomes = incomesJson.incomes.filter((i) => {
        const match = normalizeDate(i.date) === normalizeDate(selectedDate);
        console.log(`🔍 Income Match: ${normalizeDate(i.date)} === ${normalizeDate(selectedDate)} => ${match}`);
        return match;
      });

      setExpenses(filteredExpenses);
      setIncomes(filteredIncomes);

      const categoryMap = {};
      filteredExpenses.forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
      });

      const chartData = Object.keys(categoryMap).map((key, index) => ({
        name: key,
        amount: categoryMap[key],
        color: chartColors[index % chartColors.length],
        legendFontColor: '#333',
        legendFontSize: 12,
      }));

      setCategoryData(chartData);
    } catch (err) {
      console.error('🔥 Fetching error:', err);
    }
  };

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Calendar View</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#8C52FF' },
            }}
          />
        </View>

        {selectedDate && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Selected Date: {selectedDate}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>User ID: {userId}</Text>

            {expenses.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Expenses</Text>
                {expenses.map((exp, idx) => (
                  <Text key={idx}>• ₱{exp.amount} - {exp.title} ({exp.category})</Text>
                ))}
              </>
            )}

            {incomes.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Incomes</Text>
                {incomes.map((inc, idx) => (
                  <Text key={idx}>• ₱{inc.amount} - {inc.title} ({inc.category})</Text>
                ))}
              </>
            )}

            {expenses.length === 0 && incomes.length === 0 && (
              <Text style={{ color: '#777', marginTop: 10 }}>
                No income or expenses on this date.
              </Text>
            )}

            {categoryData.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Spending by Category</Text>
                <PieChart
                  data={categoryData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const chartColors = ['#8C52FF', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(78, 0, 142, ${opacity})`,
  labelColor: () => '#333',
};

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
  calendarContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    padding: 20,
    marginTop: -30,
  },
  resultContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#4E008E',
  },
});
