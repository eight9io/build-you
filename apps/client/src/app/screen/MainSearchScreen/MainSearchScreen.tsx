import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';

import NavButton from '../../component/common/Buttons/NavButton';
import { useDebounce } from '../../hooks/useDebounce';
import { ISearchUserData } from '../../types/user';
import { servieGetUserOnSearch } from '../../service/search';

import clsx from 'clsx';
import { RootStackParamList } from '../../navigation/navigation.type';

const MainSearchScreen = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<ISearchUserData[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const debouncedSearchQuery = useDebounce(searchText, 500); // Adjust the delay as needed

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text className="text-lg font-semibold">Search User</Text>
      ),
      headerSearchBarOptions: {
        placeholder: t('search_screen.search') as string,
        onChangeText: (text: any) => {
          setSearchText(text.nativeEvent.text);
        },
        visible: true,
        focus: true,
        shouldShowHintSearchIcon: true,
        hideNavigationBar: false,
      },

      headerLeft: () => (
        <NavButton
          text={t('button.back') as string}
          onPress={() => navigation.goBack()}
          withBackIcon
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true);
      servieGetUserOnSearch(debouncedSearchQuery).then((results) => {
        setIsSearching(false);
        setSearchResults(results);
      });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const navigateToUserDetail = (userId: string) => {
    const pushAction = StackActions.push('HomeScreen', {
      screen: 'Feed',
      params: {
        screen: 'OtherUserProfileScreen',
        params: { userId },
      },
    });
    navigation.dispatch(pushAction);
  };

  return (
    <SafeAreaView className='bg-white flex-1'>
      {searchResults.length > 0 && (
        <View>
          <FlatList
            data={searchResults}
            className="flex flex-col bg-white"
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => navigateToUserDetail(item.id)}
                className="flex flex-row items-center bg-white px-5 py-3"
              >
                <View className="relative">
                  {!item.avatar && (
                    <Image
                      className={clsx('h-12 w-12 rounded-full')}
                      source={require('../../common/image/avatar-load.png')}
                    />
                  )}
                  {item?.avatar && (
                    <Image
                      source={{ uri: item.avatar }}
                      className="h-12 w-12 rounded-full"
                    />
                  )}
                </View>
                <Text className="text-basic-black pl-4 text-base font-semibold">
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MainSearchScreen;
