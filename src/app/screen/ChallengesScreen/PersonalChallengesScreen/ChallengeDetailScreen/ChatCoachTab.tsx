import React, { useState, useCallback, useEffect, FC } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
} from "react-native";
import {
    Bubble,
    Composer,
    GiftedChat,
    InputToolbar,
    SystemMessage,
} from "react-native-gifted-chat";

import SendIcon from "../../../../component/asset/send-icon.svg";
import { Controller, useForm } from "react-hook-form";
import TextInputWithMention from "../../../../component/common/Inputs/TextInputWithMention";
import { IEmployeeDataProps } from "../../../../types/common";
import { useTranslation } from "react-i18next";
import ErrorText from "../../../../component/common/ErrorText";
import PostAvatar from "../../../../component/common/Avatar/PostAvatar";
import clsx from "clsx";
import { getMessageByChallengeId, sendMessage } from "../../../../service/chat";
import { IChallenge } from "../../../../types/challenge";
import { useUserProfileStore } from "../../../../store/user-store";
import { TouchableOpacity } from "react-native-gesture-handler";
interface IChatCoachTabProps {
    challengeData: IChallenge;
}
interface IChatInputProps {
    handleOnSubmit: any;
}


export function ChatCoachTab({ challengeData }: IChatCoachTabProps) {
    const [messages, setMessages] = useState([]);
    const { t } = useTranslation();
    const { getUserProfile } = useUserProfileStore();
    const currentUser = getUserProfile();
    const getMessage = () => {
        // setShouldRefresh(true);
        getMessageByChallengeId(challengeData.id).then((res) => {
            setMessages(
                res.data.map((item: any) => {
                    return {
                        _id: item.id,
                        text: item.text,
                        user: {
                            _id: item.user.id,
                            name: item.user.name,
                            avatar: item.user.avatar,
                        },
                    };
                })
            );
        });
    };

    useEffect(() => {
        getMessage();
    }, []);
    console.log(challengeData.id);

    const handleSubmit = useCallback((messages) => {
        if (messages.length === 0 || !messages[0].text) {
            return;
        }
        const message = {
            text: messages[0].text,
            challenge: challengeData.id,
        };

        sendMessage(message).then((res) => {
            getMessage();
        }
        );
    }, []);

    return (
        <GiftedChat
            messagesContainerStyle={{
                paddingBottom: Platform.OS === "ios" ? 6 : 12,
            }}
            isCustomViewBottom
            messages={messages}
            onSend={(messages) => handleSubmit(messages)}

            renderSend={(props) => {
                return (
                    <TouchableOpacity className="mr-3 flex justify-center mb-3
                   "  onPress={() => {
                            props.onSend({ text: props.text.trim() }, true);
                        }} >
                        <SendIcon
                        />
                    </TouchableOpacity >
                );
            }}
            renderInputToolbar={props => <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: "white",
                    borderColor: "#E8E8E8",
                    paddingTop: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    marginHorizontal: 20,
                }}
            />}
            maxComposerHeight={100}
            placeholder={t("chat_input.chat_input_placeholder") || "Type a message"}
            user={{
                _id: currentUser?.id,
            }}
            renderTime={() => null}
            renderBubble={(props) => (
                <Bubble
                    renderUsernameOnMessage
                    renderUsername={(user) => (
                        <Text className="absolute -bottom-4 left-0 text-sm font-light text-gray-dark">
                            {user.name}
                            <Text className="text-sm text-primary-default"> Coach</Text>
                        </Text>
                    )}
                    {...props}
                    textStyle={{
                        right: {
                            color: "#000",
                            padding: 8,
                        },
                        left: {
                            color: "#000",
                            padding: 8,
                        },
                    }}
                    containerStyle={{
                        right: {
                            maxWidth: "80%",
                            margin: 10,
                            // marginBottom: 20
                        },
                        left: {
                            maxWidth: "80%",
                        },
                    }}
                    wrapperStyle={{
                        right: {
                            backgroundColor: "#fbe1d2",
                            marginBottom: 6,
                        },
                        left: {
                            backgroundColor: "#E7E9F1",
                            marginBottom: 6,
                        },
                    }}
                />
            )}
            scrollToBottom
            infiniteScroll
        />
    );
}
