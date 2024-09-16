import GoogleSignIn from "./src/screens/GoogleSignIn";
import HomeScreen from "./src/screens/HomeScreen";
import React from "react";
import RegisterItems from "./src/screens/RegisterItems";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { AuthProvider } from "./src/auth/AuthContext";
import { store } from "./src/redux/store";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator initialRouteName="GoogleSignIn">
            <Stack.Screen name="GoogleSignIn" component={GoogleSignIn} />
            <Stack.Screen name="AddItems" component={RegisterItems} />
            <Stack.Screen
              name="Nihaar"
              options={{headerLeft: () => null}}
              component={HomeScreen}
            />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
