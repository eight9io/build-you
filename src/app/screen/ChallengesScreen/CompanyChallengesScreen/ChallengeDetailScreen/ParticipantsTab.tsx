import clsx from "clsx";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Empty from "./assets/emptyFollow.svg";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/navigation.type";
import MarkDone from "./assets/mark_done.svg";
interface IParticipantsTabProps {
  participant?: {
    id: string | number;
    avatar: string;
    name: string;
    challengeStatus?: string;
  }[];
  maxPepleCanJoin?: number;
}

const ParticipantsTab: FC<IParticipantsTabProps> = ({
  participant = [],
  maxPepleCanJoin,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  console.log(participant);
  return (
    <View className={clsx("flex-1 px-4")}>
      {participant.length > 0 && (
        <FlatList
          data={participant}
          className="pt-4"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("OtherUserProfileScreen", {
                    userId: item.id as string,
                  })
                }
                className="mb-5 flex-row items-center justify-between gap-3"
              >
                <View className="flex-row  items-center ">
                  <View className="relative">
                    <Image
                      className="h-10 w-10 rounded-full"
                      source={require("../../../../common/image/avatar-load.png")}
                    />
                    {item?.avatar && (
                      <Image
                        source={{ uri: item.avatar.trim() }}
                        className={clsx(
                          "absolute left-0  top-0 h-10 w-10  rounded-full"
                        )}
                      />
                    )}
                  </View>
                  <Text className="ml-3 text-base font-semibold text-basic-black">
                    {item.name}
                  </Text>
                </View>
                {item?.challengeStatus == "done" ||
                  (item?.challengeStatus == "closed" && <MarkDone />)}
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View className="h-20" />}
        />
      )}
      {participant.length == 0 && (
        <View className=" flex-1 items-center justify-center">
          <Empty />
          <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
            {t("challenge_detail_screen.not_participants")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ParticipantsTab;
