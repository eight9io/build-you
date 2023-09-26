import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation.type";

export const useNav = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};
