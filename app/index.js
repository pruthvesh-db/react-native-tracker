import { View, Text } from 'react-native'
import React from 'react'
import AppNav from './appNav'
import { AuthProvider } from '../authValidator/authContext'
import { ServerConfig } from '../authValidator/ServerConfig'
import { ReportProvider } from './Reports/ReportsAPI'


const index = () => {
  return (


    <AuthProvider>
      <ReportProvider>
      <AppNav />
      </ReportProvider>
    </AuthProvider>


   
    
  )
}

export default index