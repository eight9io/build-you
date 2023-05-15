import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Card from '../common/Card';
import IconLike from './asset/like.svg';
import IconComment from './asset/comment.svg';
interface IPostProps {
  isPost?: boolean;
  itemPost: {
    id: number;
    name: string;
    time: string;
    stt: string;
    card: {
      image: string;
      title: string;
      builder: string;
    };
    like: number;
    comment: number;
    avatar: string;
  };
}
export default function Index({
  isPost,
  itemPost: { name, time, stt, card, like, comment, avatar },
}: IPostProps) {
  return (
    <View className="mb-1 flex-1 bg-gray-50 p-5 ">
      <View className="mb-3 flex-row justify-between ">
        <View className="flex-row">
          <Text>Avata</Text>
          <View className="ml-2">
            <Text className="text-h6 font-bold">{name}</Text>
            <Text className="text-gray-dark text-xs font-light ">{time}</Text>
          </View>
        </View>
        {isPost && (
          <TouchableOpacity onPress={() => console.log('press')}>
            <Text className="text-h6 font-medium ">...</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text className=" text-md mb-3 font-normal leading-5">{stt}</Text>
      <Card itemCard={card} isPost={isPost} />
      <View className="mt-4  flex-row ">
        <View className="flex-row items-center gap-2">
          <IconLike />
          <Text className="text-gray-dark text-md font-normal ">
            {like} likes
          </Text>
        </View>
        <View className="ml-8 flex-row items-center ">
          <IconComment />
          <Text className="text-gray-dark text-md ml-2 font-normal ">
            {comment} comments
          </Text>
        </View>
      </View>
    </View>
  );
}
