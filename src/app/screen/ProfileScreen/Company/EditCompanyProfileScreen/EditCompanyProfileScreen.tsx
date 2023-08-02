import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Text, SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import Spinner from "react-native-loading-spinner-overlay";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { yupResolver } from "@hookform/resolvers/yup";

import { useGetUserData } from "../../../../hooks/useGetUser";
import { useUserProfileStore } from "../../../../store/user-store";
import { serviceUpdateMyProfile } from "../../../../service/profile";

import Warning from "../../../../component/asset/warning.svg";
import TextInput from "../../../../component/common/Inputs/TextInput";
import Button from "../../../../component/common/Buttons/Button";
import { EditCompanyProfileValidators } from "../../../../Validators/EditProfile.validate";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import { serviceGetMyProfile } from "../../../../service/auth";

const EditCompanyProfileScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrDialog, setIsErrDialog] = useState(false);
  const { t } = useTranslation();
  const { setUserProfile } = useUserProfileStore();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  useGetUserData();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{
    name: string;
    bio: string;
    webSite: string;
    phone: string;
    mailContact: string;
    pIva: string;

  }>({
    defaultValues: {
      name: userData?.name || "",
      bio: userData?.bio || "",
      webSite: userData?.webSite || "",
      phone: userData?.phone || "",
      mailContact: userData?.emailContact || "",
      pIva: userData?.pIva || "",
    },
    resolver: yupResolver(EditCompanyProfileValidators()),
  });

  const onSubmit = (data: any) => {
    setIsLoading(true);
    serviceUpdateMyProfile(userData?.id, {
      name: data.name,
      bio: data.bio,
      webSite: data.webSite,
      phone: data.phone,
      emailContact: data.mailContact,
      pIva: data.pIva,
    })
      .then(async (res) => {
        if (res.status === 200) {
          const res = await serviceGetMyProfile();
          setUserProfile(res.data);
          setIsLoading(false);
          GlobalToastController.showModal({
            message:
              t("dialog.update_profile_success") ||
              "Your profile update successfully!",
          });
          navigation.navigate("CompanyProfileScreen");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setIsErrDialog(true);
      });
  };

  return (
    <SafeAreaView className="h-full bg-white">
      {isLoading && <Spinner visible={isLoading} />}

      <View className="  h-full rounded-t-xl bg-white ">
        <ConfirmDialog
          title={t("dialog.err_title_update_profile") as string}
          description={t("dialog.err_update_profile") as string}
          isVisible={isErrDialog}
          onClosed={() => setIsErrDialog(false)}
          closeButtonLabel={t("close") || ""}
        />
        {userData && (
          <KeyboardAwareScrollView className=" h-full w-full px-4 pt-8 ">
            <View>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label={
                        t("edit_company_profile_screen.company_name") ||
                        "Company Name"
                      }
                      placeholder={
                        t(
                          "edit_company_profile_screen.company_name_placeholder"
                        ) || "Enter your company name"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.name && (
                      <View className="flex flex-row pt-2">
                        <Warning />
                        <Text className="pl-1 text-sm font-normal text-red-500">
                          {errors.name.message}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>

            <View className="pt-3">
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label={
                        t("edit_company_profile_screen.biography_name") ||
                        "Biography"
                      }
                      placeholder={
                        t(
                          "edit_company_profile_screen.biography_name_placeholder"
                        ) || "Your biography"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline={true}
                      numberOfLines={4}
                      className="h-32"
                    />
                  </View>
                )}
              />
            </View>

            <View className="pt-3">
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label={
                        t("edit_company_profile_screen.company_phone") ||
                        "Phone"
                      }
                      placeholder={
                        t(
                          "edit_company_profile_screen.company_phone_placeholder"
                        ) || "Enter your company phone"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />

                  </View>
                )}
              />
            </View>
            <View className="pt-3">
              <Controller
                control={control}
                name="mailContact"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label={
                        t("edit_company_profile_screen.mailContact") ||
                        "Email contact"
                      }
                      placeholder={
                        t(
                          "edit_company_profile_screen.company_email_placeholder"
                        ) || "Enter your company email contact"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />

                  </View>
                )}
              />
            </View>
            <View className="pt-3">
              <Controller
                control={control}
                name="webSite"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label={
                        t("edit_company_profile_screen.webSite") ||
                        "Website"
                      }
                      placeholder={
                        t(
                          "edit_company_profile_screen.company_webSite_placeholder"
                        ) || "Enter your company website"
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />

                  </View>
                )}
              />
            </View>
            <View className="pt-3">
              <Controller
                control={control}
                name="pIva"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex flex-col">
                    <TextInput
                      label={
                        t("edit_company_profile_screen.pIva") ||
                        "Website"
                      }
                      placeholder={
                        t(
                          "edit_company_profile_screen.company_vat_placeholder"
                        ) || "Enter your company VAT Number "
                      }
                      placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />

                  </View>
                )}
              />
            </View>



            <Button
              title={t("button.update") || "Update"}
              containerClassName=" bg-primary-default my-10"
              textClassName="text-white text-md leading-6"
              onPress={handleSubmit(onSubmit)}
            />
          </KeyboardAwareScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditCompanyProfileScreen;
