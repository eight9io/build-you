import { FC, useEffect, useLayoutEffect, useState } from "react";
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

import InfoSvg from "../../common/svg/info.svg";
import Button from "../../component/common/Buttons/Button";
import PackageInfoDialog from "../../component/common/Dialog/PackageInfoDialog";
import { IPackage, IPackageResponse } from "../../types/package";
import { serviceGetAllPackages } from "../../service/package";
import { getLanguageLocalStorage } from "../../utils/language";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import NavButton from "../../component/common/Buttons/NavButton";
import PersonalChallengeDetailScreen from "./PersonalChallengesScreen/PersonalChallengeDetailScreen/PersonalChallengeDetailScreen";
import PersonalCoachChallengeDetailScreen from "./CoachChallengesScreen/PersonalCoach/PersonalCoachChallengeDetailScreen";
import OtherUserProfileScreen from "../ProfileScreen/OtherUser/OtherUserProfileScreen";
import OtherUserProfileChallengeDetailsScreen from "../ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen/OtherUserProfileChallengeDetailsScreen";
import ProgressCommentScreen from "./ProgressCommentScreen/ProgressCommentScreen";
import AppTitle from "../../component/common/AppTitle";
import { useNewCreateOrDeleteChallengeStore } from "../../store/new-challenge-create-store";
import CompanyChallengeDetailScreen from "./CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen";

const CreateChallengeStack = createNativeStackNavigator<RootStackParamList>();

export type CreateChallengeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateChallengeScreenMain"
>;
interface ICreateChallengeCardProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
  createText: string;
  onPress: () => void;
}

interface IRightCoachChallengeDetailOptionsProps {
  handleShow: () => void;
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

export const RightCreateChallengeScreenMainOptions: FC<
  IRightCoachChallengeDetailOptionsProps
> = ({ handleShow }) => {
  return (
    <View className="-mt-1 flex  pr-3">
      <Button Icon={<InfoSvg fill={"#6C6E76"} />} onPress={handleShow} />
    </View>
  );
};

const CreateChallengeScreenMain = () => {
  const [isShowPackageRemain, setIsShowPackageRemain] =
    useState<boolean>(false);

  const [packages, setPackages] = useState<IPackageResponse>(
    {} as IPackageResponse
  );

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCompany = currentUser?.companyAccount;

  const { getNewChallengeId } = useNewCreateOrDeleteChallengeStore();
  const newChallengeId = getNewChallengeId();

  const handleCreateFreeChallenge = () => {
    if (isCompany) navigation.navigate("CreateCompanyChallengeScreen");
    else navigation.navigate("CreateChallengeScreen");
  };
  const handleCreateCretifiedChallenge = () => {
    if (isCompany) navigation.navigate("CreateCertifiedCompanyChallengeScreen");
    else navigation.navigate("CreateCertifiedChallengeScreen");
  };

  useLayoutEffect(() => {
    if (!isCompany) return;
    navigation.setOptions({
      headerRight: () => (
        <RightCreateChallengeScreenMainOptions
          handleShow={() => {
            setIsShowPackageRemain(true);
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      const currentLanguage = await getLanguageLocalStorage();
      try {
        const res = await serviceGetAllPackages(currentLanguage);
        setPackages(res.data);
      } catch (error) {
        console.error("get packages error", error);
      }
    };
    fetchPackages();
  }, [newChallengeId]);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      testID="user_create_challenge_screen"
    >
      {isCompany && (
        <PackageInfoDialog
          isVisible={isShowPackageRemain}
          onClosed={() => setIsShowPackageRemain(false)}
          packages={packages}
        />
      )}
      <View className="flex flex-col items-center justify-center pt-8">
        <Text className="text-center text-lg font-semibold text-primary-default">
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

const CreateChallengeScreen = () => {
  const { t } = useTranslation();
  return (
    <CreateChallengeStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerShown: true,
      }}
    >
      <CreateChallengeStack.Screen
        name="CreateChallengeScreenMain"
        component={CreateChallengeScreenMain}
        options={() => ({
          headerTitle: () => <AppTitle title={t("top_nav.create_challenge")} />,
        })}
      />
      <CreateChallengeStack.Screen
        name="OtherUserProfileScreen"
        component={OtherUserProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <CreateChallengeStack.Screen
        name="OtherUserProfileChallengeDetailsScreen"
        component={OtherUserProfileChallengeDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />

      <CreateChallengeStack.Screen
        name="ProgressCommentScreen"
        component={ProgressCommentScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: () => "",
          headerLeft: (props) => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />

      <CreateChallengeStack.Screen
        name="PersonalChallengeDetailScreen"
        component={PersonalChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => "",
          headerLeft: () => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
      <CreateChallengeStack.Screen
        name="PersonalCoachChallengeDetailScreen"
        component={PersonalCoachChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => "",
          headerLeft: () => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />

      <CreateChallengeStack.Screen
        name="CompanyChallengeDetailScreen"
        component={CompanyChallengeDetailScreen}
        options={({ navigation }) => ({
          headerTitle: () => "",
          headerLeft: () => (
            <NavButton
              text={t("button.back") as string}
              onPress={() => navigation.goBack()}
              withBackIcon
            />
          ),
        })}
      />
    </CreateChallengeStack.Navigator>
  );
};

export default CreateChallengeScreen;
