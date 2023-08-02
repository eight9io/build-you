import { SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { Component, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useUserProfileStore } from "../../store/user-store";
import { serviceGetTerms } from "../../service/settings";

export default function TermsOfServicesScreen({ navigation }: any) {
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
    <SafeAreaView className="justify-content: space-between flex-1 bg-white px-4 pt-3">
      {content}
    </SafeAreaView>
  );
}
