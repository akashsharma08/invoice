import AddSuppliers from './src/screens/AddSuppliers';
import GoogleSignIn from './src/screens/GoogleSignIn';
import HomeScreen from './src/screens/HomeScreen';
import Invoice from './src/screens/Invoice';
import ProductsData from './src/screens/ProductsData';
import React from 'react';
import RegisterItems from './src/screens/RegisterItems';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {AuthProvider} from './src/auth/AuthContext';
import {store} from './src/redux/store';
import Notification from './src/components/Notification';
import { Image } from 'react-native';
import tw from 'twrnc'

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator initialRouteName="GoogleSignIn">
            <Stack.Screen
              name="GoogleSignIn"
              options={{
                title: 'NIHAAR',
                headerTintColor: 'white',
                headerShown: false,
              }}
              component={GoogleSignIn}
            />
            <Stack.Screen name="AddItems" component={RegisterItems} />
            <Stack.Screen
              name="AddSuppliers"
              component={AddSuppliers}
              options={{
                title: 'Add Suppliers',
                headerStyle: {
                  backgroundColor: 'lightgray',
                },
              }}
            />
            <Stack.Screen name="ProductsData" component={ProductsData} />
            <Stack.Screen
              options={{headerLeft: () => null}}
              name="INVOICE"
              component={Invoice}
            />
            <Stack.Screen
              name="HomeScreen"
              options={{
                headerTintColor: 'white',
                headerLeft: () => <Image resizeMode='center' style={tw`w-6 ml-2`} source={require('./src/images/menu.png')}/>,
                headerRight: () => (<Notification/>),
                title: 'NIHAAR',
                headerStyle: {
                  
                  backgroundColor: '#1CB2F8',
                  
                },
                headerTitleAlign: 'center',
                headerTitleStyle:{
                  fontSize: 30,
                  textAlign:'center'
                }
              }}
              component={HomeScreen}
            />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
