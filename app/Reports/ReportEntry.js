import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment-timezone';
import { ReportContext } from './ReportsAPI';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

const ReportEntry = ({ navigation }) => {
  const [selectedRange, setSelectedRange] = useState({});
  const { fetchExpense } = useContext(ReportContext);

  const onDayPress = (day) => {
    const { dateString } = day;
    if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
      setSelectedRange({ startDate: dateString, endDate: null });
    } else {
      setSelectedRange({ ...selectedRange, endDate: dateString });
    }
  };

  const getMarkedDates = () => {
    if (!selectedRange.startDate || !selectedRange.endDate) return {};
    const startDate = moment.tz(selectedRange.startDate, 'Asia/Kolkata');
    const endDate = moment.tz(selectedRange.endDate, 'Asia/Kolkata');
    let markedDates = {};

    for (let d = startDate.clone(); d.isSameOrBefore(endDate); d.add(1, 'day')) {
      markedDates[d.format('YYYY-MM-DD')] = { color: 'lightblue' };
    }
    return markedDates;
  };

  const setPredefinedRange = (startDate, endDate) => {
    setSelectedRange({ startDate, endDate });
  };

  const getLastDay = () => {
    const today = moment.tz('Asia/Kolkata');
    const startDate = today.format('YYYY-MM-DD');
    setPredefinedRange(startDate, startDate);
  };

  const getLastWeek = () => {
    const endDate = moment.tz('Asia/Kolkata');
    const startDate = endDate.clone().subtract(7, 'days');
    setPredefinedRange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
  };

  const getLastMonth = () => {
    const endDate = moment.tz('Asia/Kolkata').startOf('month').subtract(1, 'day');
    const startDate = moment.tz('Asia/Kolkata').startOf('month').subtract(1, 'month').startOf('month');
    setPredefinedRange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
  };

  const tableHead1 = ['Date', 'Category', 'Sub-Category', 'Amount', 'Type', 'Description'];

  const processExpenseData = async () => {
    try {
      // Fetch the data asynchronously
      const ExpenseData1 = await fetchExpense(selectedRange.startDate, selectedRange.endDate);
  
      // Process the data
      const tableData1 = ExpenseData1.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.category,
        item.sub_category,
        item.amount,
        item.type,
        item.description
      ]);
  
      return tableData1;
    } catch (error) {
      console.error('Error processing expense data:', error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  };

  const handleFetchAndGenerate = async () => {
    if (!selectedRange.startDate || !selectedRange.endDate) {
      Alert.alert('Validation Error', 'Please select a date range before proceeding.');
      return;
    }

    try {
      console.log('Starting generateStatement...');
      await generateStatement();
      console.log('generateStatement completed.');
    } catch (error) {
      console.error('Error fetching expense data or generating statement:', error);
    }
  };

  const generateStatement = async () => {
    try {
      const filename = "Statement.pdf";
      const tableData2 = await processExpenseData();
      const HTMLdata = await generateHtmlContent(tableHead1, tableData2);
      const result = await Print.printToFileAsync({ html: HTMLdata });
      console.log(result);
      save(result.uri, filename, "application/pdf");
    } catch (error) {
      console.error('Error generating statement:', error);
    }
  };

  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        console.log('Permission Granted');
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

  const generateHtmlContent = (tableHead, tableData) => {
    return new Promise((resolve, reject) => {
      try {
        const htmlContent = `
          <html>
            <head>
              <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: center; }
                th { background-color: orange; color: white; }
              </style>
            </head>
            <body>
              <table>
                <thead>
                  <tr>${tableHead.map(head => `<th>${head}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${tableData.map(row => `
                    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;
        resolve(htmlContent); // Resolve the promise with htmlContent
      } catch (error) {
        reject(error); // Reject the promise if there is an error
      }
    });
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'period'}
        markedDates={{
          ...getMarkedDates(),
          [selectedRange.startDate]: { startingDay: true, color: '#B2DFDB' },
          [selectedRange.endDate]: { endingDay: true, color: '#B2DFDB' },
        }}
        onDayPress={onDayPress}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#eeab1c',
          selectedDayBackgroundColor: '#eeab1c',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#F44336',
          dayTextColor: '#333333',
          arrowColor: 'orange',
          monthTextColor: 'orange',
        }}
      />

      <View style={styles.buttonContainer}>
        <Button title="Last Day" onPress={getLastDay} color="orange" />
        <Button title="Last Week" onPress={getLastWeek} color="orange" />
        <Button title="Last Month" onPress={getLastMonth} color="orange" />
      </View>

      <Text style={styles.infoText}>
        {`Start Date: ${selectedRange.startDate || 'Not selected'}`}
      </Text>
      <Text style={styles.infoText}>
        {`End Date: ${selectedRange.endDate || 'Not selected'}`}
      </Text>

      <View style={styles.actionButtonsContainer}>
        <Button
          title="View Report"
          onPress={() => {
            if (!selectedRange.startDate || !selectedRange.endDate) {
              Alert.alert('Validation Error', 'Please select a date range before proceeding.');
              return;
            }
            navigation.navigate('Monthly Report');
            fetchExpense(selectedRange.startDate, selectedRange.endDate);
          }}
          color="orange"
          disabled={!selectedRange.startDate || !selectedRange.endDate}
        />
        <Button
          title="Download Report"
          onPress={handleFetchAndGenerate}
          color="orange"
          disabled={!selectedRange.startDate || !selectedRange.endDate}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333333',
  },
  actionButtonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ReportEntry;
