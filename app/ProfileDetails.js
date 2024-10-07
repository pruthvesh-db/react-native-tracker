import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../authValidator/authContext';

const ProfileDetailsScreen = () => {
  const { userToken, ServerIP } = useContext(AuthContext); // Fetch the token from the context
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${ServerIP}/api/auth/getuser`, {}, {
          headers: {
            'auth-token': userToken, // Pass the token in the header
          }
        });

        console.log('API Response:', response.data); // Log the API response

        // Ensure you correctly access fields in the response data
        if (response.data && response.data.length > 0) {
          const userData = response.data[0]; // Get the first item from the array

          // Log individual values to verify
          console.log('First Name:', userData.first_name);
          console.log('Last Name:', userData.last_name);
          console.log('Username:', userData.user_name);
          console.log('Contact No:', userData.contact_no);
          console.log('Email:', userData.email);

          // Update state with the fetched data
          setFirstName(userData.first_name || '');
          setLastName(userData.last_name || '');
          setUsername(userData.user_name || '');
          setContactNo(userData.contact_no || '');
          setEmail(userData.email || '');
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

  const handleSave = async () => {
    try {
      await axios.post('http://65.1.92.142:5000/api/auth/updateuser', {
        first_name: firstName,
        last_name: lastName,
        user_name: username,
        contact_no: contactNo,
        email: email
      }, {
        headers: {
          'auth-token': userToken, // Pass the token in the header
        }
      });

      Alert.alert('Profile Updated', 'Your profile details have been updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile Details</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact No:</Text>
        <TextInput
          style={styles.input}
          value={contactNo}
          onChangeText={setContactNo}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileDetailsScreen;
 