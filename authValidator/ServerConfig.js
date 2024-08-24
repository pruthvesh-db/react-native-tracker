import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native'
import React, {createContext, useState} from 'react'


export const ServerContext = createContext();

export const ServerConfig = ({childern}) => {

    
    // const ServerIP = "http://65.1.92.142:5000"
    const [ServerIP, setServerIP] = useState("http://65.1.92.142:5000");

  return (
   
    <ServerContext.Provider value={{ServerIP}} >
        {childern}
    </ServerContext.Provider>

  )
}


// export default ServerConfig