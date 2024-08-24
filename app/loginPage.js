import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput as RNTextInput } from 'react-native'
import React, { useState, useContext } from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { Checkbox } from 'expo-checkbox';
import axios from 'axios';
import Constants from 'expo-constants';
import Config from 'react-native-config';
import { AuthContext } from '../authValidator/authContext';
import { ServerContext } from '../authValidator/ServerConfig';
// import { TouchableOpacity } from 'react-native-web';
const apiUrl = Constants.expoConfig.extra.apiUrl;
// const apiUrl = Config.API_URL;

const LoginPage = ({navigation}) => {

  const {login, ChangeServerIP} = useContext(AuthContext)
  // const {setServerIP} = useContext(ServerContext)

  const [agree, setAgree] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');


const handleLongPress = () => {
  setModalVisible(true);
};

const handleIpSubmit = () => {
  if (validateIpAddress(ipAddress)) {
    console.log(ipAddress);
    ChangeServerIP(ipAddress);
    Alert.alert('IP Address Submitted', ipAddress);
  } else {
    Alert.alert('Invalid IP Address', 'Please enter a valid IP address.');
  }
};

const validateIpAddress = (ip) => {
          // Simple IP validation
          const ipPattern = /^(https?:\/\/)?(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?$/;
          return ipPattern.test(ip);
        };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LogIn</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input}
          autoCapitalize='none'
          keyboardType="email-address"
          autoCorrect={false}
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input}
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox 
          value={agree}
          onValueChange={() => setAgree(!agree)}
          color={agree ? "#1E90FF" : undefined}
        />
        <Text style={styles.checkboxText}>I agree to the Terms & Conditions</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: agree ? "#1E90FF" : "#B0BEC5" }]}
        disabled={!agree}
        onPress={() => {login(userName, password)}}
        onLongPress={handleLongPress}
      >
        <Text style={styles.buttonText}>LogIn</Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Enter IP Address</Text>
            <RNTextInput
              style={styles.modalInput}
              placeholder="e.g., http://192.168.0.1:5000"
              value={ipAddress}
              onChangeText={setIpAddress}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleIpSubmit}
            >
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={[styles.signupline]}>
        <Text>
          Don't have an account?
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.signupbutton]}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>SignUp</Text>
      </TouchableOpacity>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    backgroundColor: '#E1F5FE', // Light blue background
  },
  header: {
    fontSize: 28,
    color: '#0D47A1', // Deep blue color for the header
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#00796B', // Teal color for labels
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#4CAF50', // Green border for inputs
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#004D40', // Dark teal color for checkbox text
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  signupbutton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  signupline: {
    // backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    // borderRadius: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalHeader: {
    fontSize: 18,
    color: '#FF5722', // Bright orange for modal header
    fontWeight: '600',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#FF5722', // Orange border for modal input
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#FF5722', // Orange color for modal buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#B0BEC5', // Gray color for cancel button
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },


})  

export default LoginPage;