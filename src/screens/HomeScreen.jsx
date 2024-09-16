import React from "react";
import tw from "twrnc";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useAuth } from "../auth/AuthContext";

const HomeScreen = () => {
  const {signOut, userInfo} = useAuth();
  // console.log(userInfo );
  const route = useRoute();
  console.log(route);

  // const userInfo = useSelector(state => state.user);
  // console.log(userInfo.email);
  const navigation = useNavigation();
  // console.log(navigation)

  // const route = useRoute();
  const {user, setUserInfo} = route.params || {}; // Retrieve user data from params
  // console.log(user + "2");

  return (
    <View style={tw`flex-1  justify-start gap-20  items-center`}>
      <Text style={tw`text-black mt-4 text-2xl`}>Welcome, {user.name} </Text>
      <View style={tw`flex-1 flex-row flex-wrap justify-center gap-5`}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => navigation.navigate('AddItems')}>
          <Text style={styles.text}>Register Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => navigation.navigate('AddItems')}>
          <Text style={styles.text}>Register Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => navigation.navigate('AddItems')}>
          <Text style={styles.text}>Register Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => navigation.navigate('AddItems')}>
          <Text style={styles.text}>Register Items</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={styles.signout} onPress={signOut}>
          <Text style={tw`text-red-600 text-lg`}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  buttons: {
    borderWidth: 2,
    borderRadius: 10,
    height: 100,
    width: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signout: {
    marginBottom:20,
    borderColor:'red',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
});

export default HomeScreen;
