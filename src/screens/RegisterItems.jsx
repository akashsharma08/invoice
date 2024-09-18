import CustomPicker from "../components/CustonPicker";
import ImagePicker from "react-native-image-crop-picker";
import React, { useEffect, useState } from "react";
import firebase from "@react-native-firebase/app";
import storage from "@react-native-firebase/storage";
import tw from "twrnc";
import { BlurView } from "@react-native-community/blur";

import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Initialize Firestore
const firebaseConfig = {
  apiKey: 'AIzaSyCOFFtTGvD-B7rhBva5pX13slbLv3HnZXA',
  authDomain: 'nihaar-d5d2f.firebaseapp.com',
  projectId: 'nihaar-d5d2f',
  storageBucket: 'nihaar-d5d2f.appspot.com',
  messagingSenderId: '532552721085',
  appId: '1:532552721085:web:9ba14efd088d3329d8cdd4',
  measurementId: 'G-FFBKMYK2VD',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = getFirestore();
const datacollection = collection(db, 'datacolnew');
const suppliersCollection = collection(db, 'suppliers');

const AddProducts = () => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState('');
  const [description, setDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState([]);
  const [commission, setCommission] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [uploading, setUploading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const querySnapshot = await getDocs(suppliersCollection);
        const suppliersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(suppliersList);
      } catch (error) {
        console.error('Error fetching suppliers: ', error);
      }
    };

    fetchSuppliers();
  }, []);
  const captureImageWithCamera = () => {
    setIsModalVisible(false);
    ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      width: 800,
      height: 800,
    })
      .then(image => {
        setImageUri([...imageUri, image.path]); // Add new image to array
      })
      .catch(error => {
        console.error('Camera Error: ', error);
      });
  };

  const pickImageFromGallery = () => {
    setIsModalVisible(false);
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      cropping: true,
      width: 800,
      height: 800,
    })
      .then(images => {
        const newImageUri = images.map(image => image.path);
        setImageUri([...imageUri, ...newImageUri]);
      })
      .catch(error => {
        console.error('ImagePicker Error: ', error);
      });
  };

  const uploadImages = async () => {
    const imageUrl = [];

    for (const uri of imageUri) {
      const fileName = `${new Date().getTime()}.jpg`;
      const reference = storage().ref(fileName);
      setUploading(true);

      try {
        await reference.putFile(uri);
        const downloadUrl = await reference.getDownloadURL();
        imageUrl.push(downloadUrl);
      } catch (error) {
        console.error('Error uploading image: ', error);
        Alert.alert('Error', 'There was a problem uploading the image.');
        return null;
      }
    }

    setUploading(false);
    return imageUrl;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const imageUrl = await uploadImages();
      if (imageUrl) {
        await addDoc(datacollection, {
          name,
          description,
          price: parseFloat(price),
          commission: parseFloat(commission),
          imageUrl,
          supplierId: selectedSupplier,
          createdAt: serverTimestamp(),
          quantity: parseInt(quantity),
        });
        Alert.alert('Success', 'Form submitted successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form: ', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'There was a problem submitting the form.');
    }
  };

  const confirmImageRemoval = index => {
    Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: () => {
          const newImageUris = imageUri.filter((uri, i) => i !== index);
          setImageUri(newImageUris);
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* <Text>Name:</Text> */}
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter Product name"
        placeholderTextColor="#888"
      />
      {/* <Text>Description:</Text> */}
      <TextInput
        value={description}
        placeholder="Enter Product Description"
        placeholderTextColor="#888"
        onChangeText={setDescription}
        style={styles.input}
      />
      {/* <Text>Price:</Text> */}
      <TextInput
        value={price}
        placeholder="Price"
        placeholderTextColor="#888"
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      {/* <Text>Qty:</Text> */}
      <TextInput
        value={quantity}
        placeholder="Quantity"
        placeholderTextColor="#888"
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      {/* <Text>Commission:</Text> */}
      <TextInput
        value={commission}
        onChangeText={setCommission}
        keyboardType="numeric"
        placeholder="Enter commission"
        placeholderTextColor="#888"
        style={styles.input}
      />
      {/* <Text>Supplier:</Text> */}
      {/* <Picker
        selectedValue={selectedSupplier}
        onValueChange={setSelectedSupplier}
        style={[styles.picker, tw`border-2 border-gray-300 rounded-lg p-2`]} // Style the Picker container
        itemStyle={tw`text-black`} // Style each item
        mode="dropdown" // Add dropdown mode for better styling control (optional)
      >
        <Picker.Item
          // style={tw`text-black`}
          label="Select Supplier"
          value=""
          color="gray" // You can control the color of the text
        />
        {suppliers.map(supplier => (
          <Picker.Item
            key={supplier.id}
            label={supplier.name}
            value={supplier.id}
            color="white"
            style={tw`white`} // Styling individual picker items
          />
        ))}
      </Picker> */}
      <CustomPicker
        items={suppliers}
        selectedValue={selectedSupplier}
        onValueChange={setSelectedSupplier}
      />

      <View
        style={tw` flex-row justify-between my-5 bg-neutral-300 rounded bg-opacity-40 p-1  items-center `}>
        <Text style={tw`text-black`}>Image: </Text>

        <FlatList
          data={imageUri}
          keyExtractor={(item, index) => index.toString()} // Ensure each image has a unique key
          horizontal // Allows scrolling images horizontally
          renderItem={({item, index}) => {
            return (
              <View style={tw`relative mr-2`}>
                <Image source={{uri: item}} style={styles.image} />
                <Pressable
                  style={tw` absolute bg-opacity-70 p-1 rounded-full top-1 right-1`}
                  onPress={() => confirmImageRemoval(index)}>
                  <Image
                    resizeMode="center"
                    style={tw`w-3 h-3`}
                    source={require('../images/close.png')}
                  />
                </Pressable>
              </View>
            );
          }}
        />
        <Pressable
          style={tw` border-2 p-1 rounded-lg`}
          onPress={() => setIsModalVisible(true)}>
          <Text style={tw` text-black`}>Add Image</Text>
        </Pressable>

        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          style={tw``}>
          <View
            style={tw` relative m-auto bg-neutral-200 bg-opacity-99 rounded-lg shadow-lg w-[60%] h-[20%]  justify-center items-center`}>
            <View style={tw` flex-row justify-evenly gap-2 `}>
              <Pressable
                style={tw`border-2 p-1  rounded-lg`}
                onPress={captureImageWithCamera}>
                <Text style={tw` text-black `}>Capture</Text>
              </Pressable>
              <Pressable
                style={tw`border-2  p-1  rounded-lg`}
                onPress={pickImageFromGallery}>
                <Text style={tw` text-black `}>Gallery</Text>
              </Pressable>
              <Pressable
                style={tw` absolute -top-78 -right-12`}
                onPress={() => setIsModalVisible(false)}>
                <Image
                  resizeMode="center"
                  style={tw`w-5`}
                  source={require('../images/close.png')}
                />
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>

      <Pressable
        style={tw`  border-2 p-2 -bottom-2 `}
        onPress={handleSubmit}
        disabled={uploading}>
        {isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <Text style={tw` text-black text-center`}>Submit</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    color: 'black',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default AddProducts;
