import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

import Button from '../../../../common/Buttons/Button';
import PlayButton from './asset/play-button.svg';

const ButtonContent: string[] = [
  '💻 Development',
  '🌍 Foreign languages',
  '✏️Design',
  '📷 Photography',
  '📱 Productivity',
];

// const VideoWithPlayButton = () => {
//   const videoPlayer = React.useRef(null);
//   const [status, setStatus] = React.useState<AVPlaybackStatus>(
//     {} as AVPlaybackStatus
//   );
//   const [isVideoPlayed, setIsVideoPlayed] = React.useState(false);

//   useEffect(() => {
//     if (status && status.isLoaded) {
//       if (status.isPlaying) {
//         setIsVideoPlayed(true);
//       }
//     }
//   }, [status]);

//   //expo video doesn't support tailwind
//   return (
//     <View
//       className={clsx(
//         'relative flex flex-col items-center justify-center'
//       )}
//     >
//       <Video
//         ref={videoPlayer}
//         source={{
//           uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
//         }}
//         style={{
//           width: '100%',
//           height: 200,
//           backgroundColor: '#FFFFF',
//           borderRadius: 12,
//         }}
//         useNativeControls
//         resizeMode={ResizeMode.CONTAIN}
//         onPlaybackStatusUpdate={(status) => setStatus(() => status)}
//       />
//       {!isVideoPlayed && (
//         <TouchableOpacity
//           className={clsx('absolute translate-x-1/2 translate-y-1/2')}
//           onPress={() => {
//             (videoPlayer.current as any)?.playAsync();
//           }}
//         >
//           <PlayButton />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

const Biography = () => {
  return (
    <View className="justify-content: space-between pt-6">
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {ButtonContent.map((content, index) => {
          return (
            <Button
              key={index}
              containerClassName="p-4 border border-gray-80"
              title={content}
            />
          );
        })}
      </ScrollView>
      <View className={clsx('mt-4 flex flex-col pr-4')}>
        <Text className={clsx('text-h6 text-gray-dark')}>
          I'm a 34 year old female, and I work as a digital entrepreneur. I
          started using Buildyou to motivate myself more in personal challenges
          that I would like to complete, such as graduating and starting
          training more continuously.
        </Text>
        {/* <View className={clsx('py-6')}>
          <VideoWithPlayButton />
        </View> */}
      </View>
    </View>
  );
};

export default Biography;
