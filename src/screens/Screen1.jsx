import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const Screen1 = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
      '532552721085-u56gm1e4u00u9ujk3ire84q9e77np1sv.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();
console.log(response);
      setUserInfo(response);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {userInfo !== null && <Text>{userInfo.user.name}</Text>}
      {userInfo !== null && <Text>{userInfo.user.email}</Text>}
      {userInfo !== null && (
        <Image>
          source={{uri: userInfo.user.email}}
          style={{width: 100, height: 100}}
        </Image>
      )}

      {userInfo == null ? (
        <Text
          style={{padding: 20, borderWidth: 1, color: 'black'}}
          onPress={() => {
            signIn();
          }}>
          Sign in
        </Text>
      ) : (
        <Text
          style={{padding: 20, borderWidth: 1, marginTop: 30, color: 'black'}}>
          {' '}
          Sign out
        </Text>
      )}
    </View>
  );
};

export default Screen1;
