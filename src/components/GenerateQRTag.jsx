import RNFS from "react-native-fs";
import React, { useRef } from "react";
import ViewShot from "react-native-view-shot";
import { Button, View } from "react-native";
import { WebView } from "react-native-webview";

const generatePrintableTag = async item => {
  console.log('generating');

  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            width: 300px;
            height: 150px;
            margin: 0;
            padding: 10px;
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .product-info h2 {
            font-size: 16px;
            margin: 0;
          }
          .product-info p {
            font-size: 12px;
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
        </style>
      </head>
      <body>
        <div class="left-section">
          <p>Great Britain</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${
            item.id
          }" />
          <p>1234567890</p>
        </div>
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
            <div>
              <small>100 g = 200</small><br />
              <small>Price per 1 pc.</small>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const WebViewCapture = () => {
    const viewShotRef = useRef(null);

    // Capture the WebView as an image
    const captureImage = async () => {
      try {
        const uri = await viewShotRef.current.capture();
        console.log('Captured image URI:', uri);
        // Save the image to the filesystem or use it as needed
        const filePath = `${RNFS.DocumentDirectoryPath}/tag_image.png`;
        await RNFS.moveFile(uri, filePath);
        console.log('Saved to:', filePath);
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    };

    return (
      <View style={{flex: 1}}>
        <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1.0}}>
          <WebView
            source={{html: htmlContent}}
            style={{width: 300, height: 150}} // Size of the rendered tag
          />
        </ViewShot>
        <Button title="Capture Tag as Image" onPress={captureImage} />
      </View>
    );
  };

  return <WebViewCapture />;
};

export default generatePrintableTag;
