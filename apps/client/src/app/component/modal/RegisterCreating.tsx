import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../common/Header';
import BackButton from '../common/Buttons/BackButton';
import { useTranslation } from 'react-i18next';
import IconLoading from './asset/loading.svg';
interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
export default function RegisterCreating({
  navigation,
  modalVisible,
  setModalVisible,
}: Props) {
  const { t } = useTranslation();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      presentationStyle="pageSheet"
    >
      <View className=" bg-white ">
        <View className="h-full pt-5">
          <Header title="Register" />
          <View className="flex-column relative items-center">
            <View className="absolute top-2">
              <Image
                className=" mb-7 mt-8 h-[91px] w-[185px]"
                source={require('./asset/buildYou1.png')}
                resizeMode="cover"
              />
            </View>
          </View>
          <View className="  flex-1 items-center justify-center ">
            <IconLoading />
            <Text className="text-h6 text-gray-dark px-24 text-center leading-6 ">
              Creating your account...
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
