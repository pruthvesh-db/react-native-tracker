import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Button, Platform } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../authValidator/authContext'; // Adjust import path as needed
import { Table, Row, Rows } from 'react-native-table-component';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';


const ExpenseTable = () => {
  const { userToken, ServerIP } = useContext(AuthContext); // Get the auth token from context or another source
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

  const tableHead = ['Date', 'Category', 'Sub-Category', 'Amount', 'Type', 'Description'];
  const tableData = data.map(item => [
    new Date(item.date).toLocaleDateString(),
    item.category,
    item.sub_category,
    item.amount,
    item.type,
    item.description
  ]);

  
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

    // const htmlContent = `
    //   <html>
    //     <body>
    //       <h1>Hello, Expo PDF!</h1>
    //       <p>This is a PDF generated using Expo's Print module.</p>
    //     </body>
    //   </html>
    // `;
    const generateStatement = async () => {
      const filename = "Statement.pdf";
      // const localhost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
      const result = await Print.printToFileAsync({ html: htmlContent },
        {
          headers: {
            "MyHeader": "MyValue"
          }
        }
      );
      console.log(result);
      save(result.uri, filename, "text/html; charset=UTF-8");
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



  return (
    
      <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Table borderStyle={styles.tableBorder}>
          <Row data={tableHead} style={styles.head} textStyle={styles.headerText} />
          <Rows data={tableData} textStyle={styles.rowText} />
        </Table>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Download PDF" onPress={generateStatement} color="#FF5722" />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    // padding: 20,
    backgroundColor: '#ffffff',
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: 'gray',
  },
  head: {
    height: 50,
    backgroundColor: 'orange',
  },
  headerText: {
    margin: 6,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  rowText: {
    margin: 1,
    textAlign: 'center',
    color: 'black',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#white',
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   error: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: 'red',
//     fontSize: 16,
//   },
//   tableBorder: {
//     borderWidth: 1,
//     borderColor: 'gray',
//   },
//   head: {
//     height: 50,
//     backgroundColor: 'orange',
//   },
//   text: {
//     margin: 6,
//     textAlign: 'center',
//     color: '#FFFFFF',
//   },
//   texts: {
//     margin: 1,
//     textAlign: 'center',
//     color: 'black',
//   },
// });

export default ExpenseTable;
