import { View, Text, ActivityIndicator } from "react-native";
import React, { useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
// import ChildNavigator from './ChildNavigator';


import LoginPage from "./loginPage";
import LandingTab from "./landing";
// import AppNav from "./appNav";
import { AuthContext, AuthProvider } from "../authValidator/authContext";
import SignUpPage from "./SignUp";
import MonthlyReport from "./Reports/MonthlyReport";
import ProfileDetails from "./ProfileDetails";
import AddCatagory from "./AddCatagory";
// import NavBar from "./navBar";


const Stack = createNativeStackNavigator();
const AppNav = () => {

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          if (!state.isConnected) {
            Alert.alert('No Internet Connection', 'Please check your network settings.');
          } else {
            console.log("Connection type:", state.type);
            console.log("Is connected?", state.isConnected);
          }
        });
    
        return () => unsubscribe();
      }, []);
// ---------------------------------------------------------------------------------------------------------------
    
    const {isLoading, userToken} = useContext(AuthContext);
    if( isLoading ){
        return(
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <ActivityIndicator size={"large"} />
        </View>
        )
    }

    return (
      <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack.Navigator>
        {/* <Stack.Screen name="SignUp" component={SignUpPage} /> */}

        {userToken !== null ? <Stack.Screen name="Add Expense" component={LandingTab} options={{ headerShown: false }}/> : 
        <Stack.Screen name="Expense Tracker" component={LoginPage} options={{ headerShown: false }}/>}
        <Stack.Screen name="SignUp" component={SignUpPage} options={{ headerShown: false }} />
        <Stack.Screen name="Monthly Report" component={MonthlyReport} options={{ headerShown: false }} />
        <Stack.Screen name="Profile Details" component={ProfileDetails} options={{headerShown: false}} />
        <Stack.Screen name="Add Catagory" component={AddCatagory} options={{headerShown: false}} />
        {/* <Stack.Screen name="navBar" component={NavBar} options={{headerShown: false}} /> */}

    </Stack.Navigator>
    </GestureHandlerRootView>
    </PaperProvider>
        
    );
  };
  

export default AppNav;