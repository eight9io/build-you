import { View } from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { serviceGetTerms } from "../../service/settings";
import { WebView } from "react-native-webview";
import { CrashlyticService } from "../../service/crashlytic";
export default function TermsOfServicesScreen({ navigation }: any) {
  const [content, setContent] = useState<any>();
  const getContent = () => {
    serviceGetTerms()
      .then((res) => {
        setContent(res.data.terms);
      })
      .catch((err) => {
        console.error("err", err);
        CrashlyticService({
          errorType: "Get Terms Error",
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
