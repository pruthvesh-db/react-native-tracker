import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from 'react-native'
import React, {createContext, useEffect, useState} from "react";
import Constants from 'expo-constants';
import axios from 'axios';
// import { API_URL } from 'react-native-dotenv';


// const NewapiUrl = baseURL.apiUrl;
const apiUrl = Constants.expoConfig.extra.apiUrl;


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    // const {ServerIP} = useContext(ServerContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [ServerIP, setServerIP] = useState("http://65.1.92.142:5000");

    const login = async (userName, password) => {
        setIsLoading(true);
        try {
            // console.log('Making request to:', `${apiUrl}/auth/login`);
            console.log(ServerIP);
            const response = await axios.post(`${ServerIP}/api/auth/login`, {
              email: userName,
              pass: password
            });
       
        
            if (response.status === 200) {
                // Handle successful login
                console.log(response.data);
                let userInfo = response.data;
                setUserToken(userInfo.authtoken);
                await AsyncStorage.setItem('userToken', userInfo.authtoken);
                Alert.alert('Success', 'Login successful!');
              } else {
                // Handle non-200 response status
                Alert.alert('Error', 'Login failed!');
                console.log(response.data);
              }
            } catch (error) {
              // Handle errors that may have been thrown
              if (error.response) {
                // Server responded with a status code that falls out of the range of 2xx
                if (error.response.status === 401 || error.response.status === 400) {
                  // Handle specific status codes
                  Alert.alert('Error', 'Invalid credentials, please try again.');
                } else {
                  // Handle other status codes
                  Alert.alert('Error', 'Login failed. Please try again.');
                }
              } else if (error.request) {
                // The request was made but no response was received
                Alert.alert('Error', 'No response from server. Please try again later.');
              } else {
                // Something happened in setting up the request that triggered an Error
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
              }
              console.error(error);
            } finally {
              setIsLoading(false);
            }
        }

    const ChangeServerIP = (NewIpAddress) => {
      setServerIP(NewIpAddress);
    }

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    }

    const isLoggedIn = async() => {
        try{
        setIsLoading(true)
        let userToken = await AsyncStorage.getItem('userToken');
        setUserToken(userToken);
        setIsLoading(false);
    } catch(err) {
        console.log(`isLogged in Error ${err}`);
    }
}

    useEffect(() => {
        isLoggedIn();
    }, []);


    return(
        <AuthContext.Provider value={{login, logout, isLoading, userToken, ChangeServerIP, ServerIP}}>
            {children}
        </AuthContext.Provider>
    )
}