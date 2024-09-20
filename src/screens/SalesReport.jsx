import ExcelJS from "exceljs";
import RNFS from "react-native-fs";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";

const SalesReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnapshot = await firestore().collection('datacolnew').get();
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch all suppliers to calculate commission and seller revenue
        const suppliersSnapshot = await firestore().collection('suppliers').get();
        const suppliersData = suppliersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data(); // Map suppliers by ID
          return acc;
        }, {});

        // Combine products with their corresponding seller details
        const enrichedProducts = productsData.map(product => {
          const supplier = suppliersData[product.supplierId];
          console.log(product.supplierId);
          console.log(supplier);
          
          
          const commissionPercentage = supplier?.commission || 0;
          const sellerRevenue = product.price * (1 - commissionPercentage / 100);
          const ownerRevenue = product.price - sellerRevenue;

          return {
            ...product,
            sellerName: supplier?.name || 'Unknown',
            commissionPercentage,
            sellerRevenue,
            ownerRevenue,
          };
        });

        setProducts(enrichedProducts);
      } catch (error) {
        console.error('Error fetching products or suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download the Excel file',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const exportProductsToExcel = async () => {
    if (!await requestStoragePermission()) {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Products Report');

        // Define columns
        worksheet.columns = [
          { header: 'Product Name', key: 'name', width: 20 },
          { header: 'Product ID', key: 'id', width: 20 },
          { header: 'Seller Name', key: 'sellerName', width: 20 },
          { header: 'Date of Sale', key: 'date', width: 15 },
          { header: 'Price', key: 'price', width: 15 },
          { header: 'Commission %', key: 'commissionPercentage', width: 15 },
          { header: 'Seller Revenue', key: 'sellerRevenue', width: 20 },
          { header: 'Owner Revenue', key: 'ownerRevenue', width: 20 },
        ];

        // Add rows to the worksheet
        products.forEach(product => {
          worksheet.addRow({
            name: product.name,
            id: product.id,
            sellerName: product.sellerName,
            date: new Date(product.createdAt.seconds * 1000).toLocaleDateString(),
            price: product.price,
            commissionPercentage: product.commissionPercentage,
            sellerRevenue: product.sellerRevenue.toFixed(2),
            ownerRevenue: product.ownerRevenue.toFixed(2),
          });
        });

        // Generate Excel file and save it
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = buffer.toString("base64");

        // Save the Excel file to Downloads directory with base64 encoding
        const filePath = `${RNFS.DownloadDirectoryPath}/sales_report.xlsx`;
        await RNFS.writeFile(filePath, base64, "base64");

        Alert.alert('Success', `Excel file has been saved to ${filePath}`);
      } catch (error) {
        console.error('Error generating Excel file:', error);
        Alert.alert('Error', 'Failed to generate Excel file');
      }
    } else {
      Alert.alert('Permission Denied', 'Storage permission is required to download the Excel file');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products Report</Text>
      <Button title="Export to Excel" onPress={exportProductsToExcel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SalesReport;
