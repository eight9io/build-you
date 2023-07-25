import { EXPO_API_APP_DOMAIN } from "@env";
import * as Linking from "expo-linking";

export const DeepLink = {
  prefixes: [Linking.createURL("/"), EXPO_API_APP_DOMAIN],
  config: {
    screens: {
      NotFound: "*",
      HomeScreen: {
        screens: {
          Feed: {
            screens: {
              OtherUserProfileChallengeDetailsScreen: {
                path: "/challenge/:challengeId",
              },
            },
          },
        },
      },
    },
  },
};
