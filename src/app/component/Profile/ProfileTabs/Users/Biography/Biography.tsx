import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import clsx from "clsx";

import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";

import Button from "../../../../common/Buttons/Button";
import PlayButton from "./asset/play-button.svg";
import { IUserData } from "../../../../../types/user";
import { useTranslation } from "react-i18next";
import { useUserProfileStore } from "../../../../../store/user-store";
interface IBiographyProps {
  userProfile: IUserData | null;
}
interface IVideoWithPlayButtonProps {
  src: string | undefined;
  heightVideo?: any;
}

export const VideoWithPlayButton = ({
  src,
  heightVideo,
}: IVideoWithPlayButtonProps) => {
  const videoPlayer = React.useRef(null);
  const [status, setStatus] = React.useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );
  const [isVideoPlayed, setIsVideoPlayed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (status && status.isLoaded && status.isPlaying) {
      setIsVideoPlayed(true);
    }
  }, [status]);
  //expo video doesn't support tailwind
  return (
    <View
      className={
        "relative flex flex-col items-center justify-center rounded-xl  bg-gray-200"
      }
    >
      {src && (
        <Video
          ref={videoPlayer}
          source={{
            uri: src,
          }}
          style={{
            width: "100%",
            height: heightVideo || 200,
            backgroundColor: "#FFFFF",
            borderRadius: 12,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onLoadStart={() => {
            setIsLoading(true);
          }}
          onReadyForDisplay={() => {
            setIsLoading(false);
          }}
        />
      )}
      {!isVideoPlayed && !isLoading && (
        <TouchableOpacity
          className={clsx("absolute translate-x-1/2 translate-y-1/2")}
          onPress={() => {
            (videoPlayer.current as any)?.playAsync();
          }}
        >
          <PlayButton />
        </TouchableOpacity>
      )}
      {isLoading && (
        <View className="absolute h-full w-full items-center justify-center rounded-xl bg-black-light  opacity-60 ">
          <ActivityIndicator animating color="#FFFFFF" size="large" />
        </View>
      )}
    </View>
  );
};

const Biography = ({ userProfile }: IBiographyProps) => {
  const { getUserProfile } = useUserProfileStore();
  const myProfile = getUserProfile();

  const hardSkill = userProfile?.hardSkill;
  const bio = userProfile?.bio;
  const occupation = userProfile?.occupation;
  const videoSrc = userProfile?.video;
  const { t } = useTranslation();

  return (
    <ScrollView className="w-full px-4  ">
      <View className="justify-content: space-between mb-[100px] w-full pt-4 ">
        {videoSrc && videoSrc !== null && (
          <View className={clsx(" flex flex-col ")}>
            <View className={clsx("py-6")}>
              <VideoWithPlayButton src={videoSrc} />
            </View>
          </View>
        )}
        <Text className={clsx("text-h6 text-gray-dark")}>
          {bio ? bio : t("biography_tab.no_biography") || "No biography yet"}
        </Text>
        {hardSkill && (
          <View className="align-center mt-3 flex-row flex-wrap  ">
            {hardSkill.map((content, index) => {
              return (
                <Button
                  containerClassName="border-gray-light ml-1 border-[1px] mx-2 my-1.5  h-[48px] flex-none px-5"
                  textClassName="line-[30px] text-center text-md font-medium"
                  key={index}
                  title={content?.skill?.skill as string}
                />
              );
            })}
          </View>
        )}
        <View className="flex-column flex flex-wrap gap-5 pt-[20px]">
          {occupation && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("form_onboarding.screen_1.occupation")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {occupation.name}
              </Text>
            </View>
          )}
          {userProfile?.webSite && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("form_onboarding.screen_1.occupation")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userProfile?.webSite}
              </Text>
            </View>
          )}
          {userProfile?.phone && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("form_onboarding.screen_1.occupation")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userProfile?.phone}
              </Text>
            </View>
          )}




          {/* ============ */}
          {userProfile?.emailContact && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("form_onboarding.screen_1.occupation")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userProfile?.emailContact}
              </Text>
            </View>
          )}
          {userProfile?.pIva && (
            <View className="flex w-full flex-row flex-wrap pr-[30px]">
              <Text
                className={clsx(
                  "w-[35%] text-md font-semibold  text-gray-dark"
                )}
              >
                {t("form_onboarding.screen_1.occupation")}:&nbsp;
              </Text>

              <Text className={clsx("text-md text-gray-dark")}>
                {userProfile?.pIva}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Biography;
