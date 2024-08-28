import React, {useContext, useState, useEffect} from 'react'
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert, ScrollView, Modal, Platform, ActivityIndicator  } from 'react-native'
import { AuthContext } from '../authValidator/authContext'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { format } from 'date-fns';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library


const apiUrl = Constants.expoConfig.extra.apiUrl;

const LandingTab = ({navigation}) => {

  const {ServerIP, logout, userToken} = useContext(AuthContext);

  const [category, setCategory] = useState({});
  const [CatagoryOptions, setCatagoryOptions] = useState([]);
  const [subCategory, setSubCategory] = useState('');
  const [SubCatagoryOptions, setSubCatagoryOptions] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date()); // Default to today's date
  const [type, setType] = useState('Want');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // State to toggle sidebar visibility
  // const [loading, setLoading] = useState(true); // State to handle loading

  // Function to handle value change and update the category state with the label
  const handleCatagory = async (selectedValue) => {
    const selectedOption = CatagoryOptions.find(option => option.value === selectedValue);
    if (selectedOption) {
      setCategory(selectedOption);
    }
  };

  useEffect(() => {
    if (category) {
      fetchSubCatagory();
    }
  }, [category]);

  const fetchCatagory = async () => {
    try {
      const response = await axios.get(`${ServerIP}/api/category/fetchcategory`, {
        headers: {
          'auth-token': userToken, // Add the token here
          'Content-Type': 'application/json' // Set content type if necessary
        }
      }); // Replace with your API URL
      const data = response.data;
      
      // Map data to the format required by Picker
      const Catagoty = data.map(item => ({
        label: item.type,
        value: item.id
      }));

      setCatagoryOptions(Catagoty);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching options:', error);
      // setLoading(false);
    }
  };

  fetchCatagory();

  const fetchSubCatagory = async () => {
    console.log("API Hittttt");
    try {
      const response = await axios.get(`${ServerIP}/api/category/fetchsubcat/${category.value}`, {
        headers: {
          // 'auth-token': userToken, // Add the token here
          'Content-Type': 'application/json' // Set content type if necessary
        }
      }); // Replace with your API URL
      const SubCatdata = response.data;
      
      // Map data to the format required by Picker
      const SubCatagoty = SubCatdata.map(item => ({
        label: item.type,
        value: item.id
      }));

      setSubCatagoryOptions(SubCatagoty);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching options:', error);
      // setLoading(false);
    }
  };

  // fetchSubCatagory();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Hide the picker on selection
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!category || !subCategory || !amount || !description) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
      // Example submission logic
      const formData = {
        category,
        subCategory,
        amount: parseInt(amount, 10),
        date: format(date, 'yyyy-MM-dd'),
        type,
        description,
      };

      try {
        // Add the headers in the third parameter
        console.log(category);
        const response = await axios.post(
          `${ServerIP}/api/expense/addexpense`,
          {
            category: category.label,
            sub_category: subCategory,
            amount,
            date : format(date, 'yyyy-MM-dd'),
            type,
            description
          },
          {
            headers: {
              'auth-token': userToken, // Add the token here
              'Content-Type': 'application/json' // Set content type if necessary
            }
          }
        );

        console.log('Expense added successfully:', response.data);
        Alert.alert('Success', 'Expense added successfully!');
      } catch (error) {
        console.error('Error adding expense:', error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
  
      // Log or submit the data
      console.log('Form Data:', formData);
  
      // Clear form after submission
      setCategory('');
      setSubCategory('');
      setAmount('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setType('Want');
      setDescription('');
    };

    // if (loading) {
    //   return <ActivityIndicator size="large" color="#0000ff" />;
    // }

  return (
    <View style={styles.container}>
      {sidebarVisible && (
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Profile Details')}>
            <Text style={styles.sidebarItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Monthly Report')}>
            <Text style={styles.sidebarItemText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Add Catagory')}>
            <Text style={styles.sidebarItemText}>Add Catagory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sidebarItem, { backgroundColor: 'red'}]} onPress={() => logout()}>
            <Text style={styles.sidebarItemText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={[styles.contentWrapper, sidebarVisible && styles.contentWithSidebar]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.toggleSidebarButton}
            onPress={() => setSidebarVisible(!sidebarVisible)}
          >
            <Icon name={sidebarVisible ? 'menu-open' : 'menu'} size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Expense</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category:</Text>
            <Picker
              
              style={styles.picker}
              onValueChange={handleCatagory}
              selectedValue={category.value}
            >
              {CatagoryOptions.map((Catoption) => (
                <Picker.Item label={Catoption.label} value={Catoption.value} />
              ))}
            </Picker>
                </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Sub-Category:</Text>
            <Picker
              
              style={styles.picker}
              onValueChange={(setValue) => setSubCategory(setValue)}
              selectedValue={subCategory}
              
            >
              {SubCatagoryOptions.map((SubCatoption) => (
                <Picker.Item label={SubCatoption.label} value={SubCatoption.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date: {format(date, 'yyyy-MM-dd')}</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>Select Date</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display='default'
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Type:</Text>
            <Picker
              selectedValue={type}
              style={styles.picker}
              onValueChange={(itemValue) => setType(itemValue)}
            >
              <Picker.Item label="Want" value="Want" />
              <Picker.Item label="Need" value="Need" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              multiline
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 200,
    backgroundColor: '#2E7D32',
    padding: 10,
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  sidebarItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#388E3C',
  },
  sidebarItemText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  contentWrapper: {
    flex: 1,
    marginLeft: 0,
  },
  contentWithSidebar: {
    marginLeft: 200,
  },
  toggleSidebarButton: {
    backgroundColor: '#1E88E5',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginLeft: 10,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 45,
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  dateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 12,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default LandingTab