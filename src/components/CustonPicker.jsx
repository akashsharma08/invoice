import React, { useState } from "react";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";
import { Image, StyleSheet, View } from "react-native";

const CustomPicker = ({ selectedValue, onValueChange, items }) => {
  console.log(selectedValue);
  
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
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
        {items.map(supplier => (
          <Picker.Item
            key={supplier.id}
            label={supplier.name}
            value={supplier.id}
            color="white"
            style={tw`white`} // Styling individual picker items
          />
        ))}
      </Picker> 
      {/* Custom triangle icon */}
      <Image
        source={require('../images/arrow.png')} // Replace with your own triangle icon
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  picker: {
    width: '100%',
    color: 'black',
  },
  icon: {
    position: 'absolute',
    right: 23,
    top: '58%',
    width: 15,
    height: 15,
    transform: [{ translateY: -7.5 }], // Centering the icon vertically
  },
});

export default CustomPicker;
