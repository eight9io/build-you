import { EXPO_APP_DOMAIN } from "@env";
import * as Linking from "expo-linking";

export const DeepLink = {
  prefixes: [Linking.createURL("/"), EXPO_APP_DOMAIN],
  config: {
    screens: {
      NotFound: "*",
      HomeScreen: {
        screens: {
          Feed: {
            initialRouteName: "FeedScreen",
            screens: {
              OtherUserProfileChallengeDetailsScreen: {
                path: "/challenge/:challengeId",
              },
              OtherUserProfileScreen: {
                path: "/user/:userId",
              },
            },
          },
        },
      },
    },
  },
};
