import { View, Text } from 'react-native'
import React from 'react'
import AppNav from './appNav'
import { AuthProvider } from '../authValidator/authContext'
import { ServerConfig } from '../authValidator/ServerConfig'


const index = () => {
  return (


    <AuthProvider>
      <AppNav />
    </AuthProvider>


   
    
  )
}

export default index