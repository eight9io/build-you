import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

import Button from '../../../../common/Buttons/Button';
import PlayButton from './asset/play-button.svg';
import { useUserProfileStore } from 'apps/client/src/app/store/user-data';

const VideoWithPlayButton = ({ src }: { src: string | undefined }) => {
  const videoPlayer = React.useRef(null);
  const [status, setStatus] = React.useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );
  const [isVideoPlayed, setIsVideoPlayed] = React.useState(false);

  useEffect(() => {
    if (status && status.isLoaded) {
      if (status.isPlaying) {
        setIsVideoPlayed(true);
      }
    }
  }, [status]);
  //expo video doesn't support tailwind
  return (
    <View
      className={clsx('relative flex flex-col items-center justify-center')}
    >
      {/* {!src && (
        <Video
          ref={videoPlayer}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          style={{
            width: '100%',
            height: 200,
            backgroundColor: '#FFFFF',
            borderRadius: 12,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )} */}
      {src && (
        <Video
          ref={videoPlayer}
          source={{
            uri: src,
          }}
          style={{
            width: '100%',
            height: 200,
            backgroundColor: '#FFFFF',
            borderRadius: 12,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}
      {!isVideoPlayed && (
        <TouchableOpacity
          className={clsx('absolute translate-x-1/2 translate-y-1/2')}
          onPress={() => {
            (videoPlayer.current as any)?.playAsync();
          }}
        >
          <PlayButton />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Biography = () => {
  const { getUserProfile } = useUserProfileStore();
  const userProfile = getUserProfile();

  const hardSkill = userProfile?.hardSkill;
  const bio = userProfile?.bio;
  const videoSrc = userProfile?.video;

  return (
    <View className="justify-content: space-between ">
      {videoSrc && (
        <View className={clsx(' flex flex-col pr-4')}>
          <View className={clsx('py-6')}>
            <VideoWithPlayButton src={videoSrc} />
          </View>
        </View>
      )}
      <Text className={clsx('text-h6 text-gray-dark')}>
        {bio ? bio : 'No biography yet'}
      </Text>
      <View className="align-center mt-3 flex-row flex-wrap  ">
        {hardSkill &&
          hardSkill.map((content, index) => {
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
    </View>
  );
};

export default Biography;
