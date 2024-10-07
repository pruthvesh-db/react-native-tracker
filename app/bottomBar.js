import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can use icons for each tab
import { View, Text } from 'react-native';
import ReportEntry from './Reports/ReportEntry';


const Tab = createBottomTabNavigator();

const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home</Text>
  </View>
);

const HealthScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Health Plan</Text>
  </View>
);

const CashbackScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Cashback</Text>
  </View>
);

const Report = () => (
  <View style={{ flex: 1

  }}>
    <ReportEntry/>
  </View>
);

export default function BottomBar({navigation}) {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home'; // Example icon, use whatever fits
            } else if (route.name === 'Health Plan') {
              iconName = 'rupee';
            } else if (route.name === 'Report') {
              iconName = 'files-o';
            }

            // Return the Icon component
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff', // Active color similar to your image
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff', // Background color of the tab
            borderTopWidth: 0, // To hide top border if needed
            height: 70, // Adjust height to match the image
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5, // Adjust spacing between icon and label
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Health Plan" component={HealthScreen} />
        <Tab.Screen name="Report" component={Report} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// export default BottomBar