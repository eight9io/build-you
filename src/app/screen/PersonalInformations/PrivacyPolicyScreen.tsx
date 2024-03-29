import { StyleProp, View, ViewStyle } from "react-native";
import { FC, useEffect, useState } from "react";
import HTMLView from "react-native-htmlview";
import { serviceGetPrivacy } from "../../service/settings";
import { CrashlyticService } from "../../service/crashlytic";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import { trimHtml } from "../../utils/common";
import clsx from "clsx";

interface IPrivacyPolicyScreenProps {
  containerClassName?: string;
  contentStyle?: StyleProp<ViewStyle>;
}
const PrivacyPolicyScreen: FC<IPrivacyPolicyScreenProps> = ({
  containerClassName,
  contentStyle,
}) => {
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
    <View
      className={clsx("flex-1 overflow-scroll bg-white", containerClassName)}
    >
      <CustomActivityIndicator isVisible={isLoading} />
      <View
        style={[
          {
            paddingVertical: 16,
            paddingHorizontal: 16,
            width: "100%",
            height: "100%",
          },
          contentStyle,
        ]}
      >
        {!isLoading ? <HTMLView value={content} /> : null}
      </View>
    </View>
  );
};

export default PrivacyPolicyScreen;
