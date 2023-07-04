import clsx from 'clsx';
import { FC, ReactNode, createRef, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import { MentionInput } from 'react-native-controlled-mentions';
import {
  MentionInputProps,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions/dist/types';

import { ISearchUserData } from '../../../types/user';

import { servieGetUserOnSearch } from '../../../service/search';
import { useDebounce } from '../../../hooks/useDebounce';

interface ITextInputWithMentionProps extends MentionInputProps {
  reset?: any;
  label?: string;
  rightIcon?: ReactNode;
  onPress?: () => void;
  multiline?: boolean;
  onRightIconPress?: () => void;
}

interface IUserSuggestionProps extends MentionSuggestionsProps {
  commentInputHeight: number;
}

const renderSuggestions: FC<IUserSuggestionProps> = ({
  commentInputHeight,
  keyword,
  onSuggestionPress,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ISearchUserData[]>([]);
  const debouncedSearchQuery = useDebounce(keyword, 500); // Adjust the delay as needed

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

  return (
    <>
      {keyword && searchResults.length > 0 && (
        <ScrollView
          className={clsx(
            'bg-gray-veryLight absolute z-10 h-auto max-h-72 w-full rounded-lg px-4 py-2'
          )}
          style={{
            bottom: commentInputHeight,
          }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
        >
          {keyword &&
            searchResults.length > 0 &&
            searchResults.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() =>
                    onSuggestionPress({
                      id: item.id.toString(),
                      name: item.name,
                    })
                  }
                  className="mb-5 flex-row items-center gap-3"
                >
                  <View className="relative">
                    <Image
                      className={clsx('h-10 w-10 rounded-full')}
                      source={require('./assets/avatar-load.png')}
                    />
                    <Image
                      source={{ uri: item.avatar }}
                      resizeMode="cover"
                      className="h-10 w-10 rounded-full"
                    />
                  </View>
                  <Text className="text-basic-black text-base font-semibold">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      )}
    </>
  );
};

export const TextInputWithMention: FC<ITextInputWithMentionProps> = (props) => {
  const {
    label,
    rightIcon,
    onPress,
    onRightIconPress,
    multiline,
    onChange,
    inputRef,
    ...inputProps
  } = props;
  const [textInputHeight, setTextInputHeight] = useState(0);

  return (
    <View className="flex flex-col gap-1">
      {label ? (
        <Text className="text-primary-default text-md mb-1 font-semibold">
          {label}
        </Text>
      ) : null}
      <View className="relative">
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <View pointerEvents={'none'}>
              <MentionInput
                {...inputProps}
                onChange={onChange}
                partTypes={[
                  {
                    trigger: '@', // Should be a single character like '@' or '#'
                    renderSuggestions: (props) =>
                      renderSuggestions({
                        ...props,
                        commentInputHeight: textInputHeight,
                      }),
                    // TO-DO: Add custom style for the mention text
                    textStyle: {
                      fontWeight: '600',
                      color: 'black',
                      fontSize: 16,
                    }, // The mention style in the input,
                  },
                ]}
                className={clsx(
                  'border-gray-medium bg-gray-veryLight w-full rounded-[10px] border-[1px]',
                  inputProps?.className,
                  Platform.OS === 'ios' ? 'p-3' : 'p-2.5'
                )}
                containerStyle={{
                  paddingRight: rightIcon ? 40 : 0,
                }}
                textAlignVertical={multiline ? 'top' : 'center'}
                autoCapitalize="none"
                onLayout={(e) => {
                  setTextInputHeight(e.nativeEvent.layout.height);
                }}
              />
            </View>
            {rightIcon ? (
              <View className="absolute bottom-0 right-1 top-0 flex h-full justify-center">
                {rightIcon}
              </View>
            ) : null}
          </TouchableOpacity>
        ) : (
          <>
            <View pointerEvents={'auto'}>
              <MentionInput
                {...inputProps}
                onChange={onChange}
                partTypes={[
                  {
                    trigger: '@',
                    renderSuggestions: (props) =>
                      renderSuggestions({
                        ...props,
                        commentInputHeight: textInputHeight,
                      }),
                    // TO-DO: Add custom style for the mention text
                    textStyle: {
                      fontWeight: '600',
                      color: 'black',
                      fontSize: 16,
                    }, // The mention style in the input,
                  },
                ]}
                className={clsx(
                  'border-gray-medium bg-gray-veryLight mr-10 w-full rounded-[10px] border-[1px]',
                  inputProps?.className,
                  Platform.OS === 'ios' ? 'p-3' : 'p-2.5'
                )}
                containerStyle={{
                  paddingRight: rightIcon ? 40 : 0,
                }}
                textAlignVertical={multiline ? 'top' : 'center'}
                autoCapitalize="none"
                onLayout={(e) => {
                  setTextInputHeight(e.nativeEvent.layout.height);
                }}
              />
            </View>
            {rightIcon && (
              <View className="absolute bottom-0 right-1 top-0 flex h-full justify-center">
                {onRightIconPress ? (
                  <TouchableOpacity
                    onPress={() => {
                      onRightIconPress();
                    }}
                  >
                    {rightIcon}
                  </TouchableOpacity>
                ) : (
                  <>{rightIcon}</>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default TextInputWithMention;
