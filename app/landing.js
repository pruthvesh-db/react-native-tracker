import React, {useContext, useState, useEffect} from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert, ScrollView, Modal, Platform, ActivityIndicator, FlatList  } from 'react-native'
import { AuthContext } from '../authValidator/authContext'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { format } from 'date-fns';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import { Button, Divider } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Model from 'react-native-modal'
import * as Location from 'expo-location';
import BottomBar from './bottomBar';



const apiUrl = Constants.expoConfig.extra.apiUrl;

const LandingTab = ({navigation}) => {

  const {ServerIP, logout, userToken} = useContext(AuthContext);

  const [category, setCategory] = useState(null);
  const [categoryLabel, setCategoryLabel] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategory, setSubCategory] = useState('');
  const [subCategoryLabel, setSubCategoryLabel] = useState('');
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date()); // Default to today's date
  const [type, setType] = useState('Need');
  const [description, setDescription] = useState('');
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // State to toggle sidebar visibility
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const [subCatModalVisible, setSubCatModalVisible] = useState(false);
  const [subCatSearch, setSubCatSearch] = useState('');
  const [subCatFilteredOptions, setSubCatFilteredOptions] = useState([]);
  // const [loading, setLoading] = useState(true); // State to handle loading
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');

// _______________________________________________________________________________________________________________________

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

