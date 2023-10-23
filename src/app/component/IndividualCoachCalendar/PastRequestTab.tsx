import React, { FC } from "react";
import { View } from "react-native";
import VideoCallRequestList from "./VideoCallRequestList";

interface IPastRequestTabProps {
  requests: any[]; // TODO: replace with proper type when API is ready
}

const PastRequestTab: FC<IPastRequestTabProps> = ({ requests }) => {
  return (
    <View className="flex-1">
      <VideoCallRequestList requests={requests} />
    </View>
  );
};

export default PastRequestTab;
