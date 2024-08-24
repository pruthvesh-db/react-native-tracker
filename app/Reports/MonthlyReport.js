import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../authValidator/authContext'; // Adjust import path as needed
import { Table, Row, Rows } from 'react-native-table-component';


const ExpenseTable = () => {
  const {userToken, ServerIP} = useContext(AuthContext); // Get the auth token from context or another source
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ServerIP}/api/expense/fetchallexpenses`, {
          headers: {
            'auth-token': userToken, // Include the auth token in headers
          },
        });
        setData(response.data);
      } catch (error) {
        setError(error);
        Alert.alert('Error', 'Unable to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userToken]); // Include userToken in dependency array to refetch if token changes

  const tableHead = ['Date', 'Category', 'Sub-Category', 'Amount', 'Type','Description'];
  const tableData = data.map(item => [
    new Date(item.date).toLocaleDateString(),
    item.category,
    item.sub_category,
    item.amount,
    item.type,
    item.description    
  ]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  if (error) {
    return <Text style={styles.error}>Something went wrong: {error.message}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Table borderStyle={styles.tableBorder}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.texts} />
      </Table>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    fontSize: 16,
  },
  tableBorder: {
    borderWidth: 1,
    // borderColor: '#4CAF50',
    borderColor: 'gray',
  },
  head: {
    height: 50,
    backgroundColor: '#4CAF50',
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  texts: {
    margin: 1,
    textAlign: 'center',
    color: 'black',
  },
});

export default ExpenseTable;
