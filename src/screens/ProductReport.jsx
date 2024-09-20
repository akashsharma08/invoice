import ExcelJS from "exceljs";
import RNFS from "react-native-fs";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";

const ProductReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Firebase collection 'salesReport'
    const fetchData = async () => {
      try {
        const snapshot = await firestore().collection('salesReports').get();
        const salesData = snapshot.docs.map((doc) => doc.data());
        setReports(salesData);
      } catch (error) {
        console.error("Error fetching sales report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Request permission to write to external storage (Android only)
  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to save the Excel file",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        console.log(granted === PermissionsAndroid.RESULTS.GRANTED);
        return granted !== PermissionsAndroid.RESULTS.GRANTED;
        
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Function to export sales report as an Excel file
  const exportSalesReportToExcel = async () => {
    if (true) {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report");

        // Add columns to the worksheet
        worksheet.columns = [
          { header: "Customer Name", key: "customerName", width: 20 },
          { header: "Customer Address", key: "customerAddress", width: 25 },
          { header: "Date", key: "date", width: 15 },
          { header: "Total Amount", key: "totalAmount", width: 15 },
          { header: "Products", key: "products", width: 50 }
        ];

        // Add rows to the worksheet from sales report data
        reports.forEach((report) => {
          worksheet.addRow({
            customerName: report.customerName,
            customerAddress: report.customerAddress,
            date: new Date(report.date.seconds * 1000).toLocaleDateString(),
            totalAmount: report.totalAmount,
            products: report.products
              .map(
                (product) =>
                  `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`
              )
              .join(", ")
          });
        });
        
        
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = buffer.toString("base64");

        // Save the Excel file to Downloads directory with base64 encoding
        const filePath = `${RNFS.DownloadDirectoryPath}/sales_report.xlsx`;
        await RNFS.writeFile(filePath, base64, "base64");

        Alert.alert("Success", `Excel file has been saved to ${filePath}`);
      } catch (error) {
        console.error("Error generating Excel file:", error);
        Alert.alert("Error", "Failed to generate Excel file");
      }
    } else {
      Alert.alert("Permission Denied", "Storage permission is required to save the Excel file");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Report</Text>
      <FlatList
        data={reports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Customer Name: {item.customerName}</Text>
            <Text>Address: {item.customerAddress}</Text>
            <Text>Date: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
            <Text>Total Amount: {item.totalAmount}</Text>
            <Text>
              Products:{" "}
              {item.products
                .map(
                  (product) =>
                    `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`
                )
                .join(", ")}
            </Text>
          </View>
        )}
      />
      <Button title="Export to Excel" onPress={exportSalesReportToExcel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  }
});

export default ProductReport;
