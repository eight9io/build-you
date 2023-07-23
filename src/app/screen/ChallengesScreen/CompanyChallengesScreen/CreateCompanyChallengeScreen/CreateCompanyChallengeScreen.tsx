import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import CreateNewCompanyChallengeModal from "../../../../component/modal/company/CreateNewCompanyChallenge";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/navigation.type";

const CreateCompanyChallengeScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) => {
  return (
    <SafeAreaView>
      <CreateNewCompanyChallengeModal
        onClose={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default CreateCompanyChallengeScreen;
