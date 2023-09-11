import { View, Text, Modal } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import httpInstance from "../../../utils/http";

import { IHardSkillProps } from "../../../types/user";

import Header from "../../common/Header";
import InlineTextInput from "../../common/Inputs/InlineTextInput";
import AddEmojiButton from "../../common/Buttons/AddEmojiButton";
import AddEmojiModal from "../AddEmoji";
import Close from "../../../component/asset/close.svg";
import Button from "../../common/Buttons/Button";
import GlobalDialogController from "../../common/Dialog/GlobalDialogController";

interface IAddSkillModallProps {
  setUserAddSkill: (skills: any) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const AddSkillModal: FC<IAddSkillModallProps> = ({
  setUserAddSkill,
  isVisible,
  onClose,
}) => {
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const [selectEmojiError, setSelectEmojiError] = useState<boolean>(false);
  const [skillNameError, setSkillNameError] = useState<boolean>(false);

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

    await httpInstance
      .post("/skill/hard/create", {
        skill,
      })
      .then((res) => {
        skillToSave = res.data;
      })
      .catch((_) => {
        GlobalDialogController.showModal({
          title: t("dialog.err_title"),
          message: t("errorMessage:500"),
        });
      });

    setUserAddSkill((prev: IHardSkillProps[]) => [...prev, skillToSave]);
    selectedEmoji && setSelectedEmoji(null);
    reset();
    onClose();
  };

  const onCloseAddSkillModal = () => {
    onClose();
    setSelectedEmoji(null);
    selectEmojiError && setSelectEmojiError(false);
    skillNameError && setSkillNameError(false);
    reset();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
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
            onLeftBtnPress={onCloseAddSkillModal}
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
                  t("add_skill_modal.enter_skill_name") ||
                  "Enter your skill name"
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
    </Modal>
  );
};
export default AddSkillModal;
