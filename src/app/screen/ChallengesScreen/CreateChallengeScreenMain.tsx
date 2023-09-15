import { FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageSourcePropType,
} from "react-native";
import { useTranslation } from "react-i18next";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigation.type";
import { useUserProfileStore } from "../../store/user-store";

interface ICreateChallengeCardProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
  createText: string;
  onPress: () => void;
}

const CreateChallengeCard: FC<ICreateChallengeCardProps> = ({
  image,
  title,
  createText,
  description,
  onPress,
}) => {
  return (
    <View className="items-between flex flex-row rounded-xl bg-white shadow-md">
      <Image source={image} className="h-36 w-16 rounded-l-2xl" />
      <View className="flex flex-grow flex-col items-start justify-center px-3">
        <Text className="text-center text-xl font-semibold">{title}</Text>
        <Text className="w-[270] break-words font-regular text-[14px]">
          {description}
        </Text>

        <View className="w-full">
          <TouchableOpacity
            onPress={onPress}
            className="mt-4 flex h-8 w-full  flex-row items-center justify-center rounded-full bg-primary-default"
          >
            <Text className="text-base font-semibold text-white">
              {createText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const CreateChallengeScreenMain = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCompany = currentUser?.companyAccount;

  const handleCreateFreeChallenge = () => {
    if (isCompany) navigation.navigate("CreateCompanyChallengeScreen");
    else navigation.navigate("CreateChallengeScreen");
  };
  const handleCreateCretifiedChallenge = () => {
    if (isCompany) navigation.navigate("CreateCertifiedCompanyChallengeScreen");
    else navigation.navigate("CreateCertifiedChallengeScreen");
  };
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      testID="user_create_challenge_screen"
    >
      <View className="flex flex-col items-center justify-center pt-8">
        <Text className="text-center font-semibold text-lg text-primary-default">
          {t("new_challenge_screen.choose_type")}
        </Text>
        <Text className="text-gray-paragraph px-16 text-center text-base font-normal">
          {t("new_challenge_screen.choose_type_description")}
        </Text>

        <View className="mt-8 flex flex-col items-center justify-center px-6">
          <CreateChallengeCard
            image={require("../../common/image/image-free-challenge.jpg")}
            title={t("new_challenge_screen.free_challenge")}
            description={t("new_challenge_screen.free_challenge_description")}
            createText={t("new_challenge_screen.create_free_challenge")}
            onPress={handleCreateFreeChallenge}
          />
          <View className="h-6" />
          <CreateChallengeCard
            image={require("../../common/image/image-cost-challenge.jpg")}
            title={t("new_challenge_screen.certified_challenge")}
            description={t(
              "new_challenge_screen.certified_challenge_description"
            )}
            createText={t("new_challenge_screen.create_certified_challenge")}
            onPress={handleCreateCretifiedChallenge}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateChallengeScreenMain;
