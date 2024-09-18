import React, {useEffect, useRef, useState} from 'react';
import {Animated, Image, Pressable, Text, View} from 'react-native';
import tw from 'twrnc';
import {useAuth} from '../auth/AuthContext';

const GoogleSignIn = () => {
  const {signOut, signIn} = useAuth();
  const imagePosition = useRef(new Animated.Value(0)).current; // Ref for image animation
  const buttonOpacity = useRef(new Animated.Value(0)).current; // Ref for button opacity

  useEffect(() => {
    // Start the image position animation
    Animated.timing(imagePosition, {
      toValue: -100, // Move the image upward by 100 units (adjust as needed)
      duration: 1000, // 1 second duration for the animation
      useNativeDriver: true,
    }).start(() => {
      // Once the image animation finishes, start the button fade-in animation
      Animated.timing(buttonOpacity, {
        toValue: 1, // Fully visible
        duration: 500, // Half a second for the fade-in
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      {/* Animated image */}
      <Animated.View style={[{transform: [{translateY: imagePosition}]}]}>
        <Image
          style={tw`w-50 h-50`}
          source={require('../images/letter-n.png')}
        />
      </Animated.View>

      {/* Animated button with fade-in effect */}
      <Animated.View style={[tw`items-center `, {opacity: buttonOpacity}]}>
        <Pressable style={tw`bg-[#1CB2F8] rounded-lg  w-40`} onPress={signIn}>
          <Text style={tw`text-center text-white text-2xl`}>Sign In</Text>
        </Pressable>
        <Text style={tw`text-black mt-2`}>Please sign in using Gmail</Text>
      </Animated.View>
    </View>
  );
};

export default GoogleSignIn;
