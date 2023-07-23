import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  FlatList,
  TouchableHighlightBase,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import Button from "../../component/common/Buttons/Button";

import clsx from "clsx";
import Step from "../../component/common/Step";

interface MyObject {
  [key: string]: any;
}

const HardSkillsStep3 = () => {
  const { t } = useTranslation();

  const arraySkill = () => {
    const array = [];
    const ojb: MyObject = t("modal_skill.arraySkill", { returnObjects: true });
    for (const key in ojb) {
      array.push(ojb[key]);
    }
    return array;
  };

  return (
    <View className="flex-column h-full justify-between bg-white  px-6 pb-14">
      <View>
        <Step currentStep={3} />
        <Text className="mt-6 text-center text-h4 font-medium leading-7 ">
          {t("modal_skill.question")}
        </Text>
        <Text className="mt-3 text-center  text-h6 font-normal leading-6 text-gray-dark ">
          {t("modal_skill.sub_question")}
        </Text>
        <View className="align-center mt-6 flex-row flex-wrap justify-center ">
          {arraySkill().map((item, index) => (
            <Button
              containerClassName="border-gray-light ml-1 border-[1px] mx-2 my-1.5  h-[48px] flex-none px-5"
              textClassName="line-[30px] text-center text-sm font-medium"
              title={item}
              onPress={() => {}}
            />
          ))}
        </View>
        <Button
          containerClassName="  flex-none px-1"
          textClassName="line-[30px] text-center text-md font-medium text-primary-default"
          title={t("modal_skill.manually")}
          onPress={() => {}}
        />
      </View>
      <Button
        containerClassName="  bg-primary-default flex-none px-1"
        textClassName="line-[30px] text-center text-md font-medium text-white"
        title={t("button.next")}
        onPress={() => {}}
      />
    </View>
  );
};

export default HardSkillsStep3;
