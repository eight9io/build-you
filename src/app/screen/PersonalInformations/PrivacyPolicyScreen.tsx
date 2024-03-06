import { View } from "react-native";
import { useEffect, useState } from "react";
import HTMLView from "react-native-htmlview";
import { serviceGetPrivacy } from "../../service/settings";
import { CrashlyticService } from "../../service/crashlytic";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import { trimHtml } from "../../utils/common";

export default function PrivacyPolicyScreen({ navigation }: any) {
  const [content, setContent] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const getContent = () => {
    setIsLoading(true);
    serviceGetPrivacy()
      .then((res) => {
        setContent(trimHtml(res.data.privacy));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("err", err);
        CrashlyticService({
          errorType: "Get Privacy Error",
          error: err,
        });
      });
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <View className=" flex-1 bg-white">
      <CustomActivityIndicator isVisible={isLoading} />
      {!isLoading ? (
        <HTMLView
          value={content}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            width: "100%",
            height: "100%",
            overflow: "scroll",
          }}
        />
      ) : null}
    </View>
  );
}
