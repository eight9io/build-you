import clsx from "clsx";
import { t } from "i18next";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import httpInstance from "../../../../utils/http";

import Empty from "../../../../common/svg/empty-list.svg";

interface IParticipantWithRatingSkills {
  id: number;
  name: string;
  surname: string;
  avatar: string;
  rating: number;
  challengeId: string;
  skills: string[];
}

const mockData: IParticipantWithRatingSkills[] = [
  {
    id: 1,
    name: "John",
    surname: "Doe",
    avatar: "https://picsum.photos/200/300",
    rating: 4.5,
    challengeId: "1",
    skills: ["skill1", "skill2"],
  },
  {
    id: 2,
    name: "John",
    surname: "Doe",
    avatar: "https://picsum.photos/200/300",
    rating: 4.5,
    challengeId: "1",
    skills: ["skill1", "skill2"],
  },
];

const CompanySkillsTab = ({ navigation, challengeId }) => {
  const [participantsWithRatingSkills, setParticipantsWithRatingSkills] =
    useState<IParticipantWithRatingSkills[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getChallengeParticipants = async () => {
    // TODO: update get participants with rating skills api
    try {
      setIsRefreshing(true);
      const response = await httpInstance.get(
        `/challenge/${challengeId}/participants`
      );
      setParticipantsWithRatingSkills(response.data);
      setIsRefreshing(false);
    } catch (error) {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // getChallengeParticipants();
  }, []);

  return (
    <View className="flex-1 pl-4 ">
      {mockData?.length > 0 && (
        <FlatList
          data={mockData}
          className="pt-4"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("CoachRateChallengeScreen", {
                    challengeId: item.challengeId,
                    userId: item.id,
                  })
                }
                className="mb-5 flex-row items-center gap-3 "
              >
                <View className="relative">
                  {/* <Image
                    className="h-10 w-10 rounded-full"
                    source={require("../asset/avatar-load.png")}
                  /> */}
                  {item?.avatar && (
                    <Image
                      source={{ uri: item.avatar.trim() }}
                      className={clsx("h-10 w-10  rounded-full")}
                    />
                  )}
                </View>
                <Text className="flex w-full flex-row flex-wrap gap-1 pr-[40px]  text-base font-semibold text-basic-black">
                  {item.name + " " + item.surname}
                </Text>
              </TouchableOpacity>
            );
          }}
          onRefresh={getChallengeParticipants}
          refreshing={isRefreshing}
          ListFooterComponent={<View className="h-20" />}
        />
      )}
      {/* {participantsWithRatingSkills?.length == 0 && (
        <View className="mt-2 h-full flex-1 items-center justify-center">
          <FlatList
            data={[]}
            renderItem={() => <></>}
            showsVerticalScrollIndicator={true}
            ListFooterComponent={
              <View className=" justify-cente mt-6 items-center pt-10">
                <Empty />
                <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
                  {t("empty_followers")}
                </Text>
              </View>
            }
            onRefresh={getChallengeParticipants}
            refreshing={isRefreshing}
          />
        </View>
      )} */}
    </View>
  );
};

export default CompanySkillsTab;
