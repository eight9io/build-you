import React, { useState, useCallback, useEffect, FC } from "react";
import { Keyboard, Text, View } from "react-native";
import { Bubble, GiftedChat, SystemMessage } from "react-native-gifted-chat";

import SendIcon from "../../../../component/asset/send-icon.svg";
import { Controller, useForm } from "react-hook-form";
import TextInputWithMention from "../../../../component/common/Inputs/TextInputWithMention";
import { IEmployeeDataProps } from "../../../../types/common";
import { useTranslation } from "react-i18next";
import ErrorText from "../../../../component/common/ErrorText";
import PostAvatar from "../../../../component/common/Avatar/PostAvatar";

interface IChatInputProps {
    handleOnSubmit: any
}
export const ChatInput: FC<IChatInputProps> = ({
    handleOnSubmit
}) => {


    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            comment: "",
        },
        reValidateMode: "onSubmit",
    });

    const onSubmit = (data: { comment: string }) => {
        handleOnSubmit(data.comment);
        reset({
            comment: "",
        });

        Keyboard.dismiss();
    };

    return (
        <View className="flex flex-row   bg-[#FAFBFF] px-4  ">
            <View className="ml-3 max-h-40 flex-1">
                <Controller
                    name={"comment"}
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <TextInputWithMention
                                placeholder={
                                    t("chat_input.chat_input_placeholder") || "Type a message"
                                }
                                placeholderTextColor={"#C5C8D2"}
                                rightIcon={<SendIcon />}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                                onRightIconPress={handleSubmit(onSubmit)}
                            />
                        );
                    }}
                />
                {errors.comment ? <ErrorText message={errors.comment.message} /> : null}
            </View>
        </View>
    );
};

export function ChatCoachTab() {
    const [messages, setMessages] = useState([]);
    const { t } = useTranslation();


    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: "I'm coach id 1",
                user: {
                    _id: 1,
                    name: "Coach1",
                    avatar: "https://picsum.photos/id/3/24",
                },
            },
            {
                _id: 2,
                text: "I have just finished my first training for Mont Blanc. Totally excited for the whole journey! ",
                user: {
                    _id: 2,
                    name: "User  ",
                    avatar: "https://picsum.photos/id/3/24",
                },
            },

            {
                _id: 3,
                text: "Hello id 111",
                user: {
                    _id: 1,
                    name: "React Native",
                }

            },

            {
                _id: 4,
                text: "id 2",
                user: {
                    _id: 2,
                    name: "Rudy Aster ",
                    avatar: "https://picsum.photos/id/3/24",

                },
            },
        ]);
    }, []);

    const handleSubmit = useCallback((messages = []) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
    }, []);

    return (
        <>
            <GiftedChat

                isCustomViewBottom
                messages={messages}
                onSend={(messages) => handleSubmit(messages)}
                user={{
                    _id: 1,

                }}
                infiniteScroll
                renderTime={() => null}
                renderBubble={(props) => (
                    <Bubble
                        renderUsernameOnMessage
                        renderUsername={(user) => <Text className="text-gray-dark absolute -bottom-4 left-0 text-sm font-light">{user.name}
                            <Text className="text-primary-default text-sm"> Coach</Text>

                        </Text>}
                        {...props}
                        textStyle={{
                            right: {
                                color: "#000",
                                padding: 8,
                            },
                            left: {
                                color: "#000",
                                padding: 8
                            },
                        }}
                        containerStyle={{
                            right: {
                                maxWidth: '80%',
                                margin: 10
                            },
                            left: {
                                maxWidth: '80%',
                            },
                        }}
                        wrapperStyle={{
                            right: {
                                backgroundColor: "#fbe1d2",
                                marginBottom: 6
                            },
                            left: {
                                backgroundColor: "#E7E9F1",
                                marginBottom: 16
                            },
                        }}
                    />
                )}
                renderInputToolbar={(props) => (
                    <ChatInput
                        handleOnSubmit={handleSubmit}
                    />
                )}

            />
        </>
    );

}
