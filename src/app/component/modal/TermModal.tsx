import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Header from "../common/Header";
import NavButton from "../common/Buttons/NavButton";
import { useTranslation } from "react-i18next";
import { serviceGetTerms } from "../../service/settings";
import WebView from "react-native-webview";
interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
export default function TermModal({
  navigation,
  modalVisible,
  setModalVisible,
}: Props) {
  const { t } = useTranslation();
  const [content, setContent] = useState<any>()
  const getContent = () => {
    serviceGetTerms()
      .then((res) => {
        setContent(res.data.terms)

      })
      .catch((err) => {
        console.error("err", err);
      });

  }
  getContent()
  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={modalVisible}
      presentationStyle="pageSheet"

    >


      <View className=" flex-1 bg-white px-3 pt-3  ">
        <Header
          title={t("register_screen.terms_link") || "Privacy policy..."}
          leftBtn={
            <NavButton
              text={t("button.back") as string}
              onPress={() => setModalVisible(false)}
              withBackIcon
            />
          }
          containerStyle="mb-4"

        />
        <WebView
          originWhitelist={['*']}
          source={{ html: content }}
        />

      </View>

    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    height: "100%",

    marginTop: 22,
  },
});
