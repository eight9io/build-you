import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import CreateChallengeModal from "../../../../component/modal/CreateChallengeModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/navigation.type";

const CreateChallengeScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) => {
  return (
    <SafeAreaView>
      <CreateChallengeModal
        onClose={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default CreateChallengeScreen;
