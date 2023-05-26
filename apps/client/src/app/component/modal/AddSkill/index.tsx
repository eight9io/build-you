import { View, Text, Modal } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import EmojiSelector from 'react-native-emoji-selector';

import Header from '../../common/Header';
import InlineTextInput from '../../common/Inputs/InlineTextInput';
import AddEmojiButton from '../../common/Buttons/AddEmojiButton';
import AddEmojiModal from '../AddEmoji';

import Close from '../../../component/asset/close.svg';
import Button from '../../common/Buttons/Button';
import WarningSvg from '../asset/warning.svg';

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
      Skill: '',
    },
  });

  const onCloseEmojiModal = () => {
    setShowEmojiModal(false);
  };

  const skillName = watch('Skill');

  useEffect(() => {
    if (skillName) {
      setSkillNameError(false);
    }
  }, [skillName]);

  const handleSave = () => {
    if (!selectedEmoji) {
      setSelectEmojiError(true);
      if (!skillName) {
        setSkillNameError(true);
      }
      return;
    }
    const skill = `${selectedEmoji} ${skillName}`;
    setUserAddSkill((prev: string[]) => [...prev, skill]);
    selectedEmoji && setSelectedEmoji(null);
    reset();
    onClose();
  };

  const onCloseAddSkillModal = () => {
    onClose();
    setSelectedEmoji(null);
    reset();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
    >
      <View className="relative flex h-full flex-col rounded-t-xl bg-white pt-6">
        <AddEmojiModal
          isVisible={showEmojiModal}
          onClose={onCloseEmojiModal}
          setExternalSelectedEmoji={setSelectedEmoji}
          setSelectEmojiError={setSelectEmojiError}
        />
        <Header
          title="Add skill"
          leftBtn={<Close fill={'black'} />}
          onLeftBtnPress={onCloseAddSkillModal}
        />
        <View className="px-4">
          <View className="py-4">
            <Text className="text-gray-dark text-md">
              Select the emoji and enter the skill name
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
              placeholder="Enter your skill name"
              control={control}
              errors={errors}
              showError={skillNameError}
            />
          </View>
        </View>

        <View className="absolute bottom-12 left-0 h-12 w-full px-4">
          <Button
            title="Save"
            containerClassName="bg-primary-default flex-1"
            textClassName="text-white"
            onPress={handleSave}
          />
        </View>
      </View>
    </Modal>
  );
};
export default AddSkillModal;
