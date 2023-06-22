import clsx from 'clsx';
import { FC, ReactNode, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
} from 'react-native';
import {
  MentionInput,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import {
  MentionInputProps,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions/dist/types';
import { MOCK_FOLLOW_USERS } from '../../../mock-data/follow';

interface ITextInputWithMentionProps extends MentionInputProps {
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
  if (keyword == null) {
    return null;
  }

  return (
    <>
      {MOCK_FOLLOW_USERS.length > 0 && (
        <FlatList
          className={clsx(
            'bg-gray-veryLight absolute z-10 h-72 w-full rounded-lg px-4 py-2'
          )}
          style={{
            bottom: commentInputHeight,
          }}
          data={MOCK_FOLLOW_USERS.filter((one) =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          )}
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
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
                <Image
                  source={{ uri: item.avatar }}
                  resizeMode="contain"
                  className="h-10 w-10 rounded-full"
                />
                <Text className="text-basic-black text-base font-semibold">
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
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
    ...inputProps
  } = props;
  const [textInputHeight, setTextInputHeight] = useState(0);

  const handleOnChange = (value: string) => {
    // TO-DO: Add custom logic for the mention value
    // const transformedValue = replaceMentionValues(value, ({ name }) => name); // Default value is '@[username]', this line is to remove '@' from the value
    onChange(value);
  };
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
                onChange={handleOnChange}
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
                textAlignVertical={multiline ? 'top' : 'center'}
                autoCapitalize="none"
                onLayout={(e) => {
                  setTextInputHeight(e.nativeEvent.layout.height);
                }}
              />
            </View>
            {rightIcon ? (
              <View className="absolute bottom-0 right-4 top-0 flex h-full justify-center">
                {rightIcon}
              </View>
            ) : null}
          </TouchableOpacity>
        ) : (
          <>
            <View pointerEvents={'auto'}>
              <MentionInput
                {...inputProps}
                onChange={handleOnChange}
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
                textAlignVertical={multiline ? 'top' : 'center'}
                autoCapitalize="none"
                onLayout={(e) => {
                  setTextInputHeight(e.nativeEvent.layout.height);
                }}
              />
            </View>
            {rightIcon ? (
              <View className="absolute bottom-0 right-4 top-0 flex h-full justify-center">
                {onRightIconPress ? (
                  <TouchableOpacity onPress={onRightIconPress}>
                    {rightIcon}
                  </TouchableOpacity>
                ) : (
                  <>{rightIcon}</>
                )}
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

export default TextInputWithMention;
