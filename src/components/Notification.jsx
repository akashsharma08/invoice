import {View, Text, Image} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const Notification = () => {
  return (
    <View style={tw`relative`}>
      <Image
        resizeMode="center"
        style={tw`w-10 mr-2`}
        source={require('../images/notification.png')}
      />
      <View style={tw`absolute `}>
        <Text>{'2'}</Text>
      </View>
    </View>
  );
};

export default Notification;
