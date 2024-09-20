import CustomCarousel from "../components/Corousel";
import QRCode from "react-native-qrcode-svg";
import RNFS from "react-native-fs";
import RNPrint from "react-native-print";
import React, { useEffect, useRef, useState } from "react";
import ViewShot from "react-native-view-shot";
import WebView from "react-native-webview";
import generatePrintableTag from "../components/GenerateQRTag";
import tw from "twrnc";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// import Carousel from 'react-native-snap-carousel';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Button,
  BackHandler,
  Dimensions,
  StyleSheet,
  Modal,
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
const {width: screenWidth} = Dimensions.get('window');
const db = getFirestore();
export const datacollection = collection(db, 'datacolnew');
// const { width: screenWidth } = Dimensions.get('window');
const ProductsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [htmlContent, setHtmlContent] = useState(''); // State to store HTML content
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemID, setItemID] = useState(null);
  const [editingValues, setEditingValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity: null,
  });
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Confirm Exit',
          'Are you sure you want to leave the Product details? Any unsaved changes will be lost.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Yes',
              onPress: () => navigation.goBack(), // Navigate back if the user confirms
            },
          ],
          {cancelable: true},
        );
        return true; // Prevent default back behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );
  const viewShotRef = useRef(null);

  // Existing state and functions...
  const saveTagAsImage = async () => {
    if (viewShotRef.current) {
      try {
        // Capture the view as an image
        const uri = await viewShotRef.current.capture({
          format: 'png',
          quality: 0.8,
        });

        // Save the image to the file system
        const filePath = `${RNFS.ExternalDirectoryPath}/tag_${itemID}.png`;
        await RNFS.copyFile(uri, filePath);

        console.log('Image saved to:', filePath);
        alert(`Tag saved at ${RNFS.ExternalDirectoryPath}/tag_${itemID}.png`);
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(datacollection);
        const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setData(items);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const confirmDelete = id => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteItem(id),
          style: 'destructive',
        },
      ],
    );
  };

  const deleteItem = async id => {
    try {
      await deleteDoc(doc(db, 'datacolnew', id));
      setData(prevData => prevData.filter(item => item.id !== id));
      Alert.alert('Success', 'Item deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const startEditing = item => {
    // console.log(item.quantity);

    setEditingItemId(item.id);
    setEditingValues({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity,
    });
  };

  const saveChanges = async id => {
    try {
      const itemRef = doc(db, 'datacolnew', id);
      await updateDoc(itemRef, {
        name: editingValues.name,
        description: editingValues.description,
        price: parseFloat(editingValues.price),
        quantity: parseInt(editingValues.quantity, 10),
      });

      setData(prevData =>
        prevData.map(item =>
          item.id === id
            ? {
                ...item,
                ...editingValues,
                price: parseFloat(editingValues.price),
                quantity: parseInt(editingValues.quantity, 10),
              }
            : item,
        ),
      );

      Alert.alert('Success', 'Item updated successfully');
      setEditingItemId(null);
    } catch (err) {
      Alert.alert(err, 'Failed to save changes');
    }
  };

  const incrementItem = () => {
    setEditingValues(prevValues => ({
      ...prevValues,
      quantity: (parseInt(prevValues.quantity, 10) + 1).toString(),
    }));
  };

  const decrementItem = () => {
    setEditingValues(prevValues => ({
      ...prevValues,
      quantity: Math.max(1, parseInt(prevValues.quantity, 10) - 1).toString(),
    }));
  };

  const generatePrintableTag = async item => {
    const htmlContent = `
      <html>
      <head>
        <style>
          body {
            width: 300px; /* Adjusted width */
            height: 150px; /* Adjusted height */
            margin: 0;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: Arial, sans-serif;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .left-section {
            text-align: center;
            padding-right: 10px;
          }
          .left-section img {
            width: 80px;
            height: 80px;
            margin-bottom: 5px;
          }
          .left-section p {
            font-size: 10px;
            margin: 0;
          }
          .right-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .product-info {
            text-align: left;
          }
          .product-info h2 {
            font-size: 16px;
            margin: 0;
          }
          .product-info p {
            font-size: 12px;
            margin: 2px 0;
            color: #555;
          }
          .price-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .price-section .price {
            font-size: 24px;
            font-weight: bold;
          }
          .price-section small {
            font-size: 10px;
            color: #555;
          }
          .divider {
            width: 2px;
            background-color: red;
            height: 100%;
            margin-right: 10px;
          }
        </style>
      </head>
      <body>
        <div class="left-section">
          <p>Great Britain</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${
            item.id
          }" alt="QR Code" />
          <p>1234567890</p>
        </div>
        <div class="divider"></div>
        <div class="right-section">
          <div class="product-info">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
          </div>
          <div class="price-section">
            <div>
              <span class="price">$${(item.price + item.commission).toFixed(
                2,
              )}</span>
            </div>
           
          </div>
        </div>
      </body>
    </html>
    


    `;
    setHtmlContent(htmlContent);
    // console.log("generating qr");
    // try {
    //   await RNPrint.print({html: htmlContent});
    // } catch (error) {
    //   console.error('Error generating printable tag: ', error);
    // }
    return htmlContent;
  };
  useEffect(() => {
    const generateHtmlContent = async () => {
      if (selectedItem) {
        try {
          const content = await generatePrintableTag(selectedItem);
          setHtmlContent(content);
        } catch (error) {
          console.error('Error generating HTML content:', error);
        }
      }
    };

    generateHtmlContent();
  }, []);
  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator style={tw`mb-3`} size="large" color="gray" />
        <Text style={tw`text-lg text-gray-500`}>Loading Products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-red-500`}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-800`}>No Products Available</Text>
      </View>
    );
  }
  // console.log(data);

  // const imageData = [
  //   {uri: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Image1'},
  //   {uri: 'https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Image2'},
  //   {uri: 'https://via.placeholder.com/400x300/0000FF/FFFFFF?text=Image3'},
  //   {uri: 'https://via.placeholder.com/400x300/FFFF00/FFFFFF?text=Image4'},
  //   {uri: 'https://via.placeholder.com/400x300/00FFFF/FFFFFF?text=Image5'},
  // ];

  // // Render individual carousel items
  // const renderItem = ({item}) => {
  //   return (
  //     <View style={styles.carouselItem}>
  //       <Image source={{uri: item.uri}} style={styles.image} />
  //     </View>
  //   );
  // };
  return (
    <View style={tw`flex-1 p-5 bg-gray-100`}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <Text style={tw`text-2xl font-bold text-center mb-5 text-gray-800`}>
            Available Products
          </Text>
        )}
        renderItem={({item}) => (
          <View
            style={tw`bg-white p-4 mb-5  rounded-lg shadow flex-row justify-between`}>
            <View>
              {editingItemId === item.id ? (
                <>
                  <TextInput
                    value={editingValues.name}
                    onChangeText={text =>
                      setEditingValues(prev => ({...prev, name: text}))
                    }
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <TextInput
                    value={editingValues.description}
                    onChangeText={text =>
                      setEditingValues(prev => ({...prev, description: text}))
                    }
                    style={tw`border-b mb-2 p-2 text-black`}
                  />
                  <TextInput
                    value={editingValues.price}
                    onChangeText={text =>
                      setEditingValues(prev => ({...prev, price: text}))
                    }
                    keyboardType="numeric"
                    style={tw`border-b mb-2 p-2 text-black`}
                  />

                  <View style={tw`flex-row items-center`}>
                    <TouchableOpacity onPress={decrementItem}>
                      <Text style={tw`text-2xl text-black px-2`}>-</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-xl text-black`}>
                      {editingValues.quantity}
                    </Text>
                    <TouchableOpacity onPress={incrementItem}>
                      <Text style={tw`text-2xl text-black px-2`}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Button title="Save" onPress={() => saveChanges(item.id)} />
                </>
              ) : (
                <>
                  <Text style={tw`text-xl font-bold text-black`}>
                    {item.name}
                  </Text>
                  <Text style={tw`text-sm w-40 text-gray-500`}>
                    {item.description}
                  </Text>
                  <Text style={tw`text-lg text-green-600`}>
                    ₹{(item.price )}
                  </Text>
                  <Text style={tw`text-yellow-600`}>
                    Items: {item.quantity}
                  </Text>
                  <TouchableOpacity
                    style={tw`absolute bottom-0 z-1 left-0 opacity-50`}
                    onPress={() => confirmDelete(item.id)}>
                    <Image
                      style={tw`w-8 h-8`}
                      source={require('../images/bin.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`absolute bottom-0 z-1 left-10 opacity-50`}
                    onPress={() => startEditing(item)}>
                    <Image
                      style={tw`w-8 h-8`}
                      source={require('../images/pen.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`absolute bottom-0 z-1 left-20 `}
                    onPress={() => {
                      setSelectedItem(item);
                      setItemID(item.id);
                      setModalVisible(true);
                    }}>
                    <Image
                      style={tw`w-7 h-7`}
                      source={require('../images/label.png')}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={tw``}>
              {item.imageUrl && item.imageUrl.length > 0 ? (
                <CustomCarousel images={item.imageUrl} />
              ) : (
                <Text>No Images Available</Text>
              )}
            </View>
            {/* <View style={styles.container}>
              <Carousel
                ref={carouselRef}
                data={imageData}
                sliderWidth={screenWidth}
                itemWidth={screenWidth * 0.8} // Set the width of each carousel item
                renderItem={renderItem}
                onSnapToItem={index => setActiveIndex(index)} // Update active index on snap
                layout="default" // Can use "default", "stack", or "tinder" layout
              />
              <Text style={styles.caption}>
                Image {activeIndex + 1} of {imageData.length}
              </Text>
            </View> */}
          </View>
        )}
      />
      <View style={tw`flex-1 p-5 bg-gray-100`}>
        {/* Existing FlatList and other components */}

        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <ViewShot ref={viewShotRef} style={styles.modalContainer}>
              <View style={styles.leftSection}>
                <Text style={styles.country}>Nihaar</Text>
                <Image
                  style={styles.qrCode}
                  source={{
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${itemID}`,
                  }}
                />
                <Text style={styles.phoneNumber}>{itemID}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.rightSection}>
                <Image   style={tw` absolute top-0 right-5 w-8 h-8`}  source={require('../images/n.png')}/>
                <Text style={tw` text-black text-[10px] -bottom-4 right-5 absolute `} >*Terms and conditions applied</Text>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{selectedItem?.name}</Text>
                  <Text style={styles.productDescription}>
                    {selectedItem?.description}
                  </Text>
                </View>
                <View style={styles.priceSection}>
                    <View style={tw` absolute  left-0`}>
                      <Text style={tw` absolute top-4 text-black text-lg`}>Rs.</Text>
                    </View>
                  <Text style={styles.price}>  &nbsp;
                    {(selectedItem?.price)}
                  </Text>
                </View>
              </View>
            </ViewShot>
            <Button title="Save as PNG" onPress={saveTagAsImage} />
          </View>
        </Modal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: screenWidth * 0.9, // Adjust width as needed
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  leftSection: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  country: {
    fontSize: 12,
    color: '#555',
  },
  qrCode: {
    width: 90,
    height: 90,
  },
  phoneNumber: {
    fontSize: 5,
    color: '#555',
  },
  divider: {
    width: 2,
    backgroundColor: 'green',
    height: '100%',
    marginHorizontal: 10,
    
  },
  rightSection: {
    position:'relative',
    width: '70%',
    justifyContent: 'space-between',
  },
  productInfo: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productDescription: {
    fontSize: 12,
    color: 'gray',
  },
  priceSection: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 35,
    // flex:1,
    fontWeight: 'bold',
    color: 'green',
  },
  priceDetails: {
    fontSize: 10,
    color: '#555',
  },
});

export default ProductsData;
