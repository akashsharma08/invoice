import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useAuth } from "../auth/AuthContext";
import { setPin as updateReduxPin } from "../redux/slices/PinSlice";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from '@react-native-firebase/firestore';

import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';

const db = getFirestore();
const pinCollection = collection(db, 'pin');

const HomeScreen = () => {
  const [pin, setLocalPin] = useState(0);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await getDocs(pinCollection);
      const fetchedPin = response._docs[0]?.data().pin; // Safely access the pin
      setLocalPin(fetchedPin);
    } catch (err) {
      console.error('Error fetching PIN:', err);
    } finally {
    }
  };

  fetchData();
  let finalPin;

  useEffect(() => {
    finalPin = pin;
    console.log(finalPin);
  }, [pin]);

  const {signOut} = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const {user} = route.params || {}; // Retrieve user data from params
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChangePinModalVisible, setChangePinModalVisible] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Sign Out', onPress: signOut},
    ]);
  };

  const handleAccessProductDetails = () => {
    setModalVisible(true); // Show the modal when button is pressed
  };

  const validatePassword = () => {
    if (password === pin.toString()) {
      setPassword('');
      setModalVisible(false); // Hide modal
      navigation.navigate('ProductsData'); // Navigate to ProductsData
    } else {
      Alert.alert('Incorrect Password', 'Please try again.');
    }
  };
  const handleChangePin = async () => {
    if (oldPin === pin.toString()) {
      // Ensure oldPin matches the current pin
      if (newPin.length === 4) {
        try {
          // Reference the document you want to update
          const pinDoc = doc(db, 'pin', 'KUSAw039bea8H6efQ5oG'); // Replace with your actual document ID

          console.log(pinDoc);

          await updateDoc(pinDoc, {
            pin: newPin,
          });


          setOldPin('');
          setNewPin('');
          setChangePinModalVisible(false);
          Alert.alert('Success', 'PIN has been updated successfully');
        } catch (error) {
          console.error('Error updating PIN in Firestore:', error);
          Alert.alert('Error', 'Failed to update PIN. Please try again.');
        }
      } else {
        Alert.alert('Invalid PIN', 'PIN should be 4 digits');
      }
    } else {
      Alert.alert('Incorrect Old PIN', 'Please enter the correct current PIN');
    }
  };

  return (
    <View style={tw`flex-1 justify-start gap-20 items-center`}>
      <Text style={tw`text-black mt-4 text-2xl`}>Welcome, {user.name}</Text>
      <View style={tw`flex-1 flex-row flex-wrap justify-center gap-5`}>
      <TouchableOpacity
        onPress={() => navigation.navigate('INVOICE')}
        style={tw`border-2 px-5  rounded-lg bg-green-700 bg-opacity-10 border-green-700 h-24 w-36 flex justify-center items-center`}>
        <Text style={tw`text-green-700 text-lg text-center`}>
          Start new invoice
        </Text>
      </TouchableOpacity>
        <TouchableOpacity
          style={tw`border-2 px-5 rounded-lg h-24 w-36 flex justify-center items-center`}
          onPress={() => navigation.navigate('AddItems')}>
          <Text style={tw`text-black text-lg text-center`}>Register Items</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`border-2 px-5 rounded-lg h-24 w-36 flex justify-center items-center`}
          onPress={handleAccessProductDetails}>
          <Text style={tw`text-black text-lg text-center`}>
            Available Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`border-2 px-5 rounded-lg h-24 w-36 flex justify-center items-center`}
          onPress={() => navigation.navigate('AddSuppliers')}>
          <Text style={tw`text-black text-lg text-center`}>Add Suppliers</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex flex-row gap-5`}>
        <TouchableOpacity
          style={tw` bg-red-400 rounded-lg h-12 mb-10 w-30 flex justify-center items-center`}
          onPress={confirmSignOut}>
          <Text style={tw`text-white text-lg`}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw` bg-yellow-400 rounded-lg h-12 mb-10 w-30 flex justify-center items-center`}
          onPress={() => setChangePinModalVisible(true)}>
          <Text style={tw`text-white text-lg`}>Change PIN</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for password prompt */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-8 rounded-lg w-80`}>
            <Text style={tw`text-lg text-black font-bold mb-4`}>Admin access</Text>
            <TextInput
              value={password}
              inputMode="numeric"
              // keyboardType="numeric"
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={'lightgray'}
              secureTextEntry={true}
              style={tw`border-b-2 text-black text-center border-gray-300 mb-6 p-2`}
            />
            <TouchableOpacity
              style={tw`border-2 border-black rounded-lg`}
              onPress={validatePassword}>
              <Text style={tw`text-black text-lg text-center`}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`border-2 mt-2 border-black rounded-lg`}
              onPress={() => {
                setModalVisible(false);
                setPassword(null);
              }}>
              <Text style={tw`text-black text-lg text-center`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for changing PIN */}
      <Modal
        transparent={true}
        visible={isChangePinModalVisible}
        animationType="slide"
        onRequestClose={() => setChangePinModalVisible(false)}>
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-8 rounded-lg w-80`}>
            <Text style={tw`text-lg font-bold mb-4`}>Change PIN</Text>
            <TextInput
              value={oldPin}
              keyboardType="numeric"
              placeholderTextColor={'lightgray'}
              onChangeText={setOldPin}
              placeholder="Enter old PIN"
              secureTextEntry={true}
              style={tw`border-b-2 text-black text-center border-gray-300 mb-6 p-2`}
            />
            <TextInput
              value={newPin}
              keyboardType="numeric"
              placeholderTextColor={'lightgray'}
              onChangeText={setNewPin}
              placeholder="Enter new PIN"
              secureTextEntry={true}
              style={tw`border-b-2 text-black text-center border-gray-300 mb-6 p-2`}
            />
            <TouchableOpacity
              style={tw`border-2 border-black rounded-lg mb-4`}
              onPress={handleChangePin}>
              <Text style={tw`text-black text-lg text-center`}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`border-2 border-black rounded-lg`}
              onPress={() => {
                setChangePinModalVisible(false);
                setOldPin('');
                setNewPin('');
              }}>
              <Text style={tw`text-black text-lg text-center`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
