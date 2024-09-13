import { Button, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  return (
    <View style = {{marginTop:30}}>
      {/* <Text>HEllo,Utkarsh</Text> */}
      <Button title='click me' onPress={() => navigation.navigate("Screen1")} />
      <Button title='Add Products' onPress={() => navigation.navigate("AddProducts")} />
      <Button title='Products' onPress={() => navigation.navigate("ProductsData")} />



    </View>
  );
};



export default Home;