useEffect(() => {
    (async () => {
      // Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);

  const handleGetLocation = async () => {
    // Check permissions
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    // Get location
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(location);
  };

  // ______________________________________________________________________________________________________________

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  // Function to handle value change and update the category state with the label
  const handleCatagory = async (selectedValue) => {
    const selectedOption = categoryOptions.find(option => option.value === selectedValue);
    if (selectedOption) {
      setCategory(selectedOption);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://65.1.92.142:5000/api/auth/getuser', {}, {
          headers: {
            'auth-token': userToken, // Pass the token in the header
          }
        });

        console.log('API Response:', response.data); // Log the API response

        // Ensure you correctly access fields in the response data
        if (response.data && response.data.length > 0) {
          const userData = response.data[0]; // Get the first item from the array

          // Update state with the fetched data
          setFirstName(userData.first_name || '');
          setLastName(userData.last_name || '');
          setContactNo(userData.contact_no || '');
        } else {
          Alert.alert('Error', 'No data returned from the server.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [userToken]);

  // useEffect(() => {
  //   if (category) {
  //     fetchSubCatagory();
  //   }
  // }, [category]);

  // const fetchCatagory = async () => {
  //   try {
  //     const response = await axios.get(`${ServerIP}/api/category/fetchcategory`, {
  //       headers: {
  //         'auth-token': userToken, // Add the token here
  //         'Content-Type': 'application/json' // Set content type if necessary
  //       }
  //     }); // Replace with your API URL
  //     const data = response.data;
      
  //     // Map data to the format required by Picker
  //     const Catagoty = data.map(item => ({
  //       label: item.type,
  //       value: item.id
  //     }));

  //     setCategoryOptions(Catagoty);
  //     // setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching options:', error);
  //     // setLoading(false);
  //   }
  // };

  const fetchCatagory = async () => {
        try {
            const response = await axios.get(`${ServerIP}/api/category/fetchcategory`, {
                headers: {
                    'auth-token': userToken,
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;

            // Map data to the format required
            const catagoryOptions = data.map(item => ({
                label: item.type,
                value: item.id
            }));

            setCategoryOptions(catagoryOptions);
            setFilteredOptions(catagoryOptions);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };
    const handleSelect = (value, label) => {
      console.log(`${value} ......... ${label}`);
      setCategory(value);
      setCategoryLabel(label);
      console.log(categoryLabel);
      setCatModalVisible(false);
    };

    const handleSelectSubCat = (value, label) => {
      setSubCategory(value);
      setSubCategoryLabel(label);
      console.log(categoryLabel);
      setSubCatModalVisible(false);
    };

// fetchCatagory();
// useEffect(() => {
//   fetchCatagory();

// }, []);

useEffect(() => {
  if (search === '') {
      setFilteredOptions(categoryOptions);
  } else {
      setFilteredOptions(categoryOptions.filter(option =>
          option.label.toLowerCase().includes(search.toLowerCase())
      ));
  }
}, [search, categoryOptions]);

useEffect(() => {
  if (subCatSearch === '') {
    setSubCatFilteredOptions(subCategoryOptions);
  } else {
    setSubCatFilteredOptions(subCategoryOptions.filter(option =>
          option.label.toLowerCase().includes(subCatSearch.toLowerCase())
      ));
  }
}, [subCatSearch, subCategoryOptions]);

  // fetchCatagory();

  const fetchSubCatagory = async () => {
    console.log("API Hittttt");
    console.log(`${ServerIP}/api/category/fetchsubcat/${category}`)
    try {
      const response = await axios.get(`${ServerIP}/api/category/fetchsubcat/${category}`, {
        headers: {
          // 'auth-token': userToken, // Add the token here
          'Content-Type': 'application/json' // Set content type if necessary
        }
      }); // Replace with your API URL
      const SubCatdata = response.data;
      console.log(SubCatdata);
      
      // Map data to the format required by Picker
      const subCatagoryOptions = SubCatdata.map(item => ({
        label: item.type,
        value: item.id
      }));
      
      setSubCategoryOptions(subCatagoryOptions);
      setSubCatFilteredOptions(subCatagoryOptions);
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching SubCategory:', error);
      // setLoading(false);
    }
  };

  // fetchSubCatagory();

  // const handleDateChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShowDatePicker(false); // Hide the picker on selection
  //   // setShowDatePicker(Platform.OS === 'ios');
  //   setDate(currentDate);
  // };

  // const handleDateChange = (event, selectedDate) => {
  //   // The event might be 'undefined' when the user cancels the picker
  //   if (event.type === 'set') {
  //     setDate(selectedDate || date);
  //     setShowDatePicker(false);
  //   } else if (event.type === 'dismissed') {
  //     setShowDatePicker(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!category || !subCategory || !amount || !description) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
      // Example submission logic
      const formData = {
        categoryLabel,
        subCategoryLabel,
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
            category: categoryLabel,
            sub_category: subCategoryLabel,
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
      {/* {sidebarVisible && (
        <LinearGradient
        colors={['#AFC8CE', '#E1ECEF', '#FFCDC0']}
        style={styles.sidebar}
      >
        <View style={styles.sidebar}>
        <View style={styles.sidebarItems}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Profile Details')}>
            <Text style={styles.sidebarItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Monthly Report')}>
            <Text style={styles.sidebarItemText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Add Catagory')}>
            <Text style={styles.sidebarItemText}>Add Catagory</Text>
          </TouchableOpacity>
          <View style={styles.sidebarLogout}>
          <TouchableOpacity style={[styles.sidebarItem, { backgroundColor: 'red'}]} onPress={() => logout()}>
            <Text style={styles.sidebarItemText}>Sign Out</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>
        </LinearGradient>
      )} */}

      {/* ______________________________________________________________________________________________________________________________ */}

      <View >
			<Model isVisible={sidebarVisible} animationIn={'slideInLeft'} animationOut={'slideOutLeft'}
				backdropOpacity={0.8}>
				<View style={
					{
            
						width: '80%',
						height: '100%',
            marginLeft: -17,
						// backgroundColor: 'green',
						justifyContent: 'center',
						alignItems: 'center'
					}
				}>
					<View style={
						{
              flex: 1,
							width: '80%',
							height: '95%',
							backgroundColor: 'white',
							borderRadius: 20
						}
					}>
						<View style={
							{marginTop: 250, flex: 1,}
						}>
							<FlatList data={
									[
										{
											title: 'Profile Details',
                      component: 'Profile Details',
											icon: require('../assets/user1.png')
										}, {
											title: 'Master Data',
                      component: 'Add Catagory',
											icon: require('../assets/master.png')
										}, {
											title: 'Reports',
                      component: 'Report Entry',
                      // component: 'Monthly Report',
											icon: require('../assets/report1.png')
										}
									]
								}
								renderItem={
									({item, index}) => {
										return (
											<TouchableOpacity style={
												{
													width: '90%',
													height: 50,
													alignSelf: 'center',
													borderBottomWidth: .4,
													borderBottomColor: 'grey',
													marginTop: 10,
													flexDirection: 'row'
												}
											} onPress={() => {{navigation.navigate(item.component)}; setSidebarVisible(false)}}>
												<Image source={item.icon} style={{width:24, height:24}}/>
												<Text style={{marginLeft: 15, fontSize:18}}>{item.title}</Text>
											</TouchableOpacity>
										);
									}
								}/>
						</View>


            <View style={
							{justifyContent: 'flex-end'}
						}>
							
											<TouchableOpacity style={
												{
													width: '90%',
													height: 50,
													alignSelf: 'center',
                          // alignItems: 'baseline',
                          // alignSelf: 'baseline',
                          marginTop: 10,
													// borderTopWidth: .4,
													borderTopColor: 'grey',
													flexDirection: 'row'
												}
											} onPress={() => {{logout()}; setSidebarVisible(false)}}>
												<Image source={ require('../assets/logout.png')} style={{width:24, height:24}}/>
												<Text style={{marginLeft: 15, fontSize:18}}>Sign Out</Text>
											</TouchableOpacity>								
						</View>

				</View>
				<View style={
					{
						width: '100%',
						height: 120,
						position: 'absolute',
						top: 100


					}
				}>
					<View style={
						{
							backgroundColor: '#ffe5b0',
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
							borderWidth: 2,
							height: 100,
							width: '100%',
							borderColor: 'orange',
							flexDirection: 'row',
							alignItems: 'center',
							paddingLeft: 20,
							paddingRight: 10,
							justifyContent: 'space-between'
						}
					}>
						<View style={
							{
								flexDirection: 'row',
								alignItems: 'center'
							}
						}>
							<Image source={
									require('../assets/userprofile.png')
								}
								style={
									{
										width: 50,
										height: 50,
										borderRadius: 25
									}
							}></Image>
							<View style={
								{marginLeft: 20}
							}>
								<Text style={
									{
										fontSize: 18,
										fontWeight: '600',
										color: 'black',
                    width: 100,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
									}
								}>{firstName} {lastName}</Text>
								<Text style={
									{
										fontSize: 18,
										fontWeight: '600',
										color: 'black'
									}
								}>+91 {contactNo}</Text>
							</View>

						</View>
            <TouchableOpacity onPress={() => setSidebarVisible(false)}>
						<Image source={
								require('../assets/right_arrow2.png')
							}
							style={
								{
									width: 24,
									height: 24,
                  transform: [
                    {
                      rotate: '180deg'
                    }
                  ]
								}
						}>

            </Image>
            </TouchableOpacity>
					</View>
					<View style={
						{
							width: '100%',
							justifyContent: 'space-between',
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: -3
						}
					}>
						<View style={
							{
								width: 0,
								height: 0,
								borderLeftWidth: 22,
								borderRightWidth: 22,
								borderBottomWidth: 22,
								borderLeftColor: 'transparent',
								borderRightColor: 'transparent',
								borderBottomColor: 'orange',
								transform: [
									{
										rotate: '45deg'
									}
								]
							}
						}></View>
						<View style={
							{
								width: 0,
								height: 0,
								borderLeftWidth: 22,
								borderRightWidth: 22,
								borderBottomWidth: 22,
								borderLeftColor: 'transparent',
								borderRightColor: 'transparent',
								borderBottomColor: 'orange',
								transform: [
									{
										rotate: '-45deg'
									}
								]
							}
						}></View>
					</View>
				</View>
			</View>


		</Model>
	</View>

      {/* ____________________________________________________________________________________________________________________________ */}
      
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

          {/* <View style={styles.boxContainer}>
            <View style={styles.box}>
            <Text style={styles.boxText}>Total Income</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>Used Amount</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>Balance Amount</Text>
          </View>
          </View> */}
          {/* <BottomBar/> */}

          
          {/* <View style={styles.formGroup}>
            <Text style={styles.label}>Category:</Text>
            <Picker
              
              style={styles.picker}
              onValueChange={handleCatagory}
              selectedValue={category.value}
            >
              {CategoryOptions.map((Catoption) => (
                <Picker.Item label={Catoption.label} value={Catoption.value} />
              ))}
            </Picker>
                </View> */}
    <View style={styles.formGroup}>
                <Text style={styles.label}>Category:</Text>
                <TouchableOpacity onPress={() => {{setCatModalVisible(true)}; {fetchCatagory()}}} style={styles.picker}>
                <Text style={styles.selectedValue}>
                        {category ? categoryOptions.find(option => option.value === category)?.label : 'Select category'}
                        {/* {'Search Category'} */}
                    </Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={catModalVisible}
                    onRequestClose={() => setCatModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Catagory"
                                value={search}
                                onChangeText={setSearch}
                                // onSubmitEditing={AddCatagoryAPI} // Trigger on enter press
                            />
                            <Divider />
                            <FlatList
                                data={filteredOptions}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => {handleSelect(item.value, item.label); setIsDisabled(false);}} style={styles.item}>
                                        <Text style={styles.itemText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.list} // Style for FlatList
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text>No results found</Text>
                                    </View>
                                }
                            />
                            <Button mode="contained" onPress={() => setCatModalVisible(false)} style={styles.closeButton}>
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
                </View>

          <View style={styles.formGroup}>
            {/* <Text style={styles.label}>Sub-Category:</Text>
            <Picker
              
              style={styles.picker}
              onValueChange={(setValue) => setSubCategory(setValue)}
              selectedValue={subCategory}
              
            >
              {SubCategoryOptions.map((SubCatoption) => (
                <Picker.Item label={SubCatoption.label} value={SubCatoption.value} />
              ))}
            </Picker> */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Sub-Category:</Text>
                <TouchableOpacity onPress={() => {setSubCatModalVisible(true); fetchSubCatagory();}} style={styles.picker}>
                <Text style={styles.selectedValue}>
                        {subCategory ? subCategoryOptions.find(option => option.value === subCategory)?.label : 'Select Sub-category'}
                    </Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={subCatModalVisible}
                    onRequestClose={() => setSubCatModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Catagory"
                                value={subCatSearch}
                                onChangeText={setSubCatSearch}
                                // onSubmitEditing={AddCatagoryAPI} // Trigger on enter press
                            />
                            <Divider />
                            <FlatList
                                data={subCatFilteredOptions}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => {handleSelectSubCat(item.value, item.label); setIsDisabled(false);}} style={styles.item}>
                                        <Text style={styles.itemText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.list} // Style for FlatList
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text>No results found</Text>
                                    </View>
                                }
                            />
                            <Button mode="contained" onPress={() => setSubCatModalVisible(false)} style={styles.closeButton}>
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
                </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Type:</Text>
            <Picker
              selectedValue={type}
              style={styles.picker}
              onValueChange={(itemValue) => setType(itemValue)}
            >
              <Picker.Item label="Need" value="Need" />
              <Picker.Item label="Want" value="Want" />
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
              placeholderTextColor="#888888"
            />
          </View>

          {/* <View style={styles.formGroup}>
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
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                // datePickerContainerStyleIOS={{ backgroundColor: 'white' }}
                textColor="black"
              />
            )}
          </View> */}

<View style={styles.formGroup}>
      <Text style={styles.label}>Date: {format(date, 'yyyy-MM-dd')}</Text>
      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>Select Date</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        // isDarkModeEnabled
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        headerTextIOS="Select Date"
        confirmTextIOS="Confirm"
        cancelTextIOS="Cancel"
      />
    </View>

          

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              
              placeholderTextColor="#888888"
            />
          </View>

          {/* <TouchableOpacity style={styles.submitButton} onPress={handleGetLocation}>  */}
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
    backgroundColor: '#FFFFFF',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 200,
    // backgroundColor: '#ffbe98',
    padding: 10,
    justifyContent: 'flex',
    zIndex: 1,
  },
  sidebarItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    // backgroundColor: '#FF7A64',
    // LinearGradient: 'FF7A64',
    
  },
  sidebarItems: {
    flex: 1,
  
  },
  sidebarLogout: {
    alignContent: 'flex-end',
    
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
    // marginLeft: 200,
  },
  toggleSidebarButton: {
    backgroundColor: 'orange',
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
    color: 'orange',
    marginLeft: 10,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    // color: '#388E3C',
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    placeholderTextColor: "#888888",
  },
  textArea: {
    // height: 100,
    textAlignVertical: 'center',
  },
  picker: {
    height: 45,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dateButton: {
    backgroundColor: 'orange',
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
    backgroundColor: 'orange',
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
  selectedValue: {
    fontSize: 16,
    color: '#000000',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
  },
  list: {
    maxHeight: 200, // Set the max height of the FlatList
  },
  closeButton: {
    marginTop: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  boxContainer: {
    flexDirection: 'row', // Set to row for horizontal layout
    justifyContent: 'space-around', // Space boxes evenly
    alignItems: 'center', // Center boxes vertically
    paddingVertical: 20,
  },
  box: {
    width: 100, // Width of the box
    height: 50, // Height of the box
    backgroundColor: '#4CAF50', // Box color
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
    
  },
  boxText: {
    color: '#FFFFFF', // Text color
    fontSize: 16,
  },
});


export default LandingTab