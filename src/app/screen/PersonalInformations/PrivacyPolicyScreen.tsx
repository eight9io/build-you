import { View } from "react-native";
import React, { useState } from "react";
import { serviceGetPrivacy } from "../../service/settings";
import { WebView } from "react-native-webview";
import { CrashlyticService } from "../../service/crashlytic";
export default function PrivacyPolicyScreen({ navigation }: any) {
  const [content, setContent] = useState<any>();
  const getContent = () => {
    serviceGetPrivacy()
      .then((res) => {
        setContent(res.data.privacy);
      })
      .catch((err) => {
        console.error("err", err);
        CrashlyticService({
          errorType: "Get Privacy Error",
          error: err,
        });
      });
  };
  getContent();
  return (
    <View className=" flex-1 bg-white px-3 pt-3 ">
      <WebView originWhitelist={["*"]} source={{ html: content }} />
    </View>
  );
}
