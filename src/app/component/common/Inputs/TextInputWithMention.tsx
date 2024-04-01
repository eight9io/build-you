import clsx from "clsx";
import { FC, ReactNode } from "react";

import { Text, View, TouchableOpacity, Image } from "react-native";

// Switch from react-native-controlled-mentions to react-mentions for input component
// Because react-native-controlled-mentions is not maintained anymore, there are many issues with react-native-web
import { MentionsInput, Mention, MentionsInputProps } from "react-mentions";
import debounce from "lodash.debounce";
import isEmpty from "lodash.isempty";

import { ISearchUserData } from "../../../types/user";

import { servieGetUserOnSearch } from "../../../service/search";
import { IEmployeeDataProps } from "../../../types/common";

interface ITextInputWithMentionProps
  extends Omit<MentionsInputProps, "children"> {
  reset?: any;
  label?: string;
  rightIcon?: ReactNode;
  multiline?: boolean;
  onRightIconPress?: () => void;
  companyEmployees?: IEmployeeDataProps[] | undefined;
}

export const TextInputWithMention: FC<ITextInputWithMentionProps> = (props) => {
  const {
    label,
    rightIcon,
    onRightIconPress,
    multiline,
    inputRef,
    companyEmployees,
    ...inputProps
  } = props;

  const debouncedFetchSuggestions = debounce((keyword, callback) => {
    if (keyword) {
      if (companyEmployees && companyEmployees?.length > 0) {
        const searchResults = companyEmployees.filter((item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase())
        );
        return callback(
          searchResults.map((item) => ({
            id: item.id,
            display: `${item?.name} ${item?.surname}`,
            ...item,
          }))
        );
      }
      servieGetUserOnSearch(keyword).then((results) => {
        return callback(
          results.map((item) => ({
            id: item.id,
            display: `${item?.name} ${item?.surname}`,
            ...item,
          }))
        );
      });
    } else {
      return callback([]);
    }
  }, 500);

  return (
    <View className="flex flex-1 flex-col gap-1">
      {label ? (
        <Text className="mb-1 text-md font-semibold text-primary-default">
          {label}
        </Text>
      ) : null}
      <View className="relative flex-1">
        {/* Use font-regular to override react-mentions font family */}
        <View
          pointerEvents={"auto"}
          className="relative flex-1 font-regular text-[14px]"
        >
          <MentionsInput
            {...inputProps}
            onChange={(event, newValue, newPlainTextValue, mentions) => {
              inputProps.onChange(event, newValue, newPlainTextValue, mentions);
            }}
            onKeyDown={(e) => {
              !e.shiftKey && e.key === "Enter" && e.preventDefault();
              if (
                !e.shiftKey &&
                e.key === "Enter" &&
                !isEmpty(inputProps.value)
              )
                onRightIconPress && onRightIconPress();
            }}
            allowSuggestionsAboveCursor
            forceSuggestionsAboveCursor
            style={{
              // Input container style
              // Make sure the padding is the same as the input's padding
              height: "100%",
              paddingLeft: 10,
              paddingRight: 40,
              paddingTop: 12,
              paddingBottom: 12,
              // Text area style
              "&multiLine": {
                highlighter: {
                  position: "relative",
                  fontWeight: 700,
                },
                input: {
                  paddingLeft: 10,
                  paddingRight: 40,
                  paddingTop: 12,
                  paddingBottom: 12,
                  border: "1px solid #C5C8D2",
                  borderRadius: 10,
                  // fontSize: 14, // fontSize will cause the highlighter to be misaligned => to be fixed
                  zIndex: 1,
                  color: "#34363F",
                  marginTop: 0,
                  marginLeft: 0,
                },
              },
              suggestions: {
                // Suggestions container/overlay style
                width: "100%", // Take the full width of the input
                borderRadius: 10,
                left: 0, // Stick the suggestions to the left most edge of the input
                list: {
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: 270,
                  overflowY: "auto",
                  backgroundColor: "#FAFBFF",
                  borderRadius: 10,
                  gap: 20,
                },
              },
            }}
          >
            <Mention
              style={{
                // Mention style
                color: "#24252B",
                // fontSize: 14, // fontSize will cause the highlighter to be misaligned => to be fixed
                zIndex: 10, // Make sure the highlighter's color override the mention text
                position: "relative",
                fontWeight: 700,
              }}
              appendSpaceOnAdd
              trigger="@"
              data={debouncedFetchSuggestions}
              renderSuggestion={(
                suggestion,
                search,
                highlightedDisplay,
                index
              ) => {
                const item = suggestion as ISearchUserData;
                return (
                  // Don't use TouchableOpacity here, it will override the suggestion click event
                  <View
                    key={index}
                    className="flex-row items-center space-x-3 px-4 py-2"
                  >
                    <View className="relative">
                      {!item?.avatar && (
                        <Image
                          className={clsx("h-10 w-10 rounded-full")}
                          source={require("./assets/avatar-load.png")}
                        />
                      )}
                      {item?.avatar && (
                        <Image
                          source={{ uri: item.avatar }}
                          resizeMode="cover"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                    </View>
                    <Text className="text-base font-semibold text-basic-black">
                      {item?.name} {item?.surname}
                    </Text>
                  </View>
                );
              }}
            />
          </MentionsInput>
        </View>
        {rightIcon ? (
          <View className="absolute bottom-0 right-4 top-0 flex h-full justify-center">
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
        ) : null}
      </View>
    </View>
  );
};

export default TextInputWithMention;
