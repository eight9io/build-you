import React, { FC, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import PlayButton from '../../asset/play-button.svg';

interface IVideoPlayerProps {
  src?: string;
}
const VideoPlayer: FC<IVideoPlayerProps> = ({
  src,
}) => {
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
      {!src && (
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
      )}
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

export default VideoPlayer;
