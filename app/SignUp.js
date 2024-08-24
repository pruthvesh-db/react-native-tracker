import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../authValidator/authContext';



const SignUpPage = ({navigation}) => {

    const {ServerIP} = useContext(AuthContext)

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        // Simple validation
        if (!firstName || !lastName || !userName || !contactNo || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
        }

        // Create the payload
        const payload = {
        first_name: firstName,
        last_name: lastName,
        user_name: userName,
        contact_no: contactNo,
        email,
        pass: password
        };

        try {
        // Make the POST request with Axios
        console.log(ServerIP);
        const response = await axios.post(`${ServerIP}/api/auth/createuser`, payload, {
            headers: {
            'Content-Type': 'application/json'
            }
        });

        // Handle successful response
        console.log('Sign-up successful:', response.data);
        Alert.alert('Success', 'Sign-Up successful!');
        navigation.navigate('Expense Tracker')
        
        // Clear form after submission
        setFirstName('');
        setLastName('');
        setUserName('');
        setContactNo('');
        setEmail('');
        setPassword('');
        } catch (error) {
        // Handle error response
        console.error('Error during sign-up:', error);
        Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Sign Up</Text>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name:</Text>
            <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            />
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name:</Text>
            <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            />
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your username"
            />
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number:</Text>
            <TextInput
            style={styles.input}
            value={contactNo}
            onChangeText={setContactNo}
            placeholder="Enter your contact number"
            keyboardType="numeric"
            />
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            />
        </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpPage;
