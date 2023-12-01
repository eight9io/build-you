import { IMessage } from "../types/chat";
import http from "../utils/http";
export const getMessageByChallengeId = (challengeId: string) => {
    return http.get(`/chat/message/${challengeId}`);
};
export const sendMessage = (message: IMessage) => {
    return http.post('/chat/send', message);
};