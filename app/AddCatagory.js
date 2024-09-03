import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { AuthContext } from '../authValidator/authContext';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

const AddCatagory = () => {
    const { ServerIP, userToken } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    
    const [catagoryOptions, setCatagoryOptions] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [category, setCategory] = useState(null);
    const [SubModalVisible, setSubModalVisible] = useState(false);

    const [SubModalTwoVisible, setSubModalTwoVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [SubSearch, setSubSearch] = useState('');
    const [SubCatagoryOptions, setSubCatagoryOptions] = useState([]);
    const [SubFilteredOptions, setSubFilteredOptions] = useState([]);

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

            setCatagoryOptions(catagoryOptions);
            setFilteredOptions(catagoryOptions);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchSubCatagory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${ServerIP}/api/category/fetchsubcat/${category}`, {
                headers: {
                    'auth-token': userToken,
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;

            // Map data to the format required
            const SubCatagoryOptions = data.map(item => ({
                label: item.type,
                value: item.id
            }));
            console.log("Sub API Hitttttt");
            console.log(data);
            setLoading(false);
            // console.log(`${ServerIP}/api/category/fetchsubcat/${category}`);
            setSubCatagoryOptions(SubCatagoryOptions);
            setSubFilteredOptions(SubCatagoryOptions);
            
        } catch (error) {
            console.error('Error fetching SubCatagory');
            setLoading(false);
        }
    };

    const AddCatagoryAPI = async () => {
        try {
            const response = await axios.post(`${ServerIP}/api/category/addcategory`, {
                category: search,
            }, {
                headers: {
                    'auth-token': userToken,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setModalVisible(false);
                Alert.alert('Success', 'Added successful!');
            }
        } catch (error) {
            console.error('Error adding Catagory:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const AddSubCatagoryAPI = async () => {
        try {
            const response = await axios.post(`${ServerIP}/api/category/addsub_category/${category}`, {
                sub_category: SubSearch,
            }, {
                headers: {
                    'auth-token': userToken,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                setSubModalTwoVisible(false);
                Alert.alert('Success', 'Added successful!');
            }
        } catch (error) {
            console.error('Error adding Catagory:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };



    useEffect(() => {
        fetchCatagory();

    }, []);

    useEffect(() => {
        if (search === '') {
            setFilteredOptions(catagoryOptions);
        } else {
            setFilteredOptions(catagoryOptions.filter(option =>
                option.label.toLowerCase().includes(search.toLowerCase())
            ));
        }
    }, [search, catagoryOptions]);

    useEffect(() => {
        if (SubSearch === '') {
            setSubFilteredOptions(SubCatagoryOptions);
        } else {
            setSubFilteredOptions(SubCatagoryOptions.filter(option =>
                option.label.toLowerCase().includes(SubSearch.toLowerCase())
            ));
        }
    }, [SubSearch, SubCatagoryOptions]);

    const handleSelect = (value) => {
        setCategory(value);
        setSubModalVisible(false);
    };

    // const handleFetchSubCat = () => {
    //     fetchSubCatagory(); 
    //     setSubModalTwoVisible(true);
           
    // }


    return (
        <ScrollView contentContainerStyle={styles.content}>

            <View style={styles.formGroup}>
                <Text style={styles.mainlabel}>Add Category</Text>
                <TouchableOpacity onPress={() => {setModalVisible(true); fetchCatagory();}} style={styles.picker}>
                    <Text style={styles.selectedValue}>
                        {'Search Category'}
                    </Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search or add new..."
                                value={search}
                                onChangeText={setSearch}
                                onSubmitEditing={AddCatagoryAPI} // Trigger on enter press
                                placeholderTextColor="#888888"
                            />
                            <Divider />
                            <FlatList
                                data={filteredOptions}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.item}>
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
                            <Button mode="contained" onPress={AddCatagoryAPI} style={styles.addButton}>
                                Confirm
                            </Button>
                            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
{/* ------------------------------------------------------------------------------------------------------------------- */}
            <View style={styles.formGroup}>
                <View style={styles.formSubGroup}>
                <Text style={styles.mainlabel}>Add SubCategory</Text>
                <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
                <TouchableOpacity onPress={() => {setSubModalVisible(true); fetchCatagory();}} style={styles.picker}>
                    <Text style={styles.selectedValue}>
                        {category ? catagoryOptions.find(option => option.value === category)?.label : 'Select category'}
                    </Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={SubModalVisible}
                    onRequestClose={() => setSubModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Catagory"
                                value={search}
                                onChangeText={setSearch}
                                placeholderTextColor="#888888"
                                // onSubmitEditing={AddCatagoryAPI} // Trigger on enter press
                            />
                            <Divider />
                            <FlatList
                                data={filteredOptions}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => {handleSelect(item.value); setIsDisabled(false);}} style={styles.item}>
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
                            <Button mode="contained" onPress={() => setSubModalVisible(false)} style={styles.closeButton}>
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
                </View>
            {/* ------------------------------------ */}
                <View style={styles.formSubGroup}>
                <TouchableOpacity disabled={isDisabled} onPress={() => {fetchSubCatagory(); setSubModalTwoVisible(true);}} style={[styles.picker, isDisabled && styles.disabledButton]}>
                    <Text style={styles.selectedValue}>
                        {'Search SubCategory'}
                    </Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={SubModalTwoVisible}
                    onRequestClose={() => setSubModalTwoVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search or add new..."
                                value={SubSearch}
                                onChangeText={setSubSearch}
                                onSubmitEditing={AddSubCatagoryAPI} // Trigger on enter press
                                placeholderTextColor="#888888"
                            />
                            <Divider />
                            <FlatList
                                data={SubFilteredOptions}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity  style={styles.item}>
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
                            <Button mode="contained" onPress={AddSubCatagoryAPI} style={styles.addButton}>
                                Confirm
                            </Button>
                            <Button mode="contained" onPress={() => setSubModalTwoVisible(false)} style={styles.closeButton}>
                                Close
                            </Button>
                        </View>
                    </View>
                </Modal>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    formGroup: {
        marginBottom: 50,
    },
    formSubGroup: {
        marginBottom: 20,
    },
    mainlabel: {
        fontSize: 22,
        color: 'black',
        marginBottom: 8,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#388E3C',
        marginBottom: 8,
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
    list: {
        maxHeight: 200, // Set the max height of the FlatList
    },
    item: {
        padding: 10,
    },
    itemText: {
        fontSize: 16,
    },
    addButton: {
        marginTop: 10,
        backgroundColor: 'orange',
    },
    closeButton: {
        marginTop: 10,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    disabledButtonText: {
        color: '#CFD8DC', // Light grey text for disabled state
    },
    disabledButton: {
        backgroundColor: '#B0BEC5', // Grey color for disabled state
    },
});

export default AddCatagory;