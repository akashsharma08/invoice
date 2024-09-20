import React, { useState } from "react";
import tw from "twrnc";

import {
  addDoc,
  collection,
  getDoc,
  getFirestore,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const AddSuppliers = () => {
  const [supplierName, setSupplierName] = useState('');
  const [commission, setCommission] = useState(null);

  const db = getFirestore();
  const suppliersCollection = collection(db, 'suppliers');
  // const pin  = getDoc(suppliersCollection);
  // console.log(pin);
  const fetchSu = async () => {
    const log = await getDoc(suppliersCollection);
    console.log(log._docs[10].id);
  };
  fetchSu();

  const handleSubmit = async () => {
    if (!supplierName) {
      Alert.alert('Error', 'Supplier name is required.');
      return;
    }

    try {
      // Generate a unique ID
      const supplierId = suppliersCollection.doc().id;
      console.log(supplierId);
      console.log(getDoc(suppliersCollection));

      // Add the supplier to the suppliers collection
      await addDoc(suppliersCollection, {
        name: supplierName,
        commission: commission,
        supplierId: supplierId, // Automatically generated ID
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Supplier added successfully!');
      setSupplierName('');
    } catch (error) {
      console.error('Error adding supplier: ', error);
      Alert.alert('Error', 'There was a problem adding the supplier.');
    }
    setCommission(null);
    setSupplierName('');
  };

  return (
    <View style={tw`flex-1 p-5 justify-start`}>
      <Text style={tw`text-black text-2xl font-bold mb-6`}>
        Supplier Registration
      </Text>

      <Text style={tw`text-black mb-2`}>Supplier Name:</Text>
      <TextInput
        value={supplierName}
        onChangeText={setSupplierName}
        style={tw`border-b-2 border-gray-300 text-black mb-6 p-2`}
        placeholder="Enter supplier name"
        placeholderTextColor="gray"
      />
      <Text style={tw`text-black mb-2`}>Commission(%):</Text>
      <TextInput
        value={commission}
        maxLength={2}
        inputMode="numeric"
        onChangeText={setCommission}
        style={tw`border-b-2 border-gray-300 text-black mb-6 p-2`}
        placeholder="Enter commission"
        placeholderTextColor="gray"
      />
      <TouchableOpacity
        style={tw`border-2 border-black rounded-lg`}
        onPress={handleSubmit}>
        <Text style={tw`text-black text-center text-xl`}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddSuppliers;
