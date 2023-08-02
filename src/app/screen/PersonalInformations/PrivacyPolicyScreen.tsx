import { View } from "react-native";
import React, { useState } from "react";
import { serviceGetPrivacy } from "../../service/settings";
import { WebView } from 'react-native-webview';
export default function PrivacyPolicyScreen({ navigation }: any) {
  const [content, setContent] = useState<any>()
  const getContent = () => {
    serviceGetPrivacy()
      .then((res) => {
        setContent(res.data.privacy)

      })
      .catch((err) => {
        console.error("err", err);
      });

  }
  getContent()
  return (
    <View className=" flex-1 bg-white px-3 pt-3 ">
      <WebView
        originWhitelist={['*']}
        source={{ html: content }}
      />
    </View>
  );
}
