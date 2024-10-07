import React, {createContext, useEffect, useContext, useState} from "react";
import axios from 'axios';
import { AuthContext } from "../../authValidator/authContext";


export const ReportContext = createContext();
export const ReportProvider = ({children}) => {

    const { userToken, ServerIP } = useContext(AuthContext);

    const [ExpenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchExpense = async (from_date, to_date) => {
        try {
            const response = await axios.get(`${ServerIP}/api/report/monthly?fromDate=${from_date}&toDate=${to_date}`, {
              headers: {
                'auth-token': userToken, // Include the auth token in headers
              },
            });
            // console.log(response.data);
            console.log(`API URL: ${ServerIP}/api/report/monthly?fromDate=${from_date}&toDate=${to_date}`)
            setExpenseData(response.data);
            return response.data; // Ensure the function returns the promise
            // console.log(`API Res Data ${response}`);
          } catch (error) {
            Alert.alert('Error', 'Unable to fetch data. Please try again later.');
          } finally {
            setLoading(false);
          }
        }

        // useEffect(() => {
        //     if (ExpenseData) {
        //       console.log(`API Res Data ${JSON.stringify(ExpenseData)}`);
        //     }
        //   }, [ExpenseData]);


    return(
        <ReportContext.Provider value={{fetchExpense, ExpenseData}}>
            {children}
        </ReportContext.Provider>
    )

}