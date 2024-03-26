import { View, Text, Modal } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Close from "../../component/asset/close.svg";
import { IHardSkillProps } from "../../types/user";
import httpInstance from "../../utils/http";
import GlobalDialogController from "../../component/common/Dialog/GlobalDialog/GlobalDialogController";
import Header from "../../component/common/Header";
import AddEmojiButton from "../../component/common/Buttons/AddEmojiButton";
import InlineTextInput from "../../component/common/Inputs/InlineTextInput";
import Button from "../../component/common/Buttons/Button";
import { useNav } from "../../hooks/useNav";
import AddEmojiModal from "../../component/modal/AddEmoji";
import { useSkillStore } from "../../store/skill-store";

export const AddManualSkillScreen = () => {
  const navigation = useNav();
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const [selectEmojiError, setSelectEmojiError] = useState<boolean>(false);
  const [skillNameError, setSkillNameError] = useState<boolean>(false);
  const { userAddedSkill, setUserAddedSkill } = useSkillStore();
  const { t } = useTranslation();
  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Skill: null,
    },
  });

  const onCloseEmojiModal = () => {
    setShowEmojiModal(false);
  };

  const skillName = watch("Skill");

  useEffect(() => {
    if (skillName) {
      setSkillNameError(false);
    }
  }, [skillName]);

  const handleSave = async () => {
    if (!selectedEmoji) {
      setSelectEmojiError(true);
    }
    if (!skillName) {
      setSkillNameError(true);
    }
    if (!selectedEmoji || !skillName) return;

    const skill = `${selectedEmoji} ${skillName}`;

    let skillToSave: IHardSkillProps | null = null;

    httpInstance
      .post("/skill/hard/create", {
        skill,
      })
      .then((res) => {
        skillToSave = res.data;
        setUserAddedSkill([...userAddedSkill, skillToSave]);
        onCloseAddManualSkillScreen();
      })
      .catch((_) => {
        GlobalDialogController.showModal({
          title: t("dialog.err_title"),
          message: t("errorMessage:500"),
        });
        onCloseAddManualSkillScreen();
      });

    // selectedEmoji && setSelectedEmoji(null);
    // reset();
  };

  const onCloseAddManualSkillScreen = () => {
    setSelectedEmoji(null);
    selectEmojiError && setSelectEmojiError(false);
    skillNameError && setSkillNameError(false);
    reset();
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      className="bg-white"
    >
      <View className="relative mx-4 flex h-full flex-col rounded-t-xl bg-white">
        <AddEmojiModal
          isVisible={showEmojiModal}
          onClose={onCloseEmojiModal}
          setExternalSelectedEmoji={setSelectedEmoji}
          setSelectEmojiError={setSelectEmojiError}
        />
        <Header
          title={t("add_skill_modal.title") || "Add skill"}
          leftBtn={<Close fill={"black"} />}
          onLeftBtnPress={onCloseAddManualSkillScreen}
        />
        <View className="px-4">
          <View className="py-4">
            <Text className="text-md text-gray-dark">
              {t("add_skill_modal.description") ||
                "Select the emoji and enter the skill name"}
            </Text>
          </View>

          <View className="py-2">
            <AddEmojiButton
              selectedEmoji={selectedEmoji}
              triggerFunction={() => setShowEmojiModal(true)}
              selectEmojiError={selectEmojiError}
            />
          </View>
          <View className="py-8">
            <InlineTextInput
              title="Skill"
              containerClassName="pl-6"
              placeholder={
                t("add_skill_modal.enter_skill_name") || "Enter your skill name"
              }
              control={control}
              errors={errors}
              showError={skillNameError}
            />
          </View>
        </View>

        <View className="absolute bottom-12 left-0 h-12 w-full px-4">
          <Button
            title={t("save") || "Save"}
            containerClassName="bg-primary-default flex-1"
            textClassName="text-white"
            onPress={handleSave}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
export default AddManualSkillScreen;
