import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { FC } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ChallengeCard from '../../../../Card/ChallengeCard';

interface ICompanyProfileChallengeProps {
  navigation?: any;
}

const CompanyProfileChallenge: FC<ICompanyProfileChallengeProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  return (
    <View className={clsx('h-full w-full bg-gray-50')}>
      {/* <EmptyChallenges /> */}
      <ScrollView className=" pt-4">
        <ChallengeCard
          isCompany
          name="Challenge Name"
          imageSrc="https://picsum.photos/200/300"
          authorName="Author Name"
          navigation={navigation}
        />
        <ChallengeCard
          isCompany
          name="Challenge Name"
          imageSrc="https://picsum.photos/200/300"
          authorName="Author Name"
          navigation={navigation}
        />
        <ChallengeCard
          isCompany
          name="Challenge Name"
          imageSrc="https://picsum.photos/200/300"
          authorName="Author Name"
          navigation={navigation}
        />
        <ChallengeCard
          isCompany
          name="Challenge Name"
          imageSrc="https://picsum.photos/200/300"
          authorName="Author Name"
          navigation={navigation}
        />
      </ScrollView>
    </View>
  );
};
const Challenge = () => {
  return <CompanyProfileChallenge />;
};

export default Challenge;
