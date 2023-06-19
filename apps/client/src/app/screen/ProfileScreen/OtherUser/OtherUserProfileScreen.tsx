import React, { FC } from 'react';
import { View, FlatList, SafeAreaView, Text } from 'react-native';
import { NavigationProp, Route, useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../../../navigation/navigation.type';

interface IOtherUserProfileScreenProps {
  route: Route<
    'OtherUserProfileScreen',
    {
      userId: string;
    }
  >;
}

const OtherUserProfileComponent: FC<IOtherUserProfileScreenProps> = ({
  userId,
}) => {}


const OtherUserProfileScreen: FC<IOtherUserProfileScreenProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userId } = route.params;

  return (
    <SafeAreaView className="justify-content: space-between h-full flex-1 bg-gray-50">
      <View className="h-full">
        <ScrollView className="w-full bg-gray-50">
          <ProfileComponent
            userData={userProfile}
            navigation={navigation}
            isLoadingAvatar={isLoadingAvatar}
            setIsLoadingAvatar={setIsLoadingAvatar}
          />
        </ScrollView>
        {isLoadingAvatar && (
          <Loading containerClassName="absolute top-0 left-0 z-10 h-full " />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OtherUserProfileScreen;
