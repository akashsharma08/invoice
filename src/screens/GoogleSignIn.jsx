import React from "react";
import tw from "twrnc";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../auth/AuthContext";

const GoogleSignIn = () => {
  const { signOut, signIn, setUserInfo, userInfo } = useAuth();
  
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      {userInfo ? (
        <>
          <Text style={tw`text-black`}>Welcome, {userInfo.name}</Text>
          <TouchableOpacity onPress={signOut}>
            <Text style={tw`text-black border-2 rounded-lg p-2 mt-4 text-center`}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={signIn}>
            <Text style={tw`text-black border-2 rounded-lg p-2 text-center`}>
              Sign In with Google
            </Text>
          </TouchableOpacity>
          <Text style={tw`text-black mt-4`}>Please sign in</Text>
        </>
      )}
    </View>
  );
};

export default GoogleSignIn;
