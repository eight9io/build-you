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
import { serviceGetPrivacy } from "../../service/settings";
import WebView from "react-native-webview";
interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
export default function PolicyModal({
  navigation,
  modalVisible,
  setModalVisible,
}: Props) {
  const { t } = useTranslation();
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
    <Modal
      animationType="slide"
      // transparent={true}
      visible={modalVisible}
      presentationStyle="pageSheet"
    >
      <View className=" flex-1 bg-white px-3 pt-3" testID="policy_modal">
        <Header
          title={t("policy_modal.title") || "Privacy policy..."}
          leftBtn={
            <NavButton
              text={t("button.back") as string}
              onPress={() => setModalVisible(false)}
              withBackIcon
              testID="policy_modal_back_btn"
            />
          }
          containerStyle="mb-4"
        />
        <WebView originWhitelist={["*"]} source={{ html: content }} />
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
