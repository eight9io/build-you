import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../common/Header';
import NavButton from '../common/Buttons/NavButton';
import { useTranslation } from 'react-i18next';
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
  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={modalVisible}
      presentationStyle="pageSheet"
    >
      <ScrollView>
        <View style={styles.centeredView}>
          <View className=" ml-4 ">
            <Header
              title="Privacy policy..."
              leftBtn={
                <NavButton
                  text={t('button.back') as string}
                  onPress={() => setModalVisible(false)}
                  withBackIcon
                />
              }
            />
            <View>
              {(
                t('policy', {
                  returnObjects: true,
                }) as Array<any>
              ).map((item, index) => {
                return (
                  <View className="px-6 pt-5" key={index}>
                    <Text className="text-md  font-medium leading-6 ">
                      {item.stt}. {item.title}
                    </Text>
                    <Text className="text-md text-black-default  px-5 font-[400px] leading-6">
                      {item.detail}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    height: '100%',

    marginTop: 22,
  },
});
