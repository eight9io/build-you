import React, { FC, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import clsx from "clsx";

import {
  Video,
  ResizeMode,
  AVPlaybackStatus,
  VideoFullscreenUpdate,
} from "expo-av";
import PlayButton from "../../asset/play-button.svg";

interface IVideoPlayerProps {
  src?: string;
}
const VideoPlayer: FC<IVideoPlayerProps> = ({ src }) => {
  const videoPlayer = React.useRef<Video>(null);
  const [status, setStatus] = React.useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );
  const [isVideoPlayed, setIsVideoPlayed] = React.useState(false);
  const [resizeMode, setResizeMode] = React.useState(ResizeMode.CONTAIN);

  useEffect(() => {
    if (status && status.isLoaded && status.isPlaying) {
      setIsVideoPlayed(true);
    }
  }, [status]);
  //expo video doesn't support tailwind
  return (
    <View
      className={clsx(
        "relative flex flex-col items-center justify-center rounded-xl"
      )}
    >
      {src ? (
        <Video
          ref={videoPlayer}
          source={{
            uri: src,
          }}
          style={{
            width: "100%",
            aspectRatio: 1 / 1,
            backgroundColor: "#FFFFF",
            borderRadius: 12,
          }}
          videoStyle={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
          useNativeControls
          resizeMode={resizeMode}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onFullscreenUpdate={({ fullscreenUpdate }) => {
            // Resize when video is fullscreened (Android only, it will auto change resize mode when go fullscreen on iOS)
            if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT)
              setResizeMode(ResizeMode.CONTAIN);
            else if (
              fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS
            )
              setResizeMode(ResizeMode.COVER);
          }}
        />
      ) : (
        <Video
          ref={(r) => (videoPlayer.current = r)}
          source={{
            uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          }}
          style={{
            width: "100%",
            aspectRatio: 1 / 1,
            backgroundColor: "#FFFFF",
            borderRadius: 12,
          }}
          videoStyle={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
          useNativeControls
          resizeMode={resizeMode}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onFullscreenUpdate={({ fullscreenUpdate }) => {
            // Resize when video is fullscreened (Android only, it will auto change resize mode when go fullscreen on iOS)
            if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT)
              setResizeMode(ResizeMode.CONTAIN);
            else if (
              fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS
            )
              setResizeMode(ResizeMode.COVER);
          }}
        />
      )}
      {!isVideoPlayed ? (
        <TouchableOpacity
          className={clsx("absolute translate-x-1/2 translate-y-1/2")}
          onPress={() => {
            videoPlayer.current?.playAsync();
          }}
        >
          <PlayButton />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default VideoPlayer;